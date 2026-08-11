import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { Users, ClipboardCheck, Image, Calendar, MessageSquare, Search, ChevronLeft, ChevronRight, Plus, Trash2, X, Check } from 'lucide-react'
import { useDebounce, usePagination } from '../hooks'

const PAGE_SIZE = 20

export default function AdminDashboard() {
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'
  const setTab = (t) => setParams(t === 'overview' ? {} : { tab: t })

  return (
    <div>
      <div className="dash-tabs">
        {[
          { key: 'overview', label: 'Overview', icon: Users },
          { key: 'teachers', label: 'Teachers', icon: Users },
          { key: 'admissions', label: 'Admissions', icon: ClipboardCheck },
          { key: 'gallery', label: 'Gallery', icon: Image },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'messages', label: 'Messages', icon: MessageSquare },
        ].map(t => {
          const Icon = t.icon
          return (
            <button key={t.key} className={`dash-tab${tab === t.key ? ' active' : ''}`} onClick={() => setTab(t.key)}>
              <Icon size={16} /><span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="dash-tab-content">
        {tab === 'overview' && <AdminOverview />}
        {tab === 'teachers' && <TeachersTab />}
        {tab === 'admissions' && <AdmissionsTab />}
        {tab === 'gallery' && <AdminGalleryTab />}
        {tab === 'events' && <AdminEventsTab />}
        {tab === 'messages' && <MessagesTab />}
      </div>
    </div>
  )
}

function AdminOverview() {
  const [stats, setStats] = useState({ teachers: 0, admissions: 0, gallery: 0, events: 0, messages: 0, pendingAdmissions: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const [t, a, g, e, m, pa] = await Promise.all([
        supabase.from('teachers').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('admissions').select('*', { count: 'exact', head: true }),
        supabase.from('gallery_images').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('contact_messages').select('*', { count: 'exact', head: true }),
        supabase.from('admissions').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
      ])
      setStats({
        teachers: t.count || 0, admissions: a.count || 0, gallery: g.count || 0,
        events: e.count || 0, messages: m.count || 0, pendingAdmissions: pa.count || 0,
      })
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="dash-loading">Loading...</div>

  const cards = [
    { label: 'Teachers', value: stats.teachers, color: '#3B82F6' },
    { label: 'Admissions', value: stats.admissions, color: '#F59E0B' },
    { label: 'Pending Admissions', value: stats.pendingAdmissions, color: '#EF4444' },
    { label: 'Gallery Images', value: stats.gallery, color: '#22C55E' },
    { label: 'Events', value: stats.events, color: '#FF4FA3' },
    { label: 'Messages', value: stats.messages, color: '#8B5CF6' },
  ]

  return (
    <div className="dash-stat-grid">
      {cards.map(c => (
        <div key={c.label} className="dash-stat-card" style={{ borderColor: `${c.color}30` }}>
          <div className="dash-stat-icon" style={{ background: `${c.color}15`, color: c.color }}>
            <Users size={24} />
          </div>
          <div>
            <div className="dash-stat-num" style={{ color: c.color }}>{c.value}</div>
            <div className="dash-stat-lbl">{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  )
}

function TeachersTab() {
  const [teachers, setTeachers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('teachers').select('*').order('sort_order').limit(50)
    setTeachers(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deleteTeacher = async (id) => {
    await supabase.from('teachers').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="dash-toolbar">
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Teacher
        </button>
      </div>
      {loading ? <div className="dash-loading">Loading...</div> : teachers.length === 0 ? <div className="dash-empty">No teachers yet.</div> : (
        <div className="dash-table-wrap">
          <table className="dash-table">
            <thead><tr><th>Name</th><th>Role</th><th>Specialization</th><th>Active</th><th></th></tr></thead>
            <tbody>
              {teachers.map(t => (
                <tr key={t.id}>
                  <td>{t.name}</td><td>{t.role}</td><td>{t.specialization || '—'}</td>
                  <td>{t.is_active ? 'Yes' : 'No'}</td>
                  <td><button className="dash-del-btn" onClick={() => deleteTeacher(t.id)}><Trash2 size={16} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showAdd && <AddTeacherModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
    </div>
  )
}

function AddTeacherModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ name: '', role: '', qualification: '', experience: '', specialization: '', photo_url: '', chip: '', color: '#FF4FA3' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error: err } = await supabase.from('teachers').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head"><h3>Add Teacher</h3><button onClick={onClose}><X size={20} /></button></div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-row">
            <div className="dash-form-field"><label>Name</label><input type="text" required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} /></div>
            <div className="dash-form-field"><label>Role</label><input type="text" required value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} /></div>
          </div>
          <div className="dash-form-row">
            <div className="dash-form-field"><label>Qualification</label><input type="text" value={form.qualification} onChange={e => setForm(f => ({ ...f, qualification: e.target.value }))} /></div>
            <div className="dash-form-field"><label>Experience</label><input type="text" value={form.experience} onChange={e => setForm(f => ({ ...f, experience: e.target.value }))} /></div>
          </div>
          <div className="dash-form-field"><label>Specialization</label><input type="text" value={form.specialization} onChange={e => setForm(f => ({ ...f, specialization: e.target.value }))} /></div>
          <div className="dash-form-field"><label>Photo URL</label><input type="url" value={form.photo_url} onChange={e => setForm(f => ({ ...f, photo_url: e.target.value }))} /></div>
          <div className="dash-form-row">
            <div className="dash-form-field"><label>Chip Label</label><input type="text" value={form.chip} onChange={e => setForm(f => ({ ...f, chip: e.target.value }))} /></div>
            <div className="dash-form-field"><label>Color</label><input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} /></div>
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>{saving ? 'Saving...' : 'Save Teacher'}</button>
        </form>
      </div>
    </div>
  )
}

function AdmissionsTab() {
  const [search, setSearch] = useState('')
  const debounced = useDebounce(search, 400)

  const fetchFn = useCallback(async (page, pageSize) => {
    let query = supabase.from('admissions').select('*', { count: 'exact' })
    if (debounced) query = query.ilike('student_name', `%${debounced}%`)
    query = query.order('created_at', { ascending: false }).range((page - 1) * pageSize, page * pageSize - 1)
    const { data, count } = await query
    return { rows: data || [], total: count || 0 }
  }, [debounced])

  const { rows, total, page, totalPages, hasNext, hasPrev, loading, load } = usePagination(fetchFn, [debounced], PAGE_SIZE)

  const updateStatus = async (id, status) => {
    await supabase.from('admissions').update({ status }).eq('id', id)
  }

  return (
    <div>
      <div className="dash-toolbar">
        <div className="dash-search"><Search size={18} /><input type="text" placeholder="Search by student name..." value={search} onChange={e => setSearch(e.target.value)} /></div>
      </div>
      {loading ? <div className="dash-loading">Loading...</div> : rows.length === 0 ? <div className="dash-empty">No admissions found.</div> : (
        <>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead><tr><th>Student</th><th>Parent</th><th>Phone</th><th>Class</th><th>Status</th></tr></thead>
              <tbody>
                {rows.map(a => (
                  <tr key={a.id}>
                    <td>{a.student_name}</td><td>{a.parent_name}</td><td>{a.phone}</td><td>{a.class_applying}</td>
                    <td>
                      <select defaultValue={a.status} onChange={e => updateStatus(a.id, e.target.value)} className="dash-select-sm">
                        <option value="pending">Pending</option><option value="reviewed">Reviewed</option>
                        <option value="accepted">Accepted</option><option value="rejected">Rejected</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dash-pagination">
            <button disabled={!hasPrev} onClick={() => load(page - 1)}><ChevronLeft size={16} /> Prev</button>
            <span>Page {page} of {totalPages} ({total} total)</span>
            <button disabled={!hasNext} onClick={() => load(page + 1)}>Next <ChevronRight size={16} /></button>
          </div>
        </>
      )}
    </div>
  )
}

function MessagesTab() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false }).limit(20)
    setMessages(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const updateStatus = async (id, status) => {
    await supabase.from('contact_messages').update({ status }).eq('id', id)
  }
  const deleteMsg = async (id) => {
    await supabase.from('contact_messages').delete().eq('id', id)
    load()
  }

  return (
    <div>
      {loading ? <div className="dash-loading">Loading...</div> : messages.length === 0 ? <div className="dash-empty">No messages.</div> : (
        <div className="dash-notice-list">
          {messages.map(m => (
            <div key={m.id} className="dash-notice-item">
              <div className="dash-notice-head">
                <div className="dash-notice-title">{m.subject || m.name}</div>
                <button className="dash-del-btn" onClick={() => deleteMsg(m.id)}><Trash2 size={16} /></button>
              </div>
              <div className="dash-notice-body">{m.message}</div>
              <div className="dash-notice-date">{m.name} · {m.email} · {new Date(m.created_at).toLocaleDateString()}</div>
              <select defaultValue={m.status} onChange={e => updateStatus(m.id, e.target.value)} className="dash-select-sm">
                <option value="new">New</option><option value="read">Read</option><option value="archived">Archived</option>
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function AdminGalleryTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('gallery_images').select('*').order('created_at', { ascending: false }).limit(24)
    setImages(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deleteImage = async (id) => {
    await supabase.from('gallery_images').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="dash-toolbar">
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}><Plus size={18} /> Add Image</button>
      </div>
      {loading ? <div className="dash-loading">Loading...</div> : images.length === 0 ? <div className="dash-empty">No images.</div> : (
        <div className="dash-gallery-grid">
          {images.map(img => (
            <div key={img.id} className="dash-gallery-item">
              <img src={img.image_url} alt={img.title || ''} />
              <div className="dash-gallery-overlay"><span>{img.title || 'Untitled'}</span><button className="dash-del-btn" onClick={() => deleteImage(img.id)}><Trash2 size={16} /></button></div>
            </div>
          ))}
        </div>
      )}
      {showAdd && <AddImageModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
    </div>
  )
}

function AdminEventsTab() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('events').select('*').order('event_date', { ascending: true }).limit(20)
    setEvents(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deleteEvent = async (id) => {
    await supabase.from('events').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="dash-toolbar"><button className="dash-btn-primary" onClick={() => setShowAdd(true)}><Plus size={18} /> Add Event</button></div>
      {loading ? <div className="dash-loading">Loading...</div> : events.length === 0 ? <div className="dash-empty">No events.</div> : (
        <div className="dash-card-grid">
          {events.map(ev => (
            <div key={ev.id} className="dash-card">
              <div className="dash-card-head"><h4>{ev.title}</h4><button className="dash-del-btn" onClick={() => deleteEvent(ev.id)}><Trash2 size={16} /></button></div>
              <p className="dash-card-desc">{ev.description || 'No description'}</p>
              <div className="dash-card-meta"><span>Date: {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'TBD'}</span></div>
            </div>
          ))}
        </div>
      )}
      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
    </div>
  )
}

function AddImageModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', image_url: '', category: 'general' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error: err } = await supabase.from('gallery_images').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head"><h3>Add Image</h3><button onClick={onClose}><X size={20} /></button></div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field"><label>Title</label><input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="dash-form-field"><label>Image URL</label><input type="url" required value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} /></div>
          <div className="dash-form-field"><label>Category</label><select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}><option value="general">General</option><option value="classroom">Classroom</option><option value="activities">Activities</option><option value="outdoor">Outdoor</option><option value="events">Events</option></select></div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>{saving ? 'Adding...' : 'Add Image'}</button>
        </form>
      </div>
    </div>
  )
}

function AddEventModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', event_date: '', image_url: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    const { error: err } = await supabase.from('events').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head"><h3>Add Event</h3><button onClick={onClose}><X size={20} /></button></div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field"><label>Title</label><input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} /></div>
          <div className="dash-form-field"><label>Description</label><textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} /></div>
          <div className="dash-form-field"><label>Event Date</label><input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} /></div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>{saving ? 'Creating...' : 'Create Event'}</button>
        </form>
      </div>
    </div>
  )
}

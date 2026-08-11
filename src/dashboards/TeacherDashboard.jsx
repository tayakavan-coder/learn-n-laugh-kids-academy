import { useState, useEffect, useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { supabase } from '../supabase'
import { useAuth } from '../AuthContext'
import { useDebounce, usePagination } from '../hooks'
import { Users, ClipboardCheck, FileText, Calendar, MessageSquare, Image, Search, ChevronLeft, ChevronRight, Plus, Save, Trash2, X, Check } from 'lucide-react'

const PAGE_SIZE = 20

export default function TeacherDashboard() {
  const { profile } = useAuth()
  const [params, setParams] = useSearchParams()
  const tab = params.get('tab') || 'overview'

  const setTab = (t) => setParams(t === 'overview' ? {} : { tab: t })

  return (
    <div>
      <div className="dash-tabs">
        {[
          { key: 'overview', label: 'Overview', icon: Users },
          { key: 'students', label: 'Students', icon: Users },
          { key: 'attendance', label: 'Attendance', icon: ClipboardCheck },
          { key: 'assignments', label: 'Assignments', icon: FileText },
          { key: 'notices', label: 'Notices', icon: MessageSquare },
          { key: 'events', label: 'Events', icon: Calendar },
          { key: 'gallery', label: 'Gallery', icon: Image },
        ].map(t => {
          const Icon = t.icon
          return (
            <button
              key={t.key}
              className={`dash-tab${tab === t.key ? ' active' : ''}`}
              onClick={() => setTab(t.key)}
            >
              <Icon size={16} />
              <span>{t.label}</span>
            </button>
          )
        })}
      </div>

      <div className="dash-tab-content">
        {tab === 'overview' && <OverviewTab profile={profile} />}
        {tab === 'students' && <StudentsTab />}
        {tab === 'attendance' && <AttendanceTab profile={profile} />}
        {tab === 'assignments' && <AssignmentsTab profile={profile} />}
        {tab === 'notices' && <NoticesTab />}
        {tab === 'events' && <EventsTab />}
        {tab === 'gallery' && <GalleryTab />}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// OVERVIEW
// ═════════════════════════════════════════

function OverviewTab({ profile }) {
  const [stats, setStats] = useState({ totalStudents: 0, presentToday: 0, absentToday: 0, totalAssignments: 0, upcomingEvents: 0, recentNotices: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      setLoading(true)
      const today = new Date().toISOString().split('T')[0]

      const [{ count: totalStudents }, { count: totalAssignments }, { count: upcomingEvents }] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('assignments').select('*', { count: 'exact', head: true }).eq('is_active', true),
        supabase.from('events').select('*', { count: 'exact', head: true }).eq('is_active', true).gte('event_date', today),
      ])

      const { data: attendanceToday } = await supabase
        .from('attendance')
        .select('status')
        .eq('date', today)

      const present = attendanceToday?.filter(a => a.status === 'present').length || 0
      const absent = attendanceToday?.filter(a => a.status === 'absent').length || 0

      const { data: recentNotices } = await supabase
        .from('announcements')
        .select('title, body, created_at')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(5)

      setStats({
        totalStudents: totalStudents || 0,
        presentToday: present,
        absentToday: absent,
        totalAssignments: totalAssignments || 0,
        upcomingEvents: upcomingEvents || 0,
        recentNotices: recentNotices || [],
      })
      setLoading(false)
    })()
  }, [])

  if (loading) return <div className="dash-loading">Loading dashboard...</div>

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, color: '#3B82F6', icon: Users },
    { label: 'Present Today', value: stats.presentToday, color: '#22C55E', icon: Check },
    { label: 'Absent Today', value: stats.absentToday, color: '#EF4444', icon: X },
    { label: 'Assignments', value: stats.totalAssignments, color: '#F59E0B', icon: FileText },
    { label: 'Upcoming Events', value: stats.upcomingEvents, color: '#FF4FA3', icon: Calendar },
  ]

  return (
    <div>
      <div className="dash-stat-grid">
        {cards.map(c => {
          const Icon = c.icon
          return (
            <div key={c.label} className="dash-stat-card" style={{ borderColor: `${c.color}30` }}>
              <div className="dash-stat-icon" style={{ background: `${c.color}15`, color: c.color }}>
                <Icon size={24} />
              </div>
              <div>
                <div className="dash-stat-num" style={{ color: c.color }}>{c.value}</div>
                <div className="dash-stat-lbl">{c.label}</div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="dash-section">
        <h3 className="dash-section-title">Recent Notices</h3>
        {stats.recentNotices.length === 0 ? (
          <p className="dash-empty">No notices yet.</p>
        ) : (
          <div className="dash-notice-list">
            {stats.recentNotices.map((n, i) => (
              <div key={i} className="dash-notice-item">
                <div className="dash-notice-title">{n.title}</div>
                <div className="dash-notice-body">{n.body}</div>
                <div className="dash-notice-date">{new Date(n.created_at).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// STUDENTS (paginated + search)
// ═════════════════════════════════════════

function StudentsTab() {
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 400)
  const [classFilter, setClassFilter] = useState('')
  const [classes, setClasses] = useState([])
  const [showAdd, setShowAdd] = useState(false)

  useEffect(() => {
    supabase.from('classes').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setClasses(data || []))
  }, [])

  const fetchFn = useCallback(async (page, pageSize) => {
    let query = supabase.from('students').select('*', { count: 'exact' }).eq('is_active', true)
    if (debouncedSearch) query = query.ilike('full_name', `%${debouncedSearch}%`)
    if (classFilter) query = query.eq('class_id', classFilter)
    query = query.order('full_name').range((page - 1) * pageSize, page * pageSize - 1)
    const { data, count, error } = await query
    if (error) throw error
    return { rows: data || [], total: count || 0 }
  }, [debouncedSearch, classFilter])

  const { rows, total, page, totalPages, hasNext, hasPrev, loading, load } = usePagination(fetchFn, [debouncedSearch, classFilter], PAGE_SIZE)

  return (
    <div>
      <div className="dash-toolbar">
        <div className="dash-search">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search students..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="dash-select">
          <option value="">All Classes</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Student
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">Loading students...</div>
      ) : rows.length === 0 ? (
        <div className="dash-empty">No students found.</div>
      ) : (
        <>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>Admission #</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Phone</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(s => {
                  const cls = classes.find(c => c.id === s.class_id)
                  return (
                    <tr key={s.id}>
                      <td>{s.admission_number}</td>
                      <td>{s.full_name}</td>
                      <td>{cls?.name || '—'}</td>
                      <td>{s.phone || '—'}</td>
                      <td>{s.is_active ? 'Active' : 'Inactive'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="dash-pagination">
            <button disabled={!hasPrev} onClick={() => load(page - 1)}>
              <ChevronLeft size={16} /> Prev
            </button>
            <span>Page {page} of {totalPages} ({total} students)</span>
            <button disabled={!hasNext} onClick={() => load(page + 1)}>
              Next <ChevronRight size={16} />
            </button>
          </div>
        </>
      )}

      {showAdd && <AddStudentModal classes={classes} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load(1) }} />}
    </div>
  )
}

function AddStudentModal({ classes, onClose, onSaved }) {
  const [form, setForm] = useState({ admission_number: '', full_name: '', class_id: '', phone: '', address: '', gender: 'male' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('students').insert([{
      ...form,
      admission_date: new Date().toISOString().split('T')[0],
    }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head">
          <h3>Add New Student</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-row">
            <div className="dash-form-field">
              <label>Admission Number</label>
              <input type="text" required value={form.admission_number} onChange={e => setForm(f => ({ ...f, admission_number: e.target.value }))} />
            </div>
            <div className="dash-form-field">
              <label>Full Name</label>
              <input type="text" required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
            </div>
          </div>
          <div className="dash-form-row">
            <div className="dash-form-field">
              <label>Class</label>
              <select value={form.class_id} onChange={e => setForm(f => ({ ...f, class_id: e.target.value }))}>
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="dash-form-field">
              <label>Gender</label>
              <select value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>
          <div className="dash-form-row">
            <div className="dash-form-field">
              <label>Phone</label>
              <input type="text" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
            </div>
            <div className="dash-form-field">
              <label>Address</label>
              <input type="text" value={form.address} onChange={e => setForm(f => ({ ...f, address: e.target.value }))} />
            </div>
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>
            {saving ? 'Saving...' : 'Save Student'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// ATTENDANCE
// ═════════════════════════════════════════

function AttendanceTab() {
  const [classes, setClasses] = useState([])
  const [selectedClass, setSelectedClass] = useState('')
  const [date, setDate] = useState(new Date().toISOString().split('T')[0])
  const [students, setStudents] = useState([])
  const [attendance, setAttendance] = useState({})
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('classes').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setClasses(data || []))
  }, [])

  useEffect(() => {
    if (!selectedClass) return
    setLoading(true)
    (async () => {
      const { data: studs } = await supabase
        .from('students')
        .select('id, full_name, admission_number')
        .eq('class_id', selectedClass)
        .eq('is_active', true)
        .order('full_name')
      setStudents(studs || [])

      const { data: existing } = await supabase
        .from('attendance')
        .select('student_id, status')
        .eq('class_id', selectedClass)
        .eq('date', date)

      const map = {}
      existing?.forEach(a => { map[a.student_id] = a.status })
      setAttendance(map)
      setLoading(false)
    })()
  }, [selectedClass, date])

  const markStatus = (studentId, status) => {
    setAttendance(a => ({ ...a, [studentId]: status }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    setSaved(false)
    const records = Object.entries(attendance).map(([student_id, status]) => ({
      student_id,
      class_id: selectedClass,
      date,
      status,
    }))

    if (records.length > 0) {
      await supabase.from('attendance')
        .upsert(records, { onConflict: 'student_id,date' })
    }
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const presentCount = Object.values(attendance).filter(s => s === 'present').length
  const absentCount = Object.values(attendance).filter(s => s === 'absent').length

  return (
    <div>
      <div className="dash-toolbar">
        <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="dash-select">
          <option value="">Select Class</option>
          {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="dash-date-input" />
        {selectedClass && (
          <div className="dash-attendance-summary">
            <span className="dash-badge-green">Present: {presentCount}</span>
            <span className="dash-badge-red">Absent: {absentCount}</span>
          </div>
        )}
      </div>

      {!selectedClass ? (
        <div className="dash-empty">Select a class to mark attendance.</div>
      ) : loading ? (
        <div className="dash-loading">Loading students...</div>
      ) : students.length === 0 ? (
        <div className="dash-empty">No students in this class.</div>
      ) : (
        <>
          <div className="dash-table-wrap">
            <table className="dash-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Admission #</th>
                  <th>Name</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s, i) => (
                  <tr key={s.id}>
                    <td>{i + 1}</td>
                    <td>{s.admission_number}</td>
                    <td>{s.full_name}</td>
                    <td>
                      <div className="dash-attendance-btns">
                        {['present', 'absent', 'late', 'excused'].map(st => (
                          <button
                            key={st}
                            className={`dash-attendance-btn${attendance[s.id] === st ? ' active' : ''}`}
                            data-status={st}
                            onClick={() => markStatus(s.id, st)}
                          >
                            {st.charAt(0).toUpperCase()}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="dash-save-bar">
            {saved && <span className="dash-saved-msg">Attendance saved successfully!</span>}
            <button className="dash-btn-primary" onClick={save} disabled={saving || Object.keys(attendance).length === 0}>
              {saving ? 'Saving...' : 'Save Attendance'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ═════════════════════════════════════════
// ASSIGNMENTS
// ═════════════════════════════════════════

function AssignmentsTab({ profile }) {
  const [assignments, setAssignments] = useState([])
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('assignments')
      .select('*')
      .eq('teacher_id', profile.id)
      .order('created_at', { ascending: false })
    setAssignments(data || [])
    setLoading(false)
  }, [profile.id])

  useEffect(() => {
    supabase.from('classes').select('id, name').eq('is_active', true).order('name')
      .then(({ data }) => setClasses(data || []))
    load()
  }, [load])

  return (
    <div>
      <div className="dash-toolbar">
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Create Assignment
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="dash-empty">No assignments yet.</div>
      ) : (
        <div className="dash-card-grid">
          {assignments.map(a => {
            const cls = classes.find(c => c.id === a.class_id)
            return (
              <div key={a.id} className="dash-card">
                <div className="dash-card-head">
                  <h4>{a.title}</h4>
                  <span className="dash-card-badge" data-status={a.is_active ? 'active' : 'inactive'}>
                    {a.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <p className="dash-card-desc">{a.description || 'No description'}</p>
                <div className="dash-card-meta">
                  <span>Class: {cls?.name || '—'}</span>
                  <span>Due: {new Date(a.due_date).toLocaleDateString()}</span>
                  <span>Max: {a.max_marks}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showAdd && <AddAssignmentModal classes={classes} teacherId={profile.id} onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
    </div>
  )
}

function AddAssignmentModal({ classes, teacherId, onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', description: '', class_id: '', due_date: '', max_marks: 100 })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('assignments').insert([{
      ...form,
      teacher_id: teacherId,
      is_active: true,
    }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head">
          <h3>Create Assignment</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field">
            <label>Title</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="dash-form-row">
            <div className="dash-form-field">
              <label>Class</label>
              <select required value={form.class_id} onChange={e => setForm(f => ({ ...f, class_id: e.target.value }))}>
                <option value="">Select class</option>
                {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div className="dash-form-field">
              <label>Due Date</label>
              <input type="date" required value={form.due_date} onChange={e => setForm(f => ({ ...f, due_date: e.target.value }))} />
            </div>
          </div>
          <div className="dash-form-field">
            <label>Max Marks</label>
            <input type="number" value={form.max_marks} onChange={e => setForm(f => ({ ...f, max_marks: parseInt(e.target.value) || 100 }))} />
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create Assignment'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// NOTICES
// ═════════════════════════════════════════

function NoticesTab() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('announcements')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(20)
    setNotices(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const deleteNotice = async (id) => {
    await supabase.from('announcements').delete().eq('id', id)
    load()
  }

  return (
    <div>
      <div className="dash-toolbar">
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Notice
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="dash-empty">No notices yet.</div>
      ) : (
        <div className="dash-notice-list">
          {notices.map(n => (
            <div key={n.id} className="dash-notice-item">
              <div className="dash-notice-head">
                <div className="dash-notice-title">{n.title}</div>
                <button className="dash-del-btn" onClick={() => deleteNotice(n.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <div className="dash-notice-body">{n.body}</div>
              <div className="dash-notice-date">{new Date(n.created_at).toLocaleDateString()}</div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddNoticeModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
    </div>
  )
}

function AddNoticeModal({ onClose, onSaved }) {
  const [form, setForm] = useState({ title: '', body: '' })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setError(null)
    const { error: err } = await supabase.from('announcements').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head">
          <h3>Add Notice</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field">
            <label>Title</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Content</label>
            <textarea rows={4} required value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>
            {saving ? 'Publishing...' : 'Publish Notice'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// EVENTS
// ═════════════════════════════════════════

function EventsTab() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('events')
      .select('*')
      .order('event_date', { ascending: true })
      .limit(20)
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
      <div className="dash-toolbar">
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Event
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="dash-empty">No events yet.</div>
      ) : (
        <div className="dash-card-grid">
          {events.map(ev => (
            <div key={ev.id} className="dash-card">
              <div className="dash-card-head">
                <h4>{ev.title}</h4>
                <button className="dash-del-btn" onClick={() => deleteEvent(ev.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
              <p className="dash-card-desc">{ev.description || 'No description'}</p>
              <div className="dash-card-meta">
                <span>Date: {ev.event_date ? new Date(ev.event_date).toLocaleDateString() : 'TBD'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddEventModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
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
    setError(null)
    const { error: err } = await supabase.from('events').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head">
          <h3>Add Event</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field">
            <label>Title</label>
            <input type="text" required value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Description</label>
            <textarea rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Event Date</label>
            <input type="date" value={form.event_date} onChange={e => setForm(f => ({ ...f, event_date: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Image URL (optional)</label>
            <input type="url" value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>
            {saving ? 'Creating...' : 'Create Event'}
          </button>
        </form>
      </div>
    </div>
  )
}

// ═════════════════════════════════════════
// GALLERY
// ═════════════════════════════════════════

function GalleryTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAdd, setShowAdd] = useState(false)

  const load = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(24)
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
        <button className="dash-btn-primary" onClick={() => setShowAdd(true)}>
          <Plus size={18} /> Add Image
        </button>
      </div>

      {loading ? (
        <div className="dash-loading">Loading gallery...</div>
      ) : images.length === 0 ? (
        <div className="dash-empty">No images yet.</div>
      ) : (
        <div className="dash-gallery-grid">
          {images.map(img => (
            <div key={img.id} className="dash-gallery-item">
              <img src={img.image_url} alt={img.title || 'Gallery'} />
              <div className="dash-gallery-overlay">
                <span>{img.title || 'Untitled'}</span>
                <button className="dash-del-btn" onClick={() => deleteImage(img.id)}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showAdd && <AddImageModal onClose={() => setShowAdd(false)} onSaved={() => { setShowAdd(false); load() }} />}
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
    setError(null)
    const { error: err } = await supabase.from('gallery_images').insert([{ ...form, is_active: true }])
    if (err) { setError(err.message); setSaving(false); return }
    onSaved()
  }

  return (
    <div className="dash-modal-overlay" onClick={onClose}>
      <div className="dash-modal" onClick={e => e.stopPropagation()}>
        <div className="dash-modal-head">
          <h3>Add Gallery Image</h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        {error && <div className="dash-error">{error}</div>}
        <form onSubmit={submit} className="dash-form">
          <div className="dash-form-field">
            <label>Title</label>
            <input type="text" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Image URL</label>
            <input type="url" required value={form.image_url} onChange={e => setForm(f => ({ ...f, image_url: e.target.value }))} />
          </div>
          <div className="dash-form-field">
            <label>Category</label>
            <select value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
              <option value="general">General</option>
              <option value="classroom">Classroom</option>
              <option value="activities">Activities</option>
              <option value="outdoor">Outdoor</option>
              <option value="events">Events</option>
            </select>
          </div>
          <button type="submit" className="dash-btn-primary" disabled={saving}>
            {saving ? 'Adding...' : 'Add Image'}
          </button>
        </form>
      </div>
    </div>
  )
}

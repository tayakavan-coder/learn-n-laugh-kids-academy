import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'

const SECTIONS = [
  { key: 'teachers',      label: 'Teachers',      icon: '👩‍🏫' },
  { key: 'gallery',       label: 'Gallery',       icon: '📸' },
  { key: 'events',         label: 'Events',         icon: '🎉' },
  { key: 'announcements', label: 'Announcements', icon: '📢' },
  { key: 'admissions',    label: 'Admissions',    icon: '📝' },
  { key: 'messages',      label: 'Messages',      icon: '✉️' },
]

export default function Admin() {
  const [authed, setAuthed] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [authErr, setAuthErr] = useState(null)
  const [authLoading, setAuthLoading] = useState(false)
  const [section, setSection] = useState('teachers')
  const [data, setData] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) setAuthed(true)
    })
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      setAuthed(!!session)
    })
    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authed) return
    loadSection(section)
  }, [authed, section])

  const login = async e => {
    e.preventDefault()
    setAuthLoading(true)
    setAuthErr(null)
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) setAuthErr(error.message)
    setAuthLoading(false)
  }

  const logout = async () => { await supabase.auth.signOut(); setAuthed(false) }

  const loadSection = async key => {
    setLoading(true)
    let table = key
    if (key === 'messages') table = 'contact_messages'
    const { data: rows } = await supabase.from(table).select('*').order('created_at', { ascending: false })
    setData(d => ({ ...d, [key]: rows || [] }))
    setLoading(false)
  }

  const deleteRow = async (table, id) => {
    let t = table
    if (table === 'messages') t = 'contact_messages'
    await supabase.from(t).delete().eq('id', id)
    loadSection(section)
  }

  const updateRow = async (table, id, field, value) => {
    let t = table
    if (table === 'messages') t = 'contact_messages'
    await supabase.from(t).update({ [field]: value }).eq('id', id)
  }

  const uploadImage = async file => {
    const ext = file.name.split('.').pop()
    const path = `${section}/${Date.now()}.${ext}`
    const { error: upErr } = await supabase.storage.from('school-images').upload(path, file)
    if (upErr) return null
    const { data: pub } = supabase.storage.from('school-images').getPublicUrl(path)
    return pub.publicUrl
  }

  if (!authed) {
    return (
      <div className="admin-login-wrap">
        <motion.form
          className="admin-login"
          onSubmit={login}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <img src="/school-logo.jpg" alt="Logo" style={{ width: 72, height: 72, borderRadius: 16, objectFit: 'cover', margin: '0 auto 16px' }} />
          <h2 className="admin-login-title">Admin Login</h2>
          <p className="admin-login-sub">Learn'N Laugh Kids Academy</p>
          {authErr && <div className="admin-err">{authErr}</div>}
          <input className="admin-input" type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required />
          <input className="admin-input" type="password" placeholder="Password" value={pass} onChange={e => setPass(e.target.value)} required />
          <button className="admin-btn" type="submit" disabled={authLoading}>
            {authLoading ? 'Signing in...' : 'Sign In'}
          </button>
          <a href="#home" className="admin-back">← Back to website</a>
        </motion.form>
      </div>
    )
  }

  const rows = data[section] || []
  const cols = rows[0] ? Object.keys(rows[0]).filter(k => k !== 'id') : []

  return (
    <div className="admin-dash">
      <aside className="admin-sidebar">
        <div className="admin-sidebar-head">
          <img src="/school-logo.jpg" alt="Logo" style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
          <div>
            <div className="admin-sidebar-title">Admin Panel</div>
            <div className="admin-sidebar-sub">Learn'N Laugh</div>
          </div>
        </div>
        <nav className="admin-nav">
          {SECTIONS.map(s => (
            <button
              key={s.key}
              className={`admin-nav-btn${section === s.key ? ' active' : ''}`}
              onClick={() => setSection(s.key)}
            >
              <span>{s.icon}</span>
              <span>{s.label}</span>
            </button>
          ))}
        </nav>
        <button className="admin-logout" onClick={logout}>Sign Out</button>
        <a href="#home" className="admin-back-sidebar">← Back to website</a>
      </aside>

      <main className="admin-main">
        <h1 className="admin-h1">{SECTIONS.find(s => s.key === section)?.label}</h1>
        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : rows.length === 0 ? (
          <div className="admin-empty">No {section} found.</div>
        ) : (
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr>
                  {cols.map(c => <th key={c}>{c}</th>)}
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows.map(r => (
                  <tr key={r.id}>
                    {cols.map(c => (
                      <td key={c}>
                        {c === 'image_url' || c === 'photo_url' ? (
                          <img src={r[c]} alt="" style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }} />
                        ) : c === 'is_active' ? (
                          <input
                            type="checkbox"
                            defaultChecked={r[c]}
                            onChange={e => updateRow(section === 'messages' ? 'contact_messages' : section, r.id, 'is_active', e.target.checked)}
                          />
                        ) : c === 'status' ? (
                          <select
                            defaultValue={r[c]}
                            onChange={e => updateRow(section === 'messages' ? 'contact_messages' : section, r.id, 'status', e.target.value)}
                          >
                            {section === 'admissions' ? (
                              <>
                                <option value="pending">pending</option>
                                <option value="reviewed">reviewed</option>
                                <option value="accepted">accepted</option>
                                <option value="rejected">rejected</option>
                              </>
                            ) : (
                              <>
                                <option value="new">new</option>
                                <option value="read">read</option>
                                <option value="archived">archived</option>
                              </>
                            )}
                          </select>
                        ) : (
                          <span className="admin-cell-text">{String(r[c] ?? '')}</span>
                        )}
                      </td>
                    ))}
                    <td>
                      <button className="admin-del" onClick={() => deleteRow(section, r.id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

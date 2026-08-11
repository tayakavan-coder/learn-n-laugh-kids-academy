import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../AuthContext'
import { LayoutDashboard, Users, ClipboardCheck, FileText, Image, Calendar, MessageSquare, Settings, LogOut, Menu, X } from 'lucide-react'

const NAV_ITEMS = {
  admin: [
    { to: '/dashboard/admin', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/admin?tab=teachers', label: 'Teachers', icon: Users },
    { to: '/dashboard/admin?tab=admissions', label: 'Admissions', icon: ClipboardCheck },
    { to: '/dashboard/admin?tab=gallery', label: 'Gallery', icon: Image },
    { to: '/dashboard/admin?tab=events', label: 'Events', icon: Calendar },
    { to: '/dashboard/admin?tab=messages', label: 'Messages', icon: MessageSquare },
  ],
  teacher: [
    { to: '/dashboard/teacher', label: 'Overview', icon: LayoutDashboard },
    { to: '/dashboard/teacher?tab=students', label: 'Students', icon: Users },
    { to: '/dashboard/teacher?tab=attendance', label: 'Attendance', icon: ClipboardCheck },
    { to: '/dashboard/teacher?tab=assignments', label: 'Assignments', icon: FileText },
    { to: '/dashboard/teacher?tab=notices', label: 'Notices', icon: MessageSquare },
    { to: '/dashboard/teacher?tab=events', label: 'Events', icon: Calendar },
    { to: '/dashboard/teacher?tab=gallery', label: 'Gallery', icon: Image },
  ],
}

export default function DashboardLayout({ children }) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  if (!profile) return null

  const role = profile.role
  const items = NAV_ITEMS[role] || NAV_ITEMS.teacher
  const dashPath = role === 'admin' ? '/dashboard/admin' : '/dashboard/teacher'

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="dash-layout">
      <button className="dash-mobile-toggle" onClick={() => setSidebarOpen(v => !v)}>
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <aside className={`dash-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div className="dash-sidebar-head">
          <img src="/school-logo.jpg" alt="Logo" className="dash-logo" />
          <div>
            <div className="dash-sidebar-title">Learn'N Laugh</div>
            <div className="dash-sidebar-sub">{role.charAt(0).toUpperCase() + role.slice(1)} Panel</div>
          </div>
        </div>

        <nav className="dash-nav">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.to}
                to={item.to}
                className="dash-nav-item"
                onClick={() => setSidebarOpen(false)}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="dash-sidebar-footer">
          <Link to="/" className="dash-back-link">← Back to website</Link>
          <button className="dash-logout" onClick={handleSignOut}>
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      <main className="dash-main">
        <header className="dash-header">
          <div>
            <h1 className="dash-h1">{profile.full_name || 'Dashboard'}</h1>
            <p className="dash-h1-sub">Welcome back, {profile.email}</p>
          </div>
          <div className="dash-header-right">
            <Link to="/" className="dash-view-site">View Website</Link>
          </div>
        </header>
        <div className="dash-content">
          {children}
        </div>
      </main>
    </div>
  )
}

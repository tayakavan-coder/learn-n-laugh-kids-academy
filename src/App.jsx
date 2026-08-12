import { lazy, Suspense, useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './ThemeContext'
import { AuthProvider, useAuth } from './AuthContext'
import LoadingScreen from './components/LoadingScreen'
import MouseFollower from './components/MouseFollower'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import WhyChooseUs from './components/WhyChooseUs'
import Programs from './components/Programs'
import FunZone from './components/FunZone'
import Teachers from './components/Teachers'
import Facilities from './components/Facilities'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Achievements from './components/Achievements'
import Testimonials from './components/Testimonials'
import Admissions from './components/Admissions'
import Contact from './components/Contact'
import Footer from './components/Footer'
import LoginPage from './pages/LoginPage'
import DashboardLayout from './dashboards/DashboardLayout'

const TeacherDashboard = lazy(() => import('./dashboards/TeacherDashboard'))
const AdminDashboard = lazy(() => import('./dashboards/AdminDashboard'))

function HomePage() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <Hero />
      <About />
      <WhyChooseUs />
      <Programs />
      <FunZone />
      <Teachers />
      <Facilities />
      <Gallery />
      <Events />
      <Achievements />
      <Testimonials />
      <Admissions />
      <Contact />
      <Footer />
    </>
  )
}

function ProtectedRoute({ children, roles }) {
  const { profile, loading } = useAuth()
  if (loading) return <LoadingScreen show />
  if (!profile) return <Navigate to="/login" replace />
  if (roles && !roles.includes(profile.role)) return <Navigate to="/login" replace />
  return children
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      } />
      <Route path="/dashboard/teacher" element={
        <ProtectedRoute roles={['teacher', 'admin']}>
          <Suspense fallback={<LoadingScreen show />}>
            <TeacherDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="/dashboard/admin" element={
        <ProtectedRoute roles={['admin']}>
          <Suspense fallback={<LoadingScreen show />}>
            <AdminDashboard />
          </Suspense>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1800)
    return () => clearTimeout(t)
  }, [])

  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <LoadingScreen show={loading} />
          {!loading && <MouseFollower />}
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  )
}

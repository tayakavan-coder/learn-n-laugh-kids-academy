import { useEffect, useRef, useState } from 'react'
import { ThemeProvider } from './ThemeContext'
import LoadingScreen from './components/LoadingScreen'
import MouseFollower from './components/MouseFollower'
import ScrollProgress from './components/ScrollProgress'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import WhyChooseUs from './components/WhyChooseUs'
import Programs from './components/Programs'
import Teachers from './components/Teachers'
import Facilities from './components/Facilities'
import Gallery from './components/Gallery'
import Events from './components/Events'
import Achievements from './components/Achievements'
import Testimonials from './components/Testimonials'
import Admissions from './components/Admissions'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Admin from './components/Admin'

function HomePage() {
  const admRef = useRef(null)
  const scrollToAdmissions = () =>
    admRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })

  return (
    <>
      <ScrollProgress />
      <Navbar onAdmit={scrollToAdmissions} />
      <Hero onAdmit={scrollToAdmissions} />
      <About />
      <WhyChooseUs />
      <Programs />
      <Teachers />
      <Facilities />
      <Gallery />
      <Events />
      <Achievements />
      <Testimonials />
      <Admissions ref={admRef} />
      <Contact />
      <Footer />
    </>
  )
}

export default function App() {
  const [loading, setLoading] = useState(true)
  const [route, setRoute] = useState(window.location.hash)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2200)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const onHash = () => setRoute(window.location.hash)
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const isAdmin = route.startsWith('#/admin')

  return (
    <ThemeProvider>
      <LoadingScreen show={loading} />
      <MouseFollower />
      {isAdmin ? <Admin /> : <HomePage />}
    </ThemeProvider>
  )
}

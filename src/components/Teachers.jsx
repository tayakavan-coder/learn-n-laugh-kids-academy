import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { useReveal } from '../hooks'

const FALLBACK = [
  {
    name: 'Mrs. Sarah Mitchell',
    role: 'Head of Early Years',
    qualification: 'M.Ed. Early Childhood Education',
    experience: '12 Years Experience',
    specialization: 'Montessori & Play-Based Learning',
    photo_url: 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg?auto=compress&cs=tinysrgb&w=500',
    chip: 'Lead Educator',
    color: '#FF4FA3',
  },
  {
    name: 'Mr. James Okafor',
    role: 'Creative Arts Teacher',
    qualification: 'B.Ed. Arts & Education',
    experience: '8 Years Experience',
    specialization: 'Visual Arts, Music & Drama',
    photo_url: 'https://images.pexels.com/photos/8617673/pexels-photo-8617673.jpeg?auto=compress&cs=tinysrgb&w=500',
    chip: 'Arts Specialist',
    color: '#3B82F6',
  },
  {
    name: 'Ms. Priya Sharma',
    role: 'STEM & Science Teacher',
    qualification: 'M.Sc. Child Development',
    experience: '9 Years Experience',
    specialization: 'Coding, Science & Mathematics',
    photo_url: 'https://images.pexels.com/photos/5212345/pexels-photo-5212345.jpeg?auto=compress&cs=tinysrgb&w=500',
    chip: 'STEM Expert',
    color: '#22C55E',
  },
]

const SIcon = ({ type }) => {
  if (type === 'tw') return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.732-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
  if (type === 'li') return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
  return <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Teachers() {
  const [ref, vis] = useReveal()
  const [teachers, setTeachers] = useState(FALLBACK)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase
      .from('teachers')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setTeachers(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <section className="teachers" id="teachers" ref={ref}>
      <div className="container">
        <motion.div
          className="teachers-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">👩‍🏫 Our Teachers</div>
          <h2 className="section-title">Meet Our <span className="gradient-text">Dedicated Educators</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Passionate, qualified teachers who bring warmth, expertise, and an unmatched love for children every single day.
          </p>
        </motion.div>

        <div className="teachers-grid">
          {teachers.map((t, i) => (
            <motion.div
              key={t.name}
              className="teacher-card"
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -10 }}
            >
              <div className="teacher-img-wrap">
                <img src={t.photo_url} alt={t.name} className="teacher-img" />
                <div className="teacher-overlay">
                  {['tw','li','ig'].map(type => (
                    <button key={type} className="t-social" aria-label={type}>
                      <SIcon type={type} />
                    </button>
                  ))}
                </div>
              </div>
              <div className="teacher-body">
                <span className="teacher-chip" style={{ background: `${t.color}18`, color: t.color }}>{t.chip}</span>
                <div className="teacher-name">{t.name}</div>
                <div className="teacher-role">{t.role}</div>
                {[
                  { icon: '🎓', text: t.qualification },
                  { icon: '⏱️', text: t.experience  },
                  { icon: '⚡', text: t.specialization },
                ].filter(d => d.text).map(d => (
                  <div key={d.text} className="teacher-detail">
                    <span>{d.icon}</span>
                    <span>{d.text}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

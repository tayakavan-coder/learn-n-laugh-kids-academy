import { motion } from 'framer-motion'
import { useReveal } from '../hooks'

const PROGRAMS = [
  {
    name: 'Nursery',
    age: '2.5 – 3.5 years',
    icon: '🧸',
    color: '#FF4FA3',
    bg: 'rgba(255,79,163,0.06)',
    desc: 'A gentle introduction to structured learning through play, songs, stories, and sensory activities that build social and motor skills.',
    features: ['Play-based learning', 'Sensory development', 'Social skills', 'Story time'],
  },
  {
    name: 'LKG (KG1)',
    age: '4.5 – 5.5 years',
    icon: '🎨',
    color: '#3B82F6',
    bg: 'rgba(59,130,246,0.06)',
    desc: 'Building foundational literacy and numeracy through interactive lessons, creative arts, and hands-on exploration.',
    features: ['Phonics & reading', 'Basic numeracy', 'Creative arts', 'Group activities'],
  },
  {
    name: 'UKG (KG2)',
    age: '5.5 – 6.5 years',
    icon: '📚',
    color: '#22C55E',
    bg: 'rgba(34,197,94,0.06)',
    desc: 'Advanced preparation for primary school with structured academics, critical thinking, and confidence-building projects.',
    features: ['Reading & writing', 'Math concepts', 'Science exploration', 'Primary readiness'],
  },
  {
    name: 'Activity-Based Learning',
    age: 'All ages',
    icon: '🔬',
    color: '#F59E0B',
    bg: 'rgba(245,158,11,0.06)',
    desc: 'Hands-on projects and experiments that make learning come alive — from science to art, music, and beyond.',
    features: ['STEM projects', 'Art & craft', 'Music & dance', 'Field trips'],
  },
  {
    name: 'Smart Classes',
    age: 'All ages',
    icon: '🖥️',
    color: '#F97316',
    bg: 'rgba(249,115,22,0.06)',
    desc: 'Interactive digital classrooms with smart boards, educational apps, and multimedia content for 21st-century learning.',
    features: ['Interactive boards', 'Digital content', 'Educational apps', 'Multimedia learning'],
  },
  {
    name: 'After-School Care',
    age: 'All ages',
    icon: '🌟',
    color: '#A855F7',
    bg: 'rgba(168,85,247,0.06)',
    desc: 'Safe, engaging after-school programs with homework help, enrichment activities, and supervised play.',
    features: ['Homework support', 'Enrichment activities', 'Supervised play', 'Healthy snacks'],
  },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Programs() {
  const [ref, vis] = useReveal()

  return (
    <section className="programs" id="programs" ref={ref}>
      <div className="container">
        <motion.div
          className="programs-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">📚 Our Programs</div>
          <h2 className="section-title">Nurturing Every <span className="gradient-text">Stage of Growth</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From first steps to school readiness — our carefully crafted programs support your child at every milestone.
          </p>
        </motion.div>

        <div className="programs-grid">
          {PROGRAMS.map((p, i) => (
            <motion.div
              key={p.name}
              className="program-card"
              style={{ background: p.bg }}
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -8, scale: 1.02 }}
            >
              <div className="program-icon" style={{ background: p.color }}>{p.icon}</div>
              <div className="program-age" style={{ color: p.color }}>{p.age}</div>
              <h3 className="program-name">{p.name}</h3>
              <p className="program-desc">{p.desc}</p>
              <ul className="program-features">
                {p.features.map(f => (
                  <li key={f} className="program-feature">
                    <span className="program-check" style={{ color: p.color }}>✓</span>
                    {f}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

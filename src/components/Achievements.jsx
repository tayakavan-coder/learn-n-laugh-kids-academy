import { useReveal, useCounter } from '../hooks'

const STATS = [
  { target: 500, suffix: '+', lbl: 'Happy Students',     emoji: '🎒' },
  { target: 25,  suffix: '+', lbl: 'Expert Teachers',    emoji: '👩‍🏫' },
  { target: 98,  suffix: '%', lbl: 'Parent Satisfaction',emoji: '❤️' },
  { target: 50,  suffix: '+', lbl: 'Awards Won',          emoji: '🏆' },
]

const TROPHIES = [
  { icon: '🏆', title: 'Best Kindergarten 2024', desc: 'Awarded by the National Education Excellence Board for outstanding early years education.', year: '2024', bg: 'rgba(245,158,11,0.12)'  },
  { icon: '🥇', title: 'Top STEM Academy',        desc: 'Recognised as the top-performing STEM-focused kids academy in the region.',               year: '2023', bg: 'rgba(59,130,246,0.12)'  },
  { icon: '🌟', title: 'Creative Arts Excellence', desc: "Our students won 1st place at the National Kids Art & Culture Festival.",                 year: '2024', bg: 'rgba(255,79,163,0.12)' },
  { icon: '💚', title: 'Green School Award',       desc: 'Certified as a Green & Sustainable School for our eco-friendly campus initiatives.',      year: '2023', bg: 'rgba(34,197,94,0.12)'  },
  { icon: '📚', title: 'Reading Champion School',  desc: 'Our library programme produced the highest early literacy scores in the district.',       year: '2024', bg: 'rgba(168,85,247,0.12)' },
  { icon: '🎖️', title: 'Inclusivity Award',        desc: 'Honoured for creating an inclusive, diverse, and welcoming learning community.',          year: '2023', bg: 'rgba(249,115,22,0.12)' },
]

function StatCard({ target, suffix, lbl, emoji, active }) {
  const count = useCounter(target, 2200, active)
  return (
    <div className="stat-card">
      <span className="stat-emoji">{emoji}</span>
      <span className="stat-num">{count}{suffix}</span>
      <span className="stat-lbl">{lbl}</span>
    </div>
  )
}

export default function Achievements() {
  const [ref, vis] = useReveal()
  return (
    <section className="achievements" id="achievements" ref={ref}>
      <div className="container">
        <div className={`achievements-header reveal${vis ? ' in' : ''}`}>
          <div className="section-badge">🏆 Achievements</div>
          <h2 className="section-title">Our <span className="gradient-text">Awards & Recognition</span></h2>
          <p className="section-subtitle">
            Years of dedication and excellence — recognised by leading educational bodies nationwide.
          </p>
        </div>

        <div className="stats-row">
          {STATS.map((s, i) => (
            <div key={s.lbl} className={`reveal${vis ? ' in' : ''} rev-d${i+1}`}>
              <StatCard {...s} active={vis} />
            </div>
          ))}
        </div>

        <div className="trophies-grid">
          {TROPHIES.map((t, i) => (
            <div key={t.title} className={`trophy-card reveal${vis ? ' in' : ''} rev-d${Math.min(i+1,6)}`} style={{ background: t.bg }}>
              <div className="trophy-icon">{t.icon}</div>
              <div>
                <div className="trophy-title">{t.title}</div>
                <p className="trophy-desc">{t.desc}</p>
                <span className="trophy-year">{t.year}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

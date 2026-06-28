import { useReveal } from '../hooks'

const FEATURES = [
  { icon: '🛡️', title: 'Safe Campus',       desc: 'CCTV-monitored, fully secure campus with trained security, child-safe furniture, and strict visitor protocols.',     bg: 'linear-gradient(135deg,#FFF0F8,#FFE4F2)', iconBg: 'linear-gradient(135deg,#FF4FA3,#c9145f)', sh: 'rgba(255,79,163,0.15)' },
  { icon: '👩‍🏫', title: 'Expert Teachers',   desc: 'Certified early childhood educators with 5+ years of experience, trained in Montessori and modern pedagogy.',         bg: 'linear-gradient(135deg,#EFF6FF,#DBEAFE)', iconBg: 'linear-gradient(135deg,#3B82F6,#1d4ed8)', sh: 'rgba(59,130,246,0.15)'  },
  { icon: '🧠', title: 'Smart Learning',     desc: 'Digital smart boards, interactive apps, and project-based curriculum designed for 21st-century young learners.',      bg: 'linear-gradient(135deg,#F0FDF4,#DCFCE7)', iconBg: 'linear-gradient(135deg,#22C55E,#15803d)', sh: 'rgba(34,197,94,0.15)'   },
  { icon: '🎨', title: 'Creative Arts',      desc: 'Daily art, music, dance, and drama sessions that unlock imagination, emotional intelligence, and self-expression.',    bg: 'linear-gradient(135deg,#FFFBEB,#FEF3C7)', iconBg: 'linear-gradient(135deg,#F59E0B,#d97706)', sh: 'rgba(245,158,11,0.15)'  },
  { icon: '🌱', title: 'Holistic Growth',    desc: 'Physical, social, emotional and cognitive development woven into every activity and learning experience daily.',        bg: 'linear-gradient(135deg,#FFF7ED,#FFEDD5)', iconBg: 'linear-gradient(135deg,#F97316,#ea580c)', sh: 'rgba(249,115,22,0.15)'  },
  { icon: '🌍', title: 'Global Curriculum',  desc: 'IB-inspired curriculum blending international standards with local culture — preparing children for a global future.',  bg: 'linear-gradient(135deg,#FAF5FF,#EDE9FE)', iconBg: 'linear-gradient(135deg,#A855F7,#7c3aed)', sh: 'rgba(168,85,247,0.15)'  },
]

export default function WhyChooseUs() {
  const [ref, vis] = useReveal()

  return (
    <section className="why" id="why" ref={ref}>
      <div className="container">
        <div className={`why-header reveal${vis ? ' in' : ''}`}>
          <div className="section-badge">⭐ Why Choose Us</div>
          <h2 className="section-title">What Makes Us <span className="gradient-text">Different</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            We go beyond traditional education to create an environment where every child feels safe, inspired, and excited to learn each day.
          </p>
        </div>
        <div className="why-grid">
          {FEATURES.map((f, i) => (
            <div key={f.title} className={`why-card reveal${vis ? ' in' : ''} rev-d${Math.min(i+1,6)}`} style={{ background: f.bg }}>
              <div className="why-icon" style={{ background: f.iconBg, boxShadow: `0 8px 20px ${f.sh}` }}>{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

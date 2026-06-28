import { motion } from 'framer-motion'
import { useReveal } from '../hooks'

const FACS = [
  { name: 'Smart Classrooms', desc: 'Interactive boards, digital tools, and ergonomic furniture for young learners.',         icon: '🖥️', img: 'https://images.pexels.com/photos/8617550/pexels-photo-8617550.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Indoor Activities', desc: 'Dedicated space for arts & crafts, science experiments, music, and projects.',           icon: '🎨', img: 'https://images.pexels.com/photos/8613165/pexels-photo-8613165.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Outdoor Activities', desc: 'Safe, padded outdoor play area with slides, swings, and climbing structures.',        icon: '🛝', img: 'https://images.pexels.com/photos/8612929/pexels-photo-8612929.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Safe Environment', desc: 'CCTV-monitored, fully secure campus with trained security and child-safe furniture.',    icon: '🛡️', img: 'https://images.pexels.com/photos/8617550/pexels-photo-8617550.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Transportation', desc: 'GPS-tracked, air-conditioned school buses with trained attendants for safe journeys.',    icon: '🚌', img: 'https://images.pexels.com/photos/1201996/pexels-photo-1201996.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { name: 'Kids Library', desc: "Vibrant library with 2,000+ children's books, e-readers, and cosy reading nooks.",       icon: '📚', img: 'https://images.pexels.com/photos/1370295/pexels-photo-1370295.jpeg?auto=compress&cs=tinysrgb&w=700' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Facilities() {
  const [ref, vis] = useReveal()
  return (
    <section className="facilities" id="facilities" ref={ref}>
      <div className="container">
        <motion.div
          className="facilities-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">🏛️ Our Facilities</div>
          <h2 className="section-title">World-Class <span className="gradient-text">Learning Spaces</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Purpose-built spaces designed with children in mind — safe, inspiring, and filled with possibilities for exploration and discovery.
          </p>
        </motion.div>
        <div className="facilities-grid">
          {FACS.map((f, i) => (
            <motion.div
              key={f.name}
              className="fac-card"
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ rotateY: 8, y: -8, scale: 1.03 }}
              style={{ transformStyle: 'preserve-3d', perspective: 1000 }}
            >
              <img src={f.img} alt={f.name} className="fac-img" />
              <div className="fac-overlay">
                <div className="fac-icon-bubble">{f.icon}</div>
                <div className="fac-name">{f.name}</div>
                <p className="fac-desc">{f.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

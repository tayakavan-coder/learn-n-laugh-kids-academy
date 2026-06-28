import { motion } from 'framer-motion'
import { useReveal } from '../hooks'

const TESTIMONIALS = [
  { text: "Learn'N Laugh transformed our daughter's love for learning. She wakes up excited for school every day! The teachers are incredibly caring and skilled.",  name: 'Amelia Johnson',           role: 'Parent of Emma, Nursery',    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { text: "The best investment we made for our son. The balance of academics and play is perfect. He's come so far — confident, curious, and kind.",                  name: 'David Okonkwo',             role: 'Parent of Liam, KG2',        avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { text: 'Outstanding school! The STEM program sparked our child\'s passion for science. The teachers truly care about each child as an individual.',               name: 'Sarah Chen',                role: 'Parent of Noah, KG1',        avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { text: "We moved here and were nervous about finding a good school. Learn'N Laugh made our family feel at home instantly. Highly recommend to every parent!",     name: 'James & Fatima Al-Rashid', role: 'Parents of Layla, Reception', avatar: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { text: "The creative arts programme is second to none. Our daughter is now winning national art competitions. The teachers saw her potential before we did!",      name: 'Rebecca Williams',         role: 'Parent of Sophie, KG2',      avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150' },
  { text: 'Safety, learning, and fun — they nail all three. The app keeps us informed in real time. This school is a gem that deserves far more recognition.',       name: 'Marcus Thompson',          role: 'Parent of Max, Nursery',     avatar: 'https://images.pexels.com/photos/91227/pexels-photo-91227.jpeg?auto=compress&cs=tinysrgb&w=150' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Testimonials() {
  const [ref, vis] = useReveal()
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS]

  return (
    <section className="testimonials" id="testimonials" ref={ref}>
      <div className="container">
        <motion.div
          className="testimonials-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">💬 Testimonials</div>
          <h2 className="section-title">What <span className="gradient-text">Parents Say</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            The trust and love of our parent community is our greatest achievement.
          </p>
        </motion.div>
      </div>
      <div className="track-outer">
        <div className="track">
          {doubled.map((t, i) => (
            <div key={i} className="tcard">
              <div className="tcard-stars">{[...Array(5)].map((_, j) => <span key={j} className="star">★</span>)}</div>
              <div className="tcard-quote">"</div>
              <p className="tcard-text">{t.text}</p>
              <div className="tcard-author">
                <img src={t.avatar} alt={t.name} className="tcard-avatar" />
                <div>
                  <div className="tcard-name">{t.name}</div>
                  <div className="tcard-role">{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

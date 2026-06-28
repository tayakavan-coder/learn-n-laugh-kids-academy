import { motion } from 'framer-motion'
import { useReveal, useCounter } from '../hooks'

const MV = [
  { icon: '🎯', title: 'Our Mission', text: "To nurture every child's unique potential through joyful, holistic learning that builds confidence, creativity, and character.", bg: 'rgba(255,79,163,0.06)', iconBg: 'rgba(255,79,163,0.12)' },
  { icon: '🌟', title: 'Our Vision',  text: "To be the leading kids academy shaping tomorrow's leaders through innovation, love, and world-class early education.",  bg: 'rgba(59,130,246,0.06)',  iconBg: 'rgba(59,130,246,0.12)'  },
  { icon: '💎', title: 'Core Values', text: "Respect, Curiosity, Empathy, and Excellence — the four pillars guiding everything we do at Learn'N Laugh.", bg: 'rgba(34,197,94,0.06)',  iconBg: 'rgba(34,197,94,0.12)'  },
  { icon: '🤝', title: 'Community',   text: "Building a strong bond between teachers, parents and students — a true family for every learner.", bg: 'rgba(245,158,11,0.06)', iconBg: 'rgba(245,158,11,0.12)' },
]

const COUNTERS = [
  { target: 500, suffix: '+', lbl: 'Happy Students',     emoji: '🎒' },
  { target: 25,  suffix: '+', lbl: 'Expert Teachers',    emoji: '👩‍🏫' },
  { target: 98,  suffix: '%', lbl: 'Parent Satisfaction',emoji: '❤️' },
  { target: 15,  suffix: '+', lbl: 'Years of Excellence', emoji: '🏆' },
]

function CounterCard({ target, suffix, lbl, emoji, active }) {
  const count = useCounter(target, 2200, active)
  return (
    <div className="counter-card">
      <span className="counter-emoji">{emoji}</span>
      <span className="counter-num">{count}{suffix}</span>
      <span className="counter-lbl">{lbl}</span>
    </div>
  )
}

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function About() {
  const [ref, vis] = useReveal()

  return (
    <section className="about" id="about" ref={ref}>
      <div className="container">
        <div className="about-grid">
          <motion.div
            className="about-img-col"
            initial="hidden"
            animate={vis ? 'show' : 'hidden'}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <img
              src="https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=800"
              alt="Children learning at Learn'N Laugh"
              className="about-main-img"
            />
            <div className="about-badge">
              <div className="about-badge-num">15+</div>
              <div className="about-badge-lbl">Years of Excellence</div>
            </div>
            <div className="about-deco" />
          </motion.div>

          <div className="about-text">
            <motion.div
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.6, delay: 0.15 }}
            >
              <div className="section-badge">🏫 About Us</div>
              <h2 className="section-title">
                A Place Where <span className="gradient-text">Childhood Blooms</span>
              </h2>
              <p className="about-intro">
                Learn'N Laugh Kids Academy is a premium kindergarten and early childhood education centre dedicated to inspiring young minds. Our nurturing environment blends academic excellence with joyful play-based learning — ensuring every child develops the confidence, skills, and love of learning they need to thrive for life.
              </p>
            </motion.div>

            <div className="about-mv-grid">
              {MV.map((m, i) => (
                <motion.div
                  key={m.title}
                  className="mv-card"
                  style={{ background: m.bg }}
                  initial="hidden"
                  animate={vis ? 'show' : 'hidden'}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.02 }}
                >
                  <div className="mv-icon" style={{ width: 46, height: 46, borderRadius: 12, background: m.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 10 }}>{m.icon}</div>
                  <div className="mv-title">{m.title}</div>
                  <p className="mv-text">{m.text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <div className="counters-row">
          {COUNTERS.map((c, i) => (
            <motion.div
              key={c.lbl}
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: 0.4 + i * 0.1 }}
            >
              <CounterCard {...c} active={vis} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

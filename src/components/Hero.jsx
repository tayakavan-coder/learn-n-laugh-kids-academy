import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import ParticleBg from './ParticleBg'

const COLORS = [
  ['#FF4FA3', '#c9145f'],
  ['#3B82F6', '#1d4ed8'],
  ['#22C55E', '#15803d'],
  ['#F59E0B', '#d97706'],
  ['#F97316', '#ea580c'],
  ['#A855F7', '#7c3aed'],
  ['#EC4899', '#db2777'],
  ['#06B6D4', '#0891b2'],
]

const STATS = [
  { num: '500+', lbl: 'Happy Students' },
  { num: '25+', lbl: 'Expert Teachers' },
  { num: '15+', lbl: 'Years Excellence' },
  { num: '98%', lbl: 'Parent Satisfaction' },
]

export default function Hero({ onAdmit }) {
  const [balloons, setBalloons] = useState([])
  const [sceneMessage, setSceneMessage] = useState('Pick a learning adventure')

  const handleAdmission = () => {
    if (onAdmit) {
      onAdmit()
      return
    }
    document.getElementById('admissions')?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    setBalloons(
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${5 + Math.random() * 90}%`,
        delay: `${Math.random() * 22}s`,
        dur: `${18 + Math.random() * 16}s`,
        col: COLORS[i % COLORS.length],
        w: 42 + Math.random() * 28,
        str: 70 + Math.random() * 50,
      }))
    )
  }, [])

  return (
    <section className="hero relative min-h-screen flex items-center justify-center overflow-hidden" id="home">
      <div className="hero-gradient absolute inset-0" />
      <ParticleBg />

      {/* Balloons */}
      <div className="balloons-wrap absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        {balloons.map(b => (
          <div
            key={b.id}
            className="balloon"
            style={{ left: b.left, animationDuration: b.dur, animationDelay: b.delay }}
          >
            <div
              className="balloon-body"
              style={{
                width: b.w,
                height: b.w * 1.2,
                background: `linear-gradient(135deg, ${b.col[0]}, ${b.col[1]})`,
                boxShadow: `inset -8px -10px 20px rgba(0,0,0,0.2), 0 6px 18px rgba(0,0,0,0.2)`,
              }}
            />
            <div className="balloon-tie" />
            <div className="balloon-string" style={{ height: b.str }} />
          </div>
        ))}
      </div>

      <div className="hero-learning-scene" aria-label="Interactive learning scene">
        <button className="hero-scene-book" onClick={() => setSceneMessage('A new story is ready to explore')} aria-label="Open the story book">
          <span>BOOK</span>
        </button>
        <button className="hero-scene-rocket" onClick={() => setSceneMessage('Three, two, one — imagination takes off')} aria-label="Launch the rocket">
          <span>ROCKET</span>
        </button>
        <button className="hero-scene-star" onClick={() => setSceneMessage('Every bright idea starts with a spark')} aria-label="Spark the star">✦</button>
        <div className="hero-scene-cloud hero-scene-cloud-one" />
        <div className="hero-scene-cloud hero-scene-cloud-two" />
        <div className="hero-scene-card">
          <span className="hero-scene-card-dot" />
          <span>{sceneMessage}</span>
        </div>
      </div>

      {/* Hero content */}
      <div className="container relative w-full" style={{ zIndex: 3, background: 'linear-gradient(135deg, #0f3d56 0%, #155e75 48%, #0e7490 100%)', borderRadius: 40, boxShadow: '0 24px 70px rgba(8, 47, 73, 0.34)' }}>
        <div className="hero-content text-center">
          <motion.div
            className="hero-logo-wrap flex justify-center mb-6"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 120, delay: 0.3 }}
          >
            <img
              src="/school-logo.jpg"
              alt="Learn'N Laugh Kids Academy Logo"
              className="hero-logo rounded-2xl"
              style={{ width: 100, height: 100, objectFit: 'cover' }}
            />
          </motion.div>

          <motion.div
            className="hero-badge inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <span className="hero-badge-dot w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-body font-semibold text-sm">Admissions Open 2025-26</span>
          </motion.div>

          <motion.h1
            className="hero-title font-display font-black text-white mb-4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <span className="block text-4xl sm:text-5xl md:text-7xl">Learn'N Laugh</span>
            <span className="block text-2xl sm:text-3xl md:text-5xl bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, #FF4FA3, #3B82F6, #22C55E)' }}>Where Every Child Learns, Plays &amp; Shines</span>
          </motion.h1>

          <motion.p
            className="hero-tagline text-white/90 text-lg md:text-xl font-body font-medium mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Discover a joyful learning journey designed to inspire curiosity, creativity and confidence.
          </motion.p>

          <motion.div
            className="hero-actions flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-8 md:mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="btn-admit px-6 py-3 md:px-8 md:py-4 rounded-full font-display font-bold text-white text-base md:text-lg w-full sm:w-auto"
              style={{ background: 'linear-gradient(135deg, #FF4FA3, #c9145f)', boxShadow: '0 8px 30px rgba(255,79,163,0.4)' }}
              onClick={handleAdmission}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Apply for Admission
            </motion.button>
            <motion.a
              href="#programs"
              className="btn-tour px-6 py-3 md:px-8 md:py-4 rounded-full font-display font-bold text-white text-base md:text-lg w-full sm:w-auto text-center"
              style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.3)' }}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Programs
            </motion.a>
          </motion.div>

          <motion.div
            className="hero-stats flex flex-wrap justify-center gap-4 md:gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
          >
            {STATS.map((s, i) => (
              <div key={s.lbl} className="hero-stat-group flex items-center">
                {i > 0 && <div className="hero-divider hidden md:block w-px h-10 bg-white/20 mx-4" />}
                <div className="hero-stat text-center">
                  <span className="hero-stat-num block text-2xl md:text-4xl font-display font-black text-white">{s.num}</span>
                  <span className="hero-stat-lbl block text-xs md:text-sm text-white/70 font-body">{s.lbl}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <motion.div
        className="scroll-indicator absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ zIndex: 3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <div className="scroll-mouse w-6 h-10 rounded-full border-2 border-white/50 flex justify-center pt-2">
          <div className="scroll-wheel w-1 h-2 rounded-full bg-white/70 animate-bounce" />
        </div>
        <span className="scroll-label text-white/60 text-xs font-body">Scroll</span>
      </motion.div>
    </section>
  )
}

import { useState } from 'react'
import { motion } from 'framer-motion'
import { useReveal } from '../hooks'

const ACTIVITIES = [
  { id: 'colors', label: 'Color Lab', hint: 'Mix a bright new color', icon: '●', color: '#FF4FA3' },
  { id: 'letters', label: 'ABC Builder', hint: 'Find the next letter', icon: 'A', color: '#3B82F6' },
  { id: 'numbers', label: 'Number Pop', hint: 'Solve a quick challenge', icon: '7', color: '#F59E0B' },
  { id: 'memory', label: 'Memory Match', hint: 'Reveal the hidden pairs', icon: '◆', color: '#22C55E' },
]

const MEMORY_CARDS = ['sun', 'sun', 'star', 'star', 'book', 'book']

export default function FunZone() {
  const [ref, visible] = useReveal()
  const [active, setActive] = useState('colors')
  const [color, setColor] = useState('#FF4FA3')
  const [letter, setLetter] = useState('A')
  const [numberAnswer, setNumberAnswer] = useState(null)
  const [flipped, setFlipped] = useState([])
  const [matched, setMatched] = useState([])

  const pickLetter = () => setLetter(letter === 'A' ? 'B' : letter === 'B' ? 'C' : 'A')
  const pickNumber = (answer) => setNumberAnswer(answer === 8 ? 'Correct! You are a number star.' : 'Almost! Try eight.')
  const flipCard = (index) => {
    if (flipped.includes(index) || matched.includes(index) || flipped.length === 2) return
    const next = [...flipped, index]
    setFlipped(next)
    if (next.length === 2) {
      if (MEMORY_CARDS[next[0]] === MEMORY_CARDS[next[1]]) setMatched(current => [...current, ...next])
      window.setTimeout(() => setFlipped([]), 650)
    }
  }

  return (
    <section className="fun-zone" id="activities" ref={ref}>
      <div className="container">
        <motion.div className="fun-zone-header" initial={{ opacity: 0, y: 24 }} animate={visible ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.5 }}>
          <div className="section-badge">Play, discover, grow</div>
          <h2 className="section-title">Welcome to the <span className="gradient-text">Kids Fun Zone</span></h2>
          <p className="section-subtitle">Little learning moments made for curious minds. Pick an activity and start exploring.</p>
        </motion.div>

        <div className="fun-zone-layout">
          <div className="fun-zone-menu" role="tablist" aria-label="Kids activities">
            {ACTIVITIES.map((activity, index) => (
              <motion.button
                key={activity.id}
                className={`fun-zone-tab${active === activity.id ? ' active' : ''}`}
                style={{ '--activity-color': activity.color }}
                onClick={() => setActive(activity.id)}
                role="tab"
                aria-selected={active === activity.id}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="fun-zone-icon">{activity.icon}</span>
                <span><strong>{activity.label}</strong><small>{activity.hint}</small></span>
              </motion.button>
            ))}
          </div>

          <div className="fun-zone-stage" role="tabpanel">
            {active === 'colors' && (
              <div className="fun-activity colors-activity">
                <div className="fun-activity-copy"><span className="fun-activity-kicker">Color Lab</span><h3>What color is your idea today?</h3><p>Tap a color and watch your creative canvas change.</p></div>
                <div className="color-canvas" style={{ background: `linear-gradient(135deg, ${color}, #fff4a8)` }}><span>Brilliant!</span></div>
                <div className="color-swatches">{['#FF4FA3', '#3B82F6', '#22C55E', '#F59E0B', '#A855F7'].map(value => <button key={value} aria-label={`Choose ${value}`} className={color === value ? 'selected' : ''} style={{ background: value }} onClick={() => setColor(value)} />)}</div>
              </div>
            )}
            {active === 'letters' && (
              <div className="fun-activity letter-activity"><span className="fun-activity-kicker">ABC Builder</span><h3>Which letter comes next?</h3><div className="big-letter">{letter}</div><p>Tap the letter to keep your alphabet adventure going.</p><button className="fun-action-button" onClick={pickLetter}>Next letter</button></div>
            )}
            {active === 'numbers' && (
              <div className="fun-activity number-activity"><span className="fun-activity-kicker">Number Pop</span><h3>What is 5 + 3?</h3><div className="number-options">{[7, 8, 9].map(answer => <button key={answer} className="number-option" onClick={() => pickNumber(answer)}>{answer}</button>)}</div><p className="fun-feedback" aria-live="polite">{numberAnswer || 'Choose an answer to see how you did.'}</p></div>
            )}
            {active === 'memory' && (
              <div className="fun-activity memory-activity"><span className="fun-activity-kicker">Memory Match</span><h3>Find the matching friends</h3><div className="memory-grid">{MEMORY_CARDS.map((card, index) => <button key={index} className={`memory-card${flipped.includes(index) || matched.includes(index) ? ' revealed' : ''}`} onClick={() => flipCard(index)} aria-label="Memory card">{flipped.includes(index) || matched.includes(index) ? card : '?'}</button>)}</div><p className="fun-feedback">{matched.length === MEMORY_CARDS.length ? 'Amazing memory!' : 'Turn over two cards at a time.'}</p></div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

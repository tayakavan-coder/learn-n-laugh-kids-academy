import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { useReveal } from '../hooks'

const FALLBACK = [
  { title: 'Annual Day Celebration', description: 'A spectacular showcase of talent, music, and dance by our little stars.', event_date: '2025-12-15', image_url: 'https://images.pexels.com/photos/8612929/pexels-photo-8612929.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { title: 'Science Exhibition',     description: 'Young innovators present their exciting science projects and experiments.', event_date: '2025-11-20', image_url: 'https://images.pexels.com/photos/8612987/pexels-photo-8612987.jpeg?auto=compress&cs=tinysrgb&w=700' },
  { title: 'Sports Day',             description: 'Fun-filled outdoor activities and games for all our young athletes.',     event_date: '2026-01-10', image_url: 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=700' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Events() {
  const [ref, vis] = useReveal()
  const [events, setEvents] = useState(FALLBACK)

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setEvents(data)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="events" id="events" ref={ref}>
      <div className="container">
        <motion.div
          className="events-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">🎉 School Events</div>
          <h2 className="section-title">Upcoming <span className="gradient-text">Events & Activities</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Join us for exciting events that bring our school community together — celebrating learning, creativity, and joy.
          </p>
        </motion.div>

        <div className="events-grid">
          {events.map((e, i) => (
            <motion.div
              key={e.title}
              className="event-card"
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ y: -8 }}
            >
              <div className="event-img-wrap">
                <img src={e.image_url} alt={e.title} className="event-img" />
                {e.event_date && (
                  <div className="event-date-badge">
                    {new Date(e.event_date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}
                  </div>
                )}
              </div>
              <div className="event-body">
                <h3 className="event-title">{e.title}</h3>
                <p className="event-desc">{e.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

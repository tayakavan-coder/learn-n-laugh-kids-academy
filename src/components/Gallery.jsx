import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../supabase'
import { useReveal } from '../hooks'

const FALLBACK = [
  { title: 'Children Learning', image_url: 'https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=900', category: 'classroom' },
  { title: 'Art and Craft',     image_url: 'https://images.pexels.com/photos/8617673/pexels-photo-8617673.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'activities' },
  { title: 'Outdoor Play',      image_url: 'https://images.pexels.com/photos/8613165/pexels-photo-8613165.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'outdoor' },
  { title: 'Science Activity',  image_url: 'https://images.pexels.com/photos/8612987/pexels-photo-8612987.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'activities' },
  { title: 'Annual Celebration', image_url: 'https://images.pexels.com/photos/8612929/pexels-photo-8612929.jpeg?auto=compress&cs=tinysrgb&w=900', category: 'events' },
  { title: 'Sports Day',         image_url: 'https://images.pexels.com/photos/8613012/pexels-photo-8613012.jpeg?auto=compress&cs=tinysrgb&w=600', category: 'events' },
]

const CATS = ['all', 'classroom', 'activities', 'outdoor', 'events']

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Gallery() {
  const [ref, vis] = useReveal()
  const [images, setImages] = useState(FALLBACK)
  const [cat, setCat] = useState('all')
  const [lb, setLb] = useState(null)

  useEffect(() => {
    supabase
      .from('gallery_images')
      .select('*')
      .eq('is_active', true)
      .order('sort_order', { ascending: true })
      .then(({ data }) => {
        if (data && data.length > 0) setImages(data)
      })
      .catch(() => {})
  }, [])

  const filtered = cat === 'all' ? images : images.filter(img => img.category === cat)
  const prev = () => setLb(l => (l - 1 + filtered.length) % filtered.length)
  const next = () => setLb(l => (l + 1) % filtered.length)

  return (
    <section className="gallery" id="gallery" ref={ref}>
      <div className="container">
        <motion.div
          className="gallery-header text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
        >
          <div className="section-badge">📸 Event Gallery</div>
          <h2 className="section-title">Moments of <span className="gradient-text">Joy & Learning</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            A glimpse into the vibrant, colourful world of Learn'N Laugh — where every day is a new adventure.
          </p>
        </motion.div>

        <div className="gallery-filters">
          {CATS.map(c => (
            <button
              key={c}
              className={`gallery-filter${cat === c ? ' active' : ''}`}
              onClick={() => setCat(c)}
            >
              {c.charAt(0).toUpperCase() + c.slice(1)}
            </button>
          ))}
        </div>

        <div className="gallery-masonry">
          {filtered.map((img, i) => (
            <motion.div
              key={img.image_url + i}
              className="gallery-item"
              initial="hidden"
              animate={vis ? 'show' : 'hidden'}
              variants={fadeUp}
              transition={{ duration: 0.4, delay: Math.min(i * 0.06, 0.4) }}
              whileHover={{ y: -5 }}
              onClick={() => setLb(i)}
            >
              <img src={img.image_url} alt={img.title || 'Gallery'} className="gallery-img" />
              <div className="gallery-overlay">
                <div className="gallery-zoom">🔍</div>
                {img.title && <div className="gallery-title">{img.title}</div>}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {lb !== null && (
          <motion.div
            className="lightbox"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLb(null)}
          >
            <motion.img
              src={filtered[lb].image_url}
              alt={filtered[lb].title || 'Gallery'}
              className="lb-img"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={e => e.stopPropagation()}
            />
            <button className="lb-close" onClick={() => setLb(null)}>✕</button>
            <button className="lb-btn lb-prev" onClick={e => { e.stopPropagation(); prev() }}>‹</button>
            <button className="lb-btn lb-next" onClick={e => { e.stopPropagation(); next() }}>›</button>
            {filtered[lb].title && <div className="lb-title">{filtered[lb].title}</div>}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

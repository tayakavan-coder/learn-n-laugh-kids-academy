import { useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { useReveal } from '../hooks'

const PHONES = ['+91 7010034228', '+91 7070294012']
const WHATSAPP = '917010034228'
const ADDRESS = 'No:16, North Street, Old Saram (Near Water Tank), Puducherry – 605013'
const HOURS = 'Mon – Fri: 9:00 AM – 7:00 PM\nSaturday: 9:00 AM – 2:00 PM'

const ITEMS = [
  { icon: '📍', title: 'Visit Us',      text: ADDRESS },
  { icon: '📞', title: 'Call Us',       text: PHONES.join('\n') },
  { icon: '⏰', title: 'School Hours',  text: HOURS },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

export default function Contact() {
  const [ref, vis] = useReveal()
  const [secRef, vis2] = useReveal()
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const set = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(null) }

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error: err } = await supabase.from('contact_messages').insert([form])
    if (err) { setError('Something went wrong. Please try again.'); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  return (
    <section className="contact" id="contact" ref={ref}>
      <div className="container">
        <motion.div
          className="text-center"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.6 }}
          style={{ marginBottom: 60 }}
        >
          <div className="section-badge">📍 Contact Us</div>
          <h2 className="section-title">We'd Love to <span className="gradient-text">Hear From You</span></h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Have questions about admissions, curriculum, or campus life? Our team is always happy to help.
          </p>
        </motion.div>

        <div className="contact-inner">
          <motion.div
            className="contact-cards"
            initial="hidden"
            animate={vis ? 'show' : 'hidden'}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="contact-info-list">
              {ITEMS.map(item => (
                <div key={item.title} className="ccard">
                  <div className="ccard-icon">{item.icon}</div>
                  <div>
                    <div className="ccard-title">{item.title}</div>
                    <p className="ccard-text" style={{ whiteSpace: 'pre-line' }}>{item.text}</p>
                  </div>
                </div>
              ))}
              <div className="contact-quick-btns">
                {PHONES.map(p => (
                  <a key={p} href={`tel:${p.replace(/\s/g, '')}`} className="quick-btn call-btn">
                    📞 Call {p}
                  </a>
                ))}
                <a
                  href={`https://wa.me/${WHATSAPP}?text=Hi%20Learn'N%20Laugh%20Kids%20Academy,%20I'd%20like%20to%20know%20more%20about%20admissions.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="quick-btn wa-btn"
                >
                  💬 WhatsApp Us
                </a>
              </div>
            </div>
            <div className="contact-map">
              <iframe
                title="Learn'N Laugh Kids Academy Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3944.130229694964!2d79.81194287510603!3d11.941988588286706!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a53613f7b7fcbfd%3A0x538d6d8bd7718dd7!2sLearn%20&#39;N%20Laugh%20Kids%20Academy!5e1!3m2!1sen!2sin!4v1782396438578!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0, borderRadius: 20, minHeight: 280 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </motion.div>

          <motion.div
            className="contact-form-wrap"
            ref={secRef}
            initial="hidden"
            animate={vis2 ? 'show' : 'hidden'}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {success ? (
              <div className="form-success-msg">
                <span className="big-emoji">💌</span>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. We'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="form-head">Send Us a Message</div>
                <div className="form-sub">Fill in the form below and we'll respond shortly.</div>
                <form onSubmit={submit}>
                  <div className="form-grid">
                    <div className="fg">
                      <label htmlFor="name">Your Name *</label>
                      <input id="name" name="name" type="text" placeholder="e.g. Sarah Johnson" value={form.name} onChange={set} required />
                    </div>
                    <div className="fg">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" placeholder="parent@email.com" value={form.email} onChange={set} required />
                    </div>
                    <div className="fg full">
                      <label htmlFor="subject">Subject *</label>
                      <input id="subject" name="subject" type="text" placeholder="What's this about?" value={form.subject} onChange={set} required />
                    </div>
                    <div className="fg full">
                      <label htmlFor="message">Message *</label>
                      <textarea id="message" name="message" placeholder="Tell us how we can help..." value={form.message} onChange={set} required />
                    </div>
                  </div>
                  {error && <p className="form-error">{error}</p>}
                  <motion.button
                    className="submit-btn"
                    type="submit"
                    disabled={loading}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {loading ? <><span>⟳</span><span>Sending...</span></> : <><span>✉️</span><span>Send Message</span></>}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

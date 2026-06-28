import { forwardRef, useState } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../supabase'
import { useReveal } from '../hooks'

const CLASSES = [
  'Nursery (2.5 – 3.5 years)',
  'LKG (3.5 – 4.5 years)',
  'UKG (4.5 – 5.5 years)',
  'Activity-Based Learning',
  'Smart Classes',
  'After-School Care',
]

const STEPS = [
  { title: 'Submit Application', desc: "Fill in the online form with your child's and parent's details." },
  { title: 'Campus Visit',       desc: 'Book a guided tour and meet our welcoming teaching team.' },
  { title: 'Assessment Day',     desc: "A fun, play-based session to understand your child's learning style." },
  { title: 'Confirmation',       desc: 'Receive your admission offer and complete the enrolment process.' },
]

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0 },
}

const Admissions = forwardRef(function Admissions(_, ref) {
  const [secRef, vis] = useReveal()
  const [form, setForm] = useState({ student_name: '', parent_name: '', phone: '', email: '', class_applying: '', message: '' })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)

  const set = e => { setForm(f => ({ ...f, [e.target.name]: e.target.value })); setError(null) }

  const submit = async e => {
    e.preventDefault()
    setLoading(true)
    const { error: err } = await supabase.from('admissions').insert([form])
    if (err) { setError('Something went wrong. Please try again.'); setLoading(false); return }
    setSuccess(true)
    setLoading(false)
  }

  return (
    <section className="admissions" id="admissions" ref={el => { secRef.current = el; if (ref) ref.current = el }}>
      <div className="container">
        <motion.div
          className="section-badge"
          initial="hidden"
          animate={vis ? 'show' : 'hidden'}
          variants={fadeUp}
          transition={{ duration: 0.5 }}
          style={{ marginBottom: 0 }}
        >📝 Admissions</motion.div>
        <div className="admissions-inner">
          <motion.div
            className="admissions-info"
            initial="hidden"
            animate={vis ? 'show' : 'hidden'}
            variants={fadeUp}
            transition={{ duration: 0.6 }}
          >
            <h2 className="section-title">Start Your Child's <span className="gradient-text">Journey</span></h2>
            <p className="section-subtitle">
              Give your child a world-class early education. Admissions are open for 2025–26. Limited seats — apply today!
            </p>
            <div className="steps">
              {STEPS.map((s, i) => (
                <motion.div
                  key={s.title}
                  className="step"
                  initial="hidden"
                  animate={vis ? 'show' : 'hidden'}
                  variants={fadeUp}
                  transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                >
                  <div className="step-num">{i + 1}</div>
                  <div><h4>{s.title}</h4><p>{s.desc}</p></div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="form-wrap"
            initial="hidden"
            animate={vis ? 'show' : 'hidden'}
            variants={fadeUp}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            {success ? (
              <div className="form-success-msg">
                <span className="big-emoji">🎉</span>
                <h3>Application Submitted!</h3>
                <p>Thank you! Our admissions team will contact you within 24 hours to schedule your campus visit.</p>
              </div>
            ) : (
              <>
                <div className="form-head">Apply for Admission</div>
                <div className="form-sub">Fill in the details below and we'll get back to you soon.</div>
                <form onSubmit={submit}>
                  <div className="form-grid">
                    <div className="fg">
                      <label htmlFor="student_name">Child's Full Name *</label>
                      <input id="student_name" name="student_name" type="text" placeholder="e.g. Emma Johnson" value={form.student_name} onChange={set} required />
                    </div>
                    <div className="fg">
                      <label htmlFor="parent_name">Parent / Guardian Name *</label>
                      <input id="parent_name" name="parent_name" type="text" placeholder="e.g. Mrs. Sarah Johnson" value={form.parent_name} onChange={set} required />
                    </div>
                    <div className="fg">
                      <label htmlFor="phone">Phone Number *</label>
                      <input id="phone" name="phone" type="tel" placeholder="+91 70100 34228" value={form.phone} onChange={set} required />
                    </div>
                    <div className="fg">
                      <label htmlFor="email">Email Address *</label>
                      <input id="email" name="email" type="email" placeholder="parent@email.com" value={form.email} onChange={set} required />
                    </div>
                    <div className="fg full">
                      <label htmlFor="class_applying">Class Applying For *</label>
                      <select id="class_applying" name="class_applying" value={form.class_applying} onChange={set} required>
                        <option value="">Select class...</option>
                        {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                    <div className="fg full">
                      <label htmlFor="message">Additional Message (Optional)</label>
                      <textarea id="message" name="message" placeholder="Any special requirements or questions about your child..." value={form.message} onChange={set} />
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
                    {loading ? <><span>⟳</span><span>Submitting...</span></> : <><span>🎈</span><span>Submit Application</span></>}
                  </motion.button>
                </form>
              </>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  )
})

export default Admissions

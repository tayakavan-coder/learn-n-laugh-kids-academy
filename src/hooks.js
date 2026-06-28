import { useEffect, useRef, useState } from 'react'

export function useReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); observer.unobserve(entry.target) } },
      { threshold: 0.12 }
    )
    if (ref.current) observer.observe(ref.current)
    return () => { if (ref.current) observer.unobserve(ref.current) }
  }, [])
  return [ref, visible]
}

export function useCounter(target, duration = 2200, active = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = null
    const step = (ts) => {
      if (!start) start = ts
      const prog = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - prog, 3)
      setCount(Math.floor(eased * target))
      if (prog < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [target, duration, active])
  return count
}

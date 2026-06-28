import { useEffect, useState } from 'react'

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const scrolled = window.scrollY
      const max = document.documentElement.scrollHeight - window.innerHeight
      setProgress(max > 0 ? (scrolled / max) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="scroll-progress" style={{ width: `${progress}%` }} />
  )
}

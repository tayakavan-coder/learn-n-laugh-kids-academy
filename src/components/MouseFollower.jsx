import { useEffect, useRef, useState } from 'react'

export default function MouseFollower() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const [hovering, setHovering] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(hover: none)').matches) return
    setEnabled(true)

    let mx = 0, my = 0, rx = 0, ry = 0
    let raf

    const onMove = (e) => {
      mx = e.clientX
      my = e.clientY
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${mx - 4}px, ${my - 4}px)`
      }
      const target = e.target
      const isInteractive = target.closest('a, button, input, textarea, select, [role="button"]')
      setHovering(!!isInteractive)
    }

    const animate = () => {
      rx += (mx - rx) * 0.15
      ry += (my - ry) * 0.15
      if (ringRef.current) {
        ringRef.current.style.transform = `translate(${rx - 20}px, ${ry - 20}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    animate()

    window.addEventListener('mousemove', onMove)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  if (!enabled) return null

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 z-[9998] w-2 h-2 rounded-full pointer-events-none"
        style={{ background: '#FF4FA3', mixBlendMode: 'difference' }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 z-[9997] rounded-full pointer-events-none transition-[width,height,opacity] duration-300"
        style={{
          width: hovering ? 56 : 40,
          height: hovering ? 56 : 40,
          border: '2px solid rgba(59, 130, 246, 0.5)',
          opacity: hovering ? 1 : 0.6,
          marginLeft: hovering ? -8 : 0,
          marginTop: hovering ? -8 : 0,
        }}
      />
    </>
  )
}

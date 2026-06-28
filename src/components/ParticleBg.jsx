import { useEffect, useRef } from 'react'

export default function ParticleBg() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let w, h, particles, raf

    const COLORS = ['#FF4FA3', '#3B82F6', '#22C55E', '#F59E0B', '#A855F7']

    const resize = () => {
      w = canvas.width = canvas.offsetWidth
      h = canvas.height = canvas.offsetHeight
    }

    const init = () => {
      resize()
      const count = Math.min(50, Math.floor(w * h / 25000))
      particles = Array.from({ length: count }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        c: COLORS[Math.floor(Math.random() * COLORS.length)],
        a: 0.3 + Math.random() * 0.4,
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = p.c
        ctx.globalAlpha = p.a
        ctx.fill()
      }
      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', init)
    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 0 }}
    />
  )
}

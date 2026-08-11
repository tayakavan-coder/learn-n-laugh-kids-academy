import { useEffect, useRef, useState, useCallback } from 'react'

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

export function useDebounce(value, delay = 400) {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(t)
  }, [value, delay])
  return debounced
}

export function usePagination(fetchFn, deps = [], pageSize = 20) {
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const load = useCallback(async (p = 1) => {
    setLoading(true)
    setError(null)
    try {
      const result = await fetchFn(p, pageSize)
      setRows(result.rows || [])
      setTotal(result.total || 0)
      setPage(p)
    } catch (e) {
      setError(e.message)
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [fetchFn, pageSize])

  useEffect(() => { load(1) }, deps)

  const totalPages = Math.ceil(total / pageSize) || 1
  const hasNext = page < totalPages
  const hasPrev = page > 1

  return { rows, total, page, totalPages, hasNext, hasPrev, loading, error, load, setPage }
}

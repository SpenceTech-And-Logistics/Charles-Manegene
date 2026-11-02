// Motion helpers. No animation library: CSS keyframes do the drawing, and
// these hooks only decide when they start. Everything here stands down when
// the visitor's device asks for reduced motion.
import { useEffect, useLayoutEffect, useRef, useState } from 'react'

const calm = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

// Marks [data-r] elements with .in as they scroll into view. Elements arriving
// together are numbered through --i, so a row staggers on desktop while a
// stacked column on a phone appears one item at a time without long delays.
export function useReveals() {
  useEffect(() => {
    const els = [...document.querySelectorAll('[data-r]')]
    if (calm() || !('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver((entries) => {
      entries.filter((e) => e.isIntersecting).forEach((e, i) => {
        e.target.style.setProperty('--i', i)
        e.target.classList.add('in')
        io.unobserve(e.target)
      })
    }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' })
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// One scroll handler for everything tied to scroll position: the progress bar,
// the header shadow, the active nav link and the two parallax layers.
export function useScrollScene(ids, onSection) {
  useEffect(() => {
    const bar = document.querySelector('.progress')
    const top = document.querySelector('.top')
    const hero = document.querySelector('.hero')
    const bg = document.querySelector('.hero-bg')
    const drift = [...document.querySelectorAll('[data-drift]')]
    const sections = ids.map((id) => document.getElementById(id)).filter(Boolean)
    const still = calm()
    let queued = false

    function paint() {
      queued = false
      const y = window.scrollY
      const vh = window.innerHeight
      const max = document.documentElement.scrollHeight - vh
      const atEnd = max > 0 && y >= max - 2

      bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`
      top.classList.toggle('scrolled', y > 8)

      let current = ''
      for (const s of sections) if (s.getBoundingClientRect().top <= vh * 0.45) current = s.id
      onSection(atEnd ? sections[sections.length - 1].id : current)

      if (still) return
      if (y < hero.offsetHeight) bg.style.transform = `translate3d(0, ${(y * 0.2).toFixed(1)}px, 0)`
      for (const el of drift) {
        const r = el.parentElement.getBoundingClientRect()
        if (r.bottom < 0 || r.top > vh) continue
        const shift = Math.max(-10, Math.min(10, (r.top + r.height / 2 - vh / 2) * -0.06))
        el.style.transform = `translate3d(0, ${shift.toFixed(1)}px, 0) scale(1.12)`
      }
    }
    const queue = () => {
      if (!queued) { queued = true; requestAnimationFrame(paint) }
    }

    paint()
    window.addEventListener('scroll', queue, { passive: true })
    window.addEventListener('resize', queue)
    return () => {
      window.removeEventListener('scroll', queue)
      window.removeEventListener('resize', queue)
    }
  }, [ids, onSection])
}

// Counts a figure up from zero the first time it is seen. "500 ha" and "+54%"
// keep their units. Years stay as they are: counting up to 1995 means nothing.
// The final value is reserved in the layout so nothing shifts while it runs,
// and screen readers only ever get the final value.
export function Count({ value }) {
  const ref = useRef(null)
  const [shown, setShown] = useState(value)
  const parts = value.match(/^(\D*)(\d+)(.*)$/)
  const animate = parts && !/^(19|20)\d\d$/.test(value)

  useLayoutEffect(() => {
    if (!animate || calm() || !('IntersectionObserver' in window)) return
    const [, pre, num, post] = parts
    let frame
    setShown(`${pre}0${post}`)
    const show = () => setShown(value)
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return
      io.disconnect()
      const start = performance.now()
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 1500)
        setShown(`${pre}${Math.round(Number(num) * (1 - (1 - t) ** 4))}${post}`)
        if (t < 1) frame = requestAnimationFrame(tick)
      }
      frame = requestAnimationFrame(tick)
    }, { threshold: 0.6 })
    io.observe(ref.current)
    window.addEventListener('beforeprint', show)
    return () => {
      io.disconnect()
      cancelAnimationFrame(frame)
      window.removeEventListener('beforeprint', show)
      show()
    }
  }, [value])

  return (
    <span className="count" ref={ref}>
      <span className="sr">{value}</span>
      <span className="ghost" aria-hidden="true">{value}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  )
}

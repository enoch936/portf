'use client'

import React, { useState, useEffect, useRef } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    let last = false

    const update = () => {
      ticking = false
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0
      // Direct DOM write: no React re-render on every scroll event
      if (barRef.current) barRef.current.style.transform = `scaleX(${progress})`
      const show = scrollTop > 300
      if (show !== last) {
        last = show
        setVisible(show)
      }
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const scrollToNextSection = () => {
    const sections = Array.from(document.querySelectorAll('main section'))
    const next = sections.find((section) => section.getBoundingClientRect().top > 80)
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div ref={barRef} className="scroll-progress" />
      <button onClick={scrollToTop} className={`scroll-top-btn ${visible ? 'visible' : ''}`} aria-label="Scroll to top" title="Back to top">
        <ArrowUp className="w-5 h-5" />
      </button>
      <button onClick={scrollToNextSection} className={`scroll-next-btn ${visible ? '' : 'visible'}`} aria-label="Scroll to next section" title="Next section">
        <ArrowDown className="w-5 h-5" />
      </button>
    </>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { ArrowDown, ArrowUp } from 'lucide-react'

export function ScrollToTop() {
  const [visible, setVisible] = useState(false)
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      setScrollProgress(progress)
      setVisible(scrollTop > 300)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToNextSection = () => {
    const sections = Array.from(document.querySelectorAll('main section'))
    const next = sections.find((section) => section.getBoundingClientRect().top > 80)
    next?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <>
      <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />
      <button
        onClick={scrollToTop}
        className={`scroll-top-btn ${visible ? 'visible' : ''}`}
        aria-label="Scroll to top"
        title="Back to top"
      >
        <ArrowUp className="w-5 h-5" />
      </button>
      <button
        onClick={scrollToNextSection}
        className={`scroll-next-btn ${visible ? '' : 'visible'}`}
        aria-label="Scroll to next section"
        title="Next section"
      >
        <ArrowDown className="w-5 h-5" />
      </button>
    </>
  )
}

'use client'

import React, { useState, useEffect } from 'react'
import { ArrowUp } from 'lucide-react'

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
    </>
  )
}

import React from 'react'
import Link from 'next/link'
import { Terminal, Shield, ArrowUpRight } from 'lucide-react'

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black/40 backdrop-blur-md text-gray-400 py-12 px-4 sm:px-6 lg:px-8 mt-24">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <p className="text-white font-semibold text-sm">Gebretsadik M. Engida</p>
            <p className="text-xs text-gray-500">Senior Distributed Systems Architect & Technology Entrepreneur</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-xs text-gray-400">
          <Link href="/about" className="hover:text-white transition-colors">About</Link>
          <Link href="/skills" className="hover:text-white transition-colors">Skills</Link>
          <Link href="/projects" className="hover:text-white transition-colors">Projects</Link>
          <Link href="/resume" className="hover:text-white transition-colors">Resume</Link>
          <Link href="/blog" className="hover:text-white transition-colors">Blog</Link>
          <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          <Link href="/admin" className="text-blue-400 hover:text-blue-300 flex items-center gap-1 font-mono">
            <Shield className="w-3 h-3" /> Admin SaaS
          </Link>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-2">
          <span>&copy; {new Date().getFullYear()} Gebretsadik. All rights reserved.</span>
        </div>
      </div>
    </footer>
  )
}

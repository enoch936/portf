import React from 'react'
import Link from 'next/link'
import { ShieldCheck, Cpu, ArrowUpRight } from 'lucide-react'
import { GlassCard } from '@/components/ui/glass-card'

type Entry = { title: string; stack: string; detail: string }

// Only facts from the CV. Do not add numbers, employers, awards or tools that were not actually used.
const cybersecurity: Entry[] = [
  {
    title: 'Cyber Defender AI & Scanner',
    stack: 'Python · C++ · MD5 / SHA-256',
    detail: 'AI-based threat analysis combined with static antivirus scanning using file hashes and machine-learning anomaly detection.',
  },
  {
    title: 'Antivirus System',
    stack: 'C++',
    detail: 'File analysis and malware signature detection with MD5, SHA-1 and SHA-256 hash verification, backed by a security database.',
  },
]

const secureEngineering =
  'JWT with refresh tokens, role-based access control, BCrypt password hashing, OAuth 2.0, OTP and TOTP two-factor authentication, encrypted communication, and audit logging across my full-stack and mobile projects.'

const embedded: Entry[] = [
  {
    title: 'Automatic Car Emergency Brake',
    stack: 'C / Embedded C · hardware sensors',
    detail: 'Processes distance-sensor readings and triggers emergency stopping logic, combining hardware sensing with software control.',
  },
]

function EntryCard({ entry, accent }: { entry: Entry; accent: string }) {
  return (
    <GlassCard className="space-y-2">
      <h4 className="text-base font-bold text-white">{entry.title}</h4>
      <p className={`text-[11px] font-mono ${accent}`}>{entry.stack}</p>
      <p className="text-xs text-gray-300 leading-relaxed">{entry.detail}</p>
    </GlassCard>
  )
}

export function SecurityEmbeddedSection() {
  return (
    <section className="space-y-8" aria-labelledby="security-embedded-heading">
      <h2 id="security-embedded-heading" className="text-xl font-bold text-white flex items-center gap-3">
        <span className="w-8 h-8 rounded-lg bg-blue-600/30 border border-blue-500/40 flex items-center justify-center text-blue-400">
          <ShieldCheck className="w-4 h-4" />
        </span>
        Cybersecurity & Embedded Systems
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-mono text-blue-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" /> Cybersecurity
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Studied Cybersecurity &amp; Ethical Hacking, Computer Networks and Operating Systems at the University of Gondar, and applied them in two security tools I built from scratch.
          </p>
          {cybersecurity.map((e) => (
            <EntryCard key={e.title} entry={e} accent="text-blue-400" />
          ))}
          <GlassCard className="space-y-2">
            <h4 className="text-base font-bold text-white">Secure engineering in my applications</h4>
            <p className="text-xs text-gray-300 leading-relaxed">{secureEngineering}</p>
          </GlassCard>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-mono text-purple-400 uppercase tracking-wider font-bold flex items-center gap-2">
            <Cpu className="w-4 h-4" /> Embedded Systems
          </h3>
          <p className="text-xs text-gray-400 leading-relaxed">
            Low-level programming in C where software has to respond to the physical world through sensors.
          </p>
          {embedded.map((e) => (
            <EntryCard key={e.title} entry={e} accent="text-purple-400" />
          ))}
          <Link href="/projects" className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-400 hover:text-blue-300 transition-colors">
            See all projects <ArrowUpRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

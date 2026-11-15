import Image from 'next/image'
import { MapPin } from 'lucide-react'

interface Stat { label: string; value: number; suffix?: string }

export function HeroVisual({ name, avatarUrl, location, stats }: { name: string; avatarUrl: string; location: string; stats: Stat[]; chips?: string[] }) {
  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="glass-card overflow-hidden p-3">
        <div className="relative aspect-[4/5] overflow-hidden rounded-xl bg-slate-200 dark:bg-slate-800">
          <Image src={avatarUrl} alt={name} fill priority sizes="(max-width: 768px) 90vw, 384px" className="object-cover object-top" />
        </div>
        <div className="px-2 pt-4 pb-2">
          <p className="text-lg font-semibold text-white">{name}</p>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-gray-500"><MapPin className="w-4 h-4" />{location}</p>
          <div className="mt-4 flex gap-6 text-sm text-gray-500">
            {stats.map((s) => (
              <p key={s.label}><span className="text-base font-semibold text-white">{s.value}{s.suffix}</span> {s.label}</p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

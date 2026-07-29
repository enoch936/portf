'use client'

import { useMemo, useState } from 'react'
import { Check, GripVertical, Plus, Save, Trash2 } from 'lucide-react'
import { updateWebsiteSettingsAction } from '@/app/actions/cms'
import { GlassCard } from '@/components/ui/glass-card'
import type { WebsiteSettings } from '@prisma/client'

type NavItem = { label: string; href: string }

const fallbackItems: NavItem[] = [
  { label: 'Home', href: '/' }, { label: 'About', href: '/about' }, { label: 'Skills', href: '/skills' },
  { label: 'Projects', href: '/projects' }, { label: 'Resume', href: '/resume' }, { label: 'Blog', href: '/blog' }, { label: 'Contact', href: '/contact' },
]

const publicSections = [
  ['showHero', 'Homepage hero'], ['showAbout', 'About page'], ['showSkills', 'Skills page'], ['showProjects', 'Projects page'], ['showResume', 'Résumé page'], ['showBlog', 'Blog page'], ['showContact', 'Contact page'],
] as const

function parseItems(raw?: string): NavItem[] {
  try {
    const parsed = JSON.parse(raw || '[]')
    return Array.isArray(parsed) && parsed.every((item) => typeof item?.label === 'string' && typeof item?.href === 'string') ? parsed : fallbackItems
  } catch { return fallbackItems }
}

function parseSections(raw?: string): Record<string, boolean> {
  try { return { ...Object.fromEntries(publicSections.map(([key]) => [key, true])), ...JSON.parse(raw || '{}') } }
  catch { return Object.fromEntries(publicSections.map(([key]) => [key, true])) }
}

export function AdminNavigationBuilder({ website }: { website: WebsiteSettings | null }) {
  const [items, setItems] = useState<NavItem[]>(parseItems(website?.navItemsJson))
  const [sections, setSections] = useState(parseSections(website?.sectionsConfigJson))
  const [siteName, setSiteName] = useState(website?.siteName || 'Gebretsadik Portfolio')
  const [metaTitle, setMetaTitle] = useState(website?.metaTitle || '')
  const [metaDescription, setMetaDescription] = useState(website?.metaDescription || '')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const isValid = useMemo(() => items.length > 0 && items.every((item) => item.label.trim() && item.href.startsWith('/')), [items])

  const updateItem = (index: number, key: keyof NavItem, value: string) => setItems((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, [key]: value } : item))
  const move = (index: number, direction: -1 | 1) => setItems((current) => {
    const next = [...current]; const destination = index + direction
    if (destination < 0 || destination >= next.length) return current
    ;[next[index], next[destination]] = [next[destination], next[index]]
    return next
  })

  const save = async () => {
    if (!isValid) return
    setSaving(true)
    await updateWebsiteSettingsAction({ siteName, metaTitle, metaDescription, navItemsJson: JSON.stringify(items), sectionsConfigJson: JSON.stringify(sections) })
    setSaving(false); setSaved(true)
    window.setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="grid gap-8 xl:grid-cols-[1.2fr_.8fr]">
      <GlassCard className="p-6 sm:p-8 space-y-6">
        <div><h2 className="text-xl font-bold text-white">Navigation editor</h2><p className="mt-1 text-sm text-gray-500">Add, reorder, or remove links. Routes must begin with a slash.</p></div>
        <div className="space-y-3">
          {items.map((item, index) => (
            <div key={`${item.href}-${index}`} className="grid grid-cols-[auto_1fr_1.25fr_auto] gap-2 items-center rounded-xl border border-black/8 dark:border-white/10 p-2.5 bg-white/50 dark:bg-white/[.03]">
              <GripVertical className="w-4 h-4 text-gray-400" />
              <input aria-label={`Navigation label ${index + 1}`} value={item.label} onChange={(event) => updateItem(index, 'label', event.target.value)} className="cms-input" placeholder="Label" />
              <input aria-label={`Navigation route ${index + 1}`} value={item.href} onChange={(event) => updateItem(index, 'href', event.target.value)} className="cms-input" placeholder="/route" />
              <div className="flex gap-1"><button onClick={() => move(index, -1)} className="icon-action" aria-label="Move item up">↑</button><button onClick={() => move(index, 1)} className="icon-action" aria-label="Move item down">↓</button><button onClick={() => setItems((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="icon-action text-rose-500" aria-label="Remove item"><Trash2 className="w-3.5 h-3.5" /></button></div>
            </div>
          ))}
        </div>
        <button onClick={() => setItems((current) => [...current, { label: 'New page', href: '/new-page' }])} className="text-sm font-semibold text-blue-600 dark:text-blue-300 inline-flex items-center gap-2"><Plus className="w-4 h-4" /> Add navigation item</button>
      </GlassCard>

      <div className="space-y-8">
        <GlassCard className="p-6 sm:p-8 space-y-5"><div><h2 className="text-xl font-bold text-white">Search & sharing</h2><p className="mt-1 text-sm text-gray-500">Set the text visitors see in their browser and search results.</p></div>
          <label className="cms-label">Site name<input value={siteName} onChange={(event) => setSiteName(event.target.value)} className="cms-input mt-1.5" /></label>
          <label className="cms-label">Page title<input value={metaTitle} onChange={(event) => setMetaTitle(event.target.value)} className="cms-input mt-1.5" /></label>
          <label className="cms-label">Meta description<textarea value={metaDescription} onChange={(event) => setMetaDescription(event.target.value)} className="cms-input mt-1.5 min-h-20 resize-y" /></label>
        </GlassCard>
        <GlassCard className="p-6 sm:p-8 space-y-5"><div><h2 className="text-xl font-bold text-white">Navigation visibility</h2><p className="mt-1 text-sm text-gray-500">Hide standard pages from the public navigation whenever needed.</p></div>
          <div className="grid grid-cols-2 gap-2">{publicSections.map(([key, label]) => <label key={key} className="flex items-center gap-2 rounded-lg p-2 hover:bg-black/5 dark:hover:bg-white/5 text-sm text-gray-600 dark:text-gray-300"><input type="checkbox" checked={Boolean(sections[key])} onChange={(event) => setSections((current) => ({ ...current, [key]: event.target.checked }))} className="accent-blue-600" /> {label}</label>)}</div>
        </GlassCard>
        {!isValid && <p className="text-sm text-rose-500">Add at least one link and ensure each route begins with “/”.</p>}
        {saved && <p className="text-sm text-emerald-600 dark:text-emerald-400 inline-flex items-center gap-2"><Check className="w-4 h-4" /> Settings saved and published.</p>}
        <button disabled={saving || !isValid} onClick={save} className="w-full rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white px-5 py-3 text-sm font-bold inline-flex justify-center items-center gap-2"><Save className="w-4 h-4" /> {saving ? 'Publishing…' : 'Save and publish'}</button>
      </div>
    </div>
  )
}

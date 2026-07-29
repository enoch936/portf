'use client'

import { useId, useState } from 'react'
import { Check, LoaderCircle, Upload } from 'lucide-react'

export function MediaUploadField({
  name,
  label,
  defaultValue = '',
  required = false,
  accept = 'image/*',
}: {
  name: string
  label: string
  defaultValue?: string
  required?: boolean
  accept?: string
}) {
  const inputId = useId()
  const [value, setValue] = useState(defaultValue)
  const [uploading, setUploading] = useState(false)
  const [status, setStatus] = useState('')

  const upload = async (file?: File) => {
    if (!file) return
    setUploading(true)
    setStatus('')
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/media/upload', { method: 'POST', body: formData })
      const data = await response.json()
      if (!response.ok || !data.success || !data.media?.url) throw new Error(data.error || 'Upload failed')
      setValue(data.media.url)
      setStatus('Uploaded to your media library')
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2">
      <label htmlFor={`${inputId}-url`} className="text-xs font-mono text-gray-300">{label}{required ? ' *' : ''}</label>
      <div className="flex gap-2">
        <input id={`${inputId}-url`} type="text" name={name} value={value} onChange={(event) => setValue(event.target.value)} required={required} placeholder="Paste a URL or select a local file" className="min-w-0 flex-1 px-4 py-2.5 rounded-xl bg-black/40 border border-white/10 text-white text-xs" />
        <label htmlFor={inputId} className="shrink-0 px-3 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5">
          {uploading ? <LoaderCircle className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          <span className="hidden sm:inline">Choose file</span>
        </label>
        <input id={inputId} type="file" accept={accept} onChange={(event) => upload(event.target.files?.[0])} disabled={uploading} className="hidden" />
      </div>
      {status && <p className={`text-[11px] flex items-center gap-1 ${status.startsWith('Uploaded') ? 'text-emerald-500' : 'text-rose-500'}`}>{status.startsWith('Uploaded') && <Check className="w-3.5 h-3.5" />}{status}</p>}
    </div>
  )
}

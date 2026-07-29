'use client'

import React from 'react'
import * as LucideIcons from 'lucide-react'

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
}

export function DynamicIcon({ name, className = 'w-5 h-5', size = 20 }: DynamicIconProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComponent = (LucideIcons as any)[name] || LucideIcons.Code2
  return <IconComponent className={className} size={size} />
}

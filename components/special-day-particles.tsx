'use client'

import React, { useRef, useEffect, useCallback } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  rotation: number
  rotationSpeed: number
  opacity: number
  shape: 'rect' | 'circle' | 'star' | 'heart'
  life: number
  maxLife: number
}

const PARTICLE_COLORS_CONFETTI = [
  '#f43f5e', '#f59e0b', '#3b82f6', '#10b981', '#8b5cf6',
  '#ec4899', '#06b6d4', '#f97316', '#84cc16', '#e879f9',
]

const PARTICLE_COLORS_SPARKLES = [
  '#fbbf24', '#f59e0b', '#fcd34d', '#fde68a', '#fef3c7',
]

const PARTICLE_COLORS_STARS = [
  '#fbbf24', '#f59e0b', '#ffffff', '#e2e8f0', '#fcd34d',
]

const PARTICLE_COLORS_HEARTS = [
  '#f43f5e', '#ec4899', '#fb7185', '#fda4af', '#e879f9',
]

const PARTICLE_COLORS_SNOWFLAKES = [
  '#ffffff', '#e2e8f0', '#cbd5e1', '#f1f5f9', '#dbeafe',
]

function getColors(effect: string): string[] {
  switch (effect) {
    case 'confetti': return PARTICLE_COLORS_CONFETTI
    case 'sparkles': return PARTICLE_COLORS_SPARKLES
    case 'stars': return PARTICLE_COLORS_STARS
    case 'hearts': return PARTICLE_COLORS_HEARTS
    case 'snowflakes': return PARTICLE_COLORS_SNOWFLAKES
    default: return PARTICLE_COLORS_CONFETTI
  }
}

function getShape(effect: string): Particle['shape'] {
  switch (effect) {
    case 'confetti': return 'rect'
    case 'sparkles': return 'circle'
    case 'stars': return 'star'
    case 'hearts': return 'heart'
    case 'snowflakes': return 'circle'
    default: return 'rect'
  }
}

function createParticle(canvas: HTMLCanvasElement, effect: string, colors: string[]): Particle {
  const shape = getShape(effect)
  const color = colors[Math.floor(Math.random() * colors.length)]

  if (effect === 'snowflakes') {
    return {
      x: Math.random() * canvas.width,
      y: -10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: Math.random() * 1 + 0.5,
      size: Math.random() * 4 + 2,
      color,
      rotation: 0,
      rotationSpeed: 0,
      opacity: Math.random() * 0.6 + 0.4,
      shape,
      life: 0,
      maxLife: 600,
    }
  }

  if (effect === 'hearts') {
    return {
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vx: (Math.random() - 0.5) * 1,
      vy: -(Math.random() * 1.5 + 0.8),
      size: Math.random() * 8 + 6,
      color,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.05,
      opacity: Math.random() * 0.5 + 0.5,
      shape,
      life: 0,
      maxLife: 400,
    }
  }

  return {
    x: Math.random() * canvas.width,
    y: -10,
    vx: (Math.random() - 0.5) * 3,
    vy: Math.random() * 2 + 1,
    size: Math.random() * 6 + 4,
    color,
    rotation: Math.random() * Math.PI * 2,
    rotationSpeed: (Math.random() - 0.5) * 0.2,
    opacity: Math.random() * 0.5 + 0.5,
    shape,
    life: 0,
    maxLife: 300,
  }
}

function drawParticle(ctx: CanvasRenderingContext2D, p: Particle) {
  ctx.save()
  ctx.globalAlpha = p.opacity * (1 - p.life / p.maxLife)
  ctx.translate(p.x, p.y)
  ctx.rotate(p.rotation)
  ctx.fillStyle = p.color

  switch (p.shape) {
    case 'rect':
      ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      break
    case 'circle':
      ctx.beginPath()
      ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'star':
      drawStar(ctx, 0, 0, 5, p.size / 2, p.size / 4)
      ctx.fill()
      break
    case 'heart':
      drawHeart(ctx, 0, 0, p.size)
      ctx.fill()
      break
  }

  ctx.restore()
}

function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number, innerRadius: number) {
  let rot = Math.PI / 2 * 3
  const step = Math.PI / spikes

  ctx.beginPath()
  ctx.moveTo(cx, cy - outerRadius)

  for (let i = 0; i < spikes; i++) {
    ctx.lineTo(cx + Math.cos(rot) * outerRadius, cy + Math.sin(rot) * outerRadius)
    rot += step
    ctx.lineTo(cx + Math.cos(rot) * innerRadius, cy + Math.sin(rot) * innerRadius)
    rot += step
  }

  ctx.lineTo(cx, cy - outerRadius)
  ctx.closePath()
}

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number) {
  const s = size / 2
  ctx.beginPath()
  ctx.moveTo(x, y + s / 4)
  ctx.quadraticCurveTo(x, y, x + s / 4, y)
  ctx.quadraticCurveTo(x + s / 2, y, x + s / 2, y + s / 4)
  ctx.quadraticCurveTo(x + s / 2, y, x + s * 3 / 4, y)
  ctx.quadraticCurveTo(x + s, y, x + s, y + s / 4)
  ctx.quadraticCurveTo(x + s, y + s / 2, x + s * 3 / 4, y + s * 3 / 4)
  ctx.lineTo(x + s / 2, y + s)
  ctx.lineTo(x + s / 4, y + s * 3 / 4)
  ctx.quadraticCurveTo(x, y + s / 2, x, y + s / 4)
  ctx.closePath()
}

interface SpecialDayParticlesProps {
  effect: string
  primaryColor?: string
  accentColor?: string
  particleCount?: number
}

export function SpecialDayParticles({
  effect,
  primaryColor,
  accentColor,
  particleCount = 50,
}: SpecialDayParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animFrameRef = useRef<number>(0)

  const colors = getColors(effect)

  const animate = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (particlesRef.current.length < particleCount) {
      particlesRef.current.push(createParticle(canvas, effect, colors))
    }

    particlesRef.current = particlesRef.current.filter((p) => {
      p.life++
      p.x += p.vx
      p.y += p.vy
      p.rotation += p.rotationSpeed

      if (effect === 'confetti') {
        p.vx *= 0.99
        p.vy += 0.02
      }

      if (effect === 'sparkles') {
        p.opacity = 0.3 + Math.abs(Math.sin(p.life * 0.1)) * 0.7
      }

      if (effect === 'snowflakes') {
        p.x += Math.sin(p.life * 0.02) * 0.3
      }

      if (p.life >= p.maxLife || p.y > canvas.height + 20 || p.y < -20) {
        return false
      }

      drawParticle(ctx, p)
      return true
    })

    animFrameRef.current = requestAnimationFrame(animate)
  }, [effect, particleCount, colors])

  useEffect(() => {
    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [animate])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      style={{ mixBlendMode: effect === 'sparkles' ? 'screen' : 'normal' }}
    />
  )
}

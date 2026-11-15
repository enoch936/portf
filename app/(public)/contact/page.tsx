import React from 'react'
import { prisma } from '@/lib/prisma'
import { GlassCard } from '@/components/ui/glass-card'
import { ContactFormClient } from '@/components/contact-form-client'
import { DynamicIcon } from '@/components/icon'
import { SITE, resolveSocialLinks } from '@/lib/site-config'
import { Mail, MapPin, Phone, MessageSquare, ShieldCheck, Sparkles } from 'lucide-react'

export default async function ContactPage() {
  const profile = await prisma.profile.findFirst({
    include: { socialLinks: { orderBy: { order: 'asc' } } },
  }).catch(() => null)

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 py-8">
      {/* Header */}
      <div className="space-y-4 text-center max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-mono">
          <MessageSquare className="w-3.5 h-3.5" />
          <span>OPEN TO SOFTWARE ENGINEERING ROLES</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-gray-400 text-base sm:text-lg">
          Open to full-stack, backend, mobile, and AI software engineering roles. Send a message and I will reply as soon as I can.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Direct Contact Details */}
        <div className="space-y-6">
          <GlassCard className="space-y-6">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              Direct Communication
            </h2>

            <div className="space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-mono text-gray-400 uppercase text-[10px]">Email Address</p>
                  <a href={`mailto:${SITE.email}`} className="text-white hover:text-blue-400 font-semibold transition-colors">
                    {SITE.email}
                  </a>
                </div>
              </div>
              {profile?.phone && (

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-mono text-gray-400 uppercase text-[10px]">Direct Phone</p>
                  <p className="text-white font-semibold">{profile.phone}</p>
                </div>
              </div>
              )}

              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="font-mono text-gray-400 uppercase text-[10px]">Location</p>
                  <p className="text-white font-semibold">{profile?.location || 'Gondar, Ethiopia'}</p>
                </div>
              </div>
            </div>

            {/* Social Channels */}
            {resolveSocialLinks(profile?.socialLinks ?? []).length > 0 && (
              <div className="pt-4 border-t border-white/10 space-y-3">
                <p className="font-mono text-gray-400 uppercase text-[10px]">Social & Code Profiles</p>
                <div className="flex flex-wrap gap-2">
                  {resolveSocialLinks(profile?.socialLinks ?? []).map((link) => (
                    <a
                      key={link.id}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-gray-300 hover:text-white transition-all"
                    >
                      <DynamicIcon name={link.iconName} className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </GlassCard>

          <GlassCard className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Message Protection
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed">
              Messages sent through this form are protected with automated rate limiting and anti-spam checks.
            </p>
          </GlassCard>
        </div>

        {/* Contact Form Client Component */}
        <div className="lg:col-span-2">
          <GlassCard className="p-8 sm:p-10">
            <ContactFormClient />
          </GlassCard>
        </div>
      </div>
    </div>
  )
}

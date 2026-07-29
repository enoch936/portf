'use server'

import { prisma } from '@/lib/prisma'
import { checkRateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export async function submitContactMessage(formData: FormData) {
  try {
    const headerList = await headers()
    const ip = headerList.get('x-forwarded-for') || '127.0.0.1'

    const { success } = checkRateLimit(ip, 5, 60 * 1000)
    if (!success) {
      return { success: false, error: 'Too many messages sent. Please wait 1 minute.' }
    }

    const name = formData.get('name') as string
    const email = formData.get('email') as string
    const subject = formData.get('subject') as string
    const message = formData.get('message') as string
    const honeypot = formData.get('website_field') as string // anti-spam field

    if (honeypot) {
      // Spam honeypot triggered
      return { success: true, message: 'Message received!' }
    }

    if (!name || !email || !message) {
      return { success: false, error: 'Name, email, and message are required.' }
    }

    const isSpam = message.toLowerCase().includes('casino') || message.toLowerCase().includes('crypto scam')

    const contact = await prisma.contactMessage.create({
      data: {
        name,
        email,
        subject: subject || 'General Inquiry',
        message,
        isSpam,
      },
    })

    // Create internal notification
    await prisma.notification.create({
      data: {
        title: `New Contact Message from ${name}`,
        message: `Subject: ${subject || 'No Subject'} (${email})`,
        type: 'CONTACT',
      },
    })

    return { success: true, message: 'Thank you! Your message has been sent successfully.', id: contact.id }
  } catch (error) {
    console.error('Error submitting contact message:', error)
    return { success: false, error: 'Failed to process message. Please try again later.' }
  }
}

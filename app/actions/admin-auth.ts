'use server'

import { prisma } from '@/lib/prisma'
import { verifyPassword, signToken, setAuthCookie, removeAuthCookie, verify2FAToken } from '@/lib/auth'

export async function loginAdminAction(formData: FormData) {
  try {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const totpToken = formData.get('totpToken') as string

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return { success: false, error: 'Invalid credentials.' }
    }

    const passwordMatch = await verifyPassword(password, user.passwordHash)
    if (!passwordMatch) {
      return { success: false, error: 'Invalid credentials.' }
    }

    // 2FA check if enabled
    if (user.totpEnabled && user.totpSecret) {
      if (!totpToken) {
        return { success: false, requires2FA: true, message: '2FA authentication code required.' }
      }
      const is2FAValid = verify2FAToken(user.totpSecret, totpToken)
      if (!is2FAValid) {
        return { success: false, requires2FA: true, error: 'Invalid 2FA code.' }
      }
    }

    const jwtToken = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    await setAuthCookie(jwtToken)

    return { success: true }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('Error logging in admin:', message, error instanceof Error ? error.stack : '')
    return { success: false, error: 'An unexpected error occurred. Please check the server logs.' }
  }
}

export async function logoutAdminAction() {
  await removeAuthCookie()
  return { success: true }
}

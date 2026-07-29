import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'
import bcrypt from 'bcryptjs'
import speakeasy from 'speakeasy'
import { prisma } from './prisma'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'gebretsadik-portfolio-saas-jwt-secret-key-2026-super-secure'
)

export interface AuthSession {
  userId: string
  email: string
  role: string
}

export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash)
}

export async function signToken(payload: AuthSession): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AuthSession | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return payload as unknown as AuthSession
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('auth_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth_token')
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth_token')?.value
  if (!token) return null
  return await verifyToken(token)
}

export function generate2FASecret(email: string) {
  const secret = speakeasy.generateSecret({
    length: 20,
    name: `Gebretsadik CMS (${email})`,
    issuer: 'Gebretsadik SaaS',
  })
  return {
    otpauthUrl: secret.otpauth_url,
    base32: secret.base32,
  }
}

export function verify2FAToken(secretBase32: string, userToken: string): boolean {
  return speakeasy.totp.verify({
    secret: secretBase32,
    encoding: 'base32',
    token: userToken,
    window: 1,
  })
}

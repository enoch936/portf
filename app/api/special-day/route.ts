import { NextResponse } from 'next/server'
import { getActiveSpecialDayTheme } from '@/lib/special-day'

export async function GET() {
  try {
    const theme = await getActiveSpecialDayTheme()
    return NextResponse.json({ theme })
  } catch (e) {
    console.warn('special-day lookup failed:', e)
    return NextResponse.json({ theme: null })
  }
}

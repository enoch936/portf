import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { getAuthSession } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export async function POST(request: Request) {
  try {
    const session = await getAuthSession()
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadsDir, { recursive: true })

    const uniqueFilename = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    const filePath = path.join(uploadsDir, uniqueFilename)

    await writeFile(filePath, buffer)
    const fileUrl = `/uploads/${uniqueFilename}`

    const media = await prisma.mediaFile.create({
      data: {
        name: file.name,
        url: fileUrl,
        fileKey: uniqueFilename,
        mimeType: file.type || 'application/octet-stream',
        sizeBytes: file.size,
      },
    })

    return NextResponse.json({ success: true, media })
  } catch (error) {
    console.error('Error uploading file:', error)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}

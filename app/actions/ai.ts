'use server'

import { getAuthSession } from '@/lib/auth'

export async function generateAICacheAction(type: 'project' | 'blog' | 'resume', promptText: string) {
  const session = await getAuthSession()
  if (!session) {
    return { success: false, error: 'Unauthorized' }
  }

  try {
    let resultText = ''

    // Scaffolds only: placeholders must be filled with real, verifiable details.
    if (type === 'project') {
      resultText = `### Project Overview: ${promptText}\n\n` +
        `**Key Features**:\n` +
        `- [Describe a feature you actually built]\n` +
        `- [Describe another real feature]\n\n` +
        `**Technical Challenges & Solutions**:\n` +
        `*Challenge*: [A real problem you faced]\n` +
        `*Solution*: [What you actually did]`
    } else if (type === 'blog') {
      resultText = `# Article Outline: ${promptText}\n\n` +
        `## 1. Introduction & Problem\n` +
        `[What problem are you writing about, and why does it matter?]\n\n` +
        `## 2. Approach\n` +
        `[How you approached it, with code from your own work]\n\n` +
        `## 3. What I Learned\n` +
        `[Real results and lessons, no invented numbers]`
    } else if (type === 'resume') {
      resultText = `Computer Science graduate (University of Gondar) and full-stack software engineer with hands-on project experience in [your real focus areas]. Built [your real projects] using [your real stack].`
    }

    return { success: true, generatedContent: resultText }
  } catch (error) {
    console.error('AI Generation error:', error)
    return { success: false, error: 'Failed to generate AI response.' }
  }
}

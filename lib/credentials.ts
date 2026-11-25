// Education and certifications shown on the About page, Resume page and /api/cv.
// The admin panel has no editor for these, so this file is the source of truth.
// Add only credentials that are real: title, issuer and (if known) date, credential ID or link.
// Leave issueDate as '' when the date is not known.

export type EducationEntry = {
  id: string
  institution: string
  degree: string
  field: string
  period: string
  location?: string
  description?: string
}

export type CertificationEntry = {
  id: string
  title: string
  issuer: string
  issueDate: string
  credentialId?: string
  credentialUrl?: string
}

export const EDUCATION: EducationEntry[] = [
  {
    id: 'uog-bsc-cs',
    institution: 'University of Gondar',
    degree: 'Bachelor of Science (B.S.)',
    field: 'Computer Science',
    period: '2022 - 2026',
    location: 'Gondar, Ethiopia',
    description:
      'Focus on software engineering, data structures and algorithms, database systems, artificial intelligence, machine learning, computer networks, operating systems, distributed systems, software architecture, and cybersecurity & ethical hacking.',
  },
]

export const CERTIFICATIONS: CertificationEntry[] = [
  {
    id: 'five-million-coders',
    title: 'Ethiopian 5 Million Coders Initiative (AI & Android tracks)',
    issuer: 'Udacity',
    issueDate: '',
  },
]

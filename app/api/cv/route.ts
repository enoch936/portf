import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const profile = await prisma.profile.findFirst()
  const resume = await prisma.resume.findFirst({ where: { isDefault: true } })
  const educations = await prisma.education.findMany({ orderBy: { order: 'asc' } })
  const skillCategories = await prisma.skillCategory.findMany({
    orderBy: { order: 'asc' },
    include: { skills: { orderBy: { order: 'asc' } } },
  })
  const projects = await prisma.project.findMany({
    orderBy: { rank: 'asc' },
    include: { technologies: true },
  })

  const name = profile?.name || 'Gebretsadik Woldesenbet'
  const title = profile?.title || 'Full-Stack Software Engineer'
  const avatarUrl = profile?.avatarUrl || ''
  const summary = resume?.summary || profile?.bio || ''
  const brandingStatement = profile?.brandingStatement || ''

  let sections: Record<string, unknown> = {}
  try {
    sections = JSON.parse(resume?.sectionsJson || '{}')
  } catch {
    /* ignore */
  }

  const technicalProfiles = (sections.technicalProfiles as Array<{ role: string; tech: string }>) || []
  const strengths = (sections.strengths as string[]) || []
  const coursework = (sections.coursework as string[]) || []

  const technicalProfilesHTML = technicalProfiles
    .map(
      (tp) => `
        <div class="role-box">
          <strong>${escapeHtml(tp.role)}</strong>
          ${escapeHtml(tp.tech)}
        </div>`
    )
    .join('')

  const educationHTML = educations
    .map(
      (edu) => `
        <div class="project-item searchable-item">
          <div>
            <div class="project-header">
              <span class="project-title">${escapeHtml(edu.degree)} in ${escapeHtml(edu.field)}</span>
            </div>
            <div class="project-tagline">${escapeHtml(edu.institution)}${edu.location ? ' — ' + escapeHtml(edu.location) : ''}</div>
            <p style="font-size:0.8rem;color:var(--text-main)">${escapeHtml(edu.period)}${edu.description ? '. ' + escapeHtml(edu.description) : ''}</p>
          </div>
        </div>`
    )
    .join('')

  const skillsHTML = skillCategories
    .map(
      (cat) => `
        <div class="skill-category">
          <h3>${escapeHtml(cat.name)}</h3>
          <div class="skill-tags">
            ${cat.skills.map((s) => `<span class="tag">${escapeHtml(s.name)}</span>`).join('')}
          </div>
        </div>`
    )
    .join('')

  const projectsHTML = projects
    .map((proj) => {
      let features: string[] = []
      try {
        features = JSON.parse(proj.featuresJson)
      } catch {
        /* ignore */
      }
      const techStack = proj.technologies.map((t) => t.name).join(', ')
      const featList =
        features.length > 0
          ? `<ul class="feature-list">${features.map((f) => `<li>${escapeHtml(f)}</li>`).join('')}</ul>`
          : ''
      return `
        <div class="project-item searchable-item">
          <div>
            <div class="project-header">
              <span class="project-title">${escapeHtml(proj.title)}</span>
            </div>
            <div class="project-tagline">${escapeHtml(proj.summary)}</div>
            ${techStack ? `<div class="project-stack"><strong>Stack:</strong> ${escapeHtml(techStack)}</div>` : ''}
            <p style="margin-bottom:0.4rem;font-size:0.8rem;">${escapeHtml(proj.description)}</p>
            ${featList}
          </div>
          ${proj.category ? `<div class="focus-areas"><strong>Focus Areas:</strong> ${escapeHtml(proj.category)}</div>` : ''}
        </div>`
    })
    .join('')

  const strengthsHTML = strengths
    .map((s) => `<div class="strength-item">${escapeHtml(s)}</div>`)
    .join('')

  const courseworkHTML = coursework
    .map((c) => `<div class="course-item">${escapeHtml(c)}</div>`)
    .join('')

  const photoSection = avatarUrl
    ? `<div class="photo-frame"><img src="${escapeHtml(avatarUrl)}" alt="${escapeHtml(name)}" style="display:block"></div>`
    : `<div class="photo-frame"><span>PHOTO<br>PLACEHOLDER</span></div>`

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(name)} - CV</title>
<style>
:root{--primary:#0f172a;--accent:#2563eb;--accent-hover:#1d4ed8;--bg:#f1f5f9;--card-bg:#ffffff;--text-main:#334155;--text-heading:#0f172a;--border:#cbd5e1;--tag-bg:#eff6ff;--tag-border:#bfdbfe;--tag-text:#1e40af}
.dark-mode{--primary:#0b0f19;--accent:#3b82f6;--accent-hover:#60a5fa;--bg:#070a11;--card-bg:#111827;--text-main:#94a3b8;--text-heading:#f8fafc;--border:#1f2937;--tag-bg:#1e293b;--tag-border:#334155;--tag-text:#93c5fd}
*{box-sizing:border-box;margin:0;padding:0;transition:background-color .2s,color .2s,border-color .2s}
body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;background-color:var(--bg);color:var(--text-main);line-height:1.45;font-size:.88rem;padding:1.25rem}
.container{max-width:1250px;margin:0 auto}
.controls{display:flex;justify-content:space-between;align-items:center;gap:1rem;margin-bottom:1rem;flex-wrap:wrap}
.search-bar{flex:1;min-width:260px}
.search-bar input{width:100%;padding:.55rem .85rem;border-radius:6px;border:1px solid var(--border);background:var(--card-bg);color:var(--text-heading);font-size:.88rem;outline:none}
.search-bar input:focus{border-color:var(--accent)}
.btn-group{display:flex;gap:.5rem}
.btn{background-color:var(--card-bg);color:var(--text-heading);border:1px solid var(--border);padding:.55rem 1rem;border-radius:6px;cursor:pointer;font-weight:600;font-size:.85rem;display:inline-flex;align-items:center;gap:.4rem}
.btn:hover{border-color:var(--accent);color:var(--accent)}
.btn-primary{background-color:var(--accent);color:#fff;border:none}
.btn-primary:hover{background-color:var(--accent-hover);color:#fff}
header{background-color:var(--card-bg);padding:1.25rem 1.5rem;border-radius:8px;border:1px solid var(--border);margin-bottom:1rem;display:flex;align-items:center;gap:1.5rem;box-shadow:0 1px 2px rgba(0,0,0,.03)}
.photo-frame{width:110px;height:110px;min-width:110px;border-radius:8px;background-color:var(--bg);border:2px dashed var(--border);display:flex;flex-direction:column;align-items:center;justify-content:center;color:var(--text-main);font-size:.72rem;text-align:center;overflow:hidden;position:relative}
.photo-frame img{width:100%;height:100%;object-fit:cover}
.header-content{flex:1}
header h1{color:var(--text-heading);font-size:1.8rem;letter-spacing:-.5px;line-height:1.1;margin-bottom:.35rem}
header .subtitle{color:var(--accent);font-weight:600;font-size:.95rem;margin-bottom:.5rem}
.objective-box{background:var(--bg);padding:.5rem .75rem;border-radius:6px;border-left:3px solid var(--accent);font-size:.82rem;color:var(--text-main)}
.cv-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
.full-width{grid-column:1/-1}
.card{background-color:var(--card-bg);padding:1.15rem;border-radius:8px;border:1px solid var(--border);box-shadow:0 1px 2px rgba(0,0,0,.03);margin-bottom:1rem}
.cv-grid .card{margin-bottom:0}
.section-title{color:var(--text-heading);font-size:1.05rem;border-bottom:2px solid var(--border);padding-bottom:.35rem;margin-bottom:.85rem;text-transform:uppercase;letter-spacing:.5px;display:flex;justify-content:space-between;align-items:center}
.role-profiles-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:.75rem}
.role-box{background:var(--bg);padding:.6rem .8rem;border-radius:6px;border:1px solid var(--border)}
.role-box strong{color:var(--text-heading);display:block;margin-bottom:.2rem;font-size:.84rem}
.skills-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:.85rem}
.skill-category h3{font-size:.85rem;color:var(--text-heading);margin-bottom:.35rem;border-left:2px solid var(--accent);padding-left:.4rem}
.skill-tags{display:flex;flex-wrap:wrap;gap:.3rem}
.tag{background-color:var(--tag-bg);border:1px solid var(--tag-border);color:var(--tag-text);padding:.15rem .45rem;border-radius:4px;font-size:.76rem;font-weight:500}
.projects-container{display:grid;grid-template-columns:repeat(auto-fill,minmax(500px,1fr));gap:1rem}
.project-item{background:var(--bg);padding:.9rem;border-radius:6px;border:1px solid var(--border);display:flex;flex-direction:column;justify-content:space-between}
.project-header{display:flex;justify-content:space-between;align-items:baseline;gap:.5rem;margin-bottom:.15rem}
.project-title{font-size:1rem;color:var(--text-heading);font-weight:700}
.project-tagline{font-weight:600;color:var(--accent);font-size:.82rem;margin-bottom:.4rem}
.project-stack{font-size:.76rem;color:var(--text-main);background:var(--card-bg);padding:.35rem .6rem;border-radius:4px;margin-bottom:.5rem;border:1px solid var(--border);line-height:1.35}
.project-stack strong{color:var(--text-heading)}
ul.feature-list{list-style-type:disc;margin-left:1.1rem;font-size:.8rem;margin-bottom:.5rem}
ul.feature-list li{margin-bottom:.2rem}
.focus-areas{font-size:.76rem;font-style:italic;color:var(--text-main);border-top:1px dashed var(--border);padding-top:.35rem;margin-top:auto}
.strengths-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:.5rem}
.strength-item{display:flex;align-items:center;gap:.4rem;font-size:.82rem;font-weight:500}
.strength-item::before{content:"\\2713";color:var(--accent);font-weight:bold}
.coursework-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:.4rem .8rem}
.course-item{display:flex;align-items:center;gap:.4rem;font-size:.82rem}
.course-item::before{content:"\\2022";color:var(--accent);font-weight:bold}
.hidden{display:none !important}
@media print{body{background:#fff !important;color:#000 !important;padding:0;font-size:8pt}.controls{display:none !important}.container{max-width:100% !important}.cv-grid,.projects-container,.role-profiles-grid{display:block !important}.card,header{border:none !important;box-shadow:none !important;padding:0 !important;margin-bottom:.8rem !important;background:transparent !important}header{display:flex !important;border-bottom:2px solid #000 !important;padding-bottom:.5rem !important}.photo-frame{border:1px solid #ccc !important}header h1{color:#000 !important;font-size:16pt}.subtitle,.project-tagline{color:#222 !important}.tag,.project-stack,.objective-box,.project-item,.role-box{border:1px solid #ddd !important;background:transparent !important;color:#000 !important}.project-item{margin-bottom:.6rem !important;page-break-inside:avoid}.section-title{border-bottom:1.5pt solid #000 !important;color:#000 !important;font-size:9.5pt;margin-bottom:.4rem !important}}
@media(max-width:850px){.cv-grid,.projects-container,.role-profiles-grid{grid-template-columns:1fr}header{flex-direction:column;text-align:center}.objective-box{text-align:left}}
</style>
</head>
<body>
<div class="container">
<div class="controls">
<div class="search-bar"><input type="text" id="searchInput" placeholder="Search skills, languages, frameworks, projects..." onkeyup="filterCV()"></div>
<div class="btn-group">
<button class="btn" onclick="toggleDarkMode()">Theme</button>
<button class="btn btn-primary" onclick="window.print()">Print / PDF</button>
</div>
</div>

<header>
${photoSection}
<div class="header-content">
<h1>${escapeHtml(name.toUpperCase())}</h1>
<div class="subtitle">${escapeHtml(title)}</div>
<div class="objective-box"><strong>CAREER OBJECTIVE:</strong> ${escapeHtml(brandingStatement || summary)}</div>
</div>
</header>

<section class="card searchable-content">
<h2 class="section-title">Professional Summary</h2>
<p>${escapeHtml(summary)}</p>
</section>

${technicalProfilesHTML ? `
<section class="card searchable-content">
<h2 class="section-title">Technical Profile &amp; Domain Specializations</h2>
<div class="role-profiles-grid">${technicalProfilesHTML}</div>
</section>` : ''}

<section class="card searchable-content">
<h2 class="section-title">Technical Skills, Frameworks &amp; Tools</h2>
<div class="skills-grid">${skillsHTML}</div>
</section>

<section class="card searchable-content">
<h2 class="section-title">Featured Software Projects</h2>
<div class="projects-container">${projectsHTML}</div>
</section>

<div class="cv-grid">
${strengthsHTML ? `
<section class="card searchable-content">
<h2 class="section-title">Professional Strengths</h2>
<div class="strengths-grid">${strengthsHTML}</div>
</section>` : ''}

<section class="card searchable-content">
<h2 class="section-title">Education</h2>
${educationHTML}
</section>
</div>

${courseworkHTML ? `
<section class="card searchable-content">
<h2 class="section-title">Academic Coursework &amp; Theoretical Foundation</h2>
<div class="coursework-grid">${courseworkHTML}</div>
</section>` : ''}
</div>

<script>
function toggleDarkMode(){document.body.classList.toggle('dark-mode')}
function filterCV(){const q=document.getElementById('searchInput').value.toLowerCase();document.querySelectorAll('.searchable-item').forEach(i=>{i.classList.toggle('hidden',!i.textContent.toLowerCase().includes(q))});document.querySelectorAll('.searchable-content').forEach(c=>{c.classList.toggle('hidden',!c.textContent.toLowerCase().includes(q))})}
</script>
</body>
</html>`

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  })
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

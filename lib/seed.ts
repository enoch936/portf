import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // 1. Admin User
  const passwordHash = await bcrypt.hash('adminpassword123', 10)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@gebretsadik.io' },
    update: {},
    create: {
      email: 'admin@gebretsadik.io',
      passwordHash,
      role: 'ADMIN',
      totpEnabled: false,
    },
  })

  // 2. Profile - Real data from CV
  const profile = await prisma.profile.upsert({
    where: { userId: admin.id },
    update: {},
    create: {
      userId: admin.id,
      name: 'Gebretsadik Woldesenbet',
      title: 'Full-Stack Software Engineer | Mobile & Real-Time Systems Developer | AI & Backend Engineer',
      bio: 'Computer Science graduate and software engineer specializing in full-stack development, mobile application engineering, artificial intelligence integration, real-time communication systems, and secure distributed applications. Experienced in designing and developing complex software platforms using modern architectures including microservices, REST APIs, WebSockets, event-driven systems, AI services, database systems, multimedia processing, and cross-platform applications. Strong background in building independent end-to-end systems ranging from AI-powered marketplaces and realtime communication platforms to mobile networking applications, enterprise management systems, and security-focused software.',
      brandingStatement: 'Seeking a Software Engineer, Full-Stack Developer, Backend Engineer, Mobile Developer, or AI Systems Developer role where I can contribute to designing scalable, secure, and innovative software solutions.',
      avatarUrl: '/images/avatar.svg',
      heroImageUrl: '/images/hero.svg',
      location: 'Ethiopia',
      email: 'contact@gebretsadik.io',
      phone: '',
      status: 'Open for Software Engineering Roles',
      cvPdfUrl: '/documents/Gebretsadik_Senior_Architect_CV.pdf',
    },
  })

  // 3. Social Links
  await prisma.socialLink.deleteMany({ where: { profileId: profile.id } })
  await prisma.socialLink.createMany({
    data: [
      { profileId: profile.id, platform: 'GitHub', url: 'https://github.com/enoch936', iconName: 'Github', order: 1 },
      { profileId: profile.id, platform: 'LinkedIn', url: 'https://linkedin.com', iconName: 'Linkedin', order: 2 },
      { profileId: profile.id, platform: 'Email', url: 'mailto:contact@gebretsadik.io', iconName: 'Mail', order: 3 },
    ],
  })

  // 4. Experiences - none in the real CV (fresh graduate with project experience)
  await prisma.experience.deleteMany({})

  // 5. Education - Real data from CV
  await prisma.education.deleteMany({})
  await prisma.education.createMany({
    data: [
      {
        institution: 'University of Gondar',
        degree: 'Bachelor of Science (B.S.)',
        field: 'Computer Science',
        period: '2020 - 2024',
        location: 'Gondar, Ethiopia',
        description: 'Focus on software engineering, data structures, algorithms, database systems, artificial intelligence, machine learning, computer networks, operating systems, and distributed systems.',
        order: 1,
      },
    ],
  })

  // 6. Certifications - none listed in the real CV
  await prisma.certification.deleteMany({})

  // 7. Skill Categories & Skills - Real data from CV
  await prisma.skillCategory.deleteMany({})

  const catLanguages = await prisma.skillCategory.create({
    data: { name: 'Programming Languages', order: 1 },
  })
  const catFrontend = await prisma.skillCategory.create({
    data: { name: 'Frontend Development & Advanced UI', order: 2 },
  })
  const catBackend = await prisma.skillCategory.create({
    data: { name: 'Backend Frameworks & Technologies', order: 3 },
  })
  const catState = await prisma.skillCategory.create({
    data: { name: 'State Management & Client Architecture', order: 4 },
  })
  const catDatabase = await prisma.skillCategory.create({
    data: { name: 'Databases & ORM Libraries', order: 5 },
  })
  const catMobile = await prisma.skillCategory.create({
    data: { name: 'Mobile Development Ecosystem', order: 6 },
  })
  const catSystems = await prisma.skillCategory.create({
    data: { name: 'Systems, Performance & Low-Level', order: 7 },
  })
  const catAI = await prisma.skillCategory.create({
    data: { name: 'AI, ML & Data Engineering', order: 8 },
  })
  const catDataViz = await prisma.skillCategory.create({
    data: { name: 'Data Visualization & Interactive UI', order: 9 },
  })
  const catRealtime = await prisma.skillCategory.create({
    data: { name: 'Real-Time, Communication & Multimedia', order: 10 },
  })
  const catSecurity = await prisma.skillCategory.create({
    data: { name: 'Security & Authentication', order: 11 },
  })
  const catDevOps = await prisma.skillCategory.create({
    data: { name: 'DevOps, Environments & Tools', order: 12 },
  })

  await prisma.skill.createMany({
    data: [
      // Programming Languages
      { categoryId: catLanguages.id, name: 'TypeScript', iconName: 'FileCode2', level: 95, experienceYears: 3, description: 'Advanced type safety, generics, and full-stack TypeScript development.', order: 1 },
      { categoryId: catLanguages.id, name: 'JavaScript ES6+', iconName: 'FileCode2', level: 95, experienceYears: 4, description: 'Modern JavaScript with ES6+ features, async/await, and module systems.', order: 2 },
      { categoryId: catLanguages.id, name: 'Java', iconName: 'FileCode2', level: 90, experienceYears: 3, description: 'Spring Boot, JavaFX, JDBC, Maven, and enterprise application development.', order: 3 },
      { categoryId: catLanguages.id, name: 'Python', iconName: 'Terminal', level: 88, experienceYears: 3, description: 'FastAPI, Scikit-learn, data processing, and AI/ML integration.', order: 4 },
      { categoryId: catLanguages.id, name: 'C', iconName: 'FileCode2', level: 80, experienceYears: 2, description: 'Systems programming, memory management, and low-level development.', order: 5 },
      { categoryId: catLanguages.id, name: 'C++', iconName: 'FileCode2', level: 82, experienceYears: 2, description: 'Object-oriented systems programming, file analysis, and cryptographic hashing.', order: 6 },
      { categoryId: catLanguages.id, name: 'C#', iconName: 'FileCode2', level: 75, experienceYears: 1, description: '.NET framework development.', order: 7 },
      { categoryId: catLanguages.id, name: 'PHP', iconName: 'FileCode2', level: 70, experienceYears: 1, description: 'Laravel framework and web application development.', order: 8 },
      { categoryId: catLanguages.id, name: 'Kotlin', iconName: 'FileCode2', level: 85, experienceYears: 2, description: 'Android development and Kotlin backend with Ktor/Spring.', order: 9 },
      { categoryId: catLanguages.id, name: 'Rust', iconName: 'Shield', level: 78, experienceYears: 1, description: 'Memory-safe systems programming and high-performance applications.', order: 10 },
      { categoryId: catLanguages.id, name: 'Dart', iconName: 'FileCode2', level: 85, experienceYears: 2, description: 'Flutter cross-platform mobile application development.', order: 11 },
      { categoryId: catLanguages.id, name: 'Swift', iconName: 'FileCode2', level: 75, experienceYears: 1, description: 'iOS native application development.', order: 12 },
      { categoryId: catLanguages.id, name: 'SQL', iconName: 'Database', level: 90, experienceYears: 3, description: 'Database querying, optimization, and design.', order: 13 },

      // Frontend Development & Advanced UI
      { categoryId: catFrontend.id, name: 'React.js', iconName: 'Atom', level: 95, experienceYears: 3, description: 'Component-based UI development with hooks and modern patterns.', order: 1 },
      { categoryId: catFrontend.id, name: 'Next.js (App Router, Server Components)', iconName: 'Layout', level: 92, experienceYears: 2, description: 'Full-stack React framework with server-side rendering and App Router.', order: 2 },
      { categoryId: catFrontend.id, name: 'React Native', iconName: 'Smartphone', level: 88, experienceYears: 2, description: 'Cross-platform mobile application development.', order: 3 },
      { categoryId: catFrontend.id, name: 'Flutter', iconName: 'Smartphone', level: 85, experienceYears: 2, description: 'Cross-platform UI toolkit with Dart.', order: 4 },
      { categoryId: catFrontend.id, name: 'HTML5 / CSS3', iconName: 'Code2', level: 95, experienceYears: 4, description: 'Semantic markup, modern CSS layouts, and responsive design.', order: 5 },
      { categoryId: catFrontend.id, name: 'Tailwind CSS', iconName: 'Palette', level: 92, experienceYears: 2, description: 'Utility-first CSS framework for rapid UI development.', order: 6 },
      { categoryId: catFrontend.id, name: 'Bootstrap', iconName: 'Palette', level: 85, experienceYears: 2, description: 'Responsive CSS framework.', order: 7 },
      { categoryId: catFrontend.id, name: 'Material UI (MUI)', iconName: 'Palette', level: 85, experienceYears: 2, description: 'React component library implementing Material Design.', order: 8 },
      { categoryId: catFrontend.id, name: 'Ant Design', iconName: 'Palette', level: 80, experienceYears: 1, description: 'Enterprise-level UI component library.', order: 9 },
      { categoryId: catFrontend.id, name: 'Shadcn/ui', iconName: 'Palette', level: 85, experienceYears: 1, description: 'Re-usable components built with Radix UI and Tailwind CSS.', order: 10 },
      { categoryId: catFrontend.id, name: 'Radix UI', iconName: 'Palette', level: 82, experienceYears: 1, description: 'Unstyled, accessible UI primitives.', order: 11 },
      { categoryId: catFrontend.id, name: 'Headless UI', iconName: 'Palette', level: 80, experienceYears: 1, description: 'Completely unstyled, fully accessible UI components.', order: 12 },
      { categoryId: catFrontend.id, name: 'Framer Motion', iconName: 'Play', level: 85, experienceYears: 1, description: 'Production-ready animation library for React.', order: 13 },
      { categoryId: catFrontend.id, name: 'JavaFX', iconName: 'Monitor', level: 80, experienceYears: 1, description: 'Java desktop application UI framework.', order: 14 },

      // Backend Frameworks & Technologies
      { categoryId: catBackend.id, name: 'Java Spring Boot', iconName: 'Server', level: 88, experienceYears: 2, description: 'Enterprise Java application development with Spring ecosystem.', order: 1 },
      { categoryId: catBackend.id, name: 'Spring Security', iconName: 'Shield', level: 85, experienceYears: 2, description: 'Authentication and authorization for Spring applications.', order: 2 },
      { categoryId: catBackend.id, name: 'Spring Data', iconName: 'Database', level: 85, experienceYears: 2, description: 'Data access layer for Spring applications.', order: 3 },
      { categoryId: catBackend.id, name: 'Node.js', iconName: 'Server', level: 90, experienceYears: 3, description: 'Server-side JavaScript runtime for scalable applications.', order: 4 },
      { categoryId: catBackend.id, name: 'Express.js', iconName: 'Server', level: 88, experienceYears: 3, description: 'Fast, unopinionated web framework for Node.js.', order: 5 },
      { categoryId: catBackend.id, name: 'Python FastAPI', iconName: 'Server', level: 85, experienceYears: 2, description: 'Modern, fast web framework for building APIs with Python.', order: 6 },
      { categoryId: catBackend.id, name: 'NestJS', iconName: 'Server', level: 82, experienceYears: 1, description: 'Progressive Node.js framework for server-side applications.', order: 7 },
      { categoryId: catBackend.id, name: 'C# .NET', iconName: 'Server', level: 75, experienceYears: 1, description: '.NET framework for building web applications.', order: 8 },
      { categoryId: catBackend.id, name: 'PHP Laravel', iconName: 'Server', level: 72, experienceYears: 1, description: 'PHP web application framework.', order: 9 },
      { categoryId: catBackend.id, name: 'Socket.IO', iconName: 'Zap', level: 85, experienceYears: 2, description: 'Real-time bidirectional event-based communication.', order: 10 },
      { categoryId: catBackend.id, name: 'REST API Design', iconName: 'Globe', level: 90, experienceYears: 3, description: 'RESTful API architecture and design principles.', order: 11 },
      { categoryId: catBackend.id, name: 'Microservice Architecture', iconName: 'Boxes', level: 82, experienceYears: 1, description: 'Distributed system design patterns and microservices.', order: 12 },

      // State Management & Client Architecture
      { categoryId: catState.id, name: 'Zustand', iconName: 'Database', level: 85, experienceYears: 1, description: 'Lightweight state management for React.', order: 1 },
      { categoryId: catState.id, name: 'Redux Toolkit', iconName: 'Database', level: 82, experienceYears: 2, description: 'Predictable state container for JavaScript apps.', order: 2 },
      { categoryId: catState.id, name: 'TanStack Query', iconName: 'Database', level: 85, experienceYears: 1, description: 'Data fetching and caching for React.', order: 3 },
      { categoryId: catState.id, name: 'Context API', iconName: 'Database', level: 88, experienceYears: 2, description: 'React built-in state management.', order: 4 },
      { categoryId: catState.id, name: 'React Hook Form', iconName: 'FormInput', level: 85, experienceYears: 2, description: 'Performant, flexible and extensible forms.', order: 5 },
      { categoryId: catState.id, name: 'Zod Validation', iconName: 'ShieldCheck', level: 82, experienceYears: 1, description: 'TypeScript-first schema validation.', order: 6 },

      // Databases & ORM Libraries
      { categoryId: catDatabase.id, name: 'PostgreSQL', iconName: 'Database', level: 90, experienceYears: 3, description: 'Advanced relational database management.', order: 1 },
      { categoryId: catDatabase.id, name: 'MySQL', iconName: 'Database', level: 85, experienceYears: 2, description: 'Relational database management system.', order: 2 },
      { categoryId: catDatabase.id, name: 'MongoDB', iconName: 'Database', level: 88, experienceYears: 2, description: 'NoSQL document-oriented database.', order: 3 },
      { categoryId: catDatabase.id, name: 'SQLite', iconName: 'Database', level: 85, experienceYears: 2, description: 'Lightweight embedded database.', order: 4 },
      { categoryId: catDatabase.id, name: 'Redis', iconName: 'Zap', level: 82, experienceYears: 1, description: 'In-memory data structure store.', order: 5 },
      { categoryId: catDatabase.id, name: 'Prisma ORM', iconName: 'Database', level: 88, experienceYears: 2, description: 'Next-generation ORM for Node.js and TypeScript.', order: 6 },
      { categoryId: catDatabase.id, name: 'Hibernate / JPA', iconName: 'Database', level: 82, experienceYears: 1, description: 'Java ORM framework.', order: 7 },
      { categoryId: catDatabase.id, name: 'Mongoose ODM', iconName: 'Database', level: 82, experienceYears: 1, description: 'MongoDB object modeling for Node.js.', order: 8 },
      { categoryId: catDatabase.id, name: 'SQLAlchemy', iconName: 'Database', level: 78, experienceYears: 1, description: 'Python SQL toolkit and ORM.', order: 9 },

      // Mobile Development Ecosystem
      { categoryId: catMobile.id, name: 'React Native + TypeScript', iconName: 'Smartphone', level: 88, experienceYears: 2, description: 'Cross-platform mobile development with React.', order: 1 },
      { categoryId: catMobile.id, name: 'Flutter + Dart', iconName: 'Smartphone', level: 85, experienceYears: 2, description: 'Google UI toolkit for building native applications.', order: 2 },
      { categoryId: catMobile.id, name: 'Android (Kotlin)', iconName: 'Smartphone', level: 82, experienceYears: 1, description: 'Native Android application development.', order: 3 },
      { categoryId: catMobile.id, name: 'iOS (Swift)', iconName: 'Smartphone', level: 75, experienceYears: 1, description: 'Native iOS application development.', order: 4 },
      { categoryId: catMobile.id, name: 'React Native WebRTC', iconName: 'Phone', level: 80, experienceYears: 1, description: 'Real-time communication in mobile apps.', order: 5 },
      { categoryId: catMobile.id, name: 'Expo Ecosystem', iconName: 'Smartphone', level: 85, experienceYears: 2, description: 'Platform for making universal React apps.', order: 6 },
      { categoryId: catMobile.id, name: 'AsyncStorage', iconName: 'Database', level: 82, experienceYears: 1, description: 'Persistent storage for React Native.', order: 7 },

      // Systems, Performance & Low-Level
      { categoryId: catSystems.id, name: 'C / C++', iconName: 'Terminal', level: 82, experienceYears: 2, description: 'Systems programming and low-level development.', order: 1 },
      { categoryId: catSystems.id, name: 'Rust', iconName: 'Shield', level: 78, experienceYears: 1, description: 'Memory-safe systems programming.', order: 2 },
      { categoryId: catSystems.id, name: 'Embedded Programming', iconName: 'Cpu', level: 75, experienceYears: 1, description: 'Hardware-software integration and sensor systems.', order: 3 },
      { categoryId: catSystems.id, name: 'Memory Management', iconName: 'HardDrive', level: 80, experienceYears: 2, description: 'Manual memory management and optimization.', order: 4 },
      { categoryId: catSystems.id, name: 'Linux', iconName: 'Terminal', level: 85, experienceYears: 3, description: 'Linux development environment and system administration.', order: 5 },

      // AI, ML & Data Engineering
      { categoryId: catAI.id, name: 'FastAPI AI Services', iconName: 'Bot', level: 82, experienceYears: 1, description: 'Building AI-powered API services.', order: 1 },
      { categoryId: catAI.id, name: 'Scikit-learn', iconName: 'Brain', level: 80, experienceYears: 1, description: 'Machine learning in Python.', order: 2 },
      { categoryId: catAI.id, name: 'Pandas', iconName: 'Table', level: 80, experienceYears: 1, description: 'Data manipulation and analysis.', order: 3 },
      { categoryId: catAI.id, name: 'NumPy', iconName: 'Calculator', level: 80, experienceYears: 1, description: 'Numerical computing with Python.', order: 4 },
      { categoryId: catAI.id, name: 'Machine Learning Integration', iconName: 'Brain', level: 78, experienceYears: 1, description: 'Integrating ML models into applications.', order: 5 },
      { categoryId: catAI.id, name: 'Recommendation Systems', iconName: 'Brain', level: 75, experienceYears: 1, description: 'Building AI-powered recommendation engines.', order: 6 },

      // Data Visualization & Interactive UI
      { categoryId: catDataViz.id, name: 'Recharts', iconName: 'BarChart3', level: 82, experienceYears: 1, description: 'Charting library built on React components.', order: 1 },
      { categoryId: catDataViz.id, name: 'Chart.js', iconName: 'BarChart3', level: 80, experienceYears: 1, description: 'Simple yet flexible JavaScript charting.', order: 2 },
      { categoryId: catDataViz.id, name: 'D3.js', iconName: 'BarChart3', level: 75, experienceYears: 1, description: 'Data-driven documents for complex visualizations.', order: 3 },
      { categoryId: catDataViz.id, name: 'React / TanStack Table', iconName: 'Table', level: 82, experienceYears: 1, description: 'Headless UI for building tables and grids.', order: 4 },

      // Real-Time, Communication & Multimedia
      { categoryId: catRealtime.id, name: 'WebRTC', iconName: 'Phone', level: 82, experienceYears: 1, description: 'Real-time peer-to-peer communication.', order: 1 },
      { categoryId: catRealtime.id, name: 'Socket.IO', iconName: 'Zap', level: 85, experienceYears: 2, description: 'Real-time bidirectional event-based communication.', order: 2 },
      { categoryId: catRealtime.id, name: 'STOMP Messaging', iconName: 'MessageSquare', level: 78, experienceYears: 1, description: 'Simple text-oriented messaging protocol.', order: 3 },
      { categoryId: catRealtime.id, name: 'FFmpeg', iconName: 'Film', level: 75, experienceYears: 1, description: 'Multimedia framework for audio/video processing.', order: 4 },
      { categoryId: catRealtime.id, name: 'HLS Streaming', iconName: 'Radio', level: 75, experienceYears: 1, description: 'HTTP Live Streaming for video delivery.', order: 5 },
      { categoryId: catRealtime.id, name: 'TCP / UDP Socket Programming', iconName: 'Network', level: 80, experienceYears: 1, description: 'Low-level network socket programming.', order: 6 },
      { categoryId: catRealtime.id, name: 'Local Network Communication', iconName: 'Wifi', level: 82, experienceYears: 1, description: 'P2P and local network data transfer.', order: 7 },

      // Security & Authentication
      { categoryId: catSecurity.id, name: 'JWT Authentication & Refresh Tokens', iconName: 'Key', level: 88, experienceYears: 2, description: 'Token-based authentication systems.', order: 1 },
      { categoryId: catSecurity.id, name: 'Role-Based Access Control (RBAC)', iconName: 'Shield', level: 85, experienceYears: 2, description: 'Authorization and access control patterns.', order: 2 },
      { categoryId: catSecurity.id, name: 'BCrypt', iconName: 'Lock', level: 82, experienceYears: 2, description: 'Password hashing and verification.', order: 3 },
      { categoryId: catSecurity.id, name: 'OAuth 2.0', iconName: 'Key', level: 80, experienceYears: 1, description: 'Open authorization protocol.', order: 4 },
      { categoryId: catSecurity.id, name: 'OTP / TOTP 2FA', iconName: 'ShieldCheck', level: 78, experienceYears: 1, description: 'Two-factor authentication implementations.', order: 5 },
      { categoryId: catSecurity.id, name: 'Encryption Systems', iconName: 'Lock', level: 80, experienceYears: 1, description: 'Cryptographic hashing and encryption.', order: 6 },

      // DevOps, Environments & Tools
      { categoryId: catDevOps.id, name: 'Docker', iconName: 'Box', level: 85, experienceYears: 2, description: 'Containerization platform.', order: 1 },
      { categoryId: catDevOps.id, name: 'Docker Compose', iconName: 'Boxes', level: 82, experienceYears: 1, description: 'Multi-container Docker applications.', order: 2 },
      { categoryId: catDevOps.id, name: 'Nginx', iconName: 'Server', level: 80, experienceYears: 1, description: 'Web server and reverse proxy.', order: 3 },
      { categoryId: catDevOps.id, name: 'Maven', iconName: 'Box', level: 80, experienceYears: 1, description: 'Build automation for Java projects.', order: 4 },
      { categoryId: catDevOps.id, name: 'Gradle', iconName: 'Box', level: 75, experienceYears: 1, description: 'Build automation tool.', order: 5 },
      { categoryId: catDevOps.id, name: 'Git / GitHub', iconName: 'GitBranch', level: 90, experienceYears: 3, description: 'Version control and collaboration.', order: 6 },
      { categoryId: catDevOps.id, name: 'CI/CD', iconName: 'GitBranch', level: 80, experienceYears: 1, description: 'Continuous integration and deployment.', order: 7 },
    ],
  })

  // 8. Projects - Real data from CV
  await prisma.project.deleteMany({})

  await prisma.project.create({
    data: {
      title: 'SabaHub',
      slug: 'sabahub',
      summary: 'AI-Powered Full-Stack Freelancer Marketplace Platform',
      description: 'Designed and developed a complete marketplace ecosystem connecting freelancers, employers, and administrators. Features an AI-powered freelancer recommendation engine using a hybrid Java and Python AI architecture, real-time messaging and collaboration utilizing WebSocket-based communication and WebRTC integration, HLS streaming infrastructure and Kafka event-driven messaging, secure authentication architecture with JWT, RBAC, BCrypt, OTP, and TOTP 2FA, and payment integrations with Chapa & Stripe using a multi-database architecture with MongoDB and PostgreSQL.',
      category: 'Full-Stack / AI Architecture',
      featured: true,
      rank: 1,
      thumbnail: '/images/project-ai.svg',
      featuresJson: JSON.stringify([
        'AI-powered freelancer recommendation engine using a hybrid Java and Python AI architecture',
        'Real-time messaging and collaboration utilizing WebSocket-based communication and WebRTC integration',
        'HLS streaming infrastructure and Kafka event-driven messaging',
        'Secure authentication architecture: JWT, RBAC, BCrypt, OTP, and TOTP 2FA',
        'Payment integrations: Chapa & Stripe; Multi-database architecture using MongoDB and PostgreSQL',
      ]),
      challengesJson: JSON.stringify([
        'Building a hybrid AI recommendation system across Java and Python services',
        'Handling real-time communication at scale with WebSockets and WebRTC',
      ]),
      solutionsJson: JSON.stringify([
        'Implemented microservice architecture with Kafka for event-driven communication between services',
        'Used WebSocket rooms and WebRTC peer connections for scalable real-time features',
      ]),
      technologies: {
        create: [
          { name: 'Next.js' }, { name: 'React' }, { name: 'TypeScript' },
          { name: 'Spring Boot' }, { name: 'Java 21' }, { name: 'MongoDB' },
          { name: 'PostgreSQL' }, { name: 'Python FastAPI' }, { name: 'Kafka' }, { name: 'WebSocket' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'FileShare',
      slug: 'fileshare',
      summary: 'Peer-to-Peer Local Communication Platform',
      description: 'Developed an advanced offline communication platform combining mobile development, networking, multimedia, and security. Features peer-to-peer file transfer over local networks via TCP/UDP and local hotspot communication, file synchronization engine supporting 1-on-1 and group chat, WebRTC audio/video calling, recording, media management, and video/music playback, encryption services, QR-based device pairing, and multiplayer games (Chess, Ludo, Checkers).',
      category: 'Mobile / Networking',
      featured: true,
      rank: 2,
      thumbnail: '/images/project-cloud.svg',
      featuresJson: JSON.stringify([
        'Peer-to-peer file transfer over local networks via TCP/UDP and local hotspot communication',
        'File synchronization engine supporting 1-on-1 and group chat',
        'WebRTC audio/video calling, recording, media management, and video/music playback',
        'Encryption services, QR-based device pairing, and multiplayer games (Chess, Ludo, Checkers)',
      ]),
      challengesJson: JSON.stringify([
        'Implementing reliable peer-to-peer file transfer without internet connectivity',
        'Managing real-time synchronization across multiple devices on local networks',
      ]),
      solutionsJson: JSON.stringify([
        'Used TCP/UDP socket programming with custom protocols for local network communication',
        'Implemented conflict resolution strategies for offline-first file synchronization',
      ]),
      technologies: {
        create: [
          { name: 'React Native 0.75' }, { name: 'TypeScript' }, { name: 'Zustand' },
          { name: 'SQLite' }, { name: 'WebRTC' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Telegram Clone',
      slug: 'telegram-clone',
      summary: 'Advanced Real-Time Communication & Social Platform',
      description: 'Developed a modern communication platform inspired by large-scale messaging systems. Features real-time private messaging and group communication workflows, social communication features built on a cross-platform architecture, and user management system with comprehensive media communication support.',
      category: 'Real-Time Communication',
      featured: true,
      rank: 3,
      thumbnail: '/images/project-fintech.svg',
      featuresJson: JSON.stringify([
        'Real-time private messaging and group communication workflows',
        'Social communication features built on a cross-platform architecture',
        'User management system with comprehensive media communication support',
      ]),
      challengesJson: JSON.stringify([
        'Building scalable real-time messaging infrastructure',
      ]),
      solutionsJson: JSON.stringify([
        'Implemented WebSocket-based message delivery with acknowledgment systems',
      ]),
      technologies: {
        create: [
          { name: 'React' }, { name: 'TypeScript' }, { name: 'Node.js' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Online Examination System',
      slug: 'online-examination-system',
      summary: 'Enterprise Full-Stack Examination Management Platform',
      description: 'Built a complete online examination ecosystem with modern enterprise architecture. Features student, instructor, and admin workflows alongside exam creation, scheduling, and live sessions, automated result processing, analytics, reporting, certificate generation, and audit logging, and JWT, refresh tokens, RBAC, and deployment via Docker Compose, Nginx, and CI/CD.',
      category: 'Full-Stack / Enterprise',
      featured: true,
      rank: 4,
      thumbnail: '/images/project-cloud.svg',
      featuresJson: JSON.stringify([
        'Student, instructor, and admin workflows alongside exam creation, scheduling, and live sessions',
        'Automated result processing, analytics, reporting, certificate generation, and audit logging',
        'JWT, refresh tokens, RBAC, and deployment via Docker Compose, Nginx, and CI/CD',
      ]),
      challengesJson: JSON.stringify([
        'Managing concurrent exam sessions with real-time proctoring',
      ]),
      solutionsJson: JSON.stringify([
        'Used Socket.IO for live exam state synchronization and NestJS for scalable backend',
      ]),
      technologies: {
        create: [
          { name: 'Next.js' }, { name: 'TypeScript' }, { name: 'NestJS' },
          { name: 'Prisma' }, { name: 'PostgreSQL' }, { name: 'Socket.IO' }, { name: 'JWT' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'MovieGallery',
      slug: 'moviegallery',
      summary: 'Multimedia & Cinema Management Platform',
      description: 'Developed a multimedia ecosystem integrating desktop applications, backend services, and media processing. Features movie and media management with video playback and music systems, FFmpeg media processing and yt-dlp integration, and premium subscription systems, payment workflows, cinema reservations, and download tracking.',
      category: 'Multimedia / Desktop',
      featured: false,
      rank: 5,
      thumbnail: '/images/project-ai.svg',
      featuresJson: JSON.stringify([
        'Movie and media management with video playback and music systems',
        'FFmpeg media processing and yt-dlp integration',
        'Premium subscription systems, payment workflows, cinema reservations, and download tracking',
      ]),
      challengesJson: JSON.stringify([
        'Integrating FFmpeg for real-time media processing in a desktop application',
      ]),
      solutionsJson: JSON.stringify([
        'Built JavaFX frontend with Spring Boot backend and MongoDB for media metadata',
      ]),
      technologies: {
        create: [
          { name: 'JavaFX' }, { name: 'Spring Boot' }, { name: 'MongoDB' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Student Management System',
      slug: 'student-management-system',
      summary: 'Academic Management Platform',
      description: 'Developed an academic management system using enterprise software design patterns. Features role-based access control for students, teachers, and courses, enrollment workflows, attendance tracking, grade management, GPA calculation, and academic reports, and structured with MVC architecture and a clean DAO database layer.',
      category: 'Enterprise / Desktop',
      featured: false,
      rank: 6,
      thumbnail: '/images/project-fintech.svg',
      featuresJson: JSON.stringify([
        'Role-based access control for students, teachers, and courses',
        'Enrollment workflows, attendance tracking, grade management, GPA calculation, and academic reports',
        'Structured with MVC architecture and a clean DAO database layer',
      ]),
      challengesJson: JSON.stringify([
        'Implementing complex academic workflows with GPA calculation',
      ]),
      solutionsJson: JSON.stringify([
        'Used MVC architecture with DAO pattern for clean separation of concerns',
      ]),
      technologies: {
        create: [
          { name: 'Java 21' }, { name: 'JavaFX 21' }, { name: 'MySQL' },
          { name: 'JDBC' }, { name: 'Maven' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Cyber Defender AI',
      slug: 'cyber-defender-ai',
      summary: 'AI Cybersecurity Platform',
      description: 'Developed an AI-based cybersecurity platform focused on automated threat analysis and security intelligence. Features artificial intelligence concepts, cybersecurity concepts, threat detection, and automated security workflows.',
      category: 'AI / Security',
      featured: false,
      rank: 7,
      thumbnail: '/images/project-ai.svg',
      featuresJson: JSON.stringify([
        'Automated threat analysis and security intelligence',
        'AI-powered security workflow automation',
      ]),
      challengesJson: JSON.stringify([
        'Building real-time threat detection with machine learning models',
      ]),
      solutionsJson: JSON.stringify([
        'Implemented ML-based anomaly detection with automated response workflows',
      ]),
      technologies: {
        create: [
          { name: 'Python' }, { name: 'FastAPI' }, { name: 'Scikit-learn' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Antivirus System',
      slug: 'antivirus-system',
      summary: 'Security Application with File Analysis',
      description: 'Developed a security application using file analysis and cryptographic hashing. Features malware signature detection and file scanning, and MD5 / SHA1 / SHA256 hash verification and security database management.',
      category: 'Security / Systems',
      featured: false,
      rank: 8,
      thumbnail: '/images/project-cloud.svg',
      featuresJson: JSON.stringify([
        'Malware signature detection and file scanning',
        'MD5 / SHA1 / SHA256 hash verification and security database management',
      ]),
      challengesJson: JSON.stringify([
        'Implementing efficient file scanning with hash-based signature detection',
      ]),
      solutionsJson: JSON.stringify([
        'Used C++ for high-performance file I/O and cryptographic hash computation',
      ]),
      technologies: {
        create: [
          { name: 'C++' },
        ],
      },
    },
  })

  await prisma.project.create({
    data: {
      title: 'Automatic Car Brake System',
      slug: 'automatic-car-brake-system',
      summary: 'Embedded Safety Automation System',
      description: 'Developed an embedded automation system combining hardware sensors and software control logic. Features embedded programming, sensor-based decision making, and safety automation.',
      category: 'Embedded Systems',
      featured: false,
      rank: 9,
      thumbnail: '/images/project-cloud.svg',
      featuresJson: JSON.stringify([
        'Sensor-based automatic braking decision logic',
        'Real-time hardware-software integration for safety systems',
      ]),
      challengesJson: JSON.stringify([
        'Ensuring real-time response times for safety-critical embedded systems',
      ]),
      solutionsJson: JSON.stringify([
        'Implemented interrupt-driven sensor polling with priority-based task scheduling',
      ]),
      technologies: {
        create: [
          { name: 'C' }, { name: 'Embedded Programming' },
        ],
      },
    },
  })

  // 9. Resume
  await prisma.resume.deleteMany({})
  await prisma.resume.create({
    data: {
      title: 'Full-Stack Software Engineer CV',
      isDefault: true,
      summary: 'Computer Science graduate and software engineer specializing in full-stack development, mobile application engineering, artificial intelligence integration, real-time communication systems, and secure distributed applications. Experienced in designing and developing complex software platforms using modern architectures including microservices, REST APIs, WebSockets, event-driven systems, AI services, database systems, multimedia processing, and cross-platform applications. Strong background in building independent end-to-end systems ranging from AI-powered marketplaces and realtime communication platforms to mobile networking applications, enterprise management systems, and security-focused software.',
      pdfUrl: '/documents/Gebretsadik_Senior_Architect_CV.pdf',
      downloadsCount: 0,
      sectionsJson: JSON.stringify({
        technicalProfiles: [
          { role: 'Full-Stack Engineer', tech: 'TypeScript, JavaScript, React.js, Next.js, Node.js, Express.js, Java Spring Boot, PostgreSQL, MongoDB, REST & WebSockets' },
          { role: 'AI & Data Engineer', tech: 'Python, FastAPI, Scikit-learn, Machine Learning Integration, Recommendation Systems, Pandas, NumPy, Joblib' },
          { role: 'Mobile Engineer', tech: 'React Native + TypeScript, Flutter + Dart, Android (Kotlin), iOS (Swift), Expo Ecosystem, SQLite, AsyncStorage' },
          { role: 'Systems & Embedded Engineer', tech: 'C / C++, Rust, Embedded Programming, Sensor Decision Logic, Memory Management, Cryptographic Hashing, Linux' },
        ],
        strengths: [
          'Full-stack software engineering',
          'Mobile application development',
          'AI-powered application design',
          'Distributed systems',
          'Real-time communication',
          'Networking protocols',
          'Database architecture',
          'Security engineering',
          'Multimedia processing',
          'System design & architecture',
        ],
        coursework: [
          'Data Structures and Algorithms',
          'Object-Oriented Programming (OOP)',
          'Database Management Systems (DBMS)',
          'Advanced Database Systems',
          'Software Engineering',
          'Computer Networks',
          'Operating Systems',
          'Computer Architecture and Organization',
          'Artificial Intelligence',
          'Machine Learning Fundamentals',
          'Cybersecurity and Information Security',
          'Compiler Design',
          'Theory of Computation / Automata Theory',
          'Web Application Development',
          'Mobile Application Development',
          'Human-Computer Interaction (HCI)',
          'Distributed Systems',
          'Embedded Systems',
          'Mathematics for Computer Science',
        ],
      }),
    },
  })

  // 10. Theme & Website Settings
  await prisma.themeSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      themeMode: 'dark',
      primaryColor: '#3b82f6',
      accentColor: '#8b5cf6',
      fontSans: 'Inter',
      borderRadius: '0.75rem',
      glassOpacity: 0.15,
      animationPreset: 'smooth',
    },
  })

  await prisma.websiteSettings.upsert({
    where: { id: 'default' },
    update: {},
    create: {
      id: 'default',
      siteName: 'Gebretsadik Woldesenbet | Portfolio',
      metaTitle: 'Gebretsadik Woldesenbet - Full-Stack Software Engineer',
      metaDescription: 'Portfolio of Gebretsadik Woldesenbet, Full-Stack Software Engineer, Mobile & Real-Time Systems Developer, AI & Backend Engineer.',
      navItemsJson: JSON.stringify([
        { label: 'Home', href: '/' },
        { label: 'About', href: '/about' },
        { label: 'Skills', href: '/skills' },
        { label: 'Projects', href: '/projects' },
        { label: 'Resume', href: '/resume' },
        { label: 'Blog', href: '/blog' },
        { label: 'Contact', href: '/contact' },
      ]),
      sectionsConfigJson: JSON.stringify({
        showHero: true,
        showAbout: true,
        showSkills: true,
        showProjects: true,
        showResume: true,
        showBlog: true,
        showContact: true,
      }),
    },
  })

  // 11. Initial Notification
  await prisma.notification.create({
    data: {
      title: 'Platform Initialized',
      message: 'Portfolio CMS Platform successfully initialized with real CV data.',
      type: 'INFO',
      isRead: false,
    },
  })

  console.log('✅ Database seed completed with real CV data!')
}

main()
  .catch((e) => {
    console.error('❌ Error during database seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

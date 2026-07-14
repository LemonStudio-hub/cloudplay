export interface DocSection {
  title: string
  items: DocItem[]
}

export interface DocItem {
  title: string
  path: string
  badge?: string
}

export interface TableOfContents {
  id: string
  title: string
  level: number
}

export const sidebar: DocSection[] = [
  {
    title: 'Getting Started',
    items: [
      { title: 'Introduction', path: '/guide/introduction' },
      { title: 'Quick Start', path: '/guide/quick-start' },
      { title: 'Installation', path: '/guide/installation' },
      { title: 'Configuration', path: '/guide/configuration' },
    ],
  },
  {
    title: 'Architecture',
    items: [
      { title: 'Overview', path: '/architecture/overview' },
      { title: 'Backend Worker', path: '/architecture/backend' },
      { title: 'Desktop Client', path: '/architecture/client' },
      { title: 'Website', path: '/architecture/website' },
      { title: 'Security', path: '/architecture/security' },
    ],
  },
  {
    title: 'API Reference',
    items: [
      { title: 'Overview', path: '/api/overview' },
      { title: 'Token API', path: '/api/token' },
      { title: 'Health Check', path: '/api/health' },
      { title: 'Rate Limiting', path: '/api/rate-limiting' },
      { title: 'Error Handling', path: '/api/errors' },
    ],
  },
  {
    title: 'Deployment',
    items: [
      { title: 'Overview', path: '/deployment/overview' },
      { title: 'Worker', path: '/deployment/worker' },
      { title: 'Website', path: '/deployment/website' },
      { title: 'Desktop App', path: '/deployment/desktop' },
      { title: 'DNS Setup', path: '/deployment/dns' },
    ],
  },
  {
    title: 'Development',
    items: [
      { title: 'Setup', path: '/development/setup' },
      { title: 'Architecture', path: '/development/architecture' },
      { title: 'Testing', path: '/development/testing' },
      { title: 'Contributing', path: '/development/contributing' },
    ],
  },
  {
    title: 'Reference',
    items: [
      { title: 'FAQ', path: '/guide/faq' },
      { title: 'Troubleshooting', path: '/guide/troubleshooting' },
      { title: 'Changelog', path: '/guide/changelog' },
    ],
  },
  {
    title: 'Legal',
    items: [
      { title: 'Privacy Policy', path: '/legal/privacy' },
    ],
  },
]

export function getCurrentSection(path: string): string {
  const parts = path.split('/')
  return parts[1] || 'guide'
}

export function getTableOfContents(content: string): TableOfContents[] {
  const toc: TableOfContents[] = []
  const headingRegex = /^(#{2,3})\s+(.+)$/gm
  let match

  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length
    const title = match[2].trim()
    const id = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')

    toc.push({ id, title, level })
  }

  return toc
}

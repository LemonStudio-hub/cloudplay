<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { docs } from '../data/content'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css'

const route = useRoute()

const content = computed(() => {
  const key = route.path.slice(1) // Remove leading slash
  return docs[key] || '# Page not found\n\nThe requested documentation page was not found.'
})

const renderedContent = computed(() => {
  let html = content.value

  // Process callouts
  html = html.replace(/::callout\[(\w+)\]\n([\s\S]*?)::/g, (_, type, content) => {
    return `<div class="callout callout-${type}"><p>${content.trim()}</p></div>`
  })

  // Process code blocks
  html = html.replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) => {
    const highlighted = lang
      ? hljs.highlight(code.trim(), { language: lang }).value
      : hljs.highlightAuto(code.trim()).value
    return `<pre><code class="language-${lang || 'text'}">${highlighted}</code></pre>`
  })

  // Process inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')

  // Process headers with IDs
  html = html.replace(/^### (.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h3 id="${id}">${title}</h3>`
  })
  html = html.replace(/^## (.+)$/gm, (_, title) => {
    const id = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    return `<h2 id="${id}">${title}</h2>`
  })
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>')

  // Process bold
  html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')

  // Process links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')

  // Process tables
  html = html.replace(/\|(.+)\|\n\|[-| ]+\|\n((?:\|.+\|\n?)+)/g, (_, header, body) => {
    const headers = header.split('|').filter((h: string) => h.trim()).map((h: string) => `<th>${h.trim()}</th>`).join('')
    const rows = body.trim().split('\n').map((row: string) => {
      const cells = row.split('|').filter((c: string) => c.trim()).map((c: string) => `<td>${c.trim()}</td>`).join('')
      return `<tr>${cells}</tr>`
    }).join('')
    return `<table><thead><tr>${headers}</tr></thead><tbody>${rows}</tbody></table>`
  })

  // Process lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>')
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
  html = html.replace(/^\d+\. (.+)$/gm, '<li>$1</li>')

  // Process horizontal rules
  html = html.replace(/^---$/gm, '<hr>')

  // Process paragraphs
  html = html.replace(/^(?!<[a-z])((?!<\/[a-z]).+)$/gm, '<p>$1</p>')

  // Clean up empty paragraphs
  html = html.replace(/<p><\/p>/g, '')

  return html
})
</script>

<template>
  <div class="content-page" v-html="renderedContent" />
</template>

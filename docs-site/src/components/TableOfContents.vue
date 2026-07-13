<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

interface TocItem {
  id: string
  title: string
  level: number
}

const route = useRoute()
const headings = ref<TocItem[]>([])
const activeId = ref('')

const updateHeadings = () => {
  const elements = document.querySelectorAll('.content-page h2, .content-page h3')
  headings.value = Array.from(elements).map((el) => ({
    id: el.id || el.textContent?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || '',
    title: el.textContent || '',
    level: parseInt(el.tagName.charAt(1)),
  }))
}

const scrollToHeading = (id: string) => {
  const element = document.getElementById(id)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
  }
}

const handleScroll = () => {
  const headingElements = headings.value
    .map(h => document.getElementById(h.id))
    .filter(Boolean)

  for (let i = headingElements.length - 1; i >= 0; i--) {
    const el = headingElements[i]
    if (el && el.getBoundingClientRect().top <= 100) {
      activeId.value = headings.value[i].id
      break
    }
  }
}

watch(() => route.path, () => {
  setTimeout(updateHeadings, 100)
})

onMounted(() => {
  updateHeadings()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <div class="sticky top-20 p-6">
    <h4 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
      On this page
    </h4>
    <nav class="space-y-1">
      <button
        v-for="heading in headings"
        :key="heading.id"
        :class="[
          'block w-full text-left text-sm transition-colors duration-150',
          heading.level === 3 ? 'pl-4' : '',
          activeId === heading.id
            ? 'text-primary-400 font-medium'
            : 'text-gray-500 hover:text-gray-300'
        ]"
        @click="scrollToHeading(heading.id)"
      >
        {{ heading.title }}
      </button>
    </nav>
  </div>
</template>

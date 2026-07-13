<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const emit = defineEmits<{
  (e: 'toggle-sidebar'): void
}>()

const router = useRouter()
const searchQuery = ref('')
const isSearchOpen = ref(false)

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    // Implement search functionality
    console.log('Search:', searchQuery.value)
  }
}
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-sidebar-bg/80 backdrop-blur-xl border-b border-sidebar-border">
    <div class="flex items-center justify-between h-16 px-4 lg:px-6">
      <!-- Left -->
      <div class="flex items-center gap-4">
        <!-- Mobile menu button -->
        <button
          class="lg:hidden p-2 text-gray-400 hover:text-white"
          @click="emit('toggle-sidebar')"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>

        <!-- Logo -->
        <a href="/" class="flex items-center gap-3 group">
          <svg class="w-8 h-8 transition-transform group-hover:scale-110" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#22c55e" />
                <stop offset="100%" style="stop-color:#16a34a" />
              </linearGradient>
            </defs>
            <path d="M25 65 C10 65 5 55 10 48 C5 40 15 30 25 32 C28 22 42 18 50 25 C55 18 70 20 72 32 C82 30 90 40 85 48 C92 55 85 65 75 65 Z" fill="url(#logoGrad)"/>
            <polygon points="40,38 40,60 62,49" fill="white"/>
          </svg>
          <div class="flex items-baseline gap-2">
            <span class="text-lg font-semibold text-white">CloudPlay</span>
            <span class="text-sm text-gray-500">Docs</span>
          </div>
        </a>
      </div>

      <!-- Center - Search -->
      <div class="hidden md:flex flex-1 max-w-xl mx-8">
        <div class="relative w-full">
          <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search documentation..."
            class="w-full pl-10 pr-4 py-2 bg-sidebar-hover border border-sidebar-border rounded-lg text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
            @keydown.enter="handleSearch"
          >
          <kbd class="absolute right-3 top-1/2 -translate-y-1/2 hidden lg:inline-flex items-center px-2 py-0.5 text-xs text-gray-500 bg-sidebar-bg border border-sidebar-border rounded">
            /
          </kbd>
        </div>
      </div>

      <!-- Right -->
      <div class="flex items-center gap-4">
        <!-- GitHub -->
        <a
          href="https://github.com/cloudplay/cloudplay"
          target="_blank"
          rel="noopener noreferrer"
          class="p-2 text-gray-400 hover:text-white transition-colors"
        >
          <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
        </a>

        <!-- Version -->
        <span class="hidden sm:inline-flex items-center px-2.5 py-0.5 text-xs font-medium text-gray-400 bg-sidebar-hover border border-sidebar-border rounded-full">
          v1.0.0
        </span>
      </div>
    </div>
  </header>
</template>

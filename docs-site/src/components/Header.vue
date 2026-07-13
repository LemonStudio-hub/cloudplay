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
          <svg class="w-7 h-7 transition-transform group-hover:scale-105" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path fill="var(--logo-cloud, #5fad7a)" d="M16.5088 16.8447c.1475-.5068.0908-.9707-.1553-1.3154-.2246-.3164-.6045-.499-1.0615-.5205l-8.6592-.1123a.1559.1559 0 0 1-.1333-.0713c-.0283-.042-.0351-.0986-.021-.1553.0278-.084.1123-.1484.2036-.1562l8.7359-.1123c1.0351-.0489 2.1601-.8868 2.5537-1.9136l.499-1.3013c.0215-.0561.0293-.1128.0147-.168-.5625-2.5463-2.835-4.4453-5.5499-4.4453-2.5039 0-4.6284 1.6177-5.3876 3.8614-.4927-.3658-1.1187-.5625-1.794-.499-1.2026.119-2.1665 1.083-2.2861 2.2856-.0283.31-.0069.6128.0635.894C1.5683 13.171 0 14.7754 0 16.752c0 .1748.0142.3515.0352.5273.0141.083.0844.1475.1689.1475h15.9814c.0909 0 .1758-.0645.2032-.1553l.12-.4268zm2.7568-5.5634c-.0771 0-.1611 0-.2383.0112-.0566 0-.1054.0415-.127.0976l-.3378 1.1744c-.1475.5068-.0918.9707.1543 1.3164.2256.3164.6055.498 1.0625.5195l1.8437.1133c.0557 0 .1055.0263.1329.0703.0283.043.0351.1074.0214.1562-.0283.084-.1132.1485-.204.1553l-1.921.1123c-1.041.0488-2.1582.8867-2.5527 1.914l-.1406.3585c-.0283.0713.0215.1416.0986.1416h6.5977c.0771 0 .1474-.0489.169-.126.1122-.4082.1757-.837.1757-1.2803 0-2.6025-2.125-4.727-4.7344-4.727"/>
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

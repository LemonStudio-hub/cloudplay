<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

const scrollTo = (id: string) => {
  isMobileMenuOpen.value = false
  const element = document.getElementById(id)
  element?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      isScrolled ? 'bg-gray-950/80 backdrop-blur-xl border-b border-gray-800/50' : 'bg-transparent'
    ]"
  >
    <div class="container">
      <div class="flex items-center justify-between h-16 lg:h-20">
        <!-- Logo -->
        <a href="#" class="flex items-center gap-3 group">
          <svg class="w-9 h-9 transition-transform group-hover:scale-110" viewBox="0 0 100 100">
            <defs>
              <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style="stop-color:#22c55e" />
                <stop offset="100%" style="stop-color:#16a34a" />
              </linearGradient>
            </defs>
            <path d="M25 65 C10 65 5 55 10 48 C5 40 15 30 25 32 C28 22 42 18 50 25 C55 18 70 20 72 32 C82 30 90 40 85 48 C92 55 85 65 75 65 Z" fill="url(#logoGrad)"/>
            <polygon points="40,38 40,60 62,49" fill="white"/>
          </svg>
          <div class="flex items-baseline gap-1.5">
            <span class="text-lg font-semibold text-white">CloudPlay</span>
            <span class="text-xs text-gray-500">云玩</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="hidden lg:flex items-center gap-8">
          <button @click="scrollTo('features')" class="text-sm text-gray-400 hover:text-white transition-colors">
            功能特性
          </button>
          <button @click="scrollTo('how-it-works')" class="text-sm text-gray-400 hover:text-white transition-colors">
            工作原理
          </button>
          <button @click="scrollTo('download')" class="text-sm text-gray-400 hover:text-white transition-colors">
            下载
          </button>
          <a
            href="https://github.com/cloudplay"
            target="_blank"
            rel="noopener noreferrer"
            class="text-sm text-gray-400 hover:text-white transition-colors"
          >
            GitHub
          </a>
        </nav>

        <!-- CTA Button -->
        <div class="hidden lg:block">
          <a href="#download" class="btn-primary text-sm">
            立即下载
          </a>
        </div>

        <!-- Mobile Menu Button -->
        <button
          class="lg:hidden p-2 text-gray-400 hover:text-white"
          @click="isMobileMenuOpen = !isMobileMenuOpen"
        >
          <svg v-if="!isMobileMenuOpen" class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <svg v-else class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Mobile Menu -->
      <Transition
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="isMobileMenuOpen" class="lg:hidden pb-4">
          <div class="flex flex-col gap-3 pt-2">
            <button @click="scrollTo('features')" class="text-left text-gray-400 hover:text-white transition-colors py-2">
              功能特性
            </button>
            <button @click="scrollTo('how-it-works')" class="text-left text-gray-400 hover:text-white transition-colors py-2">
              工作原理
            </button>
            <button @click="scrollTo('download')" class="text-left text-gray-400 hover:text-white transition-colors py-2">
              下载
            </button>
            <a
              href="https://github.com/cloudplay"
              target="_blank"
              rel="noopener noreferrer"
              class="text-gray-400 hover:text-white transition-colors py-2"
            >
              GitHub
            </a>
            <a href="#download" class="btn-primary text-sm mt-2 justify-center">
              立即下载
            </a>
          </div>
        </div>
      </Transition>
    </div>
  </header>
</template>

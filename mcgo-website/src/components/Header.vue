<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue'
import { useScrollShadow } from '../composables/useScrollShadow'
import { useTheme } from '../composables/useTheme'
import LogoMark from './LogoMark.vue'

const scrolled = useScrollShadow(12)
const open = ref(false)
const { theme, toggle } = useTheme()
const GITHUB = 'https://github.com/LemonStudio-hub/cloudplay'

const go = (id: string) => {
  open.value = false
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
}

watch(open, (v) => {
  document.body.style.overflow = v ? 'hidden' : ''
})
onUnmounted(() => {
  document.body.style.overflow = ''
})
</script>

<template>
  <header
    class="fixed inset-x-0 top-0 z-50 transition-colors duration-200"
    :class="scrolled || open ? 'border-b backdrop-blur-md' : 'border-b border-transparent'"
    :style="scrolled || open
      ? { borderColor: 'var(--line)', background: 'var(--scrim)' }
      : undefined"
  >
    <div class="wrap flex h-14 items-center justify-between sm:h-16">
      <a href="#" class="flex items-center gap-2.5" aria-label="CloudPlay">
        <LogoMark :size="28" />
        <span class="text-sm font-semibold tracking-tight" style="color: var(--ink)">CloudPlay</span>
      </a>

      <nav class="hidden items-center gap-6 md:flex" aria-label="主导航">
        <button type="button" class="link-quiet" @click="go('features')">功能</button>
        <button type="button" class="link-quiet" @click="go('how')">流程</button>
        <button type="button" class="link-quiet" @click="go('download')">下载</button>
        <a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="link-quiet">GitHub</a>
      </nav>

      <div class="flex items-center gap-2">
        <button
          type="button"
          class="theme-switch"
          :data-mode="theme"
          role="switch"
          :aria-checked="theme === 'light'"
          :aria-label="theme === 'dark' ? '切换浅色模式' : '切换深色模式'"
          @click="toggle"
        >
          <span class="theme-switch__track">
            <span class="theme-switch__icon theme-switch__icon--sun" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round">
                <circle cx="12" cy="12" r="3.25" />
                <path d="M12 3.5v1.5M12 19v1.5M3.5 12H5M19 12h1.5M6.05 6.05l1.06 1.06M16.89 16.89l1.06 1.06M6.05 17.95l1.06-1.06M16.89 7.11l1.06-1.06" />
              </svg>
            </span>
            <span class="theme-switch__icon theme-switch__icon--moon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20.5 14.2A8 8 0 0 1 9.8 3.5 8.2 8.2 0 1 0 20.5 14.2z" />
              </svg>
            </span>
            <span class="theme-switch__thumb" aria-hidden="true" />
          </span>
        </button>

        <a href="#download" class="btn-solid !py-2 !px-4 text-[13px] hidden md:inline-flex">获取客户端</a>

        <button
          type="button"
          class="rounded-md p-2 md:hidden"
          style="color: var(--mute)"
          :aria-expanded="open"
          aria-label="菜单"
          @click="open = !open"
        >
          <svg v-if="!open" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M4 7h16M4 12h16M4 17h16" />
          </svg>
          <svg v-else class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.75" d="M6 6l12 12M18 6L6 18" />
          </svg>
        </button>
      </div>
    </div>

    <div v-if="open" class="border-t md:hidden" style="border-color: var(--line)">
      <div class="wrap flex flex-col gap-1 py-3">
        <button type="button" class="rounded-lg px-3 py-2.5 text-left text-sm" style="color: var(--ink)" @click="go('features')">功能</button>
        <button type="button" class="rounded-lg px-3 py-2.5 text-left text-sm" style="color: var(--ink)" @click="go('how')">流程</button>
        <button type="button" class="rounded-lg px-3 py-2.5 text-left text-sm" style="color: var(--ink)" @click="go('download')">下载</button>
        <a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="rounded-lg px-3 py-2.5 text-sm" style="color: var(--ink)">GitHub</a>
        <a href="#download" class="btn-solid mt-2 justify-center" @click="open = false">获取客户端</a>
      </div>
    </div>
  </header>
</template>

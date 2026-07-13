<script setup lang="ts">
import { ref, onMounted } from 'vue'

const isVisible = ref(false)

onMounted(() => {
  setTimeout(() => {
    isVisible.value = true
  }, 100)
})
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[120px]" />
      <div class="absolute bottom-1/4 left-1/4 w-[400px] h-[400px] bg-primary-400/5 rounded-full blur-[100px]" />
    </div>

    <!-- Grid Pattern -->
    <div class="absolute inset-0 opacity-[0.015]" style="background-image: radial-gradient(circle at 1px 1px, white 1px, transparent 0); background-size: 40px 40px;" />

    <div class="relative container text-center">
      <Transition
        enter-active-class="transition duration-1000 ease-out"
        enter-from-class="opacity-0 translate-y-8"
        enter-to-class="opacity-100 translate-y-0"
      >
        <div v-if="isVisible" class="max-w-4xl mx-auto">
          <!-- Badge -->
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-gray-900/50 border border-gray-800 rounded-full mb-8">
            <span class="w-1.5 h-1.5 bg-primary-500 rounded-full animate-pulse" />
            <span class="text-xs text-gray-400">免费 · 开源 · 无需注册</span>
          </div>

          <!-- Title -->
          <h1 class="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6">
            <span class="text-white">局域网游戏</span>
            <br />
            <span class="gradient-text">远程联机平台</span>
          </h1>

          <!-- Subtitle -->
          <p class="text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            一键开服，好友即连。无需公网 IP，无需路由器设置，
            <br class="hidden sm:block" />
            基于 Cloudflare 全球网络的免费、高性能联机方案。
          </p>

          <!-- CTA Buttons -->
          <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <a href="#download" class="btn-primary text-base px-8 py-4">
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载客户端
            </a>
            <a href="#features" class="btn-secondary text-base px-8 py-4">
              了解更多
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 max-w-md mx-auto">
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-white">0ms</div>
              <div class="text-xs sm:text-sm text-gray-500 mt-1">额外延迟</div>
            </div>
            <div class="text-center border-x border-gray-800">
              <div class="text-2xl sm:text-3xl font-bold text-white">&lt;20MB</div>
              <div class="text-xs sm:text-sm text-gray-500 mt-1">安装包</div>
            </div>
            <div class="text-center">
              <div class="text-2xl sm:text-3xl font-bold text-white">100%</div>
              <div class="text-xs sm:text-sm text-gray-500 mt-1">免费</div>
            </div>
          </div>
        </div>
      </Transition>
    </div>

    <!-- Scroll Indicator -->
    <div class="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
      <svg class="w-6 h-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </section>
</template>

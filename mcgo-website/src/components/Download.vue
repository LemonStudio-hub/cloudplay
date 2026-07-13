<script setup lang="ts">
import { ref, onMounted } from 'vue'

const platforms = [
  {
    name: 'Windows',
    icon: 'windows',
    version: 'v1.0.0',
    size: '~15 MB',
    url: '#',
    primary: true,
  },
  {
    name: 'macOS',
    icon: 'apple',
    version: 'v1.0.0',
    size: '~12 MB',
    url: '#',
    primary: false,
  },
  {
    name: 'Linux',
    icon: 'linux',
    version: 'v1.0.0',
    size: '~14 MB',
    url: '#',
    primary: false,
  },
]

const isVisible = ref(false)

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          isVisible.value = true
        }
      })
    },
    { threshold: 0.1 }
  )

  const element = document.getElementById('download')
  if (element) observer.observe(element)
})
</script>

<template>
  <section id="download" class="py-24 lg:py-32">
    <div class="container">
      <div class="text-center mb-16 lg:mb-20">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          立即
          <span class="gradient-text">开始使用</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          支持 Windows、macOS 和 Linux，选择你的平台开始联机。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        <Transition
          v-for="(platform, index) in platforms"
          :key="index"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <a
            v-if="isVisible"
            :href="platform.url"
            :class="[
              'block p-8 rounded-2xl text-center transition-all duration-300 hover:-translate-y-1 group',
              platform.primary
                ? 'bg-primary-600/10 border-2 border-primary-600/50 hover:border-primary-500'
                : 'card hover:border-gray-700'
            ]"
          >
            <!-- Icon -->
            <div class="w-16 h-16 mx-auto mb-6 transition-transform group-hover:scale-110">
              <!-- Windows -->
              <svg v-if="platform.icon === 'windows'" :class="['w-16 h-16', platform.primary ? 'text-primary-400' : 'text-gray-400']" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12V6.75l8-1.25V12H3zm0 .5h8v6.5l-8-1.25V12.5zM11.5 12V5.35l9.5-1.6V12h-9.5zm0 .5h9.5v8.25l-9.5-1.6V12.5z"/>
              </svg>
              <!-- Apple -->
              <svg v-if="platform.icon === 'apple'" :class="['w-16 h-16', platform.primary ? 'text-primary-400' : 'text-gray-400']" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <!-- Linux -->
              <svg v-if="platform.icon === 'linux'" :class="['w-16 h-16', platform.primary ? 'text-primary-400' : 'text-gray-400']" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.504 0c-.155 0-.315.008-.48.021-4.226.333-3.105 4.807-3.17 6.298-.076 1.092-.3 1.953-1.05 3.02-.885 1.051-2.127 2.75-2.716 4.521-.278.832-.41 1.684-.287 2.489a.424.424 0 00-.11.135c-.26.268-.45.6-.663.839-.199.199-.485.267-.797.36-.627.186-1.332.397-1.597 1.27-.14.466-.039.995.222 1.478.397.736 1.102 1.182 1.874 1.303.748.118 1.532-.033 2.237-.382a.854.854 0 00.139-.07c.23-.124.43-.285.615-.466.306-.298.563-.67.8-.866.138-.114.262-.168.322-.168.095 0 .233.058.429.155.352.175.737.374 1.248.374.39 0 .787-.139 1.154-.374.15-.096.29-.197.429-.286.194-.124.38-.24.586-.332a.58.58 0 01.19-.048c.118 0 .26.058.434.155.352.198.737.397 1.248.397.39 0 .787-.155 1.154-.397.352-.233.664-.498.942-.688.278-.19.517-.322.713-.397.195-.074.35-.09.466-.048.194.074.35.233.466.432.116.199.194.44.194.721 0 .278-.078.556-.194.79-.116.233-.271.432-.466.595-.195.163-.428.29-.663.382-.235.093-.466.14-.663.14-.195 0-.35-.047-.466-.14-.116-.093-.194-.233-.233-.397-.039-.163-.116-.322-.233-.466-.116-.14-.271-.233-.466-.278-.195-.045-.39-.045-.586 0-.195.045-.35.139-.466.278-.117.14-.194.303-.233.466-.039.163-.116.303-.233.397-.116.093-.271.14-.466.14z"/>
              </svg>
            </div>

            <!-- Name -->
            <h3 class="text-xl font-semibold mb-2">{{ platform.name }}</h3>

            <!-- Info -->
            <div class="text-sm text-gray-500 mb-6">
              <span>{{ platform.version }}</span>
              <span class="mx-2">·</span>
              <span>{{ platform.size }}</span>
            </div>

            <!-- Button -->
            <div
              :class="[
                'inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-200',
                platform.primary
                  ? 'bg-primary-600 text-white hover:bg-primary-700 hover:shadow-lg hover:shadow-primary-600/25'
                  : 'bg-gray-800 text-white hover:bg-gray-700 border border-gray-700 hover:border-gray-600'
              ]"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载
            </div>
          </a>
        </Transition>
      </div>

      <!-- GitHub Link -->
      <div class="text-center mt-12">
        <a
          href="https://github.com/cloudplay"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm"
        >
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
          </svg>
          在 GitHub 上查看源码
        </a>
      </div>
    </div>
  </section>
</template>

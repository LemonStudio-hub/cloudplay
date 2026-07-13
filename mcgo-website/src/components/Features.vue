<script setup lang="ts">
import { ref, onMounted } from 'vue'

const features = [
  {
    icon: 'bolt',
    title: '一键开服',
    description: '输入房间 ID，点击启动，即可生成专属地址。好友输入地址即可连接，无需任何技术知识。',
    color: 'yellow',
  },
  {
    icon: 'shield',
    title: '安全可靠',
    description: '基于 Cloudflare 全球网络，所有流量经过加密传输。Token 存储于操作系统安全区域，防止泄露。',
    color: 'blue',
  },
  {
    icon: 'globe',
    title: '全球加速',
    description: '利用 Cloudflare 边缘网络，全球 300+ 节点智能路由，确保最低延迟的游戏体验。',
    color: 'purple',
  },
  {
    icon: 'cpu',
    title: '极致轻量',
    description: '基于 Tauri + Rust 构建，安装包小于 20MB，内存占用极低，启动速度极快。',
    color: 'green',
  },
  {
    icon: 'lock',
    title: '源码保护',
    description: '核心逻辑编译为二进制，难以逆向工程。保护商业逻辑和用户隐私。',
    color: 'red',
  },
  {
    icon: 'wifi',
    title: '零配置',
    description: '无需端口映射，无需 VPN，无需公网 IP。开箱即用，完全免费。',
    color: 'cyan',
  },
]

const colorClasses: Record<string, { bg: string; text: string }> = {
  yellow: { bg: 'bg-yellow-500/10', text: 'text-yellow-500' },
  blue: { bg: 'bg-blue-500/10', text: 'text-blue-500' },
  purple: { bg: 'bg-purple-500/10', text: 'text-purple-500' },
  green: { bg: 'bg-green-500/10', text: 'text-green-500' },
  red: { bg: 'bg-red-500/10', text: 'text-red-500' },
  cyan: { bg: 'bg-cyan-500/10', text: 'text-cyan-500' },
}

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

  const element = document.getElementById('features')
  if (element) observer.observe(element)
})
</script>

<template>
  <section id="features" class="py-24 lg:py-32">
    <div class="container">
      <div class="text-center mb-16 lg:mb-20">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          为什么选择
          <span class="gradient-text">CloudPlay</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          我们致力于为玩家提供最简单、最快速、最安全的远程联机体验。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Transition
          v-for="(feature, index) in features"
          :key="index"
          enter-active-class="transition duration-500 ease-out"
          :enter-from-class="`opacity-0 ${isVisible ? 'translate-y-0' : 'translate-y-8'}`"
          enter-to-class="opacity-100 translate-y-0"
          :style="{ transitionDelay: `${index * 100}ms` }"
        >
          <div
            v-if="isVisible"
            class="card hover:border-gray-700 transition-all duration-300 hover:-translate-y-1 group"
          >
            <div
              :class="[
                'w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110',
                colorClasses[feature.color].bg
              ]"
            >
              <!-- Bolt -->
              <svg v-if="feature.icon === 'bolt'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <!-- Shield -->
              <svg v-if="feature.icon === 'shield'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <!-- Globe -->
              <svg v-if="feature.icon === 'globe'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <!-- CPU -->
              <svg v-if="feature.icon === 'cpu'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
              </svg>
              <!-- Lock -->
              <svg v-if="feature.icon === 'lock'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <!-- WiFi -->
              <svg v-if="feature.icon === 'wifi'" :class="['w-6 h-6', colorClasses[feature.color].text]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0" />
              </svg>
            </div>
            <h3 class="text-lg font-semibold mb-2">{{ feature.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed">{{ feature.description }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

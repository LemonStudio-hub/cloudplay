<script setup lang="ts">
import { ref, onMounted } from 'vue'

const steps = [
  {
    number: '01',
    title: '输入房间 ID',
    description: '在开服者界面输入一个唯一的房间名称，点击启动隧道。',
    icon: 'edit',
  },
  {
    number: '02',
    title: '分享地址',
    description: '系统自动生成专属地址，将地址分享给好友。',
    icon: 'share',
  },
  {
    number: '03',
    title: '好友连接',
    description: '好友在联机者界面输入地址，点击连接即可加入游戏。',
    icon: 'link',
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

  const element = document.getElementById('how-it-works')
  if (element) observer.observe(element)
})
</script>

<template>
  <section id="how-it-works" class="py-24 lg:py-32 bg-gray-900/30">
    <div class="container">
      <div class="text-center mb-16 lg:mb-20">
        <h2 class="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
          三步即可
          <span class="gradient-text">开始联机</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto">
          简单到极致的操作流程，无需任何技术背景。
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
        <Transition
          v-for="(step, index) in steps"
          :key="index"
          enter-active-class="transition duration-500 ease-out"
          enter-from-class="opacity-0 translate-y-8"
          enter-to-class="opacity-100 translate-y-0"
          :style="{ transitionDelay: `${index * 150}ms` }"
        >
          <div v-if="isVisible" class="relative text-center group">
            <!-- Connector Line -->
            <div v-if="index < steps.length - 1" class="hidden md:block absolute top-12 left-1/2 w-full h-px bg-gradient-to-r from-gray-700 to-transparent" />

            <!-- Step Number -->
            <div class="relative inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-gray-800/50 border border-gray-700 mb-6 transition-all duration-300 group-hover:border-primary-600 group-hover:bg-primary-600/10">
              <span class="text-3xl font-bold gradient-text">{{ step.number }}</span>
            </div>

            <!-- Icon -->
            <div class="w-12 h-12 mx-auto mb-4 rounded-xl bg-primary-600/10 flex items-center justify-center">
              <svg v-if="step.icon === 'edit'" class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              <svg v-if="step.icon === 'share'" class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <svg v-if="step.icon === 'link'" class="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>

            <!-- Content -->
            <h3 class="text-xl font-semibold mb-2">{{ step.title }}</h3>
            <p class="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">{{ step.description }}</p>
          </div>
        </Transition>
      </div>
    </div>
  </section>
</template>

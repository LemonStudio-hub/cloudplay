<script setup lang="ts">
const currentYear = new Date().getFullYear()

const links = [
  {
    title: '产品',
    items: [
      { name: '功能特性', href: '#features' },
      { name: '工作原理', href: '#how-it-works' },
      { name: '下载', href: '#download' },
    ],
  },
  {
    title: '资源',
    items: [
      { name: 'GitHub', href: 'https://github.com/cloudplay', external: true },
      { name: 'API 文档', href: '#', external: true },
      { name: '更新日志', href: '#', external: true },
    ],
  },
  {
    title: '支持',
    items: [
      { name: '常见问题', href: '#' },
      { name: '反馈建议', href: '#', external: true },
      { name: '联系我们', href: '#' },
    ],
  },
]
</script>

<template>
  <footer class="border-t border-gray-800/50">
    <div class="container py-16 lg:py-20">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">
        <!-- Brand -->
        <div class="lg:col-span-2">
          <a href="#" class="flex items-center gap-3 mb-4">
            <svg class="w-9 h-9" viewBox="0 0 100 100">
              <defs>
                <linearGradient id="footerLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#22c55e" />
                  <stop offset="100%" style="stop-color:#16a34a" />
                </linearGradient>
              </defs>
              <path d="M25 65 C10 65 5 55 10 48 C5 40 15 30 25 32 C28 22 42 18 50 25 C55 18 70 20 72 32 C82 30 90 40 85 48 C92 55 85 65 75 65 Z" fill="url(#footerLogoGrad)"/>
              <polygon points="40,38 40,60 62,49" fill="white"/>
            </svg>
            <div class="flex items-baseline gap-1.5">
              <span class="text-lg font-semibold text-white">CloudPlay</span>
              <span class="text-xs text-gray-500">云玩</span>
            </div>
          </a>
          <p class="text-sm text-gray-500 max-w-xs leading-relaxed">
            为局域网游戏提供的免费、高性能远程联机服务平台。基于 Cloudflare 全球网络，零配置，开箱即用。
          </p>
        </div>

        <!-- Links -->
        <div v-for="section in links" :key="section.title">
          <h4 class="text-sm font-semibold text-white mb-4">{{ section.title }}</h4>
          <ul class="space-y-3">
            <li v-for="item in section.items" :key="item.name">
              <a
                :href="item.href"
                :target="item.external ? '_blank' : undefined"
                :rel="item.external ? 'noopener noreferrer' : undefined"
                class="text-sm text-gray-500 hover:text-white transition-colors inline-flex items-center gap-1"
              >
                {{ item.name }}
                <svg v-if="item.external" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="border-t border-gray-800/50">
      <div class="container py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p class="text-xs text-gray-600">
          © {{ currentYear }} CloudPlay. All rights reserved.
        </p>
        <div class="flex items-center gap-6">
          <a href="#" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">隐私政策</a>
          <a href="#" class="text-xs text-gray-600 hover:text-gray-400 transition-colors">服务条款</a>
        </div>
      </div>
    </div>
  </footer>
</template>

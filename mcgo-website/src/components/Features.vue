<script setup lang="ts">
import { useInView } from '../composables/useInView'

const items = [
  { t: '一键开服', d: '输入房间 ID，生成可分享地址。无需网络配置知识。' },
  { t: '边缘加速', d: 'Cloudflare 全球节点智能路由，就近接入。' },
  { t: '端到端安全', d: '加密隧道传输；Token 存于系统钥匙串。' },
  { t: '极致轻量', d: 'Tauri + Rust，安装包 <20MB，启动快、占内存低。' },
  { t: '跨平台', d: 'Windows / macOS / Linux 同一套体验。' },
  { t: '完全免费', d: '利用 Cloudflare 免费套餐，零运营成本。' },
]

const visible = useInView('features', 0.08)
</script>

<template>
  <section id="features" class="border-t py-20 sm:py-28" style="border-color: var(--line)">
    <div class="wrap">
      <div class="max-w-xl">
        <p class="section-kicker">Features</p>
        <h2 class="section-title">为联机场景裁剪的能力</h2>
        <p class="section-lead">不堆功能，只做把人连进同一局游戏所必需的事。</p>
      </div>

      <div
        class="mt-12 grid gap-px overflow-hidden rounded-2xl border sm:grid-cols-2 lg:grid-cols-3"
        style="border-color: var(--line); background: var(--line)"
      >
        <article
          v-for="(item, i) in items"
          :key="item.t"
          class="p-6 sm:p-7 transition-opacity duration-500"
          :class="visible ? 'opacity-100' : 'opacity-0'"
          :style="{
            background: 'var(--panel)',
            transitionDelay: visible ? `${i * 50}ms` : undefined,
          }"
        >
          <div class="font-mono text-2xs" style="color: var(--green)">0{{ i + 1 }}</div>
          <h3 class="mt-3 text-base font-medium" style="color: var(--ink)">{{ item.t }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--mute)">{{ item.d }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

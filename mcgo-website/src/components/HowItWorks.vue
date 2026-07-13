<script setup lang="ts">
import { useInView } from '../composables/useInView'

const steps = [
  { n: '01', t: '开服', d: '启动客户端，输入房间 ID 与游戏端口。' },
  { n: '02', t: '分享', d: '复制生成的 *.cloudplay.lat 地址发给好友。' },
  { n: '03', t: '加入', d: '好友在联机模式连接，游戏内填 localhost。' },
]

const visible = useInView('how', 0.1)
</script>

<template>
  <section id="how" class="border-t py-20 sm:py-28" style="border-color: var(--line)">
    <div class="wrap">
      <div class="max-w-xl">
        <p class="section-kicker">Workflow</p>
        <h2 class="section-title">三步，完事</h2>
        <p class="section-lead">没有后台管理、没有账号体系，装上就能用。</p>
      </div>

      <ol class="mt-12 grid gap-4 md:grid-cols-3">
        <li
          v-for="(s, i) in steps"
          :key="s.n"
          class="panel relative p-6 sm:p-8 transition-all duration-500"
          :class="visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'"
          :style="visible ? { transitionDelay: `${i * 70}ms` } : undefined"
        >
          <span class="font-mono text-sm" style="color: var(--green)">{{ s.n }}</span>
          <h3 class="mt-4 text-lg font-medium" style="color: var(--ink)">{{ s.t }}</h3>
          <p class="mt-2 text-sm leading-relaxed" style="color: var(--mute)">{{ s.d }}</p>
        </li>
      </ol>
    </div>
  </section>
</template>

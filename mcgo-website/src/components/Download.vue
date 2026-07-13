<script setup lang="ts">
import { useInView } from '../composables/useInView'

const GITHUB = 'https://github.com/LemonStudio-hub/cloudplay'
const RELEASES = `${GITHUB}/releases`

const platforms = [
  { name: 'Windows', meta: 'v1.0 · ~15 MB', href: RELEASES, primary: true },
  { name: 'macOS', meta: 'v1.0 · ~12 MB', href: RELEASES, primary: false },
  { name: 'Linux', meta: 'v1.0 · ~14 MB', href: RELEASES, primary: false },
]

const visible = useInView('download', 0.1)
</script>

<template>
  <section id="download" class="border-t py-20 sm:py-28" style="border-color: var(--line)">
    <div class="wrap">
      <div class="panel overflow-hidden">
        <div class="grid lg:grid-cols-2">
          <div
            class="border-b p-8 sm:p-10 lg:border-b-0 lg:border-r"
            style="border-color: var(--line)"
          >
            <p class="section-kicker">Download</p>
            <h2 class="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl" style="color: var(--ink)">
              选择你的系统
            </h2>
            <p class="mt-3 max-w-sm" style="color: var(--mute)">
              从 GitHub Releases 获取最新构建。源码完全开放。
            </p>
            <a
              :href="GITHUB"
              target="_blank"
              rel="noopener noreferrer"
              class="mt-8 inline-flex items-center gap-2 text-sm transition-colors"
              style="color: var(--green)"
            >
              源码仓库 →
            </a>
          </div>

          <ul class="divide-y" style="border-color: var(--line)">
            <li
              v-for="(p, i) in platforms"
              :key="p.name"
              class="border-b last:border-0 transition-opacity duration-500"
              style="border-color: var(--line)"
              :class="visible ? 'opacity-100' : 'opacity-40'"
              :style="{ borderColor: 'var(--line)', transitionDelay: visible ? `${i * 60}ms` : undefined }"
            >
              <a
                :href="p.href"
                target="_blank"
                rel="noopener noreferrer"
                class="flex items-center justify-between gap-4 px-8 py-5 transition-colors sm:px-10 hover:bg-[var(--green-soft)]"
              >
                <div>
                  <div class="text-sm font-medium" style="color: var(--ink)">{{ p.name }}</div>
                  <div class="mt-0.5 font-mono text-2xs" style="color: var(--mute)">{{ p.meta }}</div>
                </div>
                <span
                  class="rounded-full px-3.5 py-1.5 text-xs font-medium"
                  :style="p.primary
                    ? {
                        border: '1px solid color-mix(in srgb, var(--green) 55%, var(--line))',
                        background: 'color-mix(in srgb, var(--green) 10%, transparent)',
                        color: 'var(--green)',
                      }
                    : {
                        border: '1px solid var(--line)',
                        background: 'transparent',
                        color: 'var(--mute)',
                      }"
                >
                  下载
                </span>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>
</template>

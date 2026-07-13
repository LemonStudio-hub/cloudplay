<script setup lang="ts">
import LogoMark from './LogoMark.vue'

const year = new Date().getFullYear()
const GITHUB = 'https://github.com/LemonStudio-hub/cloudplay'
</script>

<template>
  <footer class="border-t border-line py-12">
    <div class="wrap flex flex-col gap-8 sm:flex-row sm:items-center sm:justify-between">
      <div class="flex items-center gap-2.5">
        <LogoMark :size="24" />
        <div>
          <div class="text-sm font-medium">CloudPlay</div>
          <div class="text-2xs text-zinc-600">© {{ year }} · AGPL-3.0</div>
        </div>
      </div>
      <div class="flex flex-wrap gap-x-6 gap-y-2">
        <a :href="GITHUB" target="_blank" rel="noopener noreferrer" class="link-quiet">GitHub</a>
        <a :href="`${GITHUB}/releases`" target="_blank" rel="noopener noreferrer" class="link-quiet">Releases</a>
        <a :href="`${GITHUB}/blob/main/docs/faq.md`" target="_blank" rel="noopener noreferrer" class="link-quiet">FAQ</a>
        <a :href="`${GITHUB}/blob/main/SECURITY.md`" target="_blank" rel="noopener noreferrer" class="link-quiet">Security</a>
      </div>
    </div>
  </footer>
</template>

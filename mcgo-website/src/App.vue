<script setup lang="ts">
import { defineAsyncComponent } from 'vue'
import Atmosphere from './components/Atmosphere.vue'
import SiteHeader from './components/Header.vue'
import Hero from './components/Hero.vue'

const Features = defineAsyncComponent(() => import('./components/Features.vue'))
const HowItWorks = defineAsyncComponent(() => import('./components/HowItWorks.vue'))
const Download = defineAsyncComponent(() => import('./components/Download.vue'))
const SiteFooter = defineAsyncComponent(() => import('./components/Footer.vue'))
</script>

<template>
  <div class="relative min-h-svh">
    <Atmosphere />
    <SiteHeader />
    <main>
      <Hero />
      <Suspense><Features /></Suspense>
      <Suspense><HowItWorks /></Suspense>
      <Suspense><Download /></Suspense>
    </main>
    <Suspense><SiteFooter /></Suspense>
  </div>
</template>

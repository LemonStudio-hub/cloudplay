<script setup lang="ts">
import Header from './components/Header.vue'
import Hero from './components/Hero.vue'
import Features from './components/Features.vue'
import HowItWorks from './components/HowItWorks.vue'
import Download from './components/Download.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="min-h-screen">
    <Header />
    <main>
      <Hero />
      <Features />
      <HowItWorks />
      <Download />
    </main>
    <Footer />
  </div>
</template>

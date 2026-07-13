<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import Sidebar from './components/Sidebar.vue'
import Header from './components/Header.vue'
import TableOfContents from './components/TableOfContents.vue'
import { getCurrentSection } from './data/docs'

const route = useRoute()
const isSidebarOpen = ref(false)

const currentSection = computed(() => {
  return getCurrentSection(route.path)
})
</script>

<template>
  <div class="min-h-screen bg-content-bg">
    <!-- Header -->
    <Header @toggle-sidebar="isSidebarOpen = !isSidebarOpen" />

    <!-- Sidebar -->
    <Sidebar
      :is-open="isSidebarOpen"
      :current-section="currentSection"
      @close="isSidebarOpen = false"
    />

    <!-- Main Content -->
    <main class="lg:ml-72 pt-16">
      <div class="flex">
        <!-- Content -->
        <div class="flex-1 min-w-0">
          <router-view />
        </div>

        <!-- Table of Contents -->
        <aside class="hidden xl:block w-64 flex-shrink-0">
          <TableOfContents />
        </aside>
      </div>
    </main>
  </div>
</template>

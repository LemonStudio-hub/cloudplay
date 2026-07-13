import { onMounted, onUnmounted, ref, type Ref } from 'vue'

/**
 * Lightweight once-intersection observer for section enter animations.
 * Disconnects after first hit to avoid ongoing scroll cost.
 */
export function useInView(targetId: string, threshold = 0.12) {
  const isVisible = ref(false)
  let observer: IntersectionObserver | null = null

  onMounted(() => {
    const el = document.getElementById(targetId)
    if (!el) {
      isVisible.value = true
      return
    }

    // Skip animation work when reduced motion is preferred
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      isVisible.value = true
      return
    }

    observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            isVisible.value = true
            observer?.disconnect()
            observer = null
            break
          }
        }
      },
      { threshold, rootMargin: '0px 0px -40px 0px' },
    )
    observer.observe(el)
  })

  onUnmounted(() => {
    observer?.disconnect()
    observer = null
  })

  return isVisible as Ref<boolean>
}

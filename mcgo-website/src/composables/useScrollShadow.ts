import { onMounted, onUnmounted, ref } from 'vue'

/** rAF-throttled scroll flag for sticky headers. */
export function useScrollShadow(offset = 16) {
  const isScrolled = ref(false)
  let ticking = false

  const onScroll = () => {
    if (ticking) return
    ticking = true
    requestAnimationFrame(() => {
      isScrolled.value = window.scrollY > offset
      ticking = false
    })
  }

  onMounted(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', onScroll)
  })

  return isScrolled
}

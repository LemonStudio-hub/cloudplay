import { ref, watch } from 'vue'

export type Theme = 'dark' | 'light'

const STORAGE_KEY = 'cloudplay-theme'

function resolveInitial(): Theme {
  if (typeof window === 'undefined') return 'dark'
  const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: light)').matches
    ? 'light'
    : 'dark'
}

function apply(theme: Theme) {
  document.documentElement.setAttribute('data-theme', theme)
}

/** Shared state — initialized once when first imported in browser */
const theme = ref<Theme>(
  typeof window !== 'undefined' ? resolveInitial() : 'dark',
)

if (typeof window !== 'undefined') {
  apply(theme.value)
  watch(theme, (t) => {
    apply(t)
    localStorage.setItem(STORAGE_KEY, t)
  })
}

export function useTheme() {
  const toggle = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const setTheme = (t: Theme) => {
    theme.value = t
  }

  return { theme, toggle, setTheme }
}

export function bootstrapTheme() {
  const t = resolveInitial()
  theme.value = t
  apply(t)
  return t
}

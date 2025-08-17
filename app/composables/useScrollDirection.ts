export function useScrollDirection() {
  let lastScroll = 0

  const direction = ref<'up' | 'down' | null>(null)

  const route = useRoute()

  const handleScroll = () => {
    const currentScroll = window.scrollY

    if (currentScroll <= 0) {
      direction.value = null
      return
    }

    if (currentScroll > lastScroll) {
      direction.value = 'down'
    }
    else if (currentScroll < lastScroll) {
      direction.value = 'up'
    }

    lastScroll = currentScroll
  }

  onMounted(() => {
    window.addEventListener('scroll', handleScroll)
  })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
  })

  watch(() => route.fullPath, () => {
    lastScroll = 0
    direction.value = null
  })

  return { direction }
}

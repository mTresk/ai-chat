export function useSidebar(sidebarCollapsed: Ref<boolean>, sidebarOpened: Ref<boolean>) {
  const MOBILE_QUERY = '(max-width: 767.98px)'

  let mql: MediaQueryList | null = null

  const applyPolicy = () => {
    if (!mql) {
      return
    }

    if (mql.matches) {
      sidebarCollapsed.value = false

      try {
        localStorage.setItem('treskai_sidebar_collapsed', 'false')
      }
      catch {}
    }
    else {
      try {
        const saved = localStorage.getItem('treskai_sidebar_collapsed')

        if (saved !== null) {
          sidebarCollapsed.value = saved === 'true'
        }
      }
      catch {}
    }
  }

  const initSidebarState = (): void => {
    if (typeof window === 'undefined') {
      return
    }

    mql = window.matchMedia(MOBILE_QUERY)

    const handler = () => applyPolicy()

    applyPolicy()

    if ('addEventListener' in mql) {
      mql.addEventListener('change', handler)
    }
    else if ('addListener' in (mql as any)) {
      ;(mql as any).addListener(handler)
    }

    ;(initSidebarState as any)._cleanup = () => {
      if (!mql) {
        return
      }

      if ('removeEventListener' in mql) {
        mql.removeEventListener('change', handler)
      }
      else if ('removeListener' in (mql as any)) {
        ;(mql as any).removeListener(handler)
      }
    }
  }

  const toggleSidebar = (): void => {
    sidebarCollapsed.value = !sidebarCollapsed.value

    try {
      localStorage.setItem('treskai_sidebar_collapsed', String(sidebarCollapsed.value))
    }
    catch {}
  }

  const openSidebar = (): void => {
    sidebarOpened.value = true
    document.body.style.overflow = 'hidden'
  }

  const closeSidebar = (): void => {
    sidebarOpened.value = false
    document.body.style.overflow = 'auto'
  }

  return {
    toggleSidebar,
    openSidebar,
    closeSidebar,
    initSidebarState,
  }
}

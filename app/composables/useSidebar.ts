export function useSidebar(sidebarCollapsed: Ref<boolean>, sidebarOpened: Ref<boolean>) {
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

    return { toggleSidebar, openSidebar, closeSidebar }
}

import type { Chat } from '@/types'

export const useChats = () => useState<Chat[]>('chats', () => [])
export const useCurrentChat = () => useState<Chat | null>('currentChat', () => null)
export const useIsLoading = () => useState<boolean>('isLoading', () => false)
export const useSidebarCollapsedState = () => useState<boolean>('sidebarCollapsed', () => false)
export const useSidebarOpenedState = () => useState<boolean>('sidebarOpened', () => false)

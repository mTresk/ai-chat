import { chatStorage } from '@/utils/chatStorage'

export function useChatStorage() {
    const isInitialized = ref(false)

    const initStorage = async () => {
        if (!isInitialized.value) {
            await chatStorage.init()
            isInitialized.value = true
        }
    }

    return {
        chatStorage,
        isInitialized: readonly(isInitialized),
        initStorage,
    }
}

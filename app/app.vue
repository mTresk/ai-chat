<script setup lang="ts">
import type { Chat, ChatMessage } from '@/types'

useHead({
    title: 'TreskAI - Умный чат-ассистент',
    meta: [
        { name: 'description', content: 'TreskAI - современный чат-ассистент на основе искусственного интеллекта' },
    ],
})

const { chatStorage, initStorage } = useChatStorage()
const chats = ref<Chat[]>([])
const currentChat = ref<Chat | null>(null)
const sidebarCollapsed = ref(false)
const isLoading = ref(false)
const isMobile = ref(false)

function updateIsMobile() {
    if (typeof window === 'undefined') {
        return
    }
    isMobile.value = window.innerWidth < 768
}

async function loadChats() {
    try {
        chats.value = await chatStorage.getAllChats()
    }
    catch (error) {
        console.error('Failed to load chats:', error)
    }
}

async function createNewChat() {
    try {
        const newChat = await chatStorage.createNewChat()

        chats.value.unshift(newChat)
        currentChat.value = newChat
    }
    catch (error) {
        console.error('Failed to create new chat:', error)
    }
}

async function selectChat(chatId: string) {
    try {
        const chat = await chatStorage.getChat(chatId)

        if (chat) {
            currentChat.value = chat
        }
        else {
            currentChat.value = null
        }
    }
    catch (error) {
        console.error('Failed to select chat:', error)
    }
}

async function deleteChat(chatId: string) {
    try {
        await chatStorage.deleteChat(chatId)

        chats.value = chats.value.filter(chat => chat.id !== chatId)

        if (currentChat.value?.id === chatId) {
            if (chats.value.length > 0) {
                currentChat.value = chats.value[0] || null
            }
            else {
                await createNewChat()
            }
        }
    }
    catch (error) {
        console.error('Failed to delete chat:', error)
    }
}

async function sendMessage(content: string) {
    if (!currentChat.value || !content.trim() || isLoading.value) {
        return
    }

    isLoading.value = true

    try {
        const userMessage: ChatMessage = {
            id: Date.now().toString(),
            role: 'user',
            content: content.trim(),
            timestamp: new Date(),
        }

        currentChat.value.messages.push(userMessage)

        if (currentChat.value.messages.length === 1) {
            const title = chatStorage.generateChatTitle(content)

            currentChat.value.title = title

            await chatStorage.updateChatTitle(currentChat.value.id, title)

            const currentChatId = currentChat.value?.id

            if (currentChatId) {
                const chatIndex = chats.value.findIndex(c => c.id === currentChatId)
                if (chatIndex !== -1 && chats.value[chatIndex]) {
                    chats.value[chatIndex].title = title
                }
            }
        }

        await chatStorage.saveChat(currentChat.value)

        const response = await $fetch('/api/ai', {
            method: 'POST',
            body: {
                messages: currentChat.value.messages.slice(-10),
            },
        }).catch((error) => {
            console.error('Ошибка API:', error)
            throw error
        })

        const aiMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: response.choices[0]?.message?.content || 'Извините, произошла ошибка.',
            timestamp: new Date(),
        }

        currentChat.value.messages.push(aiMessage)

        await chatStorage.saveChat(currentChat.value)

        chats.value = chats.value.filter(c => c.id !== currentChat.value?.id)

        if (currentChat.value) {
            chats.value.unshift(currentChat.value)
        }
    }
    catch (error) {
        console.error('Ошибка при отправке сообщения:', error)

        const errorData = error as any
        const errorMessage: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'ai',
            content: errorData?.data?.message,
            timestamp: new Date(),
            isError: true,
        }

        if (currentChat.value) {
            currentChat.value.messages.push(errorMessage)

            await chatStorage.saveChat(currentChat.value)
        }
    }
    finally {
        isLoading.value = false
    }
}

async function clearCurrentChat() {
    if (!currentChat.value) {
        return
    }

    currentChat.value.messages = []
    currentChat.value.title = 'Новый чат'

    await chatStorage.saveChat(currentChat.value)

    const currentChatId = currentChat.value?.id

    if (currentChatId) {
        const chatIndex = chats.value.findIndex(c => c.id === currentChatId)

        if (chatIndex !== -1 && chats.value[chatIndex]) {
            chats.value[chatIndex].title = 'Новый чат'
        }
    }
}

function toggleSidebar() {
    sidebarCollapsed.value = !sidebarCollapsed.value
}

async function retryMessage(messageId: string) {
    if (!currentChat.value) {
        return
    }

    const messageIndex = currentChat.value.messages.findIndex(msg => msg.id === messageId)

    if (messageIndex <= 0) {
        return
    }

    const userMessage = currentChat.value.messages[messageIndex - 1]

    if (!userMessage || userMessage.role !== 'user') {
        return
    }

    currentChat.value.messages.splice(messageIndex, 1)

    await chatStorage.saveChat(currentChat.value)

    await sendMessage(userMessage.content)
}

onMounted(async () => {
    try {
        await initStorage()
        await loadChats()

        if (chats.value.length === 0) {
            await createNewChat()
        }
        else {
            currentChat.value = chats.value[0] || null
        }
    }
    catch (error) {
        console.error('Ошибка при инициализации приложения:', error)

        const fallbackChat = {
            id: 'fallback_chat',
            title: 'Новый чат',
            messages: [],
            createdAt: new Date(),
            updatedAt: new Date(),
        }

        chats.value = [fallbackChat]
        currentChat.value = fallbackChat
    }

    if (typeof window !== 'undefined' && window.innerWidth < 768) {
        sidebarCollapsed.value = true
    }

    updateIsMobile()

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateIsMobile)
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateIsMobile)
    }
})
</script>

<template>
    <div class="flex h-screen bg-white relative">
        <!-- Desktop sidebar -->
        <div class="hidden md:block h-full">
            <ChatSidebar
                :chats="chats"
                :current-chat-id="currentChat?.id"
                :is-collapsed="sidebarCollapsed"
                @select-chat="selectChat"
                @new-chat="createNewChat"
                @delete-chat="deleteChat"
                @toggle-sidebar="toggleSidebar"
            />
        </div>

        <!-- Mobile overlay sidebar with animations -->
        <div
            class="fixed inset-0 z-50 flex pointer-events-none"
            aria-hidden="true"
        >
            <!-- Backdrop fade -->
            <transition
                enter-active-class="transition-opacity duration-200"
                enter-from-class="opacity-0"
                enter-to-class="opacity-100"
                leave-active-class="transition-opacity duration-200"
                leave-from-class="opacity-100"
                leave-to-class="opacity-0"
            >
                <div
                    v-if="isMobile && !sidebarCollapsed"
                    class="absolute inset-0 bg-black/50 pointer-events-auto"
                    aria-label="Закрыть меню"
                    tabindex="0"
                    @click="toggleSidebar"
                    @keydown.enter.prevent="toggleSidebar"
                    @keydown.space.prevent="toggleSidebar"
                />
            </transition>

            <!-- Panel slide-in/out -->
            <transition
                enter-active-class="transition-transform duration-300 ease-out"
                enter-from-class="-translate-x-full"
                enter-to-class="translate-x-0"
                leave-active-class="transition-transform duration-300 ease-in"
                leave-from-class="translate-x-0"
                leave-to-class="-translate-x-full"
            >
                <div
                    v-if="isMobile && !sidebarCollapsed"
                    class="relative h-full transform pointer-events-auto"
                    aria-modal="true"
                    role="dialog"
                >
                    <ChatSidebar
                        :chats="chats"
                        :current-chat-id="currentChat?.id"
                        :is-collapsed="false"
                        @select-chat="selectChat"
                        @new-chat="createNewChat"
                        @delete-chat="deleteChat"
                        @toggle-sidebar="toggleSidebar"
                    />
                </div>
            </transition>
        </div>
        <div class="flex-1 flex flex-col">
            <Chat
                v-if="currentChat"
                :key="currentChat.id"
                :messages="currentChat.messages"
                :is-loading="isLoading"
                :sidebar-collapsed="sidebarCollapsed"
                @send-message="sendMessage"
                @clear-chat="clearCurrentChat"
                @toggle-sidebar="toggleSidebar"
                @retry-message="retryMessage"
            />
        </div>
    </div>
</template>

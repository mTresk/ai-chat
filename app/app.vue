<script setup lang="ts">
import type { Chat } from '@/types'

useHead({
    title: 'TreskAI - Умный чат-ассистент',
    meta: [
        {
            name: 'description',
            content: 'TreskAI - современный чат-ассистент на основе искусственного интеллекта',
        },
    ],
})

const sidebarCollapsed = ref(false)
const sidebarOpened = ref(false)
const isLoading = ref(false)
const { chatStorage: _chatStorage, initStorage } = useChatStorage()
const chats = ref<Chat[]>([])
const currentChat = ref<Chat | null>(null)
const { loadChats, createChat, selectChat, deleteChat } = useChat(chats, currentChat)
const { sendMessage, retryMessage, cancel } = useMessage(chats, currentChat, isLoading)
const { toggleSidebar, openSidebar, closeSidebar } = useSidebar(sidebarCollapsed, sidebarOpened)

onMounted(async () => {
    try {
        await initStorage()
        await loadChats()

        if (chats.value.length === 0) {
            await createChat()
        }
        else {
            currentChat.value = chats.value[0] || null
        }

        try {
            useSidebar(sidebarCollapsed, sidebarOpened).initSidebarState()
        }
        catch {}
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
})
</script>

<template>
    <div class="wrapper">
        <Sidebar
            :chats="chats"
            :current-chat-id="currentChat?.id"
            :is-collapsed="sidebarCollapsed"
            :is-opened="sidebarOpened"
            @select-chat="selectChat"
            @new-chat="createChat"
            @delete-chat="deleteChat"
            @toggle-sidebar="toggleSidebar"
            @close-sidebar="closeSidebar"
        />
        <div class="inner">
            <Header
                title="TreskAI"
                @open-sidebar="openSidebar"
                @toggle-sidebar="toggleSidebar"
                @new-chat="createChat"
            />
            <Chat
                v-if="currentChat"
                :key="currentChat.id"
                :messages="currentChat.messages"
                :is-loading="isLoading"
                :sidebar-collapsed="sidebarCollapsed"
                @send-message="sendMessage"
                @retry-message="retryMessage"
                @cancel="cancel"
            />
        </div>
    </div>
</template>

<style lang="scss" scoped>
.wrapper {
    position: relative;
    display: flex;
    height: 100%;
    min-height: 100dvh;
    background-color: $whiteColor;
}

.inner {
    display: flex;
    flex: 1;
    flex-direction: column;

    @include adaptive-value('gap', 40, 20);
}
</style>

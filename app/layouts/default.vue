<script setup lang="ts">
const chats = useChats()
const currentChat = useCurrentChat()

const sidebarCollapsed = useSidebarCollapsedState()
const sidebarOpened = useSidebarOpenedState()

const { chatStorage: _chatStorage, initStorage } = useChatStorage()
const { loadChats, createChat, selectChat, deleteChat } = useChat(chats, currentChat)
const { toggleSidebar, openSidebar, closeSidebar, initSidebarState } = useSidebar(sidebarCollapsed, sidebarOpened)

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
            initSidebarState()
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
    <Head>
        <Meta
            name="title"
            content="TreskAI - Умный чат-ассистент"
        />
        <Meta
            name="description"
            content="TreskAI - современный чат-ассистент на основе искусственного интеллекта"
        />
        <link
            rel="icon"
            type="image/png"
            href="/favicon-96x96.png"
            sizes="96x96"
        >
        <link
            rel="icon"
            type="image/svg+xml"
            href="/favicon.svg"
        >
        <link
            rel="shortcut icon"
            href="/favicon.ico"
        >
        <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
        >
    </Head>
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
            <slot />
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

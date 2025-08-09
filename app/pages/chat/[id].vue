<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const chats = useChats()
const currentChat = useCurrentChat()
const isLoading = useIsLoading()
const { loadChats, selectChat } = useChat(chats, currentChat)
const { sendMessage, retryMessage, cancel } = useMessage(chats, currentChat, isLoading)

async function ensureChatLoaded() {
    const chatId = String(route.params.id || '')

    if (!chatId) {
        return
    }

    if (currentChat.value?.id === chatId) {
        return
    }

    if (!chats.value.length) {
        await loadChats()
    }

    await selectChat(chatId)

    if (!currentChat.value) {
        router.replace('/')
    }
}

onMounted(async () => await ensureChatLoaded())

watch(
    () => route.params.id,
    async () => await ensureChatLoaded(),

)
</script>

<template>
    <Chat
        v-if="currentChat"
        :key="currentChat.id"
        :messages="currentChat.messages"
        :is-loading="isLoading"
        @send-message="sendMessage"
        @retry-message="retryMessage"
        @cancel="cancel"
    />
</template>

<script setup lang="ts">
const router = useRouter()
const chats = useChats()
const currentChat = useCurrentChat()
const isLoading = useIsLoading()
const { createChat } = useChat(chats, currentChat)
const { sendMessage, cancel } = useMessage(chats, currentChat, isLoading)
const inputValue = ref('')

async function handleNavigateToCurrent() {
    const chatId = currentChat.value?.id

    if (!chatId) {
        return
    }

    router.push(`/chat/${chatId}`)
}

async function handleThreadSubmit() {
    const trimmed = inputValue.value.trim()

    if (!trimmed) {
        return
    }

    await createChat()
    await handleNavigateToCurrent()

    void sendMessage(trimmed)

    inputValue.value = ''
}

async function handleSendExample(content: string) {
    const trimmed = String(content).trim()

    if (!trimmed) {
        return
    }

    await createChat()
    await handleNavigateToCurrent()

    void sendMessage(trimmed)
}
</script>

<template>
    <ChatWelcome @send-example="handleSendExample" />
    <ChatThread
        v-model="inputValue"
        :is-loading="isLoading"
        @submit="handleThreadSubmit"
        @cancel="cancel"
    />
</template>

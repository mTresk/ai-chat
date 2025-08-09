<script setup lang="ts">
const chats = useChats()
const currentChat = useCurrentChat()
const isLoading = useIsLoading()

const { sendMessage, retryMessage, cancel } = useMessage(chats, currentChat, isLoading)
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

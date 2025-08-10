<script setup lang="ts">
import type { ChatMessage } from '@/types'

interface Props {
    messages: ChatMessage[]
    isLoading: boolean
}

interface Emits {
    (e: 'sendMessage', content: string): void
    (e: 'retryMessage', messageId: string): void
    (e: 'cancel'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref('')
const threadRef = useTemplateRef('threadRef')

function sendMessage(content: string) {
    emit('sendMessage', content)
}

function handleSubmit() {
    sendMessage(inputValue.value.trim())

    inputValue.value = ''

    nextTick(() => {
        threadRef.value?.autoresize()
    })
}

onMounted(() => {
    nextTick(() => {
        threadRef.value?.autoresize()
    })
})
</script>

<template>
    <ChatWelcome
        v-if="messages.length === 0"
        @send-example="$emit('sendMessage', $event)"
    />
    <ChatMessages
        v-else
        :messages="messages"
        :is-loading="isLoading"
        @send-message="sendMessage"
        @retry-message="emit('retryMessage', $event)"
    />
    <ChatThread
        ref="threadRef"
        v-model="inputValue"
        :is-loading="isLoading"
        @submit="handleSubmit"
        @cancel="emit('cancel')"
    />
</template>

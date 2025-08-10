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
const messagesAreaPaddingBottom = ref(0)

function updateFooterPadding() {
    if (!threadRef.value) {
        messagesAreaPaddingBottom.value = 0

        return
    }

    const footerHeight = threadRef.value?.getHeight() || 0
    const extraGapPx = 24

    messagesAreaPaddingBottom.value = footerHeight + extraGapPx
}

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

        updateFooterPadding()
    })

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateFooterPadding)
    }
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateFooterPadding)
    }
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
        :padding-bottom="messagesAreaPaddingBottom"
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

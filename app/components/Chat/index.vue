<script setup lang="ts">
import type { ChatMessage } from '@/types'

interface Props {
    messages: ChatMessage[]
    isLoading: boolean
}

interface Emits {
    (e: 'sendMessage', content: string): void
    (e: 'retryMessage', messageId: string): void
}

defineProps<Props>()

const emit = defineEmits<Emits>()

const inputValue = ref('')
const threadRef = ref<InstanceType<typeof import('./Thread.vue').default> | null>()
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

onUpdated(() => {
    nextTick(() => {
        updateFooterPadding()
    })
})

onUnmounted(() => {
    if (typeof window !== 'undefined') {
        window.removeEventListener('resize', updateFooterPadding)
    }
})
</script>

<template>
    <main class="page">
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
        />
    </main>
</template>

<style lang="scss" scoped>
.page {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: rem(40);
    justify-content: space-between;
    width: 100%;
    max-width: rem(860);
    height: 100%;
    padding-inline: rem(20);
    margin-inline: auto;
    background-color: $whiteColor;
}
</style>

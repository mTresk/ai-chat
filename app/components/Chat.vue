<script setup lang="ts">
import type { ChatMessage } from '@/types'

interface Props {
    messages: ChatMessage[]
    isLoading: boolean
    sidebarCollapsed: boolean
}

interface Emits {
    (e: 'sendMessage', content: string): void
    (e: 'clearChat'): void
    (e: 'toggleSidebar'): void
    (e: 'retryMessage', messageId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainerRef = ref<HTMLElement>()

const examples = [
    'Объясни, что такое машинное обучение',
    'Помоги написать функцию на JavaScript',
    'Как приготовить идеальную пасту?',
    'Расскажи интересный факт о космосе',
    'Помоги составить план изучения нового языка',
    'Что такое квантовая физика простыми словами?',
]

function sendMessage(content: string) {
    emit('sendMessage', content)
}

function handleSubmit() {
    sendMessage(inputValue.value.trim())
    inputValue.value = ''
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSubmit()
    }
}

function clearChat() {
    emit('clearChat')
}

function scrollToBottom() {
    nextTick(() => {
        if (messagesContainerRef.value) {
            messagesContainerRef.value.scrollTop = messagesContainerRef.value.scrollHeight
        }
    })
}

function autoresize(): void {
    const el = textareaRef.value

    if (!el) {
        return
    }

    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 320)}px`
}

watch(() => props.messages, () => {
    scrollToBottom()
}, { deep: true })

onMounted(() => {
    if (textareaRef.value) {
        textareaRef.value.focus()
    }

    nextTick(() => {
        scrollToBottom()
        autoresize()
    })
})

onUpdated(() => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

<template>
    <div class="flex flex-col h-screen bg-white text-gray-900">
        <!-- Header -->
        <div class="border-b border-gray-200 bg-white">
            <div class="max-w-4xl mx-auto px-2 md:px-4 py-3 flex items-center justify-between">
                <h1 class="text-lg font-semibold text-gray-900">
                    TreskAI
                </h1>
                <button
                    class="p-2 rounded-md hover:bg-gray-100 transition-colors"
                    title="Очистить чат"
                    @click="clearChat"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        class="h-5 w-5 text-gray-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                    </svg>
                </button>
            </div>
        </div>

        <!-- Messages Area -->
        <div
            ref="messagesContainerRef"
            class="flex-1 overflow-y-auto"
        >
            <!-- Welcome Screen -->
            <div
                v-if="props.messages.length === 0"
                class="flex flex-col items-center justify-center h-full px-4"
            >
                <div class="text-center max-w-2xl">
                    <div class="w-16 h-16 mx-auto mb-6 bg-black rounded-full flex items-center justify-center">
                        <svg
                            class="w-8 h-8 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142.0852-4.7735 2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                        </svg>
                    </div>
                    <h1 class="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
                        Как дела? Чем могу помочь?
                    </h1>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-3 mt-8">
                        <button
                            v-for="example in examples"
                            :key="example"
                            class="p-3 md:p-4 text-left rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm"
                            @click="sendMessage(example)"
                        >
                            {{ example }}
                        </button>
                    </div>
                </div>
            </div>

            <!-- Chat Messages -->
            <div v-else>
                <div
                    v-for="message in props.messages"
                    :key="message.id"
                    class="border-b border-gray-100"
                    :class="message.role === 'user' ? 'bg-gray-50' : 'bg-white'"
                >
                    <div class="max-w-4xl mx-auto px-2 md:px-4 py-6">
                        <div class="flex gap-4">
                            <!-- Avatar -->
                            <div class="flex-shrink-0">
                                <div
                                    class="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                                    :class="message.role === 'user' ? 'bg-blue-500' : 'bg-black'"
                                >
                                    {{ message.role === 'user' ? 'U' : 'AI' }}
                                </div>
                            </div>
                            <!-- Message Content -->
                            <div class="flex-1 min-w-0">
                                <div class="text-xs md:text-sm text-gray-600 mb-1">
                                    {{ message.role === 'user' ? 'Вы' : 'TreskAI' }}
                                </div>
                                <div class="text-gray-900 text-sm md:text-base">
                                    <template v-if="message.role === 'ai'">
                                        <template
                                            v-for="(part, index) in parseMessage(message.content)"
                                            :key="index"
                                        >
                                            <div
                                                v-if="part.type === 'text'"
                                                class="max-w-none"
                                                v-html="formatTextContent(part.content)"
                                            />
                                            <CodeBlock
                                                v-else
                                                :code="part.content"
                                                :language="part.language"
                                            />
                                        </template>
                                        <!-- Retry button -->
                                        <div
                                            v-if="message.isError"
                                            class="mt-3 flex items-center gap-2"
                                        >
                                            <button
                                                class="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                                @click="emit('retryMessage', message.id)"
                                            >
                                                🔄 Повторить
                                            </button>
                                        </div>
                                    </template>
                                    <div
                                        v-else
                                        class="whitespace-pre-wrap text-sm md:text-base"
                                    >
                                        {{ message.content }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Loading indicator -->
                <div
                    v-if="props.isLoading"
                    class="bg-white border-b border-gray-100"
                >
                    <div class="max-w-4xl mx-auto px-2 md:px-4 py-6">
                        <div class="flex gap-4">
                            <div class="flex-shrink-0">
                                <div class="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
                                    AI
                                </div>
                            </div>
                            <div class="flex-1">
                                <div class="text-sm text-gray-600 mb-1">
                                    TreskAI
                                </div>
                                <div class="flex items-center gap-1">
                                    <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                                    <div
                                        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style="animation-delay: 0.1s"
                                    />
                                    <div
                                        class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                                        style="animation-delay: 0.2s"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Input Area -->
        <div class="border-t border-gray-200 bg-white">
            <div class="max-w-4xl mx-auto px-2 md:px-4 py-4">
                <form
                    class="relative"
                    @submit.prevent="handleSubmit"
                >
                    <div class="relative">
                        <textarea
                            ref="textareaRef"
                            v-model="inputValue"
                            :disabled="props.isLoading"
                            placeholder="Отправьте сообщение TreskAI"
                            rows="1"
                            class="w-full px-3 md:px-4 py-3 pr-12 border border-gray-300 rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent max-h-32 min-h-[52px] bg-white text-gray-900 placeholder-gray-500 text-sm md:text-base"
                            :class="{ 'opacity-50': props.isLoading }"
                            style="field-sizing: content;"
                            @keydown="handleKeyDown"
                            @input="autoresize"
                        />
                        <button
                            type="submit"
                            :disabled="props.isLoading || !inputValue.trim()"
                            class="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-lg transition-colors"
                            :class="inputValue.trim() && !props.isLoading ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-200 text-gray-400'"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                class="h-4 w-4"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                                />
                            </svg>
                        </button>
                    </div>
                </form>
                <div class="text-xs text-gray-500 text-center mt-2">
                    TreskAI может допускать ошибки. Проверяйте важную информацию.
                </div>
            </div>
        </div>
    </div>
</template>

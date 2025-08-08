<script setup lang="ts">
import type { Chat } from '@/types'

interface Props {
    chats: Chat[]
    currentChatId?: string
    isCollapsed?: boolean
}

interface Emits {
    (e: 'selectChat', chatId: string): void
    (e: 'newChat'): void
    (e: 'deleteChat', chatId: string): void
    (e: 'toggleSidebar'): void
}

withDefaults(defineProps<Props>(), {
    currentChatId: '',
    isCollapsed: false,
})

const emit = defineEmits<Emits>()

function formatDate(date: Date): string {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) {
        return 'Сегодня'
    }
    else if (diffDays === 1) {
        return 'Вчера'
    }
    else if (diffDays < 7) {
        return `${diffDays} дн. назад`
    }
    else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `${weeks} нед. назад`
    }
    else {
        const months = Math.floor(diffDays / 30)
        return `${months} мес. назад`
    }
}

function handleDeleteChat(event: Event, chatId: string) {
    event.stopPropagation()
    // eslint-disable-next-line no-alert
    if (confirm('Удалить этот чат?')) {
        emit('deleteChat', chatId)
    }
}
</script>

<template>
    <div
        class="flex flex-col h-full bg-gray-900 text-white transition-all duration-300"
        :class="isCollapsed ? 'w-16 md:w-20' : 'w-80'"
    >
        <!-- Header -->
        <div class="flex items-center justify-between gap-2 p-2 md:p-4 border-b border-gray-700">
            <button
                v-if="!isCollapsed"
                class="flex items-center gap-3 flex-1 p-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors text-left w-full"
                @click="emit('newChat')"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
                <span class="text-sm font-medium">Новый чат</span>
            </button>

            <button
                v-else
                class="p-3 rounded-lg border border-gray-600 hover:bg-gray-800 transition-colors w-full flex justify-center"
                @click="emit('newChat')"
            >
                <svg
                    class="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 4v16m8-8H4"
                    />
                </svg>
            </button>

            <button
                class="p-2 rounded-lg hover:bg-gray-800 transition-colors md:ml-2 z-10 relative"
                :title="isCollapsed ? 'Развернуть панель' : 'Свернуть панель'"
                @click="emit('toggleSidebar')"
            >
                <svg
                    class="w-5 h-5 transition-transform duration-300"
                    :class="isCollapsed ? 'rotate-180' : ''"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 19l-7-7 7-7m8 14l-7-7 7-7"
                    />
                </svg>
            </button>
        </div>

        <!-- Chat List -->
        <div class="flex-1 overflow-y-auto">
            <div
                v-if="chats.length === 0 && !isCollapsed"
                class="p-4 text-center text-gray-400"
            >
                <p class="text-sm">
                    Нет сохраненных чатов
                </p>
                <p class="text-xs mt-1">
                    Начните новый диалог
                </p>
            </div>

            <div
                v-else
                class="p-1 md:p-2 space-y-1"
            >
                <button
                    v-for="chat in chats"
                    :key="chat.id"
                    class="group relative w-full p-2 md:p-3 rounded-lg transition-all duration-200 text-left hover:bg-gray-800"
                    :class="currentChatId === chat.id ? 'bg-gray-800 border-l-4 border-blue-500' : 'hover:bg-gray-800'"
                    @click="emit('selectChat', chat.id)"
                >
                    <div v-if="!isCollapsed">
                        <div class="flex items-start justify-between">
                            <div class="flex-1 min-w-0">
                                <h3 class="text-sm font-medium text-white truncate mb-1">
                                    {{ chat.title }}
                                </h3>
                                <p class="text-xs text-gray-400">
                                    {{ formatDate(chat.updatedAt) }}
                                </p>
                                <p
                                    v-if="chat.messages.length > 0"
                                    class="text-xs text-gray-500 mt-1 truncate"
                                >
                                    {{ chat.messages[chat.messages.length - 1]?.content?.substring(0, 50) || '' }}...
                                </p>
                            </div>

                            <!-- Delete Button -->
                            <button
                                class="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-gray-700 transition-all duration-200 ml-2 flex-shrink-0"
                                @click="handleDeleteChat($event, chat.id)"
                            >
                                <svg
                                    class="w-4 h-4 text-gray-400 hover:text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
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

                    <!-- Collapsed view -->
                    <div
                        v-else
                        class="flex justify-center"
                    >
                        <div
                            class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium"
                            :class="currentChatId === chat.id ? 'bg-blue-500 text-white' : 'bg-gray-700 text-gray-300'"
                        >
                            {{ chat.title.charAt(0).toUpperCase() }}
                        </div>
                    </div>
                </button>
            </div>
        </div>

        <!-- Footer -->
        <div
            v-if="!isCollapsed"
            class="p-4 border-t border-gray-700"
        >
            <div class="text-xs text-gray-400 text-center">
                <p>TreskAI</p>
                <p class="mt-1">
                    {{ chats.length }} {{ chats.length === 1 ? 'чат' : 'чатов' }}
                </p>
            </div>
        </div>
    </div>
</template>

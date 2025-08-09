<script setup lang="ts">
import type { Chat } from '@/types'

interface Props {
    chats: Chat[]
    currentChatId?: string
    isCollapsed?: boolean
    isOpened?: boolean
}

interface Emits {
    (e: 'newChat'): void
    (e: 'deleteChat', chatId: string): void
    (e: 'toggleSidebar'): void
    (e: 'closeSidebar'): void
}

const props = withDefaults(defineProps<Props>(), {
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

function handleNavigate() {
    if (typeof window !== 'undefined') {
        const isMobile = window.matchMedia('(max-width: 767px)').matches
        if (isMobile) {
            emit('closeSidebar')
        }
    }
}

function handleNewChat() {
    emit('newChat')

    if (typeof window !== 'undefined') {
        const isMobile = window.matchMedia('(max-width: 767px)').matches

        if (isMobile) {
            emit('closeSidebar')
        }
    }
}

function handleToggleSidebar() {
    emit('toggleSidebar')
}

function handleCloseSidebar() {
    emit('closeSidebar')
}

const isCollapsed = computed(() => props.isCollapsed)
const toggleTooltipText = computed(() => (isCollapsed.value ? 'Открыть меню' : 'Закрыть меню'))
const toggleTooltipPlacement = computed(() => (isCollapsed.value ? 'bottom-left' : 'bottom'))
</script>

<template>
    <nav
        class="sidebar"
        :class="{ 'sidebar--collapsed': isCollapsed, 'sidebar--opened': isOpened }"
        role="navigation"
        aria-label="История чатов"
    >
        <div class="sidebar__header">
            <UiTooltip
                v-if="!isCollapsed"
                text="Новый чат"
            >
                <button
                    type="button"
                    class="sidebar__new"
                    aria-label="Новый чат"
                    tabindex="0"
                    @click="handleNewChat"
                    @keydown.enter.prevent="handleNewChat"
                    @keydown.space.prevent="handleNewChat"
                >
                    <UiIconCreate :size="24" />
                    <span
                        v-if="!isCollapsed"
                        class="sidebar__new-label"
                    >Новый чат</span>
                </button>
            </UiTooltip>
            <UiTooltip
                key="pc-toggle"
                :text="toggleTooltipText"
                :placement="toggleTooltipPlacement"
                class="sidebar__tooltip sidebar__tooltip--pc"
            >
                <UiButton
                    variant="primary"
                    :aria-label="toggleTooltipText"
                    :size="40"
                    class="sidebar__toggle sidebar__toggle--pc"
                    @click="handleToggleSidebar"
                    @keydown.enter.prevent="handleToggleSidebar"
                    @keydown.space.prevent="handleToggleSidebar"
                >
                    <UiIconToggle
                        :size="24"
                        :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }"
                    />
                </UiButton>
            </UiTooltip>
            <UiTooltip
                key="mobile-toggle"
                text="Закрыть меню"
                class="sidebar__tooltip sidebar__tooltip--mobile"
            >
                <UiButton
                    variant="primary"
                    aria-label="Закрыть меню"
                    :size="40"
                    class="sidebar__toggle sidebar__toggle--mobile"
                    @click="handleCloseSidebar"
                    @keydown.enter.prevent="handleCloseSidebar"
                    @keydown.space.prevent="handleCloseSidebar"
                >
                    <UiIconToggle
                        :size="24"
                        :style="{ transform: isCollapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease' }"
                    />
                </UiButton>
            </UiTooltip>
        </div>
        <div
            class="sidebar__body"
            tabindex="0"
        >
            <div
                v-if="chats.length === 0 && !isCollapsed"
                class="sidebar__empty"
            >
                <p class="sidebar__empty-title">
                    Нет сохраненных чатов
                </p>
                <p class="sidebar__empty-subtitle">
                    Начните новый диалог
                </p>
            </div>
            <ul
                v-else
                class="sidebar__list"
            >
                <li
                    v-for="chat in chats"
                    :key="chat.id"
                >
                    <NuxtLink
                        :to="`/chat/${chat.id}`"
                        class="sidebar__item"
                        :class="{ 'sidebar__item--active': currentChatId === chat.id }"
                        :aria-current="currentChatId === chat.id ? 'page' : undefined"
                        @click="handleNavigate"
                        @keydown.enter.prevent="handleNavigate"
                        @keydown.space.prevent="handleNavigate"
                    >
                        <div
                            v-if="!isCollapsed"
                            class="sidebar__item-content"
                        >
                            <div class="sidebar__item-head">
                                <div class="sidebar__item-texts">
                                    <h3 class="sidebar__item-title">
                                        {{ chat.title }}
                                    </h3>
                                    <p class="sidebar__item-date">
                                        {{ formatDate(chat.updatedAt) }}
                                    </p>
                                </div>
                                <UiTooltip
                                    placement="bottom-right"
                                    text="Удалить чат"
                                >
                                    <UiButton
                                        type="button"
                                        variant="primary"
                                        :size="28"
                                        class="sidebar__item-delete"
                                        aria-label="Удалить чат"
                                        tabindex="0"
                                        @click.stop="handleDeleteChat($event, chat.id)"
                                        @keydown.enter.prevent.stop="handleDeleteChat($event, chat.id)"
                                        @keydown.space.prevent.stop="handleDeleteChat($event, chat.id)"
                                    >
                                        <UiIconDelete :size="16" />
                                    </UiButton>
                                </UiTooltip>
                            </div>

                            <p
                                v-if="chat.messages.length > 0"
                                class="sidebar__item-preview"
                            >
                                {{ chat.messages[chat.messages.length - 1]?.content?.substring(0, 50) || '' }}...
                            </p>
                        </div>

                        <div
                            v-else
                            class="sidebar__item-badge"
                        >
                            {{ chat.title.charAt(0).toUpperCase() }}
                        </div>
                    </NuxtLink>
                </li>
            </ul>
        </div>
        <div
            v-if="!isCollapsed"
            class="sidebar__footer"
        >
            <div class="sidebar__brand">
                TreskAI
            </div>
            <div class="sidebar__meta">
                количество чатов - {{ chats.length }}
            </div>
        </div>
    </nav>
    <div
        class="sidebar__overlay"
        :class="{ 'sidebar__overlay--visible': isOpened }"
        role="button"
        aria-label="Закрыть меню"
        tabindex="0"
        @click="handleCloseSidebar"
        @keydown.enter.prevent="handleCloseSidebar"
        @keydown.space.prevent="handleCloseSidebar"
    />
</template>

<style lang="scss" scoped>
.sidebar {
    position: sticky;
    top: 0;
    z-index: 120;
    display: flex;
    flex-shrink: 0;
    flex-direction: column;
    width: rem(300);
    height: 100dvh;
    color: var(--color-main);
    background-color: var(--color-white);
    border-right: rem(1) solid var(--color-border);
    transition:
        width 0.3s ease-in-out,
        padding 0.3s ease-in-out;

    &--collapsed {
        width: rem(80);

        .sidebar__header {
            grid-template-columns: auto;
            justify-content: center;
        }

        .sidebar__toggle {
            margin-inline: auto;
        }
    }

    @media (max-width: $mobile) {
        position: fixed;
        top: 0;
        left: 0;
        z-index: 120;
        transform: translateX(-100%);
        transition: transform 0.3s ease-in-out;

        &--opened {
            transform: translateX(0);
        }
    }

    &__header {
        position: sticky;
        top: 0;
        z-index: 2;
        display: flex;
        gap: rem(24);
        align-items: center;
        justify-content: space-between;
        padding: rem(12);
        background-color: var(--color-white);
        border-bottom: rem(1) solid var(--color-border);
    }

    &__new {
        display: flex;
        gap: rem(8);
        align-items: center;
        justify-content: center;
        width: 100%;
        height: rem(40);
        padding: rem(10) rem(12);
        color: var(--color-main);
        white-space: nowrap;
        background-color: var(--color-gray);
        border: rem(1) solid var(--color-border-strong);
        border-radius: rem(8);
        transition:
            background-color 0.2s ease-in-out,
            border-color 0.2s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: var(--color-gray);
                border-color: var(--color-border-stronger);
            }
        }
    }

    &__toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        width: rem(40);
        height: rem(40);
        color: var(--color-main);
        background-color: transparent;
        border-radius: rem(8);

        &--pc {
            @media (max-width: $mobile) {
                display: none;
            }
        }

        &--mobile {
            display: none;

            @media (max-width: $mobile) {
                display: flex;
            }
        }
    }

    &__tooltip {
        &--pc {
            @media (max-width: $mobile) {
                display: none;
            }
        }

        &--mobile {
            display: none;

            @media (max-width: $mobile) {
                display: block;
            }
        }
    }

    &__body {
        flex: 1;
        padding: rem(8);
        overflow-y: auto;
        scrollbar-width: thin;
    }

    &__empty {
        padding: rem(16);
        color: var(--color-on-surface-muted);
        text-align: center;
    }

    &__empty-title {
        font-size: rem(14);
    }

    &__empty-subtitle {
        margin-top: rem(4);
        font-size: rem(12);
        opacity: 0.8;
    }

    &__list {
        display: grid;
        gap: rem(6);
    }

    &__item {
        position: relative;
        display: block;
        padding: rem(10);
        outline: none;
        border-radius: rem(8);
        transition:
            background-color 0.2s ease-in-out,
            border-color 0.2s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: var(--color-gray);
            }
        }

        &--active {
            background-color: var(--color-gray);
            border-left: rem(3) solid var(--color-blue);
        }
    }

    &__item-content {
        display: grid;
        gap: rem(6);
    }

    &__item-head {
        display: grid;
        grid-template-columns: 1fr auto;
        gap: rem(8);
        align-items: start;
    }

    &__item-texts {
        min-width: 0;
    }

    &__item-title {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: rem(14);
        font-weight: 500;
        line-height: 1.2;
        color: var(--color-main);
        white-space: nowrap;
    }

    &__item-date {
        margin-top: rem(2);
        font-size: rem(12);
        color: var(--color-dark);
    }

    &__item-preview {
        overflow: hidden;
        text-overflow: ellipsis;
        font-size: rem(12);
        color: var(--color-dark);
        white-space: nowrap;
    }

    &__item-delete {
        opacity: 0;

        .sidebar__item:hover & {
            opacity: 1;
        }

        @media (any-hover: hover) {
            &:hover {
                color: var(--color-white);
                background-color: var(--color-main);
            }
        }

        @media (hover: none) {
            opacity: 1;
        }
    }

    &__item-badge {
        display: grid;
        place-items: center center;
        width: rem(32);
        height: rem(32);
        margin-inline: auto;
        font-size: rem(12);
        font-weight: 600;
        color: var(--color-main);
        background-color: var(--color-gray);
        border-radius: 50%;
    }

    &__footer {
        padding: rem(12);
        background-color: var(--color-white);
        border-top: rem(1) solid var(--color-border);
    }

    &__brand {
        font-size: rem(12);
        color: var(--color-main);
        text-align: center;
        opacity: 0.9;
    }

    &__meta {
        margin-top: rem(4);
        font-size: rem(12);
        color: var(--color-dark);
        text-align: center;
    }

    &__overlay {
        display: none;

        @media (max-width: $mobile) {
            position: fixed;
            inset: 0;
            z-index: 110;
            display: block;
            pointer-events: none;
            background-color: var(--color-overlay);
            opacity: 0;
            transition: opacity 0.3s ease-in-out;

            &--visible {
                pointer-events: auto;
                opacity: 1;
            }
        }
    }
}
</style>

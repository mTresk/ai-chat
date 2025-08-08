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
    (e: 'openSidebar'): void
    (e: 'newChat'): void
    (e: 'retryMessage', messageId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const inputValue = ref('')
const textareaRef = ref<HTMLTextAreaElement>()
const messagesContainerRef = ref<HTMLElement>()
const bottomAnchorRef = ref<HTMLDivElement>()
const footerRef = ref<HTMLElement>()
const messagesAreaPaddingBottom = ref(0)

function updateFooterPadding() {
    if (!footerRef.value) {
        messagesAreaPaddingBottom.value = 0
        return
    }
    const footerHeight = footerRef.value.offsetHeight
    const extraGapPx = 24
    messagesAreaPaddingBottom.value = footerHeight + extraGapPx
}

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

    nextTick(() => {
        autoresize()
    })
}

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        handleSubmit()
    }
}

function handleNewChat() {
    emit('newChat')
}

function scrollToBottom(smooth = false) {
    nextTick(() => {
        if (bottomAnchorRef.value) {
            bottomAnchorRef.value.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'end' })
            return
        }

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

    nextTick(() => {
        updateFooterPadding()
    })
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
        updateFooterPadding()
    })

    if (typeof window !== 'undefined') {
        window.addEventListener('resize', updateFooterPadding)
    }
})

onUpdated(() => {
    nextTick(() => {
        scrollToBottom()
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
    <div class="inner">
        <header class="header">
            <UiButton
                :size="40"
                class="header__button"
                title="Открыть меню"
                aria-label="Открыть меню"
                @click="emit('openSidebar')"
                @keydown.enter.prevent="emit('toggleSidebar')"
                @keydown.space.prevent="emit('toggleSidebar')"
            >
                <UiIconBurger :size="24" />
            </UiButton>
            <h1 class="header__title">
                TreskAI
            </h1>
            <UiButton
                :size="40"
                class="header__new-chat"
                title="Новый чат"
                aria-label="Новый чат"
                @click="handleNewChat"
                @keydown.enter.prevent="handleNewChat"
                @keydown.space.prevent="handleNewChat"
            >
                <UiIconCreate :size="24" />
            </UiButton>
        </header>
        <main class="page">
            <div
                ref="messagesContainerRef"
                class="messages-area"
                :style="{ paddingBottom: `${messagesAreaPaddingBottom}px` }"
            >
                <div
                    v-if="props.messages.length === 0"
                    class="welcome-screen"
                >
                    <div class="welcome-screen__body">
                        <div class="welcome-screen__logo">
                            <svg
                                width="24"
                                height="24"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path d="M22.2819 9.8211a5.9847 5.9847 0 0 0-.5157-4.9108 6.0462 6.0462 0 0 0-6.5098-2.9A6.0651 6.0651 0 0 0 4.9807 4.1818a5.9847 5.9847 0 0 0-3.9977 2.9 6.0462 6.0462 0 0 0 .7427 7.0966 5.98 5.98 0 0 0 .511 4.9107 6.051 6.051 0 0 0 6.5146 2.9001A5.9847 5.9847 0 0 0 13.2599 24a6.0557 6.0557 0 0 0 5.7718-4.2058 5.9894 5.9894 0 0 0 3.9977-2.9001 6.0557 6.0557 0 0 0-.7475-7.0729zm-9.022 12.6081a4.4755 4.4755 0 0 1-2.8764-1.0408l.1419-.0804 4.7783-2.7582a.7948.7948 0 0 0 .3927-.6813v-6.7369l2.02 1.1686a.071.071 0 0 1 .038.052v5.5826a4.504 4.504 0 0 1-4.4945 4.4944zm-9.6607-4.1254a4.4708 4.4708 0 0 1-.5346-3.0137l.142-.0852 4.783-2.7582a.7712.7712 0 0 0 .7806 0l5.8428 3.3685v2.3324a.0804.0804 0 0 1-.0332.0615L9.74 19.9502a4.4992 4.4992 0 0 1-6.1408-1.6464zM2.3408 7.8956a4.485 4.485 0 0 1 2.3655-1.9728V11.6a.7664.7664 0 0 0 .3879.6765l5.8144 3.3543-2.0201 1.1685a.0757.0757 0 0 1-.071 0l-4.8303-2.7865A4.504 4.504 0 0 1 2.3408 7.872zm16.5963 3.8558L13.1038 8.364 15.1192 7.2a.0757.0757 0 0 1 .071 0l4.8303 2.7913a4.4944 4.4944 0 0 1-.6765 8.1042v-5.6772a.79.79 0 0 0-.407-.667zm2.0107-3.0231l-.142.0852-4.7735 2.7818a.7759.7759 0 0 0-.7854 0L9.409 9.2297V6.8974a.0662.0662 0 0 1 .0284-.0615l4.8303-2.7866a4.4992 4.4992 0 0 1 6.6802 4.66zM8.3065 12.863l-2.02-1.1638a.0804.0804 0 0 1-.038-.0567V6.0742a4.4992 4.4992 0 0 1 7.3757-3.4537l-.142.0805L8.704 5.459a.7948.7948 0 0 0-.3927.6813zm1.0976-2.3654l2.602-1.4998 2.6069 1.4998v2.9994l-2.5974 1.4997-2.6067-1.4997Z" />
                            </svg>
                        </div>
                        <h2 class="welcome-screen__title">
                            Как дела? Чем могу помочь?
                        </h2>
                        <div class="welcome-screen__buttons">
                            <button
                                v-for="example in examples"
                                :key="example"
                                class="welcome-screen__button"
                                @click="sendMessage(example)"
                            >
                                {{ example }}
                            </button>
                        </div>
                    </div>
                </div>
                <div
                    v-else
                    class="messages-area__body"
                >
                    <div
                        v-for="message in props.messages"
                        :key="message.id"
                        class="message"
                        :class="message.role === 'user' ? 'message--user' : ''"
                    >
                        <div class="message__body">
                            <div class="message__content">
                                <div
                                    v-if="message.role === 'ai'"
                                    class="message__label"
                                >
                                    TreskAI
                                </div>
                                <div class="message__text">
                                    <template v-if="message.role === 'ai'">
                                        <template
                                            v-for="(part, index) in parseMessage(message.content)"
                                            :key="index"
                                        >
                                            <div
                                                v-if="part.type === 'text'"
                                                v-html="formatTextContent(part.content)"
                                            />
                                            <CodeBlock
                                                v-else
                                                :code="part.content"
                                                :language="part.language"
                                            />
                                        </template>
                                        <div
                                            v-if="message.isError"
                                            class="message__footer"
                                        >
                                            <UiButton
                                                :size="40"
                                                title="Повторить"
                                                aria-label="Повторить"
                                                class="message__button"
                                                @click="emit('retryMessage', message.id)"
                                            >
                                                <UiIconRefresh :size="20" />
                                            </UiButton>
                                        </div>
                                    </template>
                                    <div
                                        v-else
                                    >
                                        {{ message.content }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        v-if="props.isLoading"
                        class="message message--white"
                    >
                        <div class="message__body">
                            <div class="message__wrapper">
                                <div class="message__label">
                                    TreskAI
                                </div>
                                <div class="message__loaders">
                                    <div class="message__loader message__loader--1" />
                                    <div
                                        class="message__loader message__loader--2"
                                        style="animation-delay: 0.1s"
                                    />
                                    <div
                                        class="message__loader message__loader--3"
                                        style="animation-delay: 0.2s"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div
                    ref="bottomAnchorRef"
                    class="messages-area__bottom"
                    :style="{ scrollMarginBottom: `${messagesAreaPaddingBottom}px` }"
                />
            </div>
            <footer
                ref="footerRef"
                class="footer"
            >
                <form
                    class="form"
                    @submit.prevent="handleSubmit"
                >
                    <label class="form__field">
                        <textarea
                            ref="textareaRef"
                            v-model="inputValue"
                            class="form__input"
                            :disabled="props.isLoading"
                            placeholder="Отправьте сообщение TreskAI"
                            rows="1"
                            style="field-sizing: content;"
                            @keydown="handleKeyDown"
                            @input="autoresize"
                        />
                        <UiButton
                            :size="32"
                            type="submit"
                            :disabled="props.isLoading || !inputValue.trim()"
                            class="form__button"
                            :class="inputValue.trim() && !props.isLoading ? 'form__button--active' : ''"
                        >
                            <UiIconPlane :size="16" />
                        </UiButton>
                    </label>
                </form>
                <div class="caution">
                    TreskAI может допускать ошибки. Проверяйте важную информацию.
                </div>
            </footer>
        </main>
    </div>
</template>

<style lang="scss" scoped>
.inner {
    display: flex;
    flex: 1;
    flex-direction: column;

    @include adaptive-value('gap', 40, 20);
}

.header {
    position: sticky;
    top: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding-inline: rem(12);
    margin-inline: auto;

    @include adaptive-value('padding-block', 16, 12);

    @media (max-width: em(1360)) {
        background-color: $whiteColor;
    }

    // .header__button
    &__button {
        display: none;
        align-items: center;
        justify-content: center;
        width: rem(40);
        height: rem(40);
        background-color: transparent;
        border-radius: rem(8);
        transition: background-color 0.3s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: $grayColor;
            }
        }

        @media (max-width: $mobile) {
            display: flex;
        }
    }

    // .header__title
    &__title {
        @include adaptive-value('font-size', 30, 24);
    }

    // .header__new-chat
    &__new-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: transparent;
        border-radius: rem(8);
        transition: background-color 0.3s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: $grayColor;
            }
        }
    }
}

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

.messages-area {
    flex: 1;
    overflow-y: auto;

    &__body {
        display: grid;
        gap: rem(12);
    }

    &__bottom {
        height: 1px;
    }
}

.welcome-screen {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    padding-block: rem(16);

    &__body {
        display: grid;
        gap: rem(40);
        justify-items: center;
        text-align: center;
    }

    &__logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: rem(64);
        height: rem(64);
        color: $whiteColor;
        background-color: $mainColor;
        border-radius: 50%;
    }

    &__title {
        font-size: rem(30);
        font-weight: 500;
        line-height: 125%;
    }

    &__buttons {
        display: grid;
        grid-template-columns: 1fr 1fr;

        @include adaptive-value('gap', 12, 6);

        @media (max-width: $mobileSmall) {
            grid-template-columns: 1fr;
        }
    }

    &__button {
        padding: rem(16);
        font-size: rem(14);
        background-color: transparent;
        border: rem(1) solid $grayColor;
        border-radius: rem(8);
        transition: background-color 0.3s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: $grayColor;
            }
        }
    }
}

.message {
    flex: 1;
    width: 100%;

    &--user {
        width: auto;
        max-width: rem(560);
        margin-left: auto;
        background-color: $grayColor;
        border-radius: rem(16);

        @include adaptive-value('padding', 16, 12);
    }

    &__body {
        display: flex;
        gap: rem(16);
    }

    &__wrapper {
        display: flex;
        flex-direction: column;
        gap: rem(4);
        align-items: center;
    }

    &__content {
        display: grid;
        flex: 1;
        gap: rem(4);
        min-width: 0;
    }

    &__label {
        font-size: rem(14);
        opacity: 0.8;
    }

    &__text {
        line-height: 125%;

        @include adaptive-value('font-size', 18, 16);
    }

    &__footer {
        margin-top: rem(6);
    }

    &__loaders {
        display: flex;
        gap: rem(4);
        align-items: center;
    }

    &__loader {
        width: rem(8);
        height: rem(8);
        background-color: $darkColor;
        border-radius: 50%;
        animation: bounce 1s infinite;

        &--2 {
            animation-delay: 0.1s;
        }

        &--3 {
            animation-delay: 0.2s;
        }
    }

    @keyframes bounce {
        0%,
        100% {
            transform: translateY(-25%);
            animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
        }

        50% {
            transform: none;
            animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
        }
    }
}

.footer {
    position: sticky;
    bottom: 0;
    left: 50%;
    z-index: 100;
    width: 100%;
    padding-bottom: rem(16);
    margin-inline: auto;
    margin-top: auto;
    background-color: $whiteColor;
}

.form {
    width: 100%;

    &__field {
        display: flex;
        gap: rem(20);
        align-items: center;
        justify-content: space-between;
        width: 100%;
        padding: rem(12) rem(16);
        background-color: $whiteColor;
        border: rem(1) solid $darkColor;
        border-radius: rem(20);

        &:focus-within {
            border-color: $blueColor;
        }
    }

    &__input {
        width: 100%;
        line-height: 125%;
        color: $mainColor;
        resize: none;
        background-color: $whiteColor;

        &::placeholder {
            color: $darkColor;
        }
    }

    &__button {
        color: $darkColor;
        background-color: $grayColor;

        &--active {
            color: $whiteColor;
            background-color: $mainColor;
        }

        @media (any-hover: hover) {
            &:hover {
                color: $whiteColor;
                background-color: $blueColor;
            }
        }

        &[disabled] {
            pointer-events: none;
        }
    }
}

.caution {
    margin-top: rem(6);
    font-size: rem(12);
    color: $darkColor;
    text-align: center;
}
</style>

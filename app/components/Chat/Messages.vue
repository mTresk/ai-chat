<script setup lang="ts">
import type { ChatMessage } from '@/types'

interface Props {
    messages: ChatMessage[]
    isLoading: boolean
    paddingBottom: number
}

interface Emits {
    (e: 'sendMessage', content: string): void
    (e: 'retryMessage', messageId: string): void
}

const props = defineProps<Props>()
defineEmits<Emits>()
defineExpose({ scrollToBottom })

const messagesContainerRef = useTemplateRef('messagesContainerRef')
const bottomAnchorRef = useTemplateRef('bottomAnchorRef')

function scrollToBottom(smooth = false): void {
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

watch(
    () => props.messages,
    () => {
        scrollToBottom()
    },
    { deep: true },
)

onMounted(() => {
    nextTick(() => {
        scrollToBottom()
    })
})

onUpdated(() => {
    nextTick(() => {
        scrollToBottom()
    })
})
</script>

<template>
    <div
        ref="messagesContainerRef"
        class="messages-area"
        :style="{ paddingBottom: `${paddingBottom}px` }"
        role="log"
        aria-live="polite"
        aria-relevant="additions text"
        :aria-busy="isLoading ? 'true' : 'false'"
    >
        <div class="messages-area__body">
            <div
                v-for="message in messages"
                :key="message.id"
                class="message"
                :class="message.role === 'user' ? 'message--user' : ''"
            >
                <div class="message__body">
                    <div class="message__content">
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
                                    <ChatCodeBlock
                                        v-else
                                        :code="part.content"
                                        :language="part.language"
                                    />
                                </template>
                                <div
                                    v-if="message.isError"
                                    class="message__footer"
                                >
                                    <UiTooltip text="Повторить">
                                        <UiButton
                                            :size="40"
                                            aria-label="Повторить"
                                            class="message__button"
                                            @click="$emit('retryMessage', message.id)"
                                        >
                                            <UiIconRefresh :size="20" />
                                        </UiButton>
                                    </UiTooltip>
                                </div>
                            </template>
                            <div v-else>
                                {{ message.content }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div
                v-if="isLoading"
                class="message message--white"
                role="status"
                aria-live="polite"
            >
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
        <div
            ref="bottomAnchorRef"
            class="messages-area__bottom"
            :style="{ scrollMarginBottom: `${paddingBottom}px` }"
        />
    </div>
</template>

<style lang="scss" scoped>
.messages-area {
    flex: 1;

    &__body {
        display: grid;
        gap: rem(12);
    }

    &__bottom {
        height: 1px;
    }
}

.message {
    flex: 1;
    width: 100%;

    &--user {
        width: auto;
        max-width: rem(560);
        margin-left: auto;
        background-color: var(--color-gray);
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
        line-height: 145%;

        @include adaptive-value('font-size', 18, 16);

        :deep(p) {
            margin: 0 0 rem(12);
        }

        :deep(p:last-child) {
            margin-bottom: 0;
        }

        :deep(strong) {
            font-weight: 600;
            color: var(--color-main);
        }

        :deep(em) {
            font-style: italic;
            opacity: 0.9;
        }

        :deep(h1),
        :deep(h2),
        :deep(h3),
        :deep(h4),
        :deep(h5),
        :deep(h6) {
            margin: rem(16) 0 rem(8);
            font-weight: 500;
            line-height: 125%;
            color: var(--color-main);
        }

        :deep(h1) {
            @include adaptive-value('font-size', 28, 22);
        }

        :deep(h2) {
            @include adaptive-value('font-size', 24, 20);
        }

        :deep(h3) {
            @include adaptive-value('font-size', 20, 18);
        }

        :deep(h4) {
            @include adaptive-value('font-size', 18, 16);
        }

        :deep(h5),
        :deep(h6) {
            @include adaptive-value('font-size', 16, 15);
        }

        :deep(a) {
            color: var(--color-blue);
            text-decoration: underline;
            text-underline-offset: rem(2);

            @media (any-hover: hover) {
                &:hover {
                    color: var(--color-hover);
                }
            }
        }

        :deep(ul),
        :deep(ol) {
            padding-left: rem(22);
            margin-bottom: rem(12);
            list-style-position: outside;
        }

        :deep(ul) {
            list-style-type: disc;
        }

        :deep(ol) {
            list-style-type: decimal;
        }

        :deep(li) {
            margin-bottom: rem(6);
            list-style: disc;
        }

        :deep(li::marker) {
            color: var(--color-main);
        }

        :deep(ul ul) {
            margin-top: rem(6);
            list-style-type: circle;
        }

        :deep(ul ul ul) {
            list-style-type: square;
        }

        :deep(ol ol) {
            margin-top: rem(6);
            list-style-type: lower-alpha;
        }

        :deep(ol ol ol) {
            list-style-type: lower-roman;
        }
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
        background-color: var(--color-dark);
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
</style>

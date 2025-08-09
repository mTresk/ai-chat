<script setup lang="ts">
interface Emits {
    (e: 'submit'): void
    (e: 'cancel'): void
}

defineProps<{ isLoading: boolean }>()
const emit = defineEmits<Emits>()
const inputValue = defineModel<string>({ default: '' })
defineExpose({ autoresize, getHeight })

const textareaRef = useTemplateRef('textareaRef')
const rootRef = useTemplateRef('rootRef')

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        emit('submit')
    }
}

function handleInput() {
    nextTick(() => {
        autoresize()
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

function getHeight(): number {
    return rootRef.value?.offsetHeight || 0
}
</script>

<template>
    <div
        ref="rootRef"
        class="thread"
    >
        <form
            class="form"
            @submit.prevent="emit('submit')"
        >
            <label class="form__field">
                <textarea
                    ref="textareaRef"
                    v-model="inputValue"
                    class="form__input"
                    :disabled="isLoading"
                    placeholder="Отправьте сообщение TreskAI"
                    rows="1"
                    style="field-sizing: content;"
                    aria-label="Сообщение для TreskAI"
                    aria-multiline="true"
                    @keydown="handleKeyDown"
                    @input="handleInput"
                />
                <template v-if="!isLoading">
                    <UiButton
                        :size="32"
                        type="submit"
                        :disabled="!inputValue.trim()"
                        class="form__button"
                        :class="inputValue.trim() ? 'form__button--active' : ''"
                        aria-label="Отправить"
                    >
                        <UiIconPlane :size="16" />
                    </UiButton>
                </template>
                <template v-else>
                    <UiButton
                        :size="32"
                        type="button"
                        class="form__button form__button--stop"
                        aria-label="Остановить генерацию"
                        @click="$emit('cancel')"
                        @keydown.enter.prevent="$emit('cancel')"
                        @keydown.space.prevent="$emit('cancel')"
                    >
                        <UiIconStop :size="20" />
                    </UiButton>
                </template>
            </label>
        </form>
        <div class="caution">
            TreskAI может допускать ошибки. Проверяйте важную информацию.
        </div>
    </div>
</template>

<style lang="scss" scoped>
.thread {
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
        border-radius: rem(28);
        box-shadow:
            0 1px 1px rgb(0 0 0 / 6%),
            0 1px 2px rgb(0 0 0 / 10%);

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

        &--active,
        &--stop {
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

<script setup lang="ts">
interface Props {
    modelValue?: string
    isLoading: boolean
}

interface Emits {
    (e: 'update:modelValue', value: string): void
    (e: 'submit'): void
}

withDefaults(defineProps<Props>(), {
    modelValue: '',
})

const emit = defineEmits<Emits>()

defineExpose({ autoresize, getHeight })

const textareaRef = ref<HTMLTextAreaElement>()
const rootRef = ref<HTMLElement>()

function handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault()
        emit('submit')
    }
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
                    :value="modelValue"
                    class="form__input"
                    :disabled="isLoading"
                    placeholder="Отправьте сообщение TreskAI"
                    rows="1"
                    style="field-sizing: content;"
                    @keydown="handleKeyDown"
                    @input="(e: any) => emit('update:modelValue', e.target.value)"
                />
                <UiButton
                    :size="32"
                    type="submit"
                    :disabled="isLoading || !modelValue.trim()"
                    class="form__button"
                    :class="modelValue.trim() && !isLoading ? 'form__button--active' : ''"
                >
                    <UiIconPlane :size="16" />
                </UiButton>
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

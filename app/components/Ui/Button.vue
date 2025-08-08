<script setup lang="ts">
defineProps<{
    variant?: 'primary' | 'inverse'
    size: number
}>()
</script>

<template>
    <button
        type="button"
        class="button"
        :class="`button--${variant}`"
        :style="{ width: `${size / 16}rem`, height: `${size / 16}rem` }"
    >
        <slot />
    </button>
</template>

<style lang="scss" scoped>
.button {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    background-color: transparent;
    border-radius: rem(8);
    transition: all 0.3s ease-in-out;

    @media (any-hover: hover) {
        &:hover {
            background-color: $grayColor;
        }
    }

    &--inverse {
        color: rgb(255 255 255 / 70%);

        @media (any-hover: hover) {
            &:hover {
                color: $whiteColor;
                background-color: rgb(255 255 255 / 8%);
            }
        }
    }
}
</style>

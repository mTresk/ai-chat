<script setup lang="ts">
defineProps<{
  variant?: 'primary' | 'inverse'
  size: number
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}>()
</script>

<template>
  <button
    class="button"
    :class="`button--${variant}`"
    :style="{ width: `${size / 16}rem`, height: `${size / 16}rem` }"
    :type="type || 'button'"
    :disabled="disabled"
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
      background-color: var(--color-gray);
    }
  }

  &--inverse {
    color: var(--color-on-surface-inverse);

    @media (any-hover: hover) {
      &:hover {
        color: var(--color-white);
        background-color: var(--color-overlay-weak);
      }
    }
  }
}
</style>

<script setup lang="ts">
defineProps<{
    size?: 'small' | 'medium' | 'large'
    variant?: 'default' | 'inverse'
}>()
</script>

<template>
    <div
        class="logo"
        :class="{ 'logo--inverse': variant === 'inverse', 'logo--small': size === 'small', 'logo--medium': size === 'medium', 'logo--large': size === 'large' }"
    >
        <UiIconLogo :size="size === 'small' ? 20 : size === 'medium' ? 30 : 40" />
    </div>
</template>

<style lang="scss" scoped>
.logo {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: center;
    width: rem(60);
    height: rem(60);
    color: $whiteColor;
    background-color: $mainColor;
    border-radius: 50%;

    &--medium {
        width: rem(40);
        height: rem(40);
    }

    &--small {
        width: rem(30);
        height: rem(30);
    }

    &--inverse {
        color: $mainColor;
        background-color: $whiteColor;
    }
}
</style>

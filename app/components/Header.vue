<script setup lang="ts">
interface Emits {
    (e: 'openSidebar'): void
    (e: 'toggleSidebar'): void
    (e: 'newChat'): void
}

defineProps<{ title?: string }>()

defineEmits<Emits>()
</script>

<template>
    <header class="header">
        <UiTooltip
            text="Открыть меню"
            class="header__tooltip"
        >
            <UiButton
                :size="40"
                class="header__button"
                aria-label="Открыть меню"
                @click="$emit('openSidebar')"
                @keydown.enter.prevent="$emit('toggleSidebar')"
                @keydown.space.prevent="$emit('toggleSidebar')"
            >
                <UiIconBurger :size="24" />
            </UiButton>
        </UiTooltip>
        <NuxtLink
            class="header__title"
            to="/"
        >
            <UiLogo />
            {{ title || 'TreskAI' }}
        </NuxtLink>
        <UiTooltip
            text="Новый чат"
            placement="bottom-right"
        >
            <UiButton
                :size="40"
                class="header__new-chat"
                aria-label="Новый чат"
                @click="$emit('newChat')"
                @keydown.enter.prevent="$emit('newChat')"
                @keydown.space.prevent="$emit('newChat')"
            >
                <UiIconCreate :size="24" />
            </UiButton>
        </UiTooltip>
    </header>
</template>

<style lang="scss" scoped>
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
    pointer-events: none;

    @include adaptive-value('padding-block', 16, 12);

    @media (max-width: em(1400)) {
        background-color: var(--color-white);

        .scroll-down &,
        .scroll-up & {
            border-bottom: rem(1) solid var(--color-gray);
        }
    }

    &__tooltip {
        display: none;

        @media (max-width: $mobile) {
            display: block;
        }
    }

    &__button {
        display: none;
        align-items: center;
        justify-content: center;
        width: rem(40);
        height: rem(40);
        pointer-events: auto;
        background-color: transparent;
        border-radius: rem(8);
        transition: background-color 0.3s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: var(--color-gray);
            }
        }

        @media (max-width: $mobile) {
            display: flex;
        }
    }

    &__title {
        display: flex;
        gap: rem(8);
        align-items: center;
        pointer-events: auto;

        @include adaptive-value('font-size', 24, 18);
        @include adaptive-value('gap', 8, 6);
    }

    &__new-chat {
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: auto;
        background-color: transparent;
        border-radius: rem(8);
        transition: background-color 0.3s ease-in-out;

        @media (any-hover: hover) {
            &:hover {
                background-color: var(--color-gray);
            }
        }
    }
}
</style>

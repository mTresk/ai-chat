<script setup lang="ts">
defineProps<{
    size: number
}>()
</script>

<template>
    <svg
        :width="size"
        :height="size"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        aria-hidden="true"
    >
        <g>
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
            />
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
                transform="rotate(60 12 12)"
            />
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
                transform="rotate(120 12 12)"
            />
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
                transform="rotate(180 12 12)"
            />
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
                transform="rotate(240 12 12)"
            />
            <rect
                x="10.5"
                y="2"
                width="3"
                height="7"
                rx="1.5"
                transform="rotate(300 12 12)"
            />
            <polygon points="12,8.8 13.8,9.8 13.8,12.2 12,13.2 10.2,12.2 10.2,9.8" />
        </g>
    </svg>
</template>

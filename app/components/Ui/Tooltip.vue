<script setup lang="ts">
type Placement = 'top' | 'bottom' | 'left' | 'right'

interface Props {
    placement?: Placement
    text?: string
}

const props = withDefaults(defineProps<Props>(), {
    placement: 'bottom',
    text: '',
})

const rootRef = ref<HTMLElement>()
const triggerRef = ref<HTMLElement | null>(null)
const isVisible = ref(false)
const text = ref('')
const tooltipId = useId()

function findTriggerElement(root: HTMLElement | undefined | null): HTMLElement | null {
    if (!root) {
        return null
    }

    const candidate = root.firstElementChild as HTMLElement | null

    if (candidate) {
        return candidate
    }

    return root
}

function readAndStripTitleAttribute(el: HTMLElement | null): string {
    if (!el) {
        return ''
    }

    const raw = el.getAttribute('title') || ''

    if (raw) {
        el.removeAttribute('title')
    }

    return raw
}

function attachAriaDescribedBy(el: HTMLElement | null, id: string): void {
    if (!el) {
        return
    }

    const prev = el.getAttribute('aria-describedby')
    const next = prev ? `${prev} ${id}` : id
    el.setAttribute('aria-describedby', next)
}

function detachAriaDescribedBy(el: HTMLElement | null, id: string): void {
    if (!el) {
        return
    }

    const prev = el.getAttribute('aria-describedby')

    if (!prev) {
        return
    }

    const filtered = prev
        .split(' ')
        .filter(Boolean)
        .filter(token => token !== id)
        .join(' ')

    if (filtered) {
        el.setAttribute('aria-describedby', filtered)
    }
    else {
        el.removeAttribute('aria-describedby')
    }
}

function handleShow(): void {
    if (!text.value) {
        return
    }

    isVisible.value = true
}

function handleHide(): void {
    isVisible.value = false
}

function handleKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
        isVisible.value = false
    }
}

onMounted(() => {
    const root = rootRef.value
    triggerRef.value = findTriggerElement(root)
    text.value = props.text || readAndStripTitleAttribute(triggerRef.value)
    attachAriaDescribedBy(triggerRef.value, tooltipId)

    const mql = typeof window !== 'undefined' ? window.matchMedia('(hover: hover) and (pointer: fine)') : null
    const applyHoverCapability = () => {
        const allow = !!mql && mql.matches

        if (!triggerRef.value) {
            return
        }

        if (allow) {
            triggerRef.value.addEventListener('mouseenter', handleShow)
            triggerRef.value.addEventListener('mouseleave', handleHide)
            triggerRef.value.addEventListener('focus', handleShow)
            triggerRef.value.addEventListener('blur', handleHide)
            triggerRef.value.addEventListener('keydown', handleKeyDown)
        }
        else {
            triggerRef.value.removeEventListener('mouseenter', handleShow)
            triggerRef.value.removeEventListener('mouseleave', handleHide)
            triggerRef.value.removeEventListener('focus', handleShow)
            triggerRef.value.removeEventListener('blur', handleHide)
            triggerRef.value.removeEventListener('keydown', handleKeyDown)
            isVisible.value = false
        }
    }

    if (mql) {
        if (typeof mql.addEventListener === 'function') {
            mql.addEventListener('change', applyHoverCapability)
        }
        else if (typeof (mql as any).addListener === 'function') {
            ;(mql as any).addListener(applyHoverCapability)
        }
    }

    applyHoverCapability()
})

watch(
    () => props.text,
    (val) => {
        text.value = val ? String(val) : ''
    },
)

onBeforeUnmount(() => {
    detachAriaDescribedBy(triggerRef.value, tooltipId)

    if (triggerRef.value) {
        triggerRef.value.removeEventListener('mouseenter', handleShow)
        triggerRef.value.removeEventListener('mouseleave', handleHide)
        triggerRef.value.removeEventListener('focus', handleShow)
        triggerRef.value.removeEventListener('blur', handleHide)
        triggerRef.value.removeEventListener('keydown', handleKeyDown)
    }
})
</script>

<template>
    <div
        ref="rootRef"
        class="tooltip"
    >
        <slot />
        <div
            v-show="isVisible && text"
            :id="tooltipId"
            class="tooltip__content"
            :class="{
                'tooltip__content--top': props.placement === 'top',
                'tooltip__content--bottom': props.placement === 'bottom',
                'tooltip__content--left': props.placement === 'left',
                'tooltip__content--right': props.placement === 'right',
            }"
            role="tooltip"
        >
            {{ text }}
        </div>
    </div>
</template>

<style lang="scss" scoped>
.tooltip {
    position: relative;
    display: inline-flex;
}

.tooltip__content {
    position: absolute;
    z-index: 1000;
    max-width: rem(240);
    padding: rem(6) rem(8);
    font-size: rem(12);
    line-height: 1.2;
    color: $whiteColor;
    white-space: nowrap;
    pointer-events: none;
    background-color: $mainColor;
    border-radius: rem(6);
    box-shadow: 0 rem(2) rem(8) rgb(0 0 0 / 12%);
    opacity: 0;
    transform: translateY(0);
    transition:
        opacity 0.15s ease,
        transform 0.15s ease;

    &--top {
        bottom: calc(100% + #{rem(8)});
        left: 50%;
        opacity: 1;
        transform: translate(-50%, -#{rem(4)});
    }

    &--bottom {
        top: calc(100% + #{rem(8)});
        left: 50%;
        opacity: 1;
        transform: translate(-50%, #{rem(4)});
    }

    &--left {
        top: 50%;
        right: calc(100% + #{rem(8)});
        opacity: 1;
        transform: translate(-#{rem(4)}, -50%);
    }

    &--right {
        top: 50%;
        left: calc(100% + #{rem(8)});
        opacity: 1;
        transform: translate(#{rem(4)}, -50%);
    }
}
</style>

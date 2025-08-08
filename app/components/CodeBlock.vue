<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import makefile from 'highlight.js/lib/languages/makefile'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'
import yaml from 'highlight.js/lib/languages/yaml'

interface Props {
    code: string
    language?: string
}

const props = withDefaults(defineProps<Props>(), {
    language: 'plaintext',
})

hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('typescript', typescript)
hljs.registerLanguage('python', python)
hljs.registerLanguage('php', php)
hljs.registerLanguage('html', xml)
hljs.registerLanguage('xml', xml)
hljs.registerLanguage('vue', xml)
hljs.registerLanguage('css', css)
hljs.registerLanguage('json', json)
hljs.registerLanguage('bash', bash)
hljs.registerLanguage('sql', sql)
hljs.registerLanguage('yaml', yaml)
hljs.registerLanguage('makefile', makefile)
hljs.registerLanguage('dockerfile', dockerfile)
hljs.registerLanguage('plaintext', plaintext)

const codeId = `code_${Math.random().toString(36).substr(2, 9)}`
const isCopied = ref(false)

async function copyCode() {
    try {
        await navigator.clipboard.writeText(props.code)

        isCopied.value = true

        setTimeout(() => {
            isCopied.value = false
        }, 2000)
    }
    catch (err) {
        console.error('Failed to copy code:', err)
    }
}

onMounted(() => {
    nextTick(() => {
        const codeElement = document.getElementById(codeId)

        if (codeElement) {
            hljs.highlightElement(codeElement)
        }
    })
})
</script>

<template>
    <div class="code-block">
        <div class="code-block__header">
            <span class="code-block__label">{{ language }}</span>
            <button
                class="code-block__copy"
                :class="{ 'code-block__copy--copied': isCopied }"
                type="button"
                title="Скопировать код"
                aria-label="Скопировать код"
                @click="copyCode"
            >
                {{ isCopied ? '✅ Скопировано!' : '📋 Копировать' }}
            </button>
        </div>
        <pre class="code-block__pre">
            <code
                :id="codeId"
                :class="`language-${language}`"
                class="code-block__code"
            >{{ code }}</code>
        </pre>
    </div>
</template>

<style lang="scss" scoped>
.code-block {
    position: relative;
    margin-block: rem(16);
    overflow: hidden;
    background-color: $grayColor;
    border: rem(1) solid $darkColor;
    border-radius: rem(12);
    box-shadow: 0 rem(1) rem(2) rgb(0 0 0 / 6%);

    &__header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: rem(12) rem(16);
        background-color: $grayColor;
        border-bottom: rem(1) solid $darkColor;
    }

    &__label {
        font-size: rem(14);
        font-weight: 600;
        color: $mainColor;
        text-transform: uppercase;
        letter-spacing: 0.04em;
    }

    &__copy {
        padding: rem(6) rem(12);
        font-size: rem(14);
        font-weight: 500;
        color: $mainColor;
        background-color: $whiteColor;
        border: rem(1) solid $darkColor;
        border-radius: rem(8);
        box-shadow: 0 rem(1) rem(2) rgb(0 0 0 / 6%);
        transition:
            background-color 0.2s ease,
            color 0.2s ease,
            border-color 0.2s ease;

        @media (any-hover: hover) {
            &:hover {
                background-color: $grayColor;
            }
        }

        &--copied {
            color: $blueColor;
            background-color: $grayColor;
            border-color: $blueColor;
        }
    }

    &__pre {
        padding: rem(16);
        overflow-x: auto;
        background-color: $whiteColor;
    }

    &__code {
        font-size: rem(14);
        line-height: 1.6;
    }
}
</style>

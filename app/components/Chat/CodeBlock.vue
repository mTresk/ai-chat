<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import c from 'highlight.js/lib/languages/c'
import cpp from 'highlight.js/lib/languages/cpp'
import csharp from 'highlight.js/lib/languages/csharp'
import css from 'highlight.js/lib/languages/css'
import dockerfile from 'highlight.js/lib/languages/dockerfile'
import go from 'highlight.js/lib/languages/go'
import java from 'highlight.js/lib/languages/java'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import makefile from 'highlight.js/lib/languages/makefile'
import markdown from 'highlight.js/lib/languages/markdown'
import php from 'highlight.js/lib/languages/php'
import plaintext from 'highlight.js/lib/languages/plaintext'
import python from 'highlight.js/lib/languages/python'
import ruby from 'highlight.js/lib/languages/ruby'
import rust from 'highlight.js/lib/languages/rust'
import sql from 'highlight.js/lib/languages/sql'
import swift from 'highlight.js/lib/languages/swift'
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
hljs.registerLanguage('markdown', markdown)
hljs.registerLanguage('java', java)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('go', go)
hljs.registerLanguage('csharp', csharp)
hljs.registerLanguage('rust', rust)
hljs.registerLanguage('ruby', ruby)
hljs.registerLanguage('swift', swift)
hljs.registerLanguage('c', c)

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
        <div class="code-block__bar">
            <div class="code-block__lang">
                {{ language }}
            </div>
            <div class="code-block__tools">
                <div class="code-block__actions">
                    <button
                        class="code-block__action"
                        type="button"
                        aria-label="Копировать"
                        @click="copyCode"
                    >
                        <UiIconCopy
                            v-if="!isCopied"
                            :size="14"
                        />
                        <UiIconCheck
                            v-else
                            :size="14"
                        />
                        <span class="code-block__action-text">{{ isCopied ? 'Скопировано' : 'Копировать' }}</span>
                    </button>
                </div>
            </div>
        </div>
        <div class="code-block__body">
            <code
                :id="codeId"
                :class="`language-${language}`"
                class="code-block__code"
            >{{ code }}</code>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.code-block {
    position: relative;
    max-width: 100%;
    padding: rem(16);
    margin-block: rem(16);
    contain: inline-size;
    overflow: hidden;
    background-color: $grayColor;
    border-radius: rem(16);

    &__bar {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: rem(16);
    }

    &__lang {
        font-size: rem(14);
        color: $mainColor;
        text-transform: lowercase;
    }

    &__action {
        display: flex;
        gap: rem(6);
        align-items: center;
        color: inherit;
    }

    &__action-text {
        font-size: rem(14);
        line-height: 1;
        user-select: none;
    }

    &__code {
        display: block;
        max-width: 100%;
        overflow-y: auto;
        font-size: rem(14);
        line-height: 145%;
        overflow-wrap: normal;
        white-space: pre;
        background-color: $grayColor;

        @include hide-scroll;
    }
}
</style>

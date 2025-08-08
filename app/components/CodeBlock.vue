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
    <div class="relative bg-gray-50 rounded-xl my-4 overflow-hidden border border-gray-200 shadow-sm">
        <div class="flex justify-between items-center px-4 py-3 bg-gray-100 border-b border-gray-200">
            <span class="text-sm font-semibold text-gray-800 uppercase tracking-wide">
                {{ language }}
            </span>
            <button
                class="text-sm px-3 py-1.5 rounded-lg border transition-all duration-200 font-medium shadow-sm"
                :class="isCopied
                    ? 'bg-green-100 text-green-700 border-green-300'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                @click="copyCode"
            >
                {{ isCopied ? '✅ Скопировано!' : '📋 Копировать' }}
            </button>
        </div>
        <pre class="p-4 overflow-x-auto bg-white"><code
            :id="codeId"
            :class="`language-${language}`"
            class="text-sm leading-relaxed"
        >{{ code }}</code></pre>
    </div>
</template>

import antfu from '@antfu/eslint-config'

export default antfu({
    stylistic: {
        indent: 4,
        quotes: 'single',
    },
    formatters: {
        css: true,
    },
    rules: {
        'node/prefer-global/process': 0,
        'vue/max-attributes-per-line': ['error', {
            singleline: {
                max: 1,
            },
            multiline: {
                max: 1,
            },
        }],
        'curly': 1,
    },
    ignores: [
        'docker-compose.yml',
    ],
})

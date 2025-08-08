import OpenAI from 'openai'

const config = useRuntimeConfig()
const token = config.githubToken
const endpoint = config.endpoint
const model = config.model

const client = new OpenAI({
    apiKey: token,
    baseURL: endpoint,
})

export default defineEventHandler(async (event) => {
    try {
        const body = await readBody(event)

        const messages: Array<{ role: 'system' | 'user' | 'assistant', content: string }> = [
            { role: 'system', content: 'Ты - умный помощник, который отвечает на вопросы пользователя. Внимательно анализируй всю историю беседы и поддерживай непрерывный диалог. Помни все детали из предыдущих сообщений и используй их для более точных и персонализированных ответов.' },
        ]

        if (body.messages && Array.isArray(body.messages)) {
            body.messages.forEach((msg: any) => {
                const role = msg.role === 'ai' ? 'assistant' : msg.role
                if (role === 'user' || role === 'assistant') {
                    messages.push({
                        role,
                        content: msg.content,
                    })
                }
            })
        }

        const response = await client.chat.completions.create({
            model,
            messages,
            temperature: 1.0,
            top_p: 1.0,
        })

        return response
    }
    catch (error: any) {
        console.error('API Error:', error)

        throw createError({
            statusCode: error?.status || 500,
            statusMessage: error?.message || 'Internal Server Error',
            data: {
                message: error?.message || 'Произошла ошибка при обработке запроса',
                details: error?.response?.data || error?.data || null,
            },
        })
    }
})

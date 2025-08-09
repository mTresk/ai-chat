import MarkdownIt from 'markdown-it'

let md: any | null = null

export function formatTextContent(content: string): string {
    if (!md) {
        md = new MarkdownIt({
            html: false,
            linkify: true,
            breaks: true,
            typographer: true,
        })
    }

    return md.render(String(content || ''))
}

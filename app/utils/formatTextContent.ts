const WRAPPER_STYLE = 'line-height:1.6;color:#221f1d;'
const PARAGRAPH_STYLE = 'margin:0 0 0.75rem 0;'
const STRONG_STYLE = 'font-weight:600;color:#221f1d;'
const EM_STYLE = 'font-style:italic;color:#221f1d;opacity:0.9;'
const CODE_STYLE = 'padding:0.125rem 0.375rem;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,\'Liberation Mono\',\'Courier New\',monospace;font-size:0.95rem;color:#221f1d;background-color:#f4f4f4;border-radius:0.375rem;'

export function formatTextContent(content: string): string {
    return content
        // bold **text**
        .replace(/\*\*(.+?)\*\*/g, `<strong style="${STRONG_STYLE}">$1</strong>`)
        // italic *text*
        .replace(/\*(.+?)\*/g, `<em style="${EM_STYLE}">$1</em>`)
        // inline code `code`
        .replace(/`(.+?)`/g, `<code style="${CODE_STYLE}">$1</code>`)
        // paragraphs and line breaks
        .replace(/\n\n/g, `</p><p style="${PARAGRAPH_STYLE}">`)
        .replace(/\n/g, '<br>')
        // wrapper
        .replace(/^/, `<div style="${WRAPPER_STYLE}"><p style="${PARAGRAPH_STYLE}">`)
        .replace(/$/, '</p></div>')
}

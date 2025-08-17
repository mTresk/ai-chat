export function parseMessage(content: string) {
  const parts: Array<{ type: 'text' | 'code', content: string, language?: string }> = []
  const codeBlockRegex = /```[\s\S]*?```/g
  let lastIndex = 0
  let match

  // eslint-disable-next-line no-cond-assign
  while ((match = codeBlockRegex.exec(content)) !== null) {
    if (!match || typeof match.index !== 'number') {
      continue
    }

    if (match.index > lastIndex) {
      const textContent = content.slice(lastIndex, match.index)
      if (textContent.trim()) {
        parts.push({ type: 'text', content: textContent })
      }
    }

    const lines = match[0]?.split('\n') || []
    const firstLine = lines[0]?.replace('```', '') || ''
    const language = firstLine.trim() || 'plaintext'
    const code = lines.slice(1, -1).join('\n').trim()

    parts.push({ type: 'code', content: code, language })
    lastIndex = match.index + match[0].length
  }

  if (lastIndex < content.length) {
    const textContent = content.slice(lastIndex)

    if (textContent.trim()) {
      parts.push({ type: 'text', content: textContent })
    }
  }

  if (parts.length === 0) {
    parts.push({ type: 'text', content })
  }

  return parts
}

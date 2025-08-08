export function formatTextContent(content: string): string {
    return content
        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-gray-900">$1</strong>')
        .replace(/\*(.*?)\*/g, '<em class="italic text-gray-800">$1</em>')
        .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-2 py-1 rounded-md text-sm font-mono text-gray-800 border">$1</code>')
        .replace(/\n\n/g, '</p><p class="mb-4">')
        .replace(/\n/g, '<br>')
        .replace(/^/, '<div class="text-gray-900 leading-relaxed"><p class="mb-4">')
        .replace(/$/, '</p></div>')
}

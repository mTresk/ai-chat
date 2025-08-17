<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const chats = useChats()
const currentChat = useCurrentChat()
const isLoading = useIsLoading()
const { loadChats, selectChat } = useChat(chats, currentChat)
const { sendMessage, retryMessage, cancel } = useMessage(chats, currentChat, isLoading)

async function ensureChatLoaded() {
  const chatId = String(route.params.id || '')

  if (!chatId) {
    return
  }

  if (currentChat.value?.id === chatId) {
    return
  }

  if (!chats.value.length) {
    await loadChats()
  }

  await selectChat(chatId)

  if (!currentChat.value) {
    router.replace('/')
  }
}

function scrollToPageBottom(smooth = false): void {
  if (typeof window === 'undefined') {
    return
  }

  const scrollingElement = document.scrollingElement || document.documentElement

  window.scrollTo({ top: scrollingElement.scrollHeight, behavior: smooth ? 'smooth' : 'auto' })
}

onMounted(async () => {
  await ensureChatLoaded()
  await nextTick()

  requestAnimationFrame(() => scrollToPageBottom())
})

watch(
  () => route.params.id,
  async () => {
    await ensureChatLoaded()
    await nextTick()

    requestAnimationFrame(() => scrollToPageBottom())
  },

)

watch(
  () => currentChat.value?.messages,
  () => nextTick(() => scrollToPageBottom()),
  { deep: true },
)

watch(
  () => isLoading.value,
  () => nextTick(() => scrollToPageBottom()),
)
</script>

<template>
  <Chat
    v-if="currentChat"
    :key="currentChat.id"
    :messages="currentChat.messages"
    :is-loading="isLoading"
    @send-message="sendMessage"
    @retry-message="retryMessage"
    @cancel="cancel"
  />
</template>

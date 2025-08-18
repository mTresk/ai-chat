<script setup lang="ts">
const router = useRouter()
const chats = useChats()
const currentChat = useCurrentChat()
const sidebarCollapsed = useSidebarCollapsedState()
const sidebarOpened = useSidebarOpenedState()
const { chatStorage: _chatStorage, initStorage } = useChatStorage()
const { loadChats, createChat, deleteChat } = useChat(chats, currentChat)
const { toggleSidebar, openSidebar, closeSidebar, initSidebarState } = useSidebar(sidebarCollapsed, sidebarOpened)
const { direction } = useScrollDirection()

async function handleNewChat(): Promise<void> {
  await createChat()

  if (currentChat.value?.id) {
    router.push(`/chat/${currentChat.value.id}`)
  }
}

const scrollClass = computed(() => {
  if (direction.value === 'down') {
    return 'scroll-down'
  }

  if (direction.value === 'up') {
    return 'scroll-up'
  }

  return ''
})

onMounted(async () => {
  try {
    await initStorage()
    await loadChats()

    try {
      initSidebarState()
    }
    catch {}
  }
  catch (error) {
    console.error('Ошибка при инициализации приложения:', error)
  }
})

useHead({
  htmlAttrs: {
    lang: 'ru',
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} — Tresk AI` : 'TreskAI - Умный чат-ассистент'
  },
})
</script>

<template>
  <NuxtPwaManifest />
  <Head>
    <Meta
      name="viewport"
      content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0"
    />
    <Meta
      name="description"
      content="TreskAI - современный чат-ассистент на основе искусственного интеллекта"
    />
    <link
      rel="icon"
      type="image/png"
      href="/favicon-96x96.png"
      sizes="96x96"
    >
    <link
      rel="icon"
      type="image/svg+xml"
      href="/favicon.svg"
    >
    <link
      rel="shortcut icon"
      href="/favicon.ico"
    >
    <link
      rel="apple-touch-icon"
      sizes="180x180"
      href="/apple-touch-icon.png"
    >
  </Head>
  <div
    class="wrapper"
    :class="scrollClass"
  >
    <Sidebar
      :chats="chats"
      :current-chat-id="currentChat?.id"
      :is-collapsed="sidebarCollapsed"
      :is-opened="sidebarOpened"
      @new-chat="handleNewChat"
      @delete-chat="deleteChat"
      @toggle-sidebar="toggleSidebar"
      @close-sidebar="closeSidebar"
    />
    <div class="inner">
      <Header
        title="TreskAI"
        @open-sidebar="openSidebar"
        @toggle-sidebar="toggleSidebar"
        @new-chat="handleNewChat"
      />
      <div class="page">
        <slot />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  position: relative;
  display: flex;
  height: 100%;
  min-height: 100dvh;
}

.inner {
  display: flex;
  flex: 1;
  flex-direction: column;

  @include adaptive-value('gap', 40, 20);
}

.page {
  position: relative;
  display: flex;
  flex-direction: column;
  gap: rem(40);
  justify-content: space-between;
  width: 100%;
  max-width: rem(860);
  height: 100%;
  padding-inline: rem(20);
  margin-inline: auto;
  background-color: var(--color-white);
}
</style>

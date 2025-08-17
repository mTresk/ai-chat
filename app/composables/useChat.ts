import type { Chat } from '@/types'

export function useChat(chats: Ref<Chat[]>, currentChat: Ref<Chat | null>) {
  const { chatStorage } = useChatStorage()

  const loadChats = async (): Promise<void> => {
    try {
      chats.value = await chatStorage.getAllChats()
    }
    catch (error) {
      console.error('Failed to load chats:', error)
    }
  }

  const createChat = async (): Promise<void> => {
    try {
      const newChat = await chatStorage.createNewChat()

      chats.value.unshift(newChat)
      currentChat.value = newChat
    }
    catch (error) {
      console.error('Failed to create new chat:', error)
    }
  }

  const selectChat = async (chatId: string): Promise<void> => {
    try {
      const chat = await chatStorage.getChat(chatId)

      currentChat.value = chat || null
    }
    catch (error) {
      console.error('Failed to select chat:', error)
    }
  }

  const deleteChat = async (chatId: string): Promise<void> => {
    try {
      await chatStorage.deleteChat(chatId)

      chats.value = chats.value.filter(chat => chat.id !== chatId)

      if (currentChat.value?.id === chatId) {
        if (chats.value.length > 0) {
          currentChat.value = chats.value[0] || null
        }
        else {
          await createChat()
        }
      }
    }
    catch (error) {
      console.error('Failed to delete chat:', error)
    }
  }

  return {
    loadChats,
    createChat,
    selectChat,
    deleteChat,
  }
}

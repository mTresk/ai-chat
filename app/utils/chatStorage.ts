import type { Chat } from '@/types'

const DB_NAME = 'TreskAI_Chats'
const DB_VERSION = 1
const STORE_NAME = 'chats'

class ChatStorage {
    private db: IDBDatabase | null = null

    async init(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!('indexedDB' in window)) {
                reject(new Error('IndexedDB не поддерживается в этом браузере'))
                return
            }

            const request = indexedDB.open(DB_NAME, DB_VERSION)

            request.onerror = () => {
                reject(new Error('Failed to open IndexedDB'))
            }

            request.onsuccess = () => {
                this.db = request.result
                resolve()
            }

            request.onupgradeneeded = (event) => {
                const db = (event.target as IDBOpenDBRequest).result

                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' })
                    store.createIndex('updatedAt', 'updatedAt', { unique: false })
                    store.createIndex('createdAt', 'createdAt', { unique: false })
                }
            }
        })
    }

    async saveChat(chat: Chat): Promise<void> {
        if (!this.db) {
            await this.init()
        }

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'))
                return
            }

            const transaction = this.db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const chatToSave = {
                ...chat,
                updatedAt: new Date().toISOString(),
                createdAt: chat.createdAt.toISOString(),
                messages: chat.messages.map(msg => ({
                    ...msg,
                    timestamp: msg.timestamp.toISOString(),
                })),
            }
            const request = store.put(chatToSave)

            request.onerror = () => {
                reject(new Error('Failed to save chat'))
            }

            request.onsuccess = () => {
                resolve()
            }
        })
    }

    async getChat(id: string): Promise<Chat | null> {
        if (!this.db) {
            await this.init()
        }

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'))
                return
            }

            const transaction = this.db.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.get(id)

            request.onerror = () => {
                reject(new Error('Failed to get chat'))
            }

            request.onsuccess = () => {
                const result = request.result
                if (result) {
                    result.createdAt = new Date(result.createdAt)
                    result.updatedAt = new Date(result.updatedAt)
                    result.messages = result.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    }))
                }
                resolve(result || null)
            }
        })
    }

    async getAllChats(): Promise<Chat[]> {
        if (!this.db) {
            await this.init()
        }

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'))
                return
            }

            const transaction = this.db.transaction([STORE_NAME], 'readonly')
            const store = transaction.objectStore(STORE_NAME)
            const index = store.index('updatedAt')
            const request = index.openCursor(null, 'prev')
            const chats: Chat[] = []

            request.onerror = () => {
                reject(new Error('Failed to get chats'))
            }

            request.onsuccess = () => {
                const cursor = request.result
                if (cursor) {
                    const chat = cursor.value
                    chat.createdAt = new Date(chat.createdAt)
                    chat.updatedAt = new Date(chat.updatedAt)
                    chat.messages = chat.messages.map((msg: any) => ({
                        ...msg,
                        timestamp: new Date(msg.timestamp),
                    }))
                    chats.push(chat)
                    cursor.continue()
                }
                else {
                    resolve(chats)
                }
            }
        })
    }

    async deleteChat(id: string): Promise<void> {
        if (!this.db) {
            await this.init()
        }

        return new Promise((resolve, reject) => {
            if (!this.db) {
                reject(new Error('Database not initialized'))
                return
            }

            const transaction = this.db.transaction([STORE_NAME], 'readwrite')
            const store = transaction.objectStore(STORE_NAME)
            const request = store.delete(id)

            request.onerror = () => {
                reject(new Error('Failed to delete chat'))
            }

            request.onsuccess = () => {
                resolve()
            }
        })
    }

    async createNewChat(title?: string): Promise<Chat> {
        const now = new Date()
        const chat: Chat = {
            id: `chat_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            title: title || 'Новый чат',
            messages: [],
            createdAt: now,
            updatedAt: now,
        }

        await this.saveChat(chat)

        return chat
    }

    generateChatTitle(firstMessage: string): string {
        const maxLength = 50
        const cleanMessage = firstMessage.trim()

        if (cleanMessage.length <= maxLength) {
            return cleanMessage
        }

        return `${cleanMessage.substring(0, maxLength - 3)}...`
    }

    async updateChatTitle(chatId: string, title: string): Promise<void> {
        const chat = await this.getChat(chatId)

        if (chat) {
            chat.title = title
            await this.saveChat(chat)
        }
    }
}

export const chatStorage = new ChatStorage()

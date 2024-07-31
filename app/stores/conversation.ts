import { Store } from '@tauri-apps/plugin-store'

interface Conversation {
  title: string
  createTime: number
  updateTime: number
  messages: Message[]
}

export const useConversationStore = defineStore('conversation', () => {
  const store = new Store('store.bin.conversations')
  const conversations = ref<Conversation[]>([])

  store.values<Conversation>().then((values) => {
    conversations.value = values
  })

  return {
    conversations,
  }
})

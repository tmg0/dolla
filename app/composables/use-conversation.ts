import { Store } from '@tauri-apps/plugin-store'

interface Conversation {
  title: string
  createTime: number
  updateTime: number
  messages: Message[]
}

export function useConversations() {
  const store = new Store('store.bin.conversations')
  const conversations = ref<Conversation[]>([])

  onMounted(async () => {
    conversations.value = await store.values()
  })

  function create(content?: MaybeRef<string>) {
    const now = Date.now()
    const messages = []
    if (unref(content))
      messages.push({ role: 'user', content: unref(content) })
    conversations.value.push({ title: 'New Chat', updateTime: now, createTime: now, messages })
    store.set(String(now), conversations.value)
  }

  return {
    store,
    conversations,
    create
  }
}

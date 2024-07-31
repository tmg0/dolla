import { Store } from '@tauri-apps/plugin-store'

interface Conversation {
  title: string
  createTime: number
  updateTime: number
  messages: Message[]
}

interface ChatOptions {
  onChange?: () => void
}

export function useConversations() {
  const store = new Store('store.bin.conversations')
  const conversations = ref<Conversation[]>([])
  const isFetching = ref(false)
  const { chat: oChat, abort: oAbort } = useOllama()

  onMounted(async () => {
    conversations.value = await store.values()
  })

  async function create(content?: MaybeRef<string>, options: ChatOptions = {}) {
    const now = Date.now()
    conversations.value.unshift({ title: '', updateTime: now, createTime: now, messages: [] })
    const item = conversations.value[0]!
    if (unref(content)) {
      await chat(content, item, options)
      await nextTick()
      await summarize(conversations.value[0]!)
    }
    store.set(String(now), item)
  }

  async function chat(content: MaybeRef<string | undefined>, item: Conversation, options: ChatOptions = {}) {
    if (isFetching.value || !unref(content))
      return
    isFetching.value = true
    item.messages.push({ role: 'user', content: unref(content) })
    store.set(String(item.createTime), item)
    if (isRef(content))
      content.value = ''
    options.onChange?.()
    const response = await oChat(item.messages)
    item.messages.push({ role: 'assistant', content: '' })
    for await (const part of response) {
      item.messages.at(-1)!.content += part.message.content
      options.onChange?.()
    }
    isFetching.value = false
    store.set(String(item.createTime), item)
  }

  async function summarize(item: Conversation) {
    const [_m] = item.messages
    const messages: Message[] = [{ role: 'user', content: `---BEGIN Conversation---\n${_m.content}\n---END Conversation---\nSummarize the conversation in 5 words or fewer:` }]
    const response = await oChat(messages)
    item.title = ''
    for await (const part of response)
      item.title += part.message.content
  }

  function abort() {
    oAbort()
    isFetching.value = false
  }

  async function remove(index: MaybeRef<number>) {
    const _i = unref(index)
    const item = conversations.value[_i]
    if (!item)
      return
    conversations.value.splice(_i, 1)
    await store.delete(String(item.createTime))
  }

  return {
    store,
    isFetching,
    conversations,
    create,
    chat,
    abort,
    remove,
  }
}

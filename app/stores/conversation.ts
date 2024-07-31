import type { Message as OMessage } from 'ollama/browser'

interface CreateOptions {
  afterCreate?: (c: Conversation) => void
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const { isReady, findMany, deleteMany } = useSqlite()
  const { chat: oChat } = useOllamaStore()
  const { createAndReturn, update } = useSqlite()
  const { messages, chat } = useMessageStore()

  until(isReady).toBe(true).then(fetch)

  async function fetch() {
    conversations.value = (await findMany<Conversation>('conversations')) ?? []
  }

  async function create(content: MaybeRef<string>, options: CreateOptions = {}) {
    const ctx = await createAndReturn<Conversation>('conversations', { data: { title: '' } })
    if (!ctx)
      return
    options.afterCreate?.(ctx)
    await chat(content, ctx)
    await summarize(messages, ctx)
    await fetch()
  }

  async function removeItem(id: MaybeRef<number>) {
    await deleteMany('conversations', { where: { id: unref(id) } })
    deleteMany('messages', { where: { conversation_id: unref(id) } })
    fetch()
  }

  async function summarize(m: Message[], ctx: Conversation) {
    const content = m.map(({ content }) => content).join(', ')
    const messages: OMessage[] = [{ role: 'user', content: `---BEGIN Conversation---\n${unref(content)}\n---END Conversation---\nSummarize the conversation in 5 words or fewer:` }]
    const response = await oChat(messages)
    ctx.title = ''
    for await (const part of response)
      ctx.title += part.message.content
    update('conversations', { data: { title: ctx.title }, where: { id: ctx.id } })
  }

  return {
    conversations,
    create,
    removeItem,
  }
})

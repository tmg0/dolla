interface CreateOptions {
  afterCreate?: (c: Conversation) => void | Promise<void>
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const { isReady, findMany, deleteMany } = useSqlite()
  const { generate } = useOllamaStore()
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
    await options.afterCreate?.(ctx)
    await fetch()
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
    const item = conversations.value.find(({ id }) => id === ctx.id)
    if (!item)
      return
    const txt = m.map(({ content }) => content).join('\n')
    const prompt = `---BEGIN Conversation---\n${unref(txt)}\n---END Conversation---\nSummarize the conversation in 5 words or fewer:`
    const { response } = await generate(prompt)
    item.title = response
    update('conversations', { data: { title: item.title }, where: { id: item.id } })
  }

  return {
    conversations,
    create,
    removeItem,
  }
})

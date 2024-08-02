interface CreateOptions {
  afterCreate?: (c: Conversation) => void | Promise<void>
}

interface Value {
  content: MaybeRef<string | undefined>
  images?: MaybeRef<string[] | Uint8Array[]>
}

export const useConversationStore = defineStore('conversation', () => {
  const conversations = ref<Conversation[]>([])
  const { isReady, findMany, deleteMany } = useSqlite()
  const { generate } = useOllamaStore()
  const { createAndReturn, update } = useSqlite()
  const { chat } = useMessageStore()

  until(isReady).toBe(true).then(fetch)

  async function fetch() {
    conversations.value = (await findMany<Conversation>('conversations')) ?? []
  }

  async function create({ content, images }: Value, options: CreateOptions = {}) {
    const ctx = await createAndReturn<Conversation>('conversations', { data: { title: '' } })
    if (!ctx)
      return
    await options.afterCreate?.(ctx)
    await fetch()
    let prompt = `user: ${unref(content)}\n`
    const response = await chat({ content, images }, ctx)
    if (response)
      prompt += `assistant: ${response}`
    await summarize(prompt, ctx)
    await fetch()
  }

  async function removeItem(id: MaybeRef<number>) {
    await deleteMany('conversations', { where: { id: unref(id) } })
    deleteMany('messages', { where: { conversation_id: unref(id) } })
    fetch()
  }

  async function summarize(prompt: MaybeRef<string>, ctx: Conversation) {
    const item = conversations.value.find(({ id }) => id === ctx.id)
    if (!item)
      return
    const query = `---BEGIN Conversation---\n${unref(prompt)}\n---END Conversation---\nSummarize the conversation in 5 words or fewer:`
    const { response } = await generate(query)
    item.title = response
    update('conversations', { data: { title: item.title }, where: { id: item.id } })
  }

  return {
    conversations,
    create,
    removeItem,
  }
})

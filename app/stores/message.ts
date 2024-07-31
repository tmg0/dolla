export const useMessageStore = defineStore('message', () => {
  const conversationId = useRouteParams('id', '', { transform: val => val ? Number(val) : undefined })
  const messages = ref<Message[]>([])
  const isFetching = ref(false)
  const { isReady, create, findMany } = useSqlite()
  const { chat: oChat, abort: oAbort } = useOllamaStore()
  const isNew = computed(() => !conversationId.value)

  watch(conversationId, async (id) => {
    if (!id)
      return
    await until(isReady).toBe(true)
    const query = { where: { conversation_id: id } }
    messages.value = (await findMany<Message>('messages', query)) ?? []
  }, { immediate: true })

  async function chat(content: MaybeRef<string | undefined>, ctx?: Conversation) {
    const _id = ctx?.id ?? conversationId.value
    if (isFetching.value || !unref(content) || !_id)
      return
    isFetching.value = true
    const data: any = { role: 'user', content: unref(content) ?? '', conversation_id: _id }
    messages.value.push(data)
    create('messages', { data })
    if (isRef(content))
      content.value = ''
    const response = await oChat(messages.value)
    messages.value.push({ role: 'assistant', content: '', conversation_id: _id })
    for await (const part of response) {
      messages.value.at(-1)!.content += part.message.content
    }
    create('messages', { data: messages.value.at(-1) as any })
    isFetching.value = false
  }

  function abort() {
    oAbort()
    isFetching.value = false
  }

  return {
    messages,
    isFetching,
    isNew,
    chat,
    abort,
  }
})

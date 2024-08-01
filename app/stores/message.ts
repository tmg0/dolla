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
    messages.value = await _fetch(id)
  }, { immediate: true })

  async function chat(content: MaybeRef<string | undefined>, ctx?: Conversation) {
    const _id = ctx?.id ?? conversationId.value
    if (isFetching.value || !unref(content) || !_id)
      return
    isFetching.value = true
    const data: any = { role: 'user', content: unref(content) ?? '', conversation_id: _id, images: [] }
    messages.value.push(data)
    _insert(data)
    if (isRef(content))
      content.value = ''
    const response = await oChat(messages)
    messages.value.push({ role: 'assistant', content: '', conversation_id: _id })
    for await (const part of response) {
      messages.value.at(-1)!.content += part.message.content
    }
    _insert(messages.value.at(-1) as any)
    isFetching.value = false
    return messages.value.at(-1)!.content
  }

  function abort() {
    oAbort()
    isFetching.value = false
  }

  async function _insert(message: Message) {
    const data = {
      role: message.role,
      content: _encode(message.content),
      conversation_id: message.conversation_id,
    }

    await create('messages', { data })
  }

  async function _fetch(id: number) {
    const query = { where: { conversation_id: id } }
    const response = (await findMany<Message>('messages', query)) ?? []
    return response.map(item => ({ ...item, content: _decode(item.content) }))
  }

  function _encode(value: string) {
    return btoa(encodeURIComponent(value))
  }

  function _decode(value: string) {
    return decodeURIComponent(atob(value))
  }

  return {
    messages,
    isFetching,
    isNew,
    chat,
    abort,
  }
})

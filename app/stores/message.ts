import { klona } from 'klona/json'
import { destr } from 'destr'

interface Value {
  content: MaybeRef<string | undefined>
  images?: MaybeRef<string[] | Uint8Array[]>
}

export const useMessageStore = defineStore('message', () => {
  const conversationId = useRouteParams('id', '', { transform: val => val ? Number(val) : undefined })
  const messages = ref<Message[]>([])
  const isFetching = ref(false)
  const { isReady, create, findMany } = useSqlite()
  const { chat: oChat, abort: oAbort } = useOllamaStore()
  const isNew = computed(() => !conversationId.value)

  watch(conversationId, async (id) => {
    messages.value = []
    abort()
    if (!id)
      return
    await until(isReady).toBe(true)
    messages.value = await _fetch(id)
  }, { immediate: true })

  async function chat(value: Value, ctx?: Conversation) {
    const _id = ctx?.id ?? conversationId.value
    if (isFetching.value || !unref(value.content) || !_id)
      return
    isFetching.value = true
    const images = value.images ? klona(unref(value.images)) : []
    const data: any = { role: 'user', content: unref(value.content) ?? '', conversation_id: _id, images }
    messages.value.push(data)
    _insert(data)
    if (isRef(value.content))
      value.content.value = ''
    if (isRef(value.images))
      value.images.value = []
    const response = await oChat(messages, {
      afterToolCalling(r) {
        const _m = { role: 'tool', content: r, conversation_id: _id }
        messages.value.push(_m)
        _insert(_m)
      },
    })
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
      images: message.images ? _encode(JSON.stringify(message.images ?? [])) : '',
      conversation_id: message.conversation_id,
    }

    await create('messages', { data })
  }

  async function _fetch(id: number) {
    const query = { where: { conversation_id: id } }
    const response = (await findMany<Message & { images: string }>('messages', query)) ?? []

    return response.map(item => ({
      ...item,
      content: _decode(item.content),
      images: parseImages(_decode(item.images)),
    }))
  }

  function parseImages(value?: string): string[] {
    if (!value)
      return []

    try {
      return destr<string[]>(value).filter(Boolean)
    }
    catch {
      return []
    }
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

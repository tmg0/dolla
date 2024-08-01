import { type Message, Ollama } from 'ollama/browser'

interface Options {
  data?: MaybeRef<string>
}

export const useOllamaStore = defineStore('ollama', () => {
  const model = ref('')
  const host = ref('http://localhost:11434')
  const temperature = ref(0.8)
  const template = ref('')
  const ollama = computed(() => new Ollama({ host: host.value }))
  const { state } = useAsyncState(ollama.value.list(), { models: [] })
  const models = computed(() => state.value.models)

  watch(models, (values) => {
    if (values.length)
      model.value = values[0]?.name ?? ''
  })

  async function chat(messages: MaybeRef<Message[]>, options: Options = {}) {
    const response = await ollama.value.chat({ model: unref(model), messages: unref(messages), stream: true })
    if (!options.data)
      return response
    for await (const part of response) {
      options.data += part.message.content
    }
    return response
  }

  function generate(prompt: MaybeRef<string>) {
    return ollama.value.generate({ model: unref(model), prompt: unref(prompt), stream: false })
  }

  function abort() {
    ollama.value.abort()
  }

  return {
    ollama,
    model,
    host,
    temperature,
    template,
    chat,
    generate,
    abort,
  }
})

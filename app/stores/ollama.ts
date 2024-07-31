import { Ollama } from 'ollama/browser'

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

  function chat(messages: MaybeRef<Message[]>) {
    return ollama.value.chat({ model: unref(model), messages: unref(messages), stream: true })
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
    abort,
  }
})

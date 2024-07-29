import { Ollama } from 'ollama/browser'

interface Message {
  role: 'user' | 'assistant',
  content: string
}

interface SubmitOptions {
  onResponse: (part: string) => void
}

type OllamaContext = Ref<{
  host: string
  temperature: number
}>

export function useOllama() {
  const options: OllamaContext = ref({ host: 'http://localhost:11434', temperature: 0.8 })
  let _ollama = new Ollama({ host: options.value.host })

  const messages = ref<Message[]>([])
  const model  = ref('')
  const content = ref('')
  const isFetching = ref(false)
  const { state } = useAsyncState(_ollama.list(), { models: [] })
  const models = computed(() => state.value.models)

  watchOnce(models, (values) => {
    if (values.length)
      model.value = values[0]?.name ?? ''
  })

  watch(() => options.value.host, (host) => {
    _ollama = new Ollama({ host })
  })

  async function submit(options: Partial<SubmitOptions> = {}) {
    if (isFetching.value)
      return
    if (!content.value)
      return
    isFetching.value = true
    messages.value.push({ role: 'user', content: unref(content) })
    content.value = ''
    const response = await _ollama.chat({ model: unref(model), messages: messages.value, stream: true })
    messages.value.push({ role: 'assistant', content: '' })
    for await (const part of response) {
      messages.value.at(-1)!.content += part.message.content
      options.onResponse?.(part.message.content)
    }
    isFetching.value = false
  }

  return {
    options,
    model,
    models,
    messages,
    content,
    isFetching,
    submit
  }
}

export function useProvideOllamaContext(context: OllamaContext) {
  provide('_OLLAMA_CONTEXT', context)
}

const defaults = ref({
  host: '',
  temperature: 0.8,
  template: '',
  proxy: ''
})

export function useOllamaContext() {
  return inject<OllamaContext>('_OLLAMA_CONTEXT', defaults)
}

import { Ollama } from 'ollama/browser'

interface Message {
  role: 'user' | 'assistant',
  content: string
}

type OllamaContext = Ref<{
  host: string
  temperature: number
}>

export function useOllama() {
  const options: OllamaContext = ref({ host: 'http://localhost:11434', temperature: 0.8 })
  let _ollama = new Ollama({ host: options.value.host })

  const model  = ref('')
  const content = ref('')
  const { state } = useAsyncState(_ollama.list(), { models: [] })
  const models = computed(() => state.value.models)

  watchOnce(models, (values) => {
    if (values.length)
      model.value = values[0]?.name ?? ''
  })

  watch(() => options.value.host, (host) => {
    _ollama = new Ollama({ host })
  })

  function chat(messages: MaybeRef<Message[]>) {
    return _ollama.chat({ model: unref(model), messages: unref(messages), stream: true })
  }

  function abort() {
    _ollama.abort()
  }

  return {
    options,
    model,
    models,
    content,
    chat,
    abort,
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

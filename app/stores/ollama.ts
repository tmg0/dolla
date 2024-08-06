import { type Message, Ollama } from 'ollama/browser'
import { emit, tools } from '@dolla/tools'

interface ChatOptions {
  afterToolCalling?: (response: string) => void | Promise<void>
}

export const useOllamaStore = defineStore('ollama', () => {
  const model = ref([MODELS[0]?.name, MODELS[0]?.tags?.[0]].join(':'))
  const host = ref('http://localhost:11434')
  const temperature = ref(0.8)
  const template = ref('')
  const ollama = computed(() => new Ollama({ host: host.value }))
  const { state } = useAsyncState(ollama.value.list(), { models: [] })
  const models = computed(() => state.value.models)

  async function chat(messages: MaybeRef<Message[]>, options: ChatOptions = {}) {
    const _model = MODELS.filter(({ features }) => features?.includes('tools'))[0]
    const { name } = (_model ? models.value.find(({ name }) => name.includes(_model.name)) : undefined) ?? {}
    if (tools.length && name) {
      try {
        const response = await ollama.value.chat({ model: name, messages: unref(messages), stream: false, tools })
        if (response.message.tool_calls) {
          for await (const tool of response.message.tool_calls) {
            const r = await emit(tool.function.name, tool.function.arguments)
            await options.afterToolCalling?.(r)
          }
        }
      }
      catch (error) {
        console.error(error)
      }
    }

    return ollama.value.chat({ model: unref(model), messages: unref(messages), stream: true })
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
    models,
    host,
    temperature,
    template,
    chat,
    generate,
    abort,
  }
})

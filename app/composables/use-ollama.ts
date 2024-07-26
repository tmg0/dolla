import { Ollama } from 'ollama/browser'

interface Message {
  role: 'user' | 'assistant',
  content: string
}

interface SubmitOptions {
  onResponse: (part: string) => void
}

export function useOllama(model: MaybeRef<'llama3.1'>) {
  const ollama = new Ollama({ host: 'http://127.0.0.1:11434' })
  const messages = ref<Message[]>([])
  const content = ref('')
  const isFetching = ref(false)

  async function submit(options: Partial<SubmitOptions> = {}) {
    if (isFetching.value)
      return
    if (!content.value)
      return
    isFetching.value = true
    messages.value.push({ role: 'user', content: unref(content) })
    content.value = ''
    const response = await ollama.chat({ model: unref(model), messages: messages.value, stream: true })
    messages.value.push({ role: 'assistant', content: '' })
    for await (const part of response) {
      messages.value.at(-1)!.content += part.message.content
      options.onResponse?.(part.message.content)
    }
    isFetching.value = false
  }

  return {
    messages,
    content,
    isFetching,
    submit
  }
}

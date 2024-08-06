import type { Message as OMessage } from 'ollama/browser'

export type Message = OMessage & {
  id?: number
  conversation_id: number
}

export interface Conversation {
  id: number
  title: string
  createTime: string | number
  updateTime: string | number
}

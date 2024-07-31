import type { Message as OMessage } from 'ollama/browser'

export type Message = OMessage

export interface Conversation {
  id: string | number
  title: string
  createTime: string | number
  updateTime: string | number
}

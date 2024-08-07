type Feature = 'tools'

interface Model {
  name: string
  tags?: string[]
  features?: Feature[]
}

export const MODELS: Model[] = [
  {
    name: 'llama3.1',
    tags: ['latest'],
    features: ['tools'],
  },
]

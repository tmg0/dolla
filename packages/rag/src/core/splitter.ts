import { CharacterTextSplitter } from '@langchain/textsplitters'

export const splitter = new CharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
})

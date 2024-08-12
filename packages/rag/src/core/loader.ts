import { extname } from 'pathe'
import type { BaseDocumentLoader } from 'langchain/document_loaders/base'
import { TextLoader } from 'langchain/document_loaders/fs/text'
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf'

const isPdf = (value: string) => extname(value).includes('pdf')
const isTxt = (value: string) => extname(value).includes('txt')

export function createLoader(filepath: string): BaseDocumentLoader | undefined {
  if (isTxt(filepath))
    return new TextLoader(filepath)
  if (isPdf(filepath))
    return new PDFLoader(filepath, { splitPages: false })
}

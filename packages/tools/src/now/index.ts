import { defineTool } from '../core'

const schema = {
  type: 'function',
  function: {
    description: 'Get a string with a language-sensitive representation of current date time in the local timezone.',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
}

export default defineTool(schema, () => {
  return new Date().toLocaleString()
})

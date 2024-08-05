export const schema = {
  type: 'function',
  function: {
    name: 'core:now',
    description: 'Get current date time string',
    parameters: {
      type: 'object',
      properties: {},
      required: [],
    },
  },
}

export default function () {
  return String(new Date())
}

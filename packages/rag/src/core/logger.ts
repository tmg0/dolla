export class Logger {
  log(value: any, title = '') {
    const prefix = ['[dolla-rag]', title].filter(Boolean)
    // eslint-disable-next-line no-console
    console.log(...prefix, value)
  }
}

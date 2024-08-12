import process from 'node:process'

const isString = (value: any): value is string => typeof value === 'string'

export class Logger {
  log(value: any) {
    const output = isString(value) ? value : JSON.stringify(value)
    process.stdout.write(output)
  }
}

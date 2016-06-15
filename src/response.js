/**
 * Import dependencies.
 */
import { HttpError } from './errors'

/**
 * Send response.
 * @param  {Mixed} res          HttpError instance, object, or string to send.
 * @param  {Integer} statusCode Status code to return.
 */
export function * send (res, statusCode = 200) {
  switch (this.request.accepts('html', 'json')) {
    default:
    case 'html':
      this.type = 'text/html'
      if (res instanceof HttpError) {
        const { status, code, message } = res
        this.status = status || statusCode
        if (this.ctx.render) {
          yield this.ctx.render('error', { status: this.status, code, message })
        } else {
          this.body = `${message} (${code})`
        }
      } else {
        this.status = statusCode
        this.body = res
      }
      break
    case 'json':
      this.type = 'application/json'
      if (res instanceof HttpError) {
        const { status, code, message } = res
        this.status = status || statusCode
        this.body = JSON.stringify({ code, message })
      } else {
        this.status = statusCode
        this.body = JSON.stringify(res)
      }
      break
  }
}

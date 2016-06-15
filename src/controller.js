/**
 * Import dependencies.
 */
import { NotImplementedError } from './errors'

/**
 * Controller.
 */
export default class Controller {
  // Return constructor name
  get name () {
    return this.constructor.name
  }

  // Method called when route is hit with a GET / request.
  // Intended to be overwritten when inherited.
  * index () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a GET /create request.
  // Intended to be overwritten when inherited.
  * create () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a POST / request.
  // Intended to be overwritten when inherited.
  * store () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a GET /{id} request.
  // Intended to be overwritten when inherited.
  * show () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a GET /{id}/edit request.
  // Intended to be overwritten when inherited.
  * edit () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a PUT|PATCH /{id} request.
  // Intended to be overwritten when inherited.
  * update () {
    yield this.send(new NotImplementedError())
  }

  // Method called when route is hit with a DELETE /{id} request.
  // Intended to be overwritten when inherited.
  * destroy () {
    yield this.send(new NotImplementedError())
  }
}

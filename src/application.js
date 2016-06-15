/**
 * Import dependencies.
 */
import Koa from 'koa'
import merge from 'merge-descriptors'
import Kernel from './kernel'
import Router from './router'
import Route from './route'
import Controller from './controller'

/**
 * Application class.
 */
export default class Application extends Kernel {

  /**
   * Constructor.
   * @param  {String} path Path to configuration directory.
   */
  constructor (path = process.cwd()) {
    super(path)
    Router.controllers = {}
    Route.middlewares = {}
    Router.app = this
    Route.app = this
    Controller.app = this
    this._router = new Router()
    this._koa = new Koa()
    this._koa.env = this.env()
    this._koa.name = this.config('app.name')
    this._koa.proxy = this.config('app.proxy', false)
    this._koa.subdomainOffset = this.config('app.subdomainOffset', 2)
    this._koa.keys = this.config('app.keys', ['secret', 'server', 'keys'])
    merge(this._koa.context, require('./context'))
    merge(this._koa.response, require('./response'))
  }

  /**
   * Use router or middleware.
   * @param  {String} path         Path to assign middleware.
   * @param  {Array} ...middleware Array of middleware.
   */
  use (path, ...middleware) {
    if (([path].concat(middleware).length === 1) && (path instanceof Router)) {
      return this._router.use(path.routes())
    }
    return this._koa.use.apply(this._koa, [path].concat(middleware))
  }

  /**
   * Bootstrap the application.
   */
  bootstrap () {
    const app = this
    this.use(function * (next) {
      Object.assign(this, {
        // Shortcut config object to all routes.
        get config () {
          return app._config
        }
      })

      // Go over all bindings and add them to middleware downstream.
      Object.keys(app.bindings)
        .map((binding) => {
          Object.assign(this, {
            [binding]: app.resolve(binding)
          })
        })
      yield next
    })
    this.use(this._router.routes(), this._router.allowedMethods())
    this._koa.on('error', this.emit.bind(this, 'error'))
    return this._koa.callback.apply(this._koa)
  }
}

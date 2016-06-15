/**
 * Import dependencies.
 */
import { flatten, isArrowFunc } from './helpers'

/**
 * Route.
 */
export default class Route {
  /**
   * Route constructor.
   * @param  {String|Array} verbs  Verbs to match.
   * @param  {String} path         Url path to match.
   * @param  {Function} action     Action middleware.
   */
  constructor (verbs, path, action) {
    this._verbs = Array.isArray(verbs) ? verbs : [verbs]
    this._name = null
    this._path = path
    this._action = action
    this._middleware = []
    this._skip = []
  }

  /**
   * Named route.
   * @param  {String} name Name to give the route.
   */
  as (name) {
    this._name = name
    return this
  }

  /**
   * Middleware to give to the route.
   * @param  {Variadic} middleware Variadic array of middleware functions.
   */
  use (...middleware) {
    this._middleware.push(...middleware)
    return this
  }

  /**
   * Skip any middleware passed from Router instance.
   * @param  {Variadic} middleware Variadic array of middleware functions.
   */
  skip (...middleware) {
    this._skip.push(...middleware)
    return this
  }

  /**
   * Build middleware array.
   * @param  {String} mw Middleware name.
   */
  buildMiddleware (mw) {
    const [name, args] = mw.split(':')
    const mwares = Route.middlewares[name]
    const fn = isArrowFunc(mwares) ? mwares : mwares.bind(Route.app)
    const wares = fn.apply(fn, args ? args.split(',') : [])

    // If wares is returning array, assume it's another
    // grouped middleware and call ourself again
    if (Array.isArray(wares)) {
      return wares.filter((ware) => !~this._skip.indexOf(ware))
        .map((ware) => this.buildMiddleware(ware))
    }
    return wares
  }

  /**
   * Register route with router.
   * @param  {Router} router Instance of router
   */
  register (router) {
    const middleware = this._middleware
      .filter((mw) => !~this._skip.indexOf(mw))
      .map((mw) => this.buildMiddleware(mw))
    router.register(this._path, this._verbs, flatten(middleware).concat(this._action), { name: this._name })
    return this
  }
}

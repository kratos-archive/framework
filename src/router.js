/**
 * Import dependencies.
 */
import KoaRouter from 'koa-router'
import subdomain from 'koa-sub-domain'
import methods from 'methods'
import { singularize } from 'inflect'
import Route from './route'
import { isArrowFunc } from './helpers'

/**
 * Router.
 */
export default class Router extends KoaRouter {

  /**
   * Add middleware to registry.
   * @param {String}   name Name of the middleware.
   * @param {Function} fn   Function of middleware.
   */
  static addMiddleware (name, fn) {
    Route.middlewares[name] = fn
  }

  /**
   * Add controller to registry.
   * @param {String} name     Name of controller.
   * @param {Object} instance Instance of controller.
   */
  static addController (name, instance) {
    Router.controllers[name] = instance
  }

  /**
   * Router constructor.
   * @param  {Object}      Options object.
   */
  constructor (opts, middleware = []) {
    super(opts)
    // Hold routes before we register them.
    this._routes = []
    // Hold instance middleware.
    this._middleware = middleware
  }

  /**
   * Use middleware.
   * @param  {String} path    Path to mount middleware.
   * @param  {Array|Function} middleware Middleware.
   */
  use (path, ...middleware) {
    if ([path].concat(middleware).length === 1 && path instanceof Router) {
      return super.use(path.routes())
    }
    return super.use.apply(this, [path].concat(middleware))
  }

  /**
   * Create and register a route.
   * @param  {String|Array} verbs    HTTP verb(s) to match.
   * @param  {String} name            Name of route.
   * @param  {String|RegExp} path     Path string or regular expression.
   * @param  {Function} ...middleware Middleware functions.
   */
  addRoute (verbs, path, action) {
    if (typeof action === 'string') {
      const [ctrlName, ctrlAction] = action.split(/\./)
      action = getControllerAction(ctrlName, ctrlAction)
    }

    const route = new Route(verbs, path, action)

    // Make sure to pass parent Router instances of middleware
    // down to all routes inside of it.
    if (this._middleware.length > 0) {
      route.use(...this._middleware)
    }

    // Push new route instance onto Router.
    this._routes.push(route)

    return route
  }

  /**
   * Generate routes.
   */
  routes () {
    // Loop over routes and register them with Koa Router.
    this._routes.map((route) => route.register(this))
    return super.routes()
  }

  /**
   * Group routing.
   * @param  {object}   options    Options to set on the route group.
   * @param  {Function} callback   Callback to start defining routes.
   */
  group ({ domain = false, prefix, use = [] }, callback) {
    const group = new this.constructor({ prefix }, use)

    // If `callback` is an arrow function, we call it normally
    // then pass in the new Router instance.
    if (isArrowFunc(callback)) {
      callback(group)
    } else {
      // Otherwise we can bind the new instance to `this`
      // which will result in cleaner code.
      callback.call(group)
    }

    // TODO: Fix this. Not sure if it's `koa-sub-domain` that's
    // not working or what. Possibly bring implementation
    // in-house.
    if (domain) {
      return this.use(subdomain(domain, group.routes()))
    }
    return this.use(group)
  }

  /**
   * Create and register a route responding to all verbs.
   * @param  {String} name            Name of route.
   * @param  {String|RegExp} path     Path string or regular expression.
   * @param  {Function} ...middleware Middleware functions.
   */
  any (path, action) {
    return this.addRoute(this.methods, path, action)
  }

  /**
   * Register a resource.
   * @param  {String} resource   Resource to register.
   * @param  {String} controller Controller to associate with resource.
   * @param  {Object} options    Options object.
   * @return {Object}            Instance of Router.
   */
   resource (resource, controller, options = { only: false, except: false }) {
     const { name, path } = getParts(resource)
     const id = options.id || `${singularize(name)}Id(\\d+)`
     const routes = {
       index: { verbs: ['get'], path: `${path}` },
       create: { verbs: ['get'], path: `${path}/create` },
       store: { verbs: ['post'], path: `${path}` },
       show: { verbs: ['get'], path: `${path}/:${id}` },
       edit: { verbs: ['get'], path: `${path}/:${id}/edit` },
       update: { verbs: ['put', 'patch'], path: `${path}/:${id}` },
       destroy: { verbs: ['delete'], path: `${path}/:${id}` }
     }

     Object.keys(routes)
       .filter((route) => {
         if (Array.isArray(options.only)) {
           return options.only.indexOf(route) !== -1
         }
         if (Array.isArray(options.except)) {
           return options.except.indexOf(route) === -1
         }
         return true
       })
       .map((route) => {
         const { verbs, path } = routes[route]
         return this.addRoute(verbs, path, `${controller}.${route}`).as(`${name}.${route}`)
       })
       .map((route) => {
         if (options.use && Array.isArray(options.use)) {
           route.use(...options.use)
         }

         if (options.skip && Array.isArray(options.skip)) {
           route.skip(...options.skip)
         }
       })

     return this
   }
}

/*
 * Loop over all verbs available and register alias methods.
 */
methods.map((verb) => {
  Router.prototype[verb] = function (path, action) {
    return this.addRoute([verb], path, action)
  }
})

/**
 * Get controller action from controllers registry.
 * @param  {String} name   Name of controller.
 * @param  {String} action Action to retrieve.
 */
function getControllerAction (name, action) {
  return Router.controllers[name][action]
}

/**
* Return object of resource parts.
* @param  {String} resource Resource to parse.
*/
function getParts (resource) {
  const [parent, child] = resource.split('.')

  if (typeof child === 'undefined') {
    return { name: parent, path: `/${parent}` }
  } else {
    return { name: child, path: `/${parent}/${child}` }
  }
}

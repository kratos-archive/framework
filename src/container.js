/**
 * Import dependencies.
 */
import { EventEmitter } from 'events'
import { Binding } from './binding'
import { parseArgs, instantiate } from './helpers'

/**
 * Container.
 */
export default class Container extends EventEmitter {
  constructor () {
    super()
    this.setMaxListeners(0)
    this.bindings = {}
  }

  /**
   * Bind object to container.
   * @param  {string} name    Name to give it in the container.
   * @param  {function} thing Function to return when name is requested.
   * @return {object}         The binded object.
   */
  bind (name, thing) {
    // Make sure name is lowercase.
    name = String(name).toLowerCase()
    // First check to msee if it exists.
    const existing = this.exists(name) ? this.bindings[name] : false

    // If it does exist and isn't overridable, then error.
    if (existing && !existing.isOverridable()) {
      throw new Error(`Cannot override: ${name}`)
    }

    // Create binding object.
    const binding = new Binding(name, thing)

    // Add to bindings object.
    this.bindings[name] = binding

    // Finally return the binding.
    return binding
  }

  /**
   * Check if binding exists.
   * @param  {string} name Name to look up.
   * @return {Boolean}     Boolean if it exists.
   */
  exists (name) {
    return !!this.bindings[name]
  }

  /**
   * Get the given binding from the container.
   * @param  {string|Function} name Binding name in container.
   * @return {Mixed}       Object from container.
   */
  resolve (name) {
    // Make sure name is lowercase.
    name = String(name).toLowerCase()
    // Is the name a string?
    if (typeof name === 'string') {
      // Does it exist in our bindings?
      if (!this.exists(name)) {
        // Can't find it, throw error.
        throw new Error(`Cannot resolve dependency "${name}"`)
      }
      // Get function and dependencies from binding.
      const { fn, deps } = this.bindings[name]

      // Build instance.
      return this.build(fn, deps)
    }

    // Is name a function?
    if (typeof name === 'function') {
      // Build instance.
      return this.build(name, parseArgs(name))
    }

    // Nothing found.
    return null
  }

  /**
   * Build dependency tree of object.
   * @param  {Mixed}  fn     The function, string or object to build.
   * @param  {Array}  deps   Array of dependencies.
   * @return {Object}        Instantiated object.
   */
  build (fn, deps) {
    // If it's a string or an object, just return it back.
    if (typeof fn === 'string' || typeof fn === 'object') {
      return fn
    }

    // Go over all dependencies and resolve them.
    const dependencies = deps.map((dep) => this.resolve(dep))

    // Instantiate a new instance of the `fn` injecting dependencies.
    return instantiate(fn, dependencies)
  }
}

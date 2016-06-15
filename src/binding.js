/**
 * Import dependencies.
 */
import { parseArgs } from './helpers'

/**
 * Binding class.
 */
export class Binding {
  /**
   * Constructor.
   * @param  {String}   name The name of the binding.
   * @param  {Function} fn   Function to bind to container.
   */
  constructor (name, fn) {
    this.name = name
    this.fn = fn

    // Get dependencies of `fn`
    this.deps = parseArgs(fn)

    // Make binding overridable.
    this.override = false
  }

  /**
   * Make binding overridable.
   */
  canOverride () {
    this.override = true
    return this
  }

  /**
   * Can this binding be overriden?
   */
  isOverridable () {
    return this.override
  }
}

/**
 * Import dependencies.
 */
import { resolve, basename } from 'path'
import { exists, readDir, defaults, has, get, put } from './helpers'

/**
 * Config class.
 */
export default class Config {

  /**
   * Constructor.
   * @param  {string} env  Current environment name.
   * @param  {string} path Path of config files to load.
   */
  constructor (env, path) {
    // Initialize config as empty object.
    this.config = {}

    // Read path and filter only `*.js`.
    // Then map over all files.
    readDir(path).filter((file) => file.endsWith('.js'))
      .map((file) => {
        // Resolve potential corresponding environment file.
        const envFile = resolve(path, env, file)

        // Get production file.
        const prodObj = require(resolve(path, file))

        // Get corresponding environment file if exists otherwise
        // return empty object.
        const envObj = exists(envFile) ? require(envFile) : {}

        // Merge it all together and set it on the `this.config` object.
        this.config[basename(file, '.js')] = defaults(envObj, prodObj)
      })
  }

  /**
   * Check if path is direct property.
   * @param  {string|Array}  path The path to check.
   * @return {Boolean}       True if `path` is direct property or false.
   */
  has (path) {
    return has(this.config, path)
  }

  /**
   * Get the property value at `path` or return `defaultValue`.
   * @param  {String|Array} path    The path of the property to get.
   * @param  {Mixed} defaultValue   Returned value if resolved `path` is undefined.
   * @return {Mixed}                Returns the resolved value.
   */
  get (path, defaultValue = false) {
    return get(this.config, path, defaultValue)
  }

  /**
   * Sets the property value of `path`.
   * If a portion of `path` does not exist it is created.
   * @param  {String|Array} path  The path of the property to set.
   * @param  {Mixed} value        The value to set.
   * @return {object}             Returns object.
   */
  put (path, value) {
    return put(this.config, path, value)
  }
}

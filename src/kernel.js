/**
 * Import dependencies.
 */
import env from 'process-env'
import Container from './container'
import Config from './config'
import Provider from './provider'

/**
 * Kernel class.
 */
export default class Kernel extends Container {

  /**
   * constructor
   * @param  {String} path Location of config directory.
   */
  constructor (path = process.cwd()) {
    super()
    this._config = new Config(this.env(), path)
    this._config.put('env', env.all())
    Provider.app = this
  }

  /**
   * Enivronment matcher.
   * @param  {String|Boolean} match Environment to match against.
   * @return {String|Boolean}       String of environment or boolean if matches.
   */
  env (match = false) {
    // Get current environment, or default to `development`.
    const environment = env.get('node_env', 'development')

    // Are we passing an environment to see if it's what we're in?
    if (match) {
      // Yes we are, return boolean result.
      return environment === match.toLowerCase()
    }
    // No we're not. Return current environment.
    return environment
  }

  /**
   * Config get proxy.
   * @return {String|object}
   */
  config (...args) {
    return this._config.get(...args)
  }

  /**
   * Provider registration.
   * @param  {Provider} Provider Provider class.
   * @return {object}            Instance of Kernel.
   */
  register (Provider) {
    (new Provider()).register()
    return this
  }

  /**
   * Use placeholder.
   * @return {Object} Instance of Kernel.
   */
  use () {
    return this
  }

  /**
   * Command placeholder.
   * @return {Object} Instance of Kernel.
   */
  command () {
    return this
  }
}

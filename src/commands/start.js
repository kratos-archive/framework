/**
 * Import dependencies.
 */
import { resolve } from 'path'
import Command from '../command'

/**
 * Start Command.
 */
export default class Start extends Command {
  /**
   * Set blocking to true.
   */
  get blocking () {
    return true
  }

  /**
   * Set description of command.
   */
  get description () {
    return 'start the application'
  }

  /**
   * Command action.
   */
  action () {
    return require(resolve(this.config('paths.app'), '..', 'bootstrap/http'))
      .then(function boot (app) {
        return require('http').createServer(app.bootstrap())
        .listen(app.config('app.port'), app.config('app.hostname'), () => {
          console.log(
            '%s started on http://%s:%s/ in %s mode.',
            app.config('app.name'),
            app.config('app.hostname'),
            app.config('app.port'),
            app.env()
          )
        })
      })
  }
}

/**
 * Import dependencies.
 */
import Command from '../command'

/**
 * Version command.
 */
export default class Version extends Command {
  /*
   * This command can run in standalone mode.
   */
  static get standalone () {
    return true
  }
  /**
   * Set description of command.
   */
  get description () {
    return 'output the version number'
  }

  /**
   * Command action.
   */
  action () {
    return Command.app.versionInformation()
  }
}

/**
 * Regular expression to match and convert CaseTitleCommand names.
 */
const NAME_REPLACE_REGEX = /([a-z]+|[0-9]+|(?:[A-Z][a-z]+)|(?:[A-Z]+(?=(?:[A-Z][a-z])|[^AZa-z]|[$\d\n])))/

/**
 * Command class.
 */
export default class Command {

  /**
   * Can run in standalone mode.
   */
  static get standalone () {
    return false
  }

  /**
   * Get name
   * @return {String} Name of command.
   */
  get name () {
    // First we get the constructor name...
    return this.constructor.name
      .replace(/(.+)Command/, '$1') // Remove `Command` suffix if exists.
      .replace(NAME_REPLACE_REGEX, '$1:') // Now we convert the name from ex: `MakeMigration` to `Make:Migration:`
      .replace(/(.+)(:)$/, '$1').toLowerCase() // Finally we remove the last `:` and lowercase it all.
  }

  /**
   * Block process.
   * This tells the program not to exit the process unless
   * called manually.
   * @return {Boolean} Yes or no.
   */
  get blocking () {
    return false
  }

  /**
   * Command signature.
   * Return the signature of the command, ex: `<name>`
   * This combind with the name makes your command convert to
   * something similar to `make:migration <name>` for
   * Commander to take over.
   * @return {Boolean|String} False if no signature, or a string.
   */
  get signature () {
    return false
  }

  /**
   * The description of your command.
   * @return {String} Description.
   */
  get description () {
    return 'No description provided.'
  }

  /**
   * Any options for command.
   * @return {Boolean|Object} False if no options, or an hash map.
   */
  get options () {
    return false
  }

  /**
   * The action to execute when command is called.
   */
  action () {
    console.log(`
  error: missing action for \`${this.name}\`
    `)
  }

  /**
   * Proxy environment to app.
   */
  env (...args) {
    return Command.app.env.apply(Command.app, args)
  }

  /**
   * Proxy resolve to app.
   */
  resolve (...args) {
    return Command.app.resolve.apply(Command.app, args)
  }

  /**
   * Proxy config to app.
   */
  config (...args) {
    return Command.app.config.apply(Command.app, args)
  }

  /**
   * Proxy on to app.
   */
  on (...args) {
    return Command.app.on.apply(Command.app, args)
  }

  /**
   * Proxy emit to app.
   */
  emit (...args) {
    return Command.app.emit.apply(Command.app, args)
  }
}

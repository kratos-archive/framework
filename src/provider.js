/**
 * Provider class.
 */
export default class Provider {
  /**
   * Environment proxy method.
   */
  env (...args) {
    return Provider.app.env.apply(Provider.app, args)
  }

  /**
   * Config proxy method.
   */
  config (...args) {
    return Provider.app.config.apply(Provider.app, args)
  }

  /**
   * Make proxy method.
   */
  make (...args) {
    return Provider.app.make.apply(Provider.app, args)
  }

  /**
   * Use proxy method.
   */
  use (...args) {
    return Provider.app.use.apply(Provider.app, args)
  }

  /**
   * Command proxy method.
   */
  command (...args) {
    return Provider.app.command.apply(Provider.app, args)
  }

  /**
   * On proxy method.
   */
  on (...args) {
    return Provider.app.on.apply(Provider.app, args)
  }

  /**
   * Emit proxy method.
   */
  emit (...args) {
    return Provider.app.emit.apply(Provider.app, args)
  }

  /**
   * Bind proxy method.
   */
  bind (name, service) {
    return Provider.app.bind(name, service)
  }
}

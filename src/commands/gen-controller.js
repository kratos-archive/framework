import { resolve } from 'path'
import Command from '../command'
import { write } from '../helpers'

export default class GenController extends Command {
  get description () {
    return 'create a new controller'
  }

  get signature () {
    return '<name>'
  }

  action (controller, options) {
    const log = this.resolve('log')
    const path = this.config('paths.controllers')
    const name = controller.replace(/(.+)Controller$/, '$1').toLowerCase()
    const resource = options.resource ? options.resource : false

    log.success(`Created ${controller}`)
    return write(resolve(path, `${name}.js`), template(controller, name, resource))
  }
}

const template = (controller, name, resource = false) => `import { Controller } from 'kratos'

export default class ${controller} extends Controller {
  * index () {
    yield this.render('${name}')
  }
}
`

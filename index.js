'use strict'
/**
 * Export Constants.
 */
exports.NAME = require('./package.json').name
exports.DESCRIPTION = require('./package.json').description
exports.HOMEPAGE = require('./package.json').homepage
exports.VERSION = require('./package.json').version

/**
 * Export Classes.
 */
exports.Application = require('./dist/application')
exports.CLI = require('./dist/cli')
exports.Command = require('./dist/command')
exports.Provider = require('./dist/provider')
exports.Router = require('./dist/router')
exports.Controller = require('./dist/controller')
exports.Promise = require('bluebird')

/**
 * Export Errors.
 */
const errors = require('./dist/errors')
Object.keys(errors).map((error) => {
  exports[error] = errors[error]
})

/**
 * Export helpers.
 */
const helpers = require('./dist/helpers')
Object.keys(helpers).map((helper) => {
  exports[helper] = helpers[helper]
})

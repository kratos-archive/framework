/**
 * Import dependencies.
 */
import { existsSync, readdirSync, writeFileSync } from 'fs'
import {
  set,
  defaultsDeep,
  snakeCase as lodashSnakeCase,
  startCase as lodashStartCase,
  has as lodashHas,
  get as lodashGet,
  flattenDeep as lodashFlatten,
  head as lodashHead
} from 'lodash'

// Bind to new name. Keep it all sync.
export const exists = existsSync.bind(existsSync)

export const readDir = readdirSync.bind(readdirSync)

export const write = writeFileSync.bind(writeFileSync)

export const defaults = defaultsDeep.bind(defaultsDeep)

export const snakeCase = lodashSnakeCase.bind(lodashSnakeCase)

export const startCase = lodashStartCase.bind(lodashStartCase)

export const has = lodashHas.bind(lodashHas)

export const get = lodashGet.bind(lodashGet)

export const put = get.bind(get)

export const flatten = lodashFlatten.bind(lodashFlatten)

export const first = lodashHead.bind(lodashHead)

/**
 * See if function is an arrow function or not.
 * @param  {Function} fn Function to check.
 */
export function isArrowFunc (fn) {
  return !/^function\s?(.*)/.test(fn.toString())
}

/**
 * snakeCaseDeep.
 * @param  {object} obj Object to snakeCase over.
 * @return {Object}     snakeCased Object.
 */
export function snakeCaseDeep (obj) {
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      if (obj[prop] && typeof obj[prop] === 'object') {
        obj[prop] = snakeCaseDeep(obj[prop])
      }
      let val = obj[prop]
      delete obj[prop]
      obj[snakeCase(prop)] = val
    }
  }
  return obj
}

// Function arguments RegExp.
export const FUNCTION_ARGS = /(?:function|constructor)[^\(]*\(([^\)]*)/m

/**
 * Parse Arguments of Function.
 * @param  {Function} fn Function to get arguments for.
 * @return {Array}       Array of arguments.
 */
export function parseArgs (fn) {
  const matches = []
  let args = fn.toString().match(FUNCTION_ARGS)

  if (args) {
    args = args[1].replace(/[ ]*,[ ]*/, ',')
      .split(',')

    for (let i = 0; i < args.length; i++) {
      const arg = args[i].replace(/^\s+|\s+$/g, '')
      if (arg) {
        matches.push(arg)
      }
    }
  }

  return matches
}

/**
 * Instantiate a function/Class.
 * @param  {Function|Class} Constructor Constructor function to instantiate.
 * @param  {Array} args                 Any arguments to pass to constructor.
 * @return {Object}                     Instance of function/class.
 */
export function instantiate (Constructor, ...args) {
  return new Constructor(...args)
}

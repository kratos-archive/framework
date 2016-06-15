/**
 * Import dependencies.
 */
import { snakeCase } from './helpers'
import statuses from 'statuses'

/**
 * Add support for custom statuses.
 */
statuses['420'] = 'Enhance Your Calm'

/**
 * HTTP Error Status Codes.
 * @type {Object}
 */
export const STATUS_CODES = {
  BadRequest: [400, 'Bad Request'],
  Unauthorized: [401, 'Unauthorized'],
  PaymentRequired: [402, 'Payment Required'],
  Forbidden: [403, 'Forbidden'],
  NotFound: [404, 'Not Found'],
  MethodNotAllowed: [405, 'Method Not Allowed'],
  NotAcceptable: [406, 'Not Acceptable'],
  ProxyAuthenticationRequired: [407, 'Proxy Authentication Required'],
  RequestTimeout: [408, 'Request Timeout'],
  Conflict: [409, 'Conflict'],
  Gone: [410, 'Gone'],
  LengthRequired: [411, 'Length Required'],
  PreconditionFailed: [412, 'Precondition Failed'],
  PayloadTooLarge: [413, 'Payload Too Large'],
  URITooLong: [414, 'URI Too Long'],
  UnsupportedMediaType: [415, 'Unsupported Media Type'],
  RangeNotSatisfiable: [416, 'Range Not Satisfiable'],
  ExpectationFailed: [417, 'Expectation Failed'],
  ImATeapot: [418, 'I\'m a Teapot'],
  EnhanceYourCalm: [420, 'Enhance Your Calm'],
  MisdirectedRequest: [421, 'Misdirected Request'],
  UnprocessableEntity: [422, 'Unprocessable Entity'],
  Locked: [423, 'Locked'],
  FailedDependency: [424, 'Failed Dependency'],
  UnorderedCollection: [425, 'Unordered Collection'],
  UpgradeRequired: [426, 'Upgrade Required'],
  PreconditionRequired: [428, 'Precondition Required'],
  TooManyRequests: [429, 'Too Many Requests'],
  RequestHeaderFieldsTooLarge: [431, 'Request Header Fields Too Large'],
  LoginTimeout: [440, 'Login Timeout'],
  NoResponse: [444, 'No Response'],
  RetryWith: [449, 'Retry With'],
  UnavailableForLegalReasons: [451, 'Unavailable For Legal Reasons'],
  InternalServerError: [500, 'Internal Server Error'],
  NotImplemented: [501, 'Not Implemented'],
  BadGateway: [502, 'Bad Gateway'],
  ServiceUnavailable: [503, 'Service Unavailable'],
  GatewayTimeout: [504, 'Gateway Timeout'],
  HTTPVersionNotSupported: [505, 'HTTP Version Not Supported'],
  VariantAlsoNegotiates: [506, 'Variant Also Negotiates'],
  InsufficentStorage: [507, 'Insufficent Storage'],
  LoopDetected: [508, 'Loop Detected'],
  BandwidthLimitExceeded: [509, 'Bandwidth Limit Exceeded'],
  NotExtended: [510, 'Not Extended'],
  NetworkAuthenticationRequred: [511, 'Network Authentication Required']
}

/**
 * RuntimeError.
 */
export class RuntimeError extends Error {
  // Get constructor name.
  get name () {
    return this.constructor.name
  }

  /**
   * Constructor.
   * @param  {String} message Message to set on the error.
   */
  constructor (message = 'A runtime error occorred') {
    super(message)
    this.stack = this.stack.split('\n')
      .filter((line) => !line.match(/(^\s{4,})(.+)(errors\.js)/))
      .join('\n')
  }
}

/**
 * HttpError.
 * Since we can't dynamically generate `extend`ed classes in
 * ECMAScript 2015, we're going back to the old way.
 * @param  {String} message Message to set on the error.
 * @param  {String} code    Custom error code.
 * @param  {Integer} status Http Error Code.
 */
export function HttpError (message, code = 'HTTP_ERROR', status = 400) {
  Error.call(this, message)
  this.message = message
  this.code = code
  this.status = status
}

// Generate Error classes for all status codes.
Object.keys(STATUS_CODES)
  .map((code) => {
    const [errorStatus, errorMessage] = STATUS_CODES[code]
    const errorCode = snakeCase(errorMessage).toUpperCase()

    exports[`${code}Error`] = function (message, code) {
      HttpError.call(this, message || errorMessage, code || errorCode, errorStatus)
    }
    exports[`${code}Error`].prototype = Object.create(HttpError.prototype)
  })

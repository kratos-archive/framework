/**
 * Import dependencies.
 */
import delegate from 'delegates'

// Delegate methods from the `response` object to `this` or `ctx` object.
delegate(exports, 'response')
  .method('send')

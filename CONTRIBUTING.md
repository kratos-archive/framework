# Contributing to Kratos

First off thanks for your interest in contributing to the project.

## Issues

Please [open an issue](https://github.com/kratos/kratos/issues) for bug reports and patches. Include your OS version, code examples, stack traces and everything you can think to help debug your problem.

If you have a new feature or large change in mind, please open a new issue with your suggestion to discuss the idea together.

## Code Style

We follow the [JavaScript Standard Style](http://standardjs.com).

### Rules

- **2 spaces** – for indentation
- **Single quotes for strings** – except to avoid escaping
- **No unused variables** – this one catches *tons* of bugs!
- **No semicolons** – [It's][1] [fine.][2] [Really!][3]
- **Never start a line with `(` or `[`**
    - This is the **only** gotcha with omitting semicolons – *automatically checked for you!*
- **Space after keywords** `if (condition) { ... }`
- **Space after function name** `function name (arg) { ... }`
- Always use `===` instead of `==` – but `obj == null` is allowed to check `null || undefined`.
- Always handle the node.js `err` function parameter
- Always prefix browser globals with `window` – except `document` and `navigator` are okay
  - Prevents accidental use of poorly-named browser globals like `open`, `length`,
    `event`, and `name`.
- [Read more...](https://github.com/feross/standard/blob/master/RULES.md#javascript-standard-style)

[1]: http://blog.izs.me/post/2353458699/an-open-letter-to-javascript-leaders-regarding
[2]: http://inimino.org/~inimino/blog/javascript_semicolons
[3]: https://www.youtube.com/watch?v=gsfbh17Ax9I

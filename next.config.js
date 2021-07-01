const withTM = require('next-transpile-modules')([
  'hast-util-sanitize',
  'unist-util-visit',
])

module.exports = withTM({})

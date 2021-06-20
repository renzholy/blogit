const withTM = require('next-transpile-modules')([
  'hast-util-sanitize',
  'unist-util-visit',
])

module.exports = withTM({
  future: {
    webpack5: true,
  },
})

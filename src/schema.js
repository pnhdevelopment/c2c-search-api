const { makeExecutableSchema } = require('graphql-tools')

const Policy = require('./policy/schema')
const resolvers = require('./resolvers')

module.exports = makeExecutableSchema({
  typeDefs: [Policy],
  resolvers,
  logger: { log: e => console.log(e) },
})

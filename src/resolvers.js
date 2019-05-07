const PolicyResolvers = require('./policy/resolvers')

const PolicyQuery = PolicyResolvers.Query
const PolicyMutation = PolicyResolvers.Mutation
const Policy = PolicyResolvers.Policy

module.exports = {
    Query: {
        ...PolicyQuery
    },
    Mutation: {
        ...PolicyMutation
    },
    Policy
}
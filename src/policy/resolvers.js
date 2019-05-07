const sleep = require('sleep')

const DEFAULT_PAGE = 1
const DEFAULT_PAGE_SIZE = 3
const DEFAULT_SORT = { monthlyPremium: +1 }

const {createLead} = require('../service/sales-force')
const {searchQuery, findBySisCodeQuery} = require('../db/queries')

// const toInclusionCovered = (inclusion) => ({ category: inclusion, covered: true})
// const createInclusionCoveredQuery = (inclusions) => ({ $all: inclusions.map(toInclusionCovered) })

const Query = {
    search: async (obj, searchCriteria, context) => {
            // sleep.sleep(1) // NOTE: added sleep to test front end waiting and showing loading spinner
            const page = searchCriteria.page || DEFAULT_PAGE
            const pageSize = searchCriteria.pageSize || DEFAULT_PAGE_SIZE
            const dbQuery = searchQuery(searchCriteria)
            const totalRecords = await context.datastore.policies.find(dbQuery).count()
            const totalPages = totalRecords > 0 ? Math.ceil(totalRecords/pageSize) : 0
            const results = await context.datastore.policies
                .find(dbQuery)
                .sort(DEFAULT_SORT)
                .skip((page - 1) * pageSize)
                .limit(pageSize)
                .toArray()

            return {
                policies: results,
                meta: {
                    page: totalRecords === 0 ? 0 :page,
                    pageSize,
                    totalPages,
                    totalRecords
                }
            }
    }
}

// TODO: validation  pattern http://blog.rstankov.com/graphql-mutations-and-form-errors/
const Mutation = {
    buyPolicy: async (obj, input, context) => {
        //console.log(JSON.stringify(input, null, 2))
        const {sisCode, customerDetails} = input
        const policy = await context.datastore.policies.findOne(findBySisCodeQuery(sisCode))
        //console.log(JSON.stringify(policy, null, 2))
        const lead = await createLead(sisCode, customerDetails)

        return {
            data: policy
        }
    }
}

const Policy = {
    id: policy => policy._id,
    categoryOfCover: policy => policy.category,
    policyType: policy => policy.type
}

module.exports = {
    Query,
    Mutation,
    Policy
}
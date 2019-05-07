const lodash = require('lodash')

const FUND_CODES = ['AUF', 'BUP', 'HCF', 'LHM', 'PWA', 'MYO']
const OPEN_FUND_TYPE = 'OPEN'
const POLICY_TYPE_HOSPITAL = 'HOSPITAL'
const POLICY_TYPE_EXTRAS = 'EXTRAS'
const POLICY_TYPE_COMBINED = 'COMBINED'

const toInclusionCovered = (inclusion) => ({ category: inclusion, covered: true})
const createInclusionCoveredQuery = (inclusions) => ({ $all: inclusions.map(toInclusionCovered) })

exports.searchQuery = (searchCriteria) => {
  const { policyType, categoryOfCover, state, maxMonthlyPremium, hospitalInclusions, extrasInclusions  } = searchCriteria

    const query = {
        type: policyType,
        fundType: OPEN_FUND_TYPE,
        category: categoryOfCover,
        states: {
            $in: [state]
        },
        fundCode: {
            $in: FUND_CODES
        }
    }

    if (maxMonthlyPremium) {
        query.monthlyPremium = {
            $lte: maxMonthlyPremium
        }
    }

    if(!lodash.isEmpty(hospitalInclusions)) {
        query['hospitalComponent.inclusions'] = createInclusionCoveredQuery(hospitalInclusions)
    }

    if(!lodash.isEmpty(extrasInclusions)) {
        query['extrasComponent.inclusions'] = createInclusionCoveredQuery(extrasInclusions)
    }

    return query
}

exports.findBySisCodeQuery = (sisCode) => {
  return {
    sisCode
  }
}
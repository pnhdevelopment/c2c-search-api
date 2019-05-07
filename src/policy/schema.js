const Policy = `

enum PolicyType {
    HOSPITAL
    EXTRAS
    COMBINED
}

enum AustralianStates {
    ACT
    NSW
    NT
    QLD
    SA
    TAS
    VIC
    WA
}

enum CategoryOfCover {
    SINGLES
    COUPLES
    FAMILIES
    SINGLE_PARENTS
    DEPENDANTS
}

enum FundType {
    OPEN
    RESTRICTED
}

enum AmbulanceCover {
    COMPREHENSIVE
    PARTIAL
    NOT_COVERED
}

enum HospitalInclusions {
    HEART_SUGERY
    EYE_SURGERY
    PREGNANCY
    IVF
    JOINT_REPLACEMENTS
    DIALYSIS
    SURGICAL_WEIGHT_LOSS_PROCEDURES
    STERILISATION
    NON_COSMETIC_PLASTIC_SURGERY
    IN_HOSPITAL_REHABILITATION
    IN_HOSPITAL_PSYCHIATRY
    PALLIATIVE_CARE
    OTHER_NON_MEDICARE
}

enum ExtrasInclusions {
    DENTAL_GENERAL
    DENTAL_MAJOR
    DENTAL_ENDODONTIC
    DENTAL_ORTHODONTIC
    OPTICAL
    NON_PBS_PHARMACEUTICALS
    PHYSIOTHERAPY
    CHIROPRACTIC
    PODIATRY
    CLINICAL_PSYCHOLOGY
    ACUPUNCTURE
    NATUROPATHY
    MASSAGE
    HEARING_AIDS
    BLOOD_GLUCOSE_MONITOR
}

enum CoPayments {
    L,
    N,
    U
}

type Excess {
    perHospitalVisit: String!
    maxPerPerson: String!
    maxPerAnnum: String!
}

type Policy {
    id: ID!
    fundCode: String!
    fundName: String!
    fundType: FundType!
    policyName: String!
    policyType: PolicyType!
    sisCode: String!
    states: [AustralianStates]!
    categoryOfCover: CategoryOfCover!
    monthlyPremium: Float!
    ambulanceCover: AmbulanceCover!
    hospitalComponent: HospitalComponent
    extrasComponent: ExtrasComponent
}

type HospitalComponent {
    coPayments: CoPayments!
    excess: Excess!
    inclusions: [HospitalInclusionDetails]!
}

type ExtrasComponent {
    preferredProvider: Boolean!
    inclusions: [ExtrasInclusionDetails]!
}

type HospitalInclusionDetails {
    category: HospitalInclusions!
    covered: Boolean!
}

type ExtrasInclusionDetails {
    category: ExtrasInclusions!
    covered: Boolean!
}

type SearchMeta {
    page: Int!
    pageSize: Int!
    totalPages: Int!
    totalRecords: Int!
}

type PolicySearchResults {
    policies: [Policy]!
    meta: SearchMeta!
}

type Query {

    search(
        policyType: PolicyType!
        categoryOfCover: CategoryOfCover!
        state: AustralianStates!
        maxMonthlyPremium: Float
        hospitalInclusions: [HospitalInclusions]
        extrasInclusions: [ExtrasInclusions]
        page: Int
        pageSize: Int
    ): PolicySearchResults

}

type Error {
    field: String!
    messages: [String!]!
  }

input Address {
    streetAddress: String!
    city: String!
    state: AustralianStates!
    postcode: String!
}

input CustomerDetails {
    firstName: String!
    lastName: String!
    address: Address!
    emailAdress: String!
    phoneNumber: String!
}

input BuyPolicyRequest {
    sisCode: String!
    customerDetails: CustomerDetails!
}

type BuyPolicyResponse {
    errors: [Error]
    data: Policy
}

type Mutation {
    buyPolicy(
        sisCode: String!
        customerDetails: CustomerDetails!
    ): BuyPolicyResponse
}
`

module.exports = () => [Policy]

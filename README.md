# Care2Compare Search Service

## Installation

You will need `yarn` installed.

Then run the following to install all project dependancies:
```bash
yarn install
```

## Running the application

### Create and Seed the Policy Database
You will need `docker`. So install it on your operating system.

Then run this command to seed the local policy database:
```bash
./local-recreate-mongo.sh
```

> Note: this will recreate the entire mongo db and the collection of policies.

### Starting development server
Start the search API server:
```bash
yarn start
```
> Note: this starts up using `nodemon`, so any changes will automatically restart the `express` server.

## Search API
The Search API has been implemented using `GraphQL`. After start up visit http://localhost:4000/graphql, and look at what is available.

For example:
```
query{
  search(
    policyType: HOSPITAL
    categoryOfCover: SINGLES
    state: VIC
    hospitalInclusions: [
      HEART_SUGERY
      JOINT_REPLACEMENTS
    ]
    maxMonthlyPremium: 150
    page: 0
    pageSize: 3
  ) {
    policies {
      id
      fundName
      policyName
      policyType
      monthlyPremium
      ambulanceCover
      hospitalComponent {
        coPayments
        excess {
          perHospitalVisit
          maxPerPerson
          maxPerAnnum
        }
        inclusions {
          category
          covered
        }
      }
    }
    meta {
      page
      pageSize
      totalPages
      totalRecords
    }
  }
}
```

> This query returns hosptial policies (only requested attributes) for policies that covers:
> "Singles" and in "VIC" and with maximum monthly premium of $150. 
> Also page 0 is requested with page size of 3.

const {MongoClient} = require('mongodb')

const DB_URL = process.env.DB_URL || 'mongodb://localhost/policy-search-db'

module.exports = async() => {
  const db = await MongoClient.connect(DB_URL)
  console.log(`Connected correctly database: ${DB_URL}`)

  return {
    policies: db.collection('policies')
  }
}

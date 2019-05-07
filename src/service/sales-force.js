const axios = require('axios')
const qs = require('qs')

const WEB_TO_LEAD_END_POINT = 'https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8'

exports.createLead = async (productId, leadDetails) => {

    const data = qs.stringify({
      oid: '00D7F000006Me7U',
      Policy_ID__c: productId,
      first_name: leadDetails.firstName,
      last_name: leadDetails.lastName,
      street: leadDetails.address.streetAddress,
      city: leadDetails.address.city,
      state: leadDetails.address.state,
      zip: leadDetails.address.postcode,
      email: leadDetails.emalAddress,
      phone: leadDetails.phoneNumber,
      retURL: 'http://demo.caretocompare.com.au/#/thanks',
      Email_for_Contact__c: leadDetails.emalAddress
    })

    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
    }

    const result = await axios.post(WEB_TO_LEAD_END_POINT, data, headers)
    //console.log(result.status)
    return leadDetails
}
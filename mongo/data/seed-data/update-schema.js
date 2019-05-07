// Set monthlyPremium to double type
var cursor = db.policies.find();
while (cursor.hasNext()) {
  var doc = cursor.next();
  db.policies.update({_id : doc._id}, {$set : {monthlyPremium : NumberDecimal(doc.monthlyPremium) }});
}

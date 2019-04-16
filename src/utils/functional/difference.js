const { includes } = require('./includes')

// Like Lodash difference()
const difference = function(arrA, arrB) {
  return arrA.filter(val => !includes(arrB, val))
}

module.exports = {
  difference,
}

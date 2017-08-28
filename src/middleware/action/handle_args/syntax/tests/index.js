'use strict';

module.exports = {
  ...require('./generic'),
  ...require('./filter'),
  ...require('./order_by'),
  ...require('./pagination'),
  ...require('./data'),
  ...require('./required'),
  ...require('./unknown'),
};

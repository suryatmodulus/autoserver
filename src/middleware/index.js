'use strict';


module.exports = Object.assign(
  {},
  require('./error_handler'),
  require('./protocol_convertor'),
  require('./protocol_negotiator'),
  require('./protocol_error_handler'),
  require('./response'),
  require('./get_path'),
  require('./timestamp'),
  require('./ip'),
  require('./routing'),
  require('./logger'),
  require('./params'),
  require('./interface_convertor'),
  require('./interface_negotiator'),
  require('./custom_jsl'),
  require('./execute_interface'),
  require('./api_convertor'),
  require('./basic_validation'),
  require('./actions'),
  require('./normalization'),
  require('./crud_convertor'),
  require('./crud_basic_validation'),
  require('./system_defaults'),
  require('./user_defaults'),
  require('./pagination'),
  require('./clean_delete'),
  require('./transform'),
  require('./filter'),
  require('./validation'),
  require('./database'),
  require('./no_response')
);

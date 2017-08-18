'use strict';

// Validation can be called from different places in the codebase
// Each come with its specific reason and error message
const validationTypes = {
  idl: {
    reason: 'IDL_VALIDATION',
    message: 'Error in schema file',
  },
  paginationInput: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  clientInputSyntax: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  clientInputData: {
    reason: 'INPUT_VALIDATION',
    message: 'Wrong parameters',
  },
  paginationOutput: {
    reason: 'OUTPUT_VALIDATION',
    message: 'Response is corrupted',
  },
};

module.exports = {
  validationTypes,
};

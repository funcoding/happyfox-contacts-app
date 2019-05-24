// @author: Vinay Kumar
'use strict';

const { check, checkSchema, oneOf } = require('express-validator/check');


const create = [
  checkSchema({
    name: {
      errorMessage: 'Name is required.',
      trim: true,
    },
    contacts: {
      isArray: true,
      custom: {
        options: value => value.length > 0,
        errorMessage: 'Atleast one contact is required.',
      },
    },
    'contacts.*': {
      isMongoId: true,
    },
  }),
];


module.exports = { create };

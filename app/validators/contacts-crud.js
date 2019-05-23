// @author: Vinay Kumar
'use strict';

const { check, checkSchema, oneOf } = require('express-validator/check');


const create = [
  oneOf([
    check('phone').exists(),
    check('email').exists(),
  ], 'either phone or email is required'),
  checkSchema({
    name: {
      errorMessage: 'Name is required.',
      trim: true,
    },
    phone: {
      isArray: true,
      optional: true,
      custom: {
        options: value => value.length > 0,
        errorMessage: 'Atleast one phone is required.',
      },
    },
    'phone.*.content': {
      exists: true,
      isString: true,
    },
    'phone.*.tag': {
      exists: true,
      isString: true,
      custom: {
        options: value => ['work', 'personal'].includes(value),
      },
    },
    email: {
      isArray: true,
      optional: true,
      custom: {
        options: value => value.length > 0,
        errorMessage: 'Atleast one email is required.',
      },
    },
    'email.*.content': {
      isEmail: true,
      exists: true,
      isString: true,
    },
    'email.*.tag': {
      exists: true,
      isString: true,
      custom: {
        options: value => ['work', 'personal'].includes(value),
      },
    },
  }),
];


module.exports = { create };

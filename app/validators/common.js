// @author: Vinay Kumar
'use strict';

const { checkSchema } = require('express-validator/check');


const isValidId = checkSchema({
  id: {
    in: ['params', 'query'],
    errorMessage: 'Invalid id',
    isMongoId: true,
  },
});


module.exports = { isValidId };

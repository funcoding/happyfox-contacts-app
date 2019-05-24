// @author: Vinay Kumar

'use strict';

const express = require('express');
const { validationResult } = require('express-validator/check');
const GroupController = require('../controllers/group-controller');
const validator = require('../validators/group-crud');

const route = express.Router();

function formValidator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

route.get('/group/:id', GroupController.show);
route.put('/group/:id', [...validator.create, formValidator], GroupController.update);
route.delete('/group/:id', GroupController.delete);
route.get('/group', GroupController.all);
route.post('/group', [...validator.create, formValidator], GroupController.store);

module.exports = route;

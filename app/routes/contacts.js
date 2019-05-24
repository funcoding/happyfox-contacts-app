// @author: Vinay Kumar

'use strict';

const express = require('express');
const { validationResult } = require('express-validator/check');
const ContactsController = require('../controllers/contacts-controller');
const validator = require('../validators/contacts-crud');

const route = express.Router();

function formValidator(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
  return next();
}

route.get('/contacts/:id', ContactsController.show);
route.put('/contacts/:id', [...validator.create, formValidator], ContactsController.update);
route.delete('/contacts/:id', ContactsController.delete);
route.get('/contacts', ContactsController.all);
route.post('/contacts', [...validator.create, formValidator], ContactsController.store);

module.exports = route;

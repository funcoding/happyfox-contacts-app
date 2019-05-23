// @author: Vinay Kumar

'use strict';

const express = require('express');
const ContactsController = require('../controllers/contacts-controller');

const route = express.Router();

route.get('/contacts/:id', ContactsController.show);
route.put('/contacts/:id', ContactsController.update);
route.delete('/contacts/:id', ContactsController.delete);
route.get('/contacts', ContactsController.all);
route.post('/contacts', ContactsController.store);

module.exports = route;

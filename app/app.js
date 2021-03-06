// @author: Vinay Kumar
'use strict';

const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');

const Config = require('../config');
const swaggerDocument = require('../swagger.json');
 
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (Config.env !== 'production') {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
}

// Contacts
app.use('/api', require('./routes/contacts'));

// Group
app.use('/api', require('./routes/group'));

app.use((req, res) => {
  return res.status(404).json({ error: 'not found' });
});

// Error handling
app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }
  res.status(500);
  res.json({ error: err });
});

module.exports = app;

// @author: Vinay Kumar
'use strict';

const express = require('express');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get('/', (req, res) => {
  res.send('hello world');
});

// Contacts
app.use('/api', require('./routes/contacts'));


module.exports = app;

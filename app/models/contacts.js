// @author: Vinay Kumar

'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const emailSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true,
  },
  tag: {
    type: String,
    enum: ['work', 'personal'],
    required: true,
  },
});

const phoneSchema = new Schema({
  content: {
    type: String,
    trim: true,
    required: true,
  },
  tag: {
    type: String,
    enum: ['work', 'personal'],
    required: true,
  },
});

const schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  email: [emailSchema],
  phone: [phoneSchema],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

mongoose.model('contact', schema);

module.exports = schema;

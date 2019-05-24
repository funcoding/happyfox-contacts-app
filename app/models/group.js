// @author: Vinay Kumar

'use strict';

const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  name: {
    type: String,
    trim: true,
    required: true,
  },
  contacts: [{ type: mongoose.Schema.ObjectId, ref: 'contact' }],
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

mongoose.model('group', schema);

module.exports = schema;

// @author: Vinay Kumar
'use strict';

const mongoose = require('mongoose');

const Contact = mongoose.model('contact');

class ContactsService {
  static async all(params) {
    return Contact.find({});
  }

  static async fetchById(id) {
    return Contact.findOne({ _id: id });
  }

  static async store(params) {
    const record = await new Contact(params).save();
    return { id: record.id };
  }

  static async update(params) {
        
  }

  static async delete(id) {
    return Contact.findOneAndRemove({ _id: id });
  }
}

module.exports = ContactsService;

// @author: Vinay Kumar
'use strict';

const mongoose = require('mongoose');

const Contact = mongoose.model('contact');

class ContactsService {
  static async all(params) {
    let { page = 1, limit = 10, search = ''} = params;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {
      $or: [
        { name: new RegExp(search, 'i') },
        { 'phone.content': new RegExp(search, 'i') },
        { 'email.content': new RegExp(search, 'i') },
      ],
    };
    const records = await Contact.find(filter)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const totalRecords = await Contact.countDocuments(filter);
    return { meta: { page, limit, total: totalRecords }, records };
  }

  static async fetchById(id) {
    return Contact.findOne({ _id: id });
  }

  static async store(params) {
    const record = await new Contact(params).save();
    return { _id: record._id };
  }

  static async update(id, params) {
    const record = await Contact.findOneAndUpdate({ _id: id }, params);
    return { _id: record._id };
  }

  static async delete(id) {
    return Contact.findOneAndRemove({ _id: id });
  }

  static async validateByids(ids) {
    const records = await Contact.find({ _id: { $in: ids } });
    return records.map(item => item._id);
  }
}

module.exports = ContactsService;

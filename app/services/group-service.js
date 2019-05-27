// @author: Vinay Kumar
'use strict';

const mongoose = require('mongoose');

const Group = mongoose.model('group');

class GroupService {
  static async all(params) {
    let { page = 1, limit = 10, search = ''} = params;
    page = parseInt(page);
    limit = parseInt(limit);
    const filter = {};
    if (search) {
      filter.name = new RegExp(search, 'i');
    }
    const records = await Group.find(filter)
      .select('name created_at')
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    const totalRecords = await Group.countDocuments(filter);
    return { meta: { page, limit, total: totalRecords }, records };
  }

  static async fetchById(id) {
    return Group.findOne({ _id: id }).populate({ path: 'contacts', select: 'name' });
  }

  static async store(params) {
    const record = await new Group(params).save();
    return { _id: record._id };
  }

  static async update(id, params) {
    const record = await Group.findOneAndUpdate({ _id: id }, params);
    return { _id: record._id };
  }

  static async delete(id) {
    return Group.findOneAndRemove({ _id: id });
  }
}

module.exports = GroupService;

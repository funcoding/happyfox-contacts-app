// @author: Vinay Kumar
'use strict';

const GroupService = require('../services/group-service');

class GroupController {
  static async all(req, res, next) {
    try {
      return res.json({ data: await GroupService.all(req.query) });
    } catch (e) {
      return next(e);
    }
  }

  static async show(req, res, next) {
    try {
      const data = await GroupService.fetchById(req.params.id);
      return data ? res.json({ data }) : next();
    } catch (e) {
      return next(e);
    }
  }

  static async store(req, res, next) {
    try {
      return res.json({ data: await GroupService.store(req.body) });
    } catch (e) {
      return next(e);
    }
  }

  static async update(req, res, next) {
    try {
      return res.json({ data: await GroupService.update(req.params.id, req.body) });
    } catch (e) {
      return next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const data = await GroupService.delete(req.params.id);
      return data ? res.status(204).json({ data }) : next();
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = GroupController;

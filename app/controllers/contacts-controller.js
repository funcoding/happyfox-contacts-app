// @author: Vinay Kumar
'use strict';

const ContactService = require('../services/contacts-service');

class ContactsController {
  static async all(req, res, next) {
    try {
      return res.json({ data: await ContactService.all(req.query) });
    } catch (e) {
      return next(e);
    }
  }

  static async show(req, res, next) {
    try {
      const data = await ContactService.fetchById(req.params.id);
      return data ? res.json({ data }) : next();
    } catch (e) {
      return next(e);
    }
  }

  static async store(req, res, next) {
    try {
      return res.json({ data: await ContactService.store(req.body) });
    } catch (e) {
      return next(e);
    }
  }

  static async update(req, res, next) {
    try {
      return res.json({ data: await ContactService.update(req.params.id, req.body) });
    } catch (e) {
      return next(e);
    }
  }

  static async delete(req, res, next) {
    try {
      const data = await ContactService.delete(req.params.id);
      return data ? res.status(204).json({ data }) : next();
    } catch (e) {
      return next(e);
    }
  }
}

module.exports = ContactsController;

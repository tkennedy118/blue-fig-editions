const db = require('../models');

// Methods for purchases controller.
module.exports = {
  findAll: function(req, res) {
    db.Purchase
      .find(req.query)
      .sort({ createdAt: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Purchase
      .findById(req.params.id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Purchase
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Purchase
      .findOneAndUpdate({ _id: req.params.id }, req.body.data, req.body.options)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Purchase
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove()
      .then(dbModel => res.json(dbModel)))
      .catch(err => res.status(422).json(err));
  }
};

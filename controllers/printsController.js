const db = require('../models');

// Methods for prints controller.
module.exports = {
  findAll: function(req, res) {
    db.Print
      .find(req.query)
      .sort({ createdAt: -1 })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.Print
      .findById(req.body._id)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    db.Print
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {
    db.Print
      .findOneAndUpdate({ _id: req.params.id }, req.body.data, req.body.options)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.Print
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove()
      .then(dbModel => res.json(dbModel)))
      .catch(err => res.status(422).json(err));
  }
};

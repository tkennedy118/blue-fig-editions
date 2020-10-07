const bcrypt = require('bcrypt');
const db = require('../models');

// Methods for users controller.
module.exports = {
  findAll: function(req, res) {
    db.User
      .find(req.query)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findById: function(req, res) {
    db.User
      .findOne({ _id: req.params.id })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  findByHash: function(req, res) {
    db.User
      .findOne({ resetPassword: req.body.hash })
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  create: function(req, res) {
    const salt = bcrypt.genSaltSync(10);
    req.body.password = bcrypt.hashSync(req.body.password, salt);
    req.body.isAdmin = false;

    db.User
      .create(req.body)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  update: function(req, res) {

    // Don't let non-admin post requests update isAdmin value.
    if (!req.user[0].isAdmin) { req.body.data.isAdmin = false; }

    // Handle password updates.
    if (req.body.data.password) {
      if (bcrypt.compareSync(req.body.data.currentPassword, req.user[0].password)) {
        const salt = bcrypt.genSaltSync(10);
        req.body.data.password = bcrypt.hashSync(req.body.data.password, salt);
      } else {
        return res.status(422).send({ error: 'Incorrect Password' });
      }
    }

    db.User
      .findOneAndUpdate({ _id: req.params.id }, req.body.data, req.body.options)
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },
  remove: function(req, res) {
    db.User
      .findById({ _id: req.params.id })
      .then(dbModel => dbModel.remove())
      .then(dbModel => res.json(dbModel))
      .catch(err => res.status(422).json(err));
  },

  resetPassword: async function(req, res) {
    let result;

    try {
      const user = await db.User.findOne({ passwordReset: req.body.hash });
    
      if (user) {
        const salt = bcrypt.genSaltSync(10);
        req.body.password = bcrypt.hashSync(req.body.password, salt);

        //Reset the password
        const response = await db.User.findOneAndUpdate({ _id: user._id }, {
          password: req.body.password,
          passwordReset: null
        });

        if (response) {
          result = res.send({ success: true });
        } else {
          result = res.send({ error: 'Password could not be saved.' });
        }

      } else {
        result = res.send({ error: 'Password could not be saved.' });
      }
    } catch {
      result = res.send({ error: 'Reset hash was not found in the database' });
    }

    return result;
  }
};

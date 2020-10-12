const router = require('express').Router();
const EasyPost = require('@easypost/api');
const db = require('../../models');
const isAuthenticated = require('../../config/middleware/isAuthenticated');
const isAdmin = require('../../config/middleware/isAdmin');

const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const api = new EasyPost(process.env.EASYPOST_API_KEY);

router.route('/retrieve-shipment-label/:id')
  .get(isAdmin, (req, res) => {
    api.Shipment.retrieve(req.params.id)
      .then((response) => {
        res.send(response.postage_label.label_url);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

router.route('/retrieve-shipment-date/:id')
  .get(isAuthenticated, (req, res) => {
    api.Shipment.retrieve(req.params.id)
      .then((response) => {
        res.send(response.created_at);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

router.route('/retrieve-shipment-rates/:id')
  .get(isAuthenticated, (req, res) => {
    api.Shipment.retrieve(req.params.id)
      .then((response) => {
        res.send(response.rates);
      })
      .catch((err) => {
        res.status(422).send(err);
      })
  })

router.route('/retrieve-parcel/:id')
  .get(isAuthenticated, (req, res) => {
    api.Parcel.retrieve(req.params.id)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(422).send(err);
      })
  });

router.route('/retrieve-address/:id')
  .get(isAuthenticated, (req, res) => {
    api.Address.retrieve(req.params.id)
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

router.route('/buy-shipment/:id')
  .post(isAuthenticated, (req, res) => {
    
    api.Shipment.retrieve(req.params.id)
      .then((shipment) => {
        shipment.buy(req.body.rate_id)
          .then((response) => {
            res.send(response);
          })
          .catch((err) => {
            res.status(422).send(err);
          });
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

router.route('/create-shipment')
  .post(isAuthenticated, async (req, res) => {

    try {
      // Get admin address for fromAddress.
      const response = await db.User.findOne({ email: process.env.ADMIN_EMAIL, isAdmin: true });
  
      const fromAddress = new api.Address(response.address);
      fromAddress.save()
        .then(() => {
          const shipment = new api.Shipment({
            from_address: fromAddress.id,
            to_address: req.body.toAddress,
            parcel: req.body.parcel
          });
      
          shipment.save()
            .then((response) => {
              res.send(response);
            })
            .catch((err) => {
              res.status(422).send(err);
            });
        })
        .catch((err) => {
          res.status(422).send(err);
        });

    } catch (err) {
      res.status(422).send(err);
    }
  });

router.route('/create-parcel')
  .post(isAuthenticated, (req, res) => {
    const parcel = new api.Parcel(req.body.parcel);

    parcel.save()
      .then((response) => {
        res.send(response);
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

router.route('/create-address')
  .post(isAuthenticated, (req, res) => {
    req.body.address.verify = ['delivery', 'zip4'];
    const address = new api.Address(req.body.address);

    address.save()
      .then((response) => {
        if (response.verifications.delivery.success) {
          res.send(response);
        } else {
          res.status(422).send({ err: response.verifications.delivery.errors });
        }
      })
      .catch((err) => {
        res.status(422).send(err);
      });
  });

module.exports = router;

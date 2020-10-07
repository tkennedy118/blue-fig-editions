const router = require('express').Router();
const purchasesController = require('../../controllers/purchasesController');
const isAuthenticated = require('../../config/middleware/isAuthenticated');

// Matches with '/api/purchases'
router.route('/')
  .get(isAuthenticated, purchasesController.findAll)
  .post(isAuthenticated, purchasesController.create);

// Matches with '/api/purchases/:id'
router.route('/:id')
  .get(isAuthenticated, purchasesController.findById)
  .post(isAuthenticated, purchasesController.update)
  .delete(isAuthenticated, purchasesController.remove);

module.exports = router;

const router = require('express').Router();
const usersController = require('../../controllers/usersController');
const isAuthenticated = require('../../config/middleware/isAuthenticated');
const isAuthorized = require('../../config/middleware/isAuthorized');
// Matches with '/api/users'
router.route('/')
  .get(usersController.findAll)
  .post(usersController.create);

router.route('/reset-password')
  .post(usersController.resetPassword);

// Matches with '/api/users/:id'
router.route('/:id')
  .get(usersController.findById)
  .post(isAuthorized, usersController.update)
  .delete(isAuthenticated, usersController.remove);

  module.exports = router;

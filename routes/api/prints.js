const router = require("express").Router();
const printsController = require("../../controllers/printsController");
const isAdmin = require('../../config/middleware/isAdmin');
const isAuthenticated = require('../../config/middleware/isAuthenticated');

// Matches with "/api/posts/:id"
router.route("/:id")
  .get(printsController.findById)
  .put(isAuthenticated, printsController.update)
  .delete(isAdmin, printsController.remove);

// Matches with "/api/posts"
router.route("/")
  .get(printsController.findAll)
  .post(isAdmin, printsController.create);

module.exports = router;

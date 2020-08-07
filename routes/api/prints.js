const router = require("express").Router();
const printsController = require("../../controllers/pprintsController");

// Matches with "/api/posts"
router.route("/")
  .get(printsController.findAll)
  .post(printsController.create);

// Matches with "/api/posts/:id"
router.route("/:id")
  .get(printsController.findById)
  .put(printsController.update)
  .delete(printsController.remove);

module.exports = router;

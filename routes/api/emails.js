const router = require("express").Router();
const emailsController = require("../../controllers/emailsController");

// Matches with "/api/email"
router.route("/send")
  .put(emailsController.send);

module.exports = router;

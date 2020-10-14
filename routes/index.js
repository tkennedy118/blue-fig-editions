const path = require('path');
const router = require('express').Router();
const apiRoutes = require('./api');

// Catch all API routes.
router.use('/api', apiRoutes);

// If no other routes are hit, send to home page.
router.use(function(req, res) {
  res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

module.exports = router;

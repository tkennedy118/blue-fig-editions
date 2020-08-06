const router = require('express').Router();
const db = require('../../models');
const passport = require('../../config/passport');
const userRoutes = require('./users');
// const snipRoutes = require('./snips');
const usersController = require('../../controllers/usersController');
const isAuthenticated = require('../../config/middleware/isAuthenticated');

// Catch user and snip routes.
router.use('/users', userRoutes);
// router.use('/snips', snipRoutes);

// =============================== SIGNUP/LOGIN/LOGOUT/STATUS ===================================

// Route to signup. If the user is created successfully, respond with the user information. The
// client side should hanlde login upon successful creation.
router.route('/signup').post(usersController.create);

// Route to login. Uses passport.authenticate middleware that was set up with local strategy.
// If the user has valid login credentials, sign them in. Otherwise send an error.
router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) { console.log(err); }

    // Username or password was incorrect.
    if (info) { res.json({ message: info.message }); } 
    
    // Username and password were correct.
    req.logIn(user, err => {
      if (err) { return next(err); }
      return res.json(user);
    });
  })(req, res, next);
});

// Route to terminate a login session. According to passport docs, invoking req.logout() will
// remove the req.user property and clear the lgoin session (if any).
router.get('/logout', isAuthenticated, (req, res) => {
  req.logout();
  return res.json({ status: false });
});

// Route to determine if user is logged in.
router.get('/status', (req, res) => {
  if (req.user) {
    db.User.findById(req.user[0].id)
      .then(dbUser =>  res.json(dbUser))
      .catch(err => console.log(err));
  }

  // User is not logged in
  else { return res.json({ status: false }); }
});

// ===================================================================================
module.exports = router;

// Middleware for restricting routes that only a logged in user may see.
module.exports = function(req, res, next) {
  // If user is loggin in, continue with request to restriced route.
  if(req.user) {
    return next();
  }

  // If user isn't loggin in, redirect to login page.
  return res.redirect('/api/login');
};

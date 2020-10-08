// Middleware for restricting routes that only a logged in user may see.
module.exports = function(req, res, next) {

  // If user is loggin in, continue with request to restriced route.
  if(String(req.user[0]._id) === req.params.id) {
    return next();
  }
};

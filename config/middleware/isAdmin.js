// Middleware for restricting routes that only a logged in user may see.
module.exports = function(req, res, next) {
  
  // If user is loggin in, continue with request to restriced route.
  if(req.user && req.user[0].isAdmin) {
    return next();
  }
};

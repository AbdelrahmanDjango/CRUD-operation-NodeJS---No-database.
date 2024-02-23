// Simple function to understand what's middleware meaning. 
function logger (req, res, next) {
    console.log('Login with some user..');
    next();
};

module.exports = logger;
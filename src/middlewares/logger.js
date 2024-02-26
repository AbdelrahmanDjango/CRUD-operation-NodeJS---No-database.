// Simple function to understand what's middleware meaning. 
function logger (req, res, next) {
    console.log(`Method is ${req.method} on '${req.originalUrl}' url at ${new Date()}`)
    next();
};


module.exports = logger


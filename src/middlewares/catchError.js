// Middleware to handle wrong urls.
function catchError(req, res, next){
    if (req.originalUrl === '/favicon.ico') {
        return next();
    }
    const err = new Error(`Can't find this link: ${req.originalUrl}`)
    console.log(`Error: ${err.message}`);
    res.status(400).json({err: err.message});
    next();
};

module.exports = catchError;
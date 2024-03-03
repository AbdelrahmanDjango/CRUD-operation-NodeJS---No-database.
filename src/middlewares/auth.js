const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

function ensureAuth(givenRoles) {
  return function ensureUser(req, res, next) {
    /**
     * extract token from the header if not return error
     * validate token if not return error
     * update the request with the user  request.user = {id:1, email:someEamil@test.com}
     */
    try {
      const token = req.headers["authorization"];
      console.log(token);
      if (!token) {
        return res.status(403).send("invalid authorization");
      }
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);

      if (!decodedToken) {
        return res.status(403).send("invalid authorization");
      }

      console.log({ decodedToken });
      if (!givenRoles.includes(decodedToken.role)) {
        return res.status(403).send("invalid authorization");
      }
      req.user = decodedToken;

      next();
    } catch (e) {
      console.log(e);
      return res.status(403).send("invalid authorization");
    }
  };
}

module.exports = ensureAuth;

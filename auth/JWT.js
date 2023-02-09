const jwt = require("jsonwebtoken");

const createJWT = (user, callback) => {
  jwt.sign(
    JSON.parse(JSON.stringify(user)),
    process.env.SECRETORPRIVATEKEY,
    {
      expiresIn: "1h",
    },
    (error, token) => {
      callback(error, token);
    }
  );
};

module.exports = createJWT;

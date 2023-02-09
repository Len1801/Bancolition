const { validationResult } = require("express-validator");

const validation = (req, res, next) => {

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    let output = {
        cod : 400,
        msg : errors.errors[0].msg
    }
    console.log(output)
    return res.status(400).json(output);
  }
  next();
};

module.exports = {
    validation
};

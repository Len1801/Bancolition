const morgan = require("morgan");

morgan.token("localdate", () => new Date());

const morganFormat = (tokens, req, res) => {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    "|",
    tokens["localdate"](req, res),
    "|",
    tokens["response-time"](req, res),
    "ms",
  ].join(" ");
};

module.exports = {
    morganFormat
}
// module.exports = morganFormat;

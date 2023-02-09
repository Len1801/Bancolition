const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const { morganFormat } = require("../middlewares/morgan.config");
const swaggerUI = require("swagger-ui-express");
const swaggerFile = require("../docs/swagger_output.json");

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT;
    this.basePath = "/api/bankconlition";

    // Middlewares
    this.middlewares();

    // Rutas de mi aplicación
    this.routes();
  }

  middlewares() {
    //CORS
    this.app.use(cors());

    //Lectura y parseo del body
    this.app.use(express.json());

    //Directorio Público
    this.app.use(express.static("public"));

    //Morgan
    this.app.use(morgan(morganFormat));

    this.app.use(express.urlencoded({ extended: true }));
  }

  routes() {
    this.app.use(this.basePath, require("../routes/auth"));
    this.app.use(this.basePath, require("../routes/accounts"));
    this.app.use(this.basePath, require("../routes/clients"));
    this.app.use(this.basePath, require("../routes/cartolas"));
    this.app.use(this.basePath, require("../routes/users"));
    this.app.use(
      `${this.basePath}/docs`,
      swaggerUI.serve,
      swaggerUI.setup(swaggerFile)
    );
  }

  listener() {
    this.app.listen(this.port, () => {
      console.log("Server running at port", this.port);
    });
  }
}

module.exports = Server;

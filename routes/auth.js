const { Router } = require("express");
const { check } = require("express-validator");
const {validation} = require("../middlewares/validations");

const controller = require("../controllers/auth");

const router = Router();

router.post("/login", [
    check("usuario")
    .notEmpty()
    .withMessage("El usuario es obligatorio")
    .bail()
    .custom(usuario => /^([a-zA-Z0-9_])*$/.test(usuario))
    .withMessage("El nombre del usuario no puede llevar caracteres especiales")
    .bail(),
    check("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .bail(),
    validation
],controller.login)

module.exports = router;
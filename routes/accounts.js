const { Router } = require("express");
const { check } = require("express-validator");
const {validation} = require("../middlewares/validations");

const controller = require("../controllers/accounts");
const validateToken = require("../middlewares/validateJWT");

const router = Router();

router.get("/accounts",[
    validateToken
],controller.getAccounts)

router.get("/accounts/:id",[
    check("id")
    .toInt()
    .isInt()
    .withMessage("El id debe ser numerico")
    .bail()
    .custom(id => id > 0)
    .withMessage("El id debe ser mayor a 0")
    .bail(),
    validateToken,
    validation
], controller.getAccountById)

router.post("/accounts",[
    check("idCliente")
    .isNumeric()
    .withMessage("El cliente debe ser numerico")
    .bail()
    .custom(idCliente => idCliente > 0)
    .withMessage("El id cliente debe ser mayor a 0")
    .bail(),
    check("idBanco")
    .isNumeric()
    .withMessage("El id banco debe ser numerico")
    .bail()
    .custom(idBanco => idBanco > 0)
    .withMessage("El id banco debe ser mayor a 0")
    .bail(),
    check("idTipoCuenta")
    .isNumeric()
    .withMessage("El id tipo de cuenta debe ser numerico")
    .bail()
    .custom(idTipoCuenta => idTipoCuenta > 0)
    .withMessage("El id tipo de cuenta debe ser mayor a 0")
    .bail(),
    check("rut")
    .notEmpty()
    .withMessage("El rut es obligatorio")
    .bail(),
    check("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .bail()
    .custom(password => /([\S])+/.test(password))
    .withMessage("La contraseña no puede llevar espacios en blanco")
    .bail(),
    check("numeroCuenta")
    .isNumeric()
    .withMessage("El cliente debe ser numerico")
    .bail()
    .isLength({min: 6, max: 45})
    .withMessage("El numero de cuenta debe llevar entre 6 y 45 caracteres")
    .bail()
    .custom(idCliente => idCliente > 0)
    .withMessage("El id cliente debe ser mayor a 0")
    .bail(),
    validateToken,
    validation
],controller.insertAccount)

router.put("/accounts",[
    check("idCuenta")
    .isNumeric()
    .withMessage("El id de cuenta debe ser numerico")
    .bail()
    .custom(idCuenta => idCuenta > 0)
    .withMessage("El id de cuenta debe ser mayor a 0")
    .bail(),
    check("rut")
    .notEmpty()
    .withMessage("El rut es obligatorio")
    .bail(),
    check("password")
    .notEmpty()
    .withMessage("La password es obligatoria")
    .bail()
    .custom(password => /([\S])+/.test(password))
    .withMessage("La contraseña no puede llevar espacios en blanco")
    .bail(),
    validateToken,
    validation
],controller.updateAccount)

router.put("/accounts/:id",[
    check("id")
    .toInt()
    .isInt()
    .withMessage("El id debe ser numerico")
    .bail()
    .custom(id => id > 0)
    .withMessage("El id debe ser mayor a 0")
    .bail(),
    validateToken,
    validation
], controller.activateAccount)

router.delete("/accounts/:id",[
    check("id")
    .toInt()
    .isInt()
    .withMessage("El id debe ser numerico")
    .bail()
    .custom(id => id > 0)
    .withMessage("El id debe ser mayor a 0")
    .bail(),
    validateToken,
    validation
], controller.deleteAccount)

module.exports = router;
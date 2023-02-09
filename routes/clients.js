const { Router } = require("express");
const { check } = require("express-validator");
const {validation} = require("../middlewares/validations");

const controller = require("../controllers/clients");
const validateToken = require("../middlewares/validateJWT");

const router = Router();

router.get("/clients",[
    validateToken
],controller.getClients)

router.get("/clients/:id",[
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
], controller.getClientById)

router.post("/clients",[
    check("empresa")
    .notEmpty()
    .withMessage("El nombre de empresa es obligatorio")
    .bail()
    .isLength({min: 3, max: 45})
    .withMessage("El nombre de empresa debe llevar entre 3 y 45 caracteres")
    .bail()
    .custom(empresa => /^([a-zA-Z])+(?:\s[a-zA-Z]+)*$/.test(empresa))
    .withMessage("El nombre de empresa no puede llevar caracteres especiales")
    .bail(),
    check("rut")
    .notEmpty()
    .withMessage("El rut es obligatorio")
    .bail(),
    validateToken,
    validation
],controller.insertClient)

router.put("/clients",[
    check("idCliente")
    .isNumeric()
    .withMessage("El id cliente debe ser numerico")
    .bail()
    .custom(idCliente => idCliente > 0)
    .withMessage("El id cliente debe ser mayor a 0")
    .bail(),
    check("empresa")
    .notEmpty()
    .withMessage("El nombre de empresa es obligatorio")
    .bail()
    .isLength({min: 3, max: 45})
    .withMessage("El nombre de empresa debe llevar entre 3 y 45 caracteres")
    .bail()
    .custom(empresa => /^([a-zA-Z])+(?:\s[a-zA-Z]+)*$/.test(empresa))
    .withMessage("El nombre de empresa no puede llevar caracteres especiales")
    .bail(),
    check("rut")
    .notEmpty()
    .withMessage("El rut es obligatorio")
    .bail(),
    validateToken,
    validation
],controller.updateClient)

router.put("/clients/:id",[
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
], controller.activateClient)

router.delete("/clients/:id",[
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
], controller.deleteClient)

module.exports = router;
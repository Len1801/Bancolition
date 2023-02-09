const { Router } = require("express");
const { check } = require("express-validator");
const {validation} = require("../middlewares/validations");
const upload = require("../middlewares/upload");

const controller = require("../controllers/cartolas");
const validateToken = require("../middlewares/validateJWT");

const router = Router();

router.post("/cartolas/conciliation",[
    validateToken,
    upload.single("file")
],controller.getConciliation)

router.get("/cartolas/:idCuenta",[
    validateToken
], controller.getCartolas)


module.exports = router;
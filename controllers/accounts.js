const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../database/connection");

const getAccounts = (req = request, res = response) => {
  let sql = "CALL sp_sel_cuentabancaria()";
  const { rol } = req.body.payload;
  if (rol === "Administrador") {
    db(sql, res, (result) => res.json({ accounts: result }));
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }

  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para obtener una lista con todas las cuentas bancarias en el sistema"
   */
};

const getAccountById = (req = request, res = response) => {
  const { id } = req.params;
  let sql = `CALL sp_sel_cuentabancaria_by_id('${id}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (result[0]) {
        res.json(result[0]);
      } else {
        res.status(400).json({
          cod: 400,
          msg: "La cuenta bancaria que buscas, no existe",
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
  /**
     * #swagger.tags = ["Accounts"]
     * #swagger.description = "Endpoint para obtener cuentas bancarias por id"
     * #swagger.parameters['Request'] = {
                  in: 'body',
                  schema: {}
     */
};

const insertAccount = (req = request, res = response) => {
  const { idCliente, idBanco, idTipoCuenta, rut, password, numeroCuenta } =
    req.body;
  const { rol } = req.body.payload;

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  let sql = `CALL sp_ins_cuentabancaria('${idCliente}','${idBanco}','${idTipoCuenta}','${rut}','${passwordEncrypted}','${numeroCuenta}')`;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (result[0].id) {
        res.json(result[0]);
      } else {
        res.status(400).json({
          cod: 400,
          msg: result[0].msg,
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para crear cuentas bancarias en el sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestInsertAccount"}
      }
   */
};

const updateAccount = (req = request, res = response) => {
  const { idCuenta, rut, password } = req.body;
  const { rol } = req.body.payload;

  //Encriptar password
  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  let sql = `CALL sp_upd_cuentabancaria('${idCuenta}','${rut}','${passwordEncrypted}')`;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cuenta bancaria actualizada con éxito",
        });
      } else {
        res.status(400).json({
          cod: 400,
          msg: result[0].msg,
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para actualizar cuentas bancarias del sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestUpdateAccount"}
      }
   */
};

const deleteAccount = (req = request, res = response) => {
  const { id } = req.params;
  let sql = `CALL sp_del_cuentabancaria('${id}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cuenta bancaria desactivada con éxito",
        });
      } else {
        res.status(400).json({
          cod: 400,
          msg: result[0].msg,
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para desactivar cuentas bancarias del sistema"
   * #swagger.parameters['Request'] = {
                in: 'body',
                schema: {}
   */
};

const activateAccount = (req = request, res = response) => {
  const { id } = req.params;
  let sql = `CALL sp_activar_cuenta('${id}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cuenta bancaria activada con éxito",
        });
      } else {
        res.status(400).json({
          cod: 400,
          msg: result[0].msg,
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para activar cuentas bancarias del sistema"
   * #swagger.parameters['Request'] = {
                in: 'body',
                schema: {}
   */
};

module.exports = {
  getAccounts,
  getAccountById,
  insertAccount,
  updateAccount,
  deleteAccount,
  activateAccount
};

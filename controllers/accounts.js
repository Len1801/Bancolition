const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../database/connection");

const getAccounts = (req = request, res = response) => {
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_cuentabancaria()", [], res, (result) => res.json({ accounts: result }));
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para obtener una lista con todas las cuentas bancarias en el sistema"
   */
};

const getAccountById = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_cuentabancaria_by_id(?)", [id], res, (result) => {
    if (result[0]) {
      res.json(result[0]);
    } else {
      res.status(400).json({ cod: 400, msg: "La cuenta bancaria que buscas, no existe" });
    }
  });
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para obtener cuentas bancarias por id"
   */
};

const insertAccount = (req = request, res = response) => {
  const { idCliente, idBanco, idTipoCuenta, rut, password, numeroCuenta } = req.body;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }

  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  db(
    "CALL sp_ins_cuentabancaria(?, ?, ?, ?, ?, ?)",
    [idCliente, idBanco, idTipoCuenta, rut, passwordEncrypted, numeroCuenta],
    res,
    (result) => {
      if (result[0].id) {
        res.json(result[0]);
      } else {
        res.status(400).json({ cod: 400, msg: result[0].msg });
      }
    }
  );
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
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }

  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  db("CALL sp_upd_cuentabancaria(?, ?, ?)", [idCuenta, rut, passwordEncrypted], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cuenta bancaria actualizada con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
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
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_del_cuentabancaria(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cuenta bancaria desactivada con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para desactivar cuentas bancarias del sistema"
   */
};

const activateAccount = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_activar_cuenta(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cuenta bancaria activada con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Accounts"]
   * #swagger.description = "Endpoint para activar cuentas bancarias del sistema"
   */
};

module.exports = { getAccounts, getAccountById, insertAccount, updateAccount, deleteAccount, activateAccount };

const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../database/connection");

const getUsers = (req = request, res = response) => {
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_usuario()", [], res, (result) => res.json({ users: result }));
  /**
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para obtener una lista con todos los usuarios del sistema"
   */
};

const getUserById = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_usuario_by_id(?)", [id], res, (result) => {
    if (result[0]) {
      res.json(result[0]);
    } else {
      res.status(400).json({ cod: 400, msg: "El usuario que buscas, no existe" });
    }
  });
  /**
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para obtener usuarios por id"
   */
};

const insertUser = (req = request, res = response) => {
  const { idCliente, username, password, rut, nombres, apellidos, correo } = req.body;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }

  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  db(
    "CALL sp_ins_usuario(?, ?, ?, ?, ?, ?, ?)",
    [idCliente, username, passwordEncrypted, rut, nombres, apellidos, correo],
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
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para crear usuarios del sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestInsertUser"}
      }
   */
};

const updateUser = (req = request, res = response) => {
  const { idUsuario, username, password, rut, nombres, apellidos, correo } = req.body;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }

  const salt = bcryptjs.genSaltSync();
  const passwordEncrypted = bcryptjs.hashSync(password, salt);

  db(
    "CALL sp_upd_usuario(?, ?, ?, ?, ?, ?, ?)",
    [idUsuario, username, passwordEncrypted, rut, nombres, apellidos, correo],
    res,
    (result) => {
      if (!result) {
        res.json({ cod: 200, msg: "Usuario actualizado con éxito" });
      } else {
        res.status(400).json({ cod: 400, msg: result[0].msg });
      }
    }
  );
  /**
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para actualizar usuarios del sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestUpdateUser"}
      }
   */
};

const deleteUser = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_del_usuario(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Usuario desactivado con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para desactivar usuarios del sistema"
   */
};

const activateUser = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_activar_usuario(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Usuario activado con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Users"]
   * #swagger.description = "Endpoint para activar usuarios del sistema"
   */
};

module.exports = { getUsers, getUserById, insertUser, updateUser, deleteUser, activateUser };

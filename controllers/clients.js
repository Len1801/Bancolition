const { response, request } = require("express");
const db = require("../database/connection");

const getClients = (req = request, res = response) => {
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_cliente()", [], res, (result) => res.json({ clients: result }));
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para obtener una lista con todos los clientes del sistema"
   */
};

const getClientById = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_sel_cliente_by_id(?)", [id], res, (result) => {
    if (result[0]) {
      res.json(result[0]);
    } else {
      res.status(400).json({ cod: 400, msg: "El cliente que buscas, no existe" });
    }
  });
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para obtener clientes por id"
   */
};

const insertClient = (req = request, res = response) => {
  const { empresa, rut } = req.body;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_ins_cliente(?, ?)", [empresa, rut], res, (result) => {
    if (result[0].id) {
      res.json(result[0]);
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para crear clientes del sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestInsertClient"}
      }
   */
};

const updateClient = (req = request, res = response) => {
  const { idCliente, empresa, rut } = req.body;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_upd_cliente(?, ?, ?)", [idCliente, empresa, rut], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cliente actualizado con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para actualizar clientes del sistema"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestUpdateClient"}
      }
   */
};

const deleteClient = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_del_cliente(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cliente desactivado con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para desactivar clientes del sistema"
   */
};

const activateClient = (req = request, res = response) => {
  const { id } = req.params;
  const { rol } = req.body.payload;
  if (rol !== "Administrador") {
    return res.status(401).json({ cod: 401, msg: "Usuario no tiene rol de administrador" });
  }
  db("CALL sp_activar_cliente(?)", [id], res, (result) => {
    if (!result) {
      res.json({ cod: 200, msg: "Cliente activado con éxito" });
    } else {
      res.status(400).json({ cod: 400, msg: result[0].msg });
    }
  });
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para activar clientes del sistema"
   */
};

module.exports = { getClients, getClientById, insertClient, updateClient, deleteClient, activateClient };

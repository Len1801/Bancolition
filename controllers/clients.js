const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../database/connection");

const getClients = (req = request, res = response) => {
  let sql = "CALL sp_sel_cliente()";
  const { rol } = req.body.payload;
  if (rol === "Administrador") {
    db(sql, res, (result) => res.json({ clients: result }));
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador",
    });
  }
 
  /**
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para obtener una lista con todos los clientes del sistema"
   */
};

const getClientById = (req = request, res = response) => {
    const { id } = req.params;
    let sql = `CALL sp_sel_cliente_by_id('${id}')`;
    const { rol } = req.body.payload;
  
    if (rol === "Administrador") {
      db(sql, res, (result) => {
        if (result[0]) {
          res.json(result[0]);
        } else {
          res.status(400).json({
            cod: 400,
            msg: "El cliente que buscas, no existe",
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
     * #swagger.tags = ["Clients"]
     * #swagger.description = "Endpoint para obtener clientes por id"
     * #swagger.parameters['Request'] = {
                  in: 'body',
                  schema: {}
     */
  };

const insertClient = (req = request, res = response) => {
  const { empresa, rut } = req.body;
  let sql = `CALL sp_ins_cliente('${empresa}','${rut}')`;
  const { rol } = req.body.payload;

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
  let sql = `CALL sp_upd_cliente('${idCliente}','${empresa}','${rut}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cliente actualizado con éxito",
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
  let sql = `CALL sp_del_cliente('${id}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cliente desactivado con éxito",
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
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para desactivar clientes del sistema"
   * #swagger.parameters['Request'] = {
                in: 'body',
                schema: {}
   */
};

const activateClient = (req = request, res = response) => {
  const { id } = req.params;
  let sql = `CALL sp_activar_cliente('${id}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador") {
    db(sql, res, (result) => {
      if (!result) {
        res.json({
          cod: 200,
          msg: "Cliente activado con éxito",
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
   * #swagger.tags = ["Clients"]
   * #swagger.description = "Endpoint para activar clientes del sistema"
   * #swagger.parameters['Request'] = {
                in: 'body',
                schema: {}
   */
};


module.exports = {
  getClients,
  getClientById,
  insertClient,
  updateClient,
  deleteClient,
  activateClient
};

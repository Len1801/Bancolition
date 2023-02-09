const { response, request } = require("express");
const db = require("../database/connection");
const fs = require("fs");
const csv = require("fast-csv");

const getConciliation = (req = request, res = response) => {
  // const { rol } = req.body.payload;
  // if(rol === "Administrador" || rol === "Consultor"){

  try {
    if (req.file == undefined) {
      return res.status(400).send({
        msg: "Solo se permiten archivos csv",
      });
    }
    let csvResult = [];
    let path = `D:\\tesis\\backend-bankconlition\\temp\\${req.file.originalname}`;
    fs.createReadStream(path)
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => {
        throw error.message;
      })
      .on("data", (row) => {
        csvResult.push(row);
      })
      .on("end", () => {
        csvResult.forEach((row) => {
          let sql = `CALL sp_ins_librodiario('${row.monto}', '${row.cargoAbono}', '${row.descripcion}', '${row.fecha}')`;
          db(sql, res, (result) => {});
        });
      });
    return res.json({ msg: `Se insertaron ${csvResult.length} resultados` });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      msg: `No se pudo descargar el archivo ${req.file.originalname}`,
    });
  }
  // }else{
  //     return res.status(401).json({
  //         cod: 401,
  //         msg: "Usuario no tiene rol de administrador o consultor",
  //       });
  // }

  /**
   * #swagger.tags = ["Cartolas"]
   * #swagger.description = "Endpoint para poder efectuar conciliación, se debe enviar atraves de form-data un archivo csv, respetando la estructura (Monto, CargoAbono, Descripcion y Fecha)"
   * #swagger.parameters['Request'] = {
                  in: 'body',
                  schema: {}
   */
};

const getCartolas = (req = request, res = response) => {
  const { desde = 0, hasta = 0 } = req.query;
  const { idCuenta } = req.params;
  const { clienteId } = req.body.payload;
  let sql = `CALL sp_ListarCartola('${clienteId}','${idCuenta}','${desde}','${hasta}')`;
  const { rol } = req.body.payload;

  if (rol === "Administrador" || rol === "Consultor") {
    db(sql, res, (result) => {
      if (result[0]) {
        res.json(result);
      } else {
        res.status(400).json({
          cod: 400,
          msg: "La cuenta que buscas no existe o no tiene registros",
        });
      }
    });
  } else {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador o consultor",
    });
  }
  /**
     * #swagger.tags = ["Cartolas"]
     * #swagger.description = "Endpoint para obtener una lista de cartolas, se puede filtrar por rango de fechas (desde y hasta)"
     * #swagger.parameters['Request'] = {
                  in: 'body',
                  schema: {}
     */
};

module.exports = {
  getConciliation,
  getCartolas,
};

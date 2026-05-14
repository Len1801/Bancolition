const { response, request } = require("express");
const db = require("../database/connection");
const fs = require("fs");
const path = require("path");
const csv = require("fast-csv");

const getConciliation = (req = request, res = response) => {
  if (!req.file) {
    return res.status(400).json({ msg: "Solo se permiten archivos csv" });
  }

  const filePath = req.file.path;
  const csvResult = [];

  fs.createReadStream(filePath)
    .pipe(csv.parse({ headers: true }))
    .on("error", () => {
      fs.unlink(filePath, () => {});
      return res.status(500).json({ msg: "Error al procesar el archivo CSV" });
    })
    .on("data", (row) => {
      csvResult.push(row);
    })
    .on("end", async () => {
      fs.unlink(filePath, () => {});

      if (csvResult.length === 0) {
        return res.json({ msg: "El archivo no contiene datos" });
      }

      try {
        for (const row of csvResult) {
          await db.async("CALL sp_ins_librodiario(?, ?, ?, ?)", [
            row.monto,
            row.cargoAbono,
            row.descripcion,
            row.fecha,
          ]);
        }
        res.json({ msg: `Se insertaron ${csvResult.length} resultados` });
      } catch (err) {
        res.status(500).json({ msg: "Error al insertar los datos del CSV" });
      }
    });
  /**
   * #swagger.tags = ["Cartolas"]
   * #swagger.description = "Endpoint para poder efectuar conciliación, se debe enviar atraves de form-data un archivo csv, respetando la estructura (Monto, CargoAbono, Descripcion y Fecha)"
   */
};

const getCartolas = (req = request, res = response) => {
  const { desde = 0, hasta = 0 } = req.query;
  const { idCuenta } = req.params;
  const { clienteId, rol } = req.body.payload;

  if (rol !== "Administrador" && rol !== "Consultor") {
    return res.status(401).json({
      cod: 401,
      msg: "Usuario no tiene rol de administrador o consultor",
    });
  }

  db(
    "CALL sp_ListarCartola(?, ?, ?, ?)",
    [clienteId, idCuenta, desde, hasta],
    res,
    (result) => {
      if (result[0]) {
        res.json(result);
      } else {
        res.status(400).json({
          cod: 400,
          msg: "La cuenta que buscas no existe o no tiene registros",
        });
      }
    }
  );
  /**
   * #swagger.tags = ["Cartolas"]
   * #swagger.description = "Endpoint para obtener una lista de cartolas, se puede filtrar por rango de fechas (desde y hasta)"
   */
};

module.exports = { getConciliation, getCartolas };

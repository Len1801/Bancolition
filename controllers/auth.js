const { response, request } = require("express");
const bcryptjs = require("bcryptjs");
const db = require("../database/connection");
const createJWT = require("../auth/JWT");

const login = (req = request, res = response) => {
  const { usuario, password } = req.body;

  let sql = `CALL sp_ValidarUsuario('${usuario}', '${password}')`;

  db(sql, res, (result) => {
    if (result[0]) {
      const {pass, ...user} = result[0];
      if(!bcryptjs.compareSync(password, pass)){
        res.status(401).json({
          cod: 401,
          msg: "Contraseña incorrecta",
        });
      }
      createJWT(user, (error, token) =>{
        if(error){
          console.log(error);
          return res.status(500).json({
            cod: 500,
            msg: "Error al crear token, intente más tarde",
          })
        }else{
          return res.json({
            user,
            token
          })
        }
      });
    } else {
      res.status(401).json({
        cod: 401,
        msg: "Usuario no registrado en el sistema",
      });
    }
  });
  /**
   * #swagger.tags = ["Login"]
   * #swagger.description = "Endpoint para poder ingresar al sistema mediante usuario y password"
   * #swagger.parameters['Request'] = {
        in: "body",
        description: "Ejemplo de request",
        required: true,
        schema: { $ref: "#/definitions/RequestLogin"}
      }
   */
}

module.exports = {
  login
};

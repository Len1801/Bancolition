const swaggerAutogen = require("swagger-autogen")();

const outputFile = "./docs/swagger_output.json";
const endpointFiles = ["./routes/*.js"];

const doc = {
    info: {
        version : "1.0.0",
        title : "Bankconlition API",
        description : "Documentación de los endpoints creados para ser consumidos por el equipo de front-end de Bankconliton"
    },
    host: "localhost:3000",
    basePath: "/api/bankconlition",
    schms: ["http"],
    consumes: ["application/json"],
    produces: ["application/json"],
    tags: [
        {
            "name" : "Accounts",
            "description" : "CRUD de cuentas para rol Administrador"
        },
        {
            "name" : "Cartolas",
            "description" : "Listado de cartolas y conciliación"
        },
        {
            "name" : "Clients",
            "description" : "CRUD de clientes para rol Administrador"
        },
        {
            "name" : "Login",
            "description" : "Autenticación de usuarios del sistema"
        },
        {
            "name" : "Users",
            "description" : "CRUD de usuarios para rol Administrador"
        }
    ],
    definitions: {
        RequestInsertUser:{
            idCliente : 2,
            username : "userAPI221",
            password : "123abc",
            rut : "8-911",
            nombres : "juan",
            apellidos : "lopez",
            correo : "juan_lopez@gmail.cl"
        },
        RequestInsertAccount:{
            idCliente : 2,
            idBanco : 2,
            idTipoBanco : 1,
            rut : "8-911",
            password : "123abc",
            numeroCuenta : "999999999"
        },
        RequestInsertClient:{
            empresa : "empresa test",
            rut : "1221-3"
        },
        RequestLogin :{
            usuario : "pperes",
            password : "pperez"
        },
        RequestUpdateUser:{
            idUsuario : 9,
            username : "userAPI221",
            password : "123abc",
            rut : "8-911",
            nombres : "juan",
            apellidos : "lopez",
            correo : "juan_lopez@gmail.cl"
        },
        RequestUpdateAccount:{
            idCuenta : 9,
            idBanco : 2,
            idTipoBanco : 1,
            rut : "8-911",
            password : "123abc",
            numeroCuenta : "999999999"
        },
        RequestUpdateClient:{
            idCliente : 2,
            empresa : "empresa update test",
            rut : "1221-31"
        },
    }
}

swaggerAutogen(outputFile, endpointFiles, doc).then(() =>{
    require("../app.js");
})
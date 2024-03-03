"use strict";
var models = require("../models");
var rol = models.rol;
var uuid = require("uuid");

class Rol {
    
    async crear(req, res) {
        if(req.body.hasOwnProperty("nombre")){
            var data = {
                nombre: req.body.nombre,
                external_id: uuid.v4()
            };

            var result = await rol.create(data);

            if(result == null) {
                res.json(401);
                res.json({ msg: "ERROR", tag: "No se pudo crear rol"})
            }else{
                res.status(200);
                res.json({ msg: "OK", code: 200 });
            }
            
        }else{
            res.status(401);
            res.json({ msg: "ERROR", tag: "Datos incompletos", code: 400});
        }
    }

    async listar(req, res){
        var lista = await rol.findAll({
            attributes: [
                ["external_id", "id"],
                "nombre"
            ]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtenerRol(req, res){
        const external = req.params.external;
        var rolA = await rol.findOne( {
            where: { external_id: external},
            attributes:[
                "nombre",
                ["external_id", "id"]
            ]
        });
        if(rolA == undefined ){
            res.status(401);
            res.json({ msg: "ERROR", tag: "Rol no encontrado", code: 401, })
        }else{
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: rolA});
        }
    }
}

module.exports = Rol;
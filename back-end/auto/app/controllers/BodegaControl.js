"use strict";
var models = require("../models");
var bodega = models.bodega;
var uuid = require("uuid");

class Bodega{
    async crear(req, res){
        console.log(req.body)
        if(req.body.hasOwnProperty("nombre") &&
        req.body.hasOwnProperty("ubicacion") &&
        req.body.hasOwnProperty("tamanio") ){
            var data = {
                nombre: req.body.nombre,
                ubicacion: req.body.ubicacion,
                tamanio: req.body.tamanio,
                external_id: uuid.v4()
            }
            var result = await bodega.create(data);
            if(result == null){
                res.status(401);
                res.json({
                    code: 401,
                    msg: "ERROR",
                    tag: "No se pudo crear bodega"
                });
            }else{
                res.status(200);
                res.json({
                    msg: "OK",
                    tag: "Bodega creada",
                    code: 200
                });
            }
        }else{
            res.status(401);
            res.json({
                msg: "ERROR",
                tag: "Datos insuficientes",
                code: 401
            });
        }
    }

    async listar(req, res){
        var lista = await bodega.findAll({
            attributes: [
                ["external_id", "id"],
                "nombre",
                "ubicacion",
                "tamanio"
            ]
        });
        res.status(200);
        res.json({ msg: "OK", code: 200, datos: lista });
    }

    async obtenerBodega(req, res){
        const external = req.params.external;
        var bodegaA = await bodega.findOne( {
            where: { external_id: external},
            attributes:[
                ["external_id", "id"],
                "nombre",
                "ubicacion",
                "tamanio"
            ]
        });
        if(bodegaA == undefined ){
            res.status(401);
            res.json({ msg: "ERROR", tag: "Bodega no encontrado", code: 401, })
        }else{
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: bodegaA});
        }
    }
}

module.exports = Bodega;
"use strict";
const {obtenerMes, obtenerNombreMes} = require('../../utils/index')
var models = require("../models");
var orden = models.orden;
var auto = models.auto;
var user = models.user;
class DetalleControl{
    async listarTodasVentas(req, res){
        // var result = await orden.findAll({ include: 'detallesOrden' }); // This also works
        var arrayDetalle = [];
        var result = await orden.findAll({ // This works, passing the alias
          include: {
            model: auto,
            as: 'detallesOrden',
            attributes: ["modelo"]
          },
          attributes: ["total"]
        });
        for(let i = 0; i < result.length; i++){
          for(let j = 0; j < result[i].detallesOrden.length; j++){
            var detalleOrden = result[i].detallesOrden[j].detalle;
            arrayDetalle.push(detalleOrden);
          }
        }
        const countPorMes = {};
        arrayDetalle.forEach((elemento) => {
          let mes = (obtenerMes(elemento.createdAt) + 1);
          let nombreMes = obtenerNombreMes(mes);
          countPorMes[nombreMes] = (countPorMes[nombreMes] || 0) + 1;
        });
        if(result == null){
          res.status(401);
          res.json({msg: "ERORR", tag: "NO hay valores disponibles"});
        }else{
          
          res.status(200);
          res.json({msg: "OK", data: countPorMes})
        }
    }

    async listarVentasVendedor(req, res){
      const external = req.params.external;
      var userA = await user.findOne( {
        where: { external_id: external},
    });
      var arrayDetalle = [];
        var result = await orden.findAll({ // This works, passing the alias
          where: {salesman_id: userA.id},
          include: {
            model: auto,
            as: 'detallesOrden',
            attributes: ["modelo"]
          },
          attributes: ["total"]
        });
        for(let i = 0; i < result.length; i++){
          for(let j = 0; j < result[i].detallesOrden.length; j++){
            var detalleOrden = result[i].detallesOrden[j].detalle;
            arrayDetalle.push(detalleOrden);
          }
        }
        const countPorMes = {};
        arrayDetalle.forEach((elemento) => {
          const mes = (obtenerMes(elemento.createdAt) + 1);
          let nombreMes = obtenerNombreMes(mes);
          countPorMes[nombreMes] = (countPorMes[nombreMes] || 0) + 1;
        });
        console.log(countPorMes)
        if(result == null){
          res.status(401);
          res.json({msg: "ERORR", tag: "NO hay valores disponibles"});
        }else{
          if(Object.keys(countPorMes).length === 0){
            res.status(200);
            res.json({msg: "OK", tag: "No ha realizado ventas", data: {Informacion: "No ha realizado ventas"}});
          }else{
            res.status(200);
            res.json({msg: "OK", data: countPorMes})
          }
          
        }
    }

}

module.exports = DetalleControl;
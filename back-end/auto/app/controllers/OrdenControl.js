"use strict";
var models = require("../models");
var orden = models.orden;
var user = models.user;
var auto = models.auto;
var existencia = models.existencia;
var uuid = require("uuid");

class Orden {
  async crear(req, res) {
    if (
      req.body.hasOwnProperty("subtotal") &&
      req.body.hasOwnProperty("iva") &&
      req.body.hasOwnProperty("total") &&
      req.body.hasOwnProperty("consumer_id") &&
      req.body.hasOwnProperty("salesman_id") && 
      req.body.hasOwnProperty("autos") 

    ) {
      var arrayAutos = [];
      for(let i = 0; i < req.body.autos.length; i++ ){
        
        let autoA = await auto.findOne({
          where: { external_id: req.body.autos[i]}
        });
        console.log(autoA)
        let existenciaA = await existencia.findOne({
          where: { auto_id: autoA.id }
        });
        console.log(existenciaA)
        let cantidad = existenciaA.cantidad - 1;
        // console.log('external ' + autoA.external_id);
        if(cantidad >=0){
          await existencia.update(
            {cantidad},
            {where: {external_id: existenciaA.external_id }}
          );
        }
        
        if(autoA != null && cantidad >= 0){
          // console.log(autoA)
          arrayAutos.push(autoA);
        }
      }
      var clientA = await user.findOne({
        where: {
          external_id: req.body.consumer_id
        }
      });
      var salemanA = await user.findOne({
        where: {
          external_id: req.body.salesman_id
        }
      });
      console.log(arrayAutos[0])
      var data = {
        subtotal: req.body.subtotal,
        iva: req.body.iva,
        total: req.body.total,
        consumer_id: clientA.id,
        salesman_id: salemanA.id,
        external_id: uuid.v4()
      };
      console.log(data);
      // var result = await orden.create(data,{include: 'detallesOrden'});
      var result = await orden.create(data);
      if (result == null || clientA == null || salemanA == null) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "No se pudo crear orden",
          code: 401,
        });
      } else {
        result.addDetallesOrden(arrayAutos);
        res.status(200);
        res.json({
          msg: "OK",
          tag: "Orden creada",
          code: 200,
        });
      }
    } else {
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: "Datos incompletos",
        code: 401,
      });
    }
  }
  
  async listar(req, res) {
    var lista = await orden.findAll({
      attibutes: [["external_id", "id"], "fecha", "subtotal", "iva", "total"],
    });
    
    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      datos: lista,
    });
  };

  async listarOrdenesVendedor(req, res){
    const external = req.params.external;
    const userA = await user.findOne({
      where: {external_id: external},
      
    })
    const lista = await orden.findAll({
      where: {salesman_id: userA.id},
      include: {model: models.user, as: "user", attributes:["nombres", "apellidos"]}
    });
    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      datos: lista,
    });
  }

  async listarMes(req, res){
    const lista = await orden.findAll();
    const datosPorMeses = {};

    lista.forEach((dato) => {
      const mes = dato.fecha.getMonth() + 1; // Suma 1 porque los meses en JavaScript son de 0 a 11
      const year = dato.fecha.getFullYear();
      const clave = `${year}-${mes}`;
      if (!datosPorMeses[clave]) {
        datosPorMeses[clave] = [];
      }
      datosPorMeses[clave].push(dato);

    });
    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      datos: datosPorMeses,
    });
  }

  async obtenerOrden(req, res) {
    const external = req.params.external;
    var ordenA = await orden.findOne({
      where: {
        external_id: external,
      },
      attibutes: [["external_id", "id"], "fecha", "subtotal", "iva", "total"],
    });
    let detallesA = await ordenA.getDetallesOrden();
    console.log(detallesA);
    ordenA.detalles = detallesA;
    if (ordenA == undefined) {
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: "No existe orden",
        code: 401,
      });
    } else {
      res.status(200);
      res.json({
        msg: "OK",
        tag: "Orden encontrada",
        data: ordenA,
        detalles: detallesA
      });
    }
  }

  async editarOrden(req, res) {
    try {
      //Add existencia
      const external = req.params.external;
      let { subtotal, iva, total, autos, consumer_id, salesman_id} = req.body;
      let ordenA = await orden.findOne({
        where: {
          external_id: external,
        }
      });
      let detalleA = await ordenA.getDetallesOrden()
      for(let i =0; i < detalleA.length; i++){
        let existenciaA = await existencia.findOne({
          where: { auto_id: detalleA[i].id }
        });
        let cantidad = existenciaA.cantidad + 1;
        await existencia.update(
          { cantidad },
          { where: { id: existenciaA.id } }
        );
      }


      var arrayAutos = [];
      for(let i = 0; i < autos.length; i++ ){
        
        let autoA = await auto.findOne({
          where: { external_id: autos[i]}
        });
        let existenciaA = await existencia.findOne({
          where: { auto_id: autoA.id }
        });
        let cantidad = existenciaA.cantidad - 1;
        // console.log('external ' + autoA.external_id);
        if(cantidad >=0){
          await existencia.update(
            {cantidad},
            {where: {external_id: existenciaA.external_id }}
          );
        }
        if(autoA != null && cantidad >= 0){
          // console.log(autoA)
          arrayAutos.push(autoA);
        }
      }
      var clientA = await user.findOne({
        where: {
          external_id: consumer_id
        }
      });
      var salemanA = await user.findOne({
        where: {
          external_id: salesman_id
        }
      });
      
      await ordenA.setDetallesOrden(arrayAutos);

      consumer_id = clientA.id;
      salesman_id = salemanA.id;
      await orden.update(
        { subtotal, iva, total, consumer_id, salesman_id },
        { where: {external_id: external}}
      );

      
      res.status(200);
      res.json({
        msg: "OK",
        // tag: {ordenUpdated}
      });
    } catch (error) {
      console.log(error);
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: {error},
        code: 401,
      });
    }
  }
}
module.exports = Orden;

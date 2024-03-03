"use strict";
var models = require("../models");
var auto = models.auto;
var existencia = models.existencia;
var uuid = require("uuid");

class Auto {
  async crear(req, res) {
    if (
      req.body.hasOwnProperty("modelo") &&
      req.body.hasOwnProperty("descripcion") &&
      req.body.hasOwnProperty("marca") &&
      req.body.hasOwnProperty("fotos") &&
      req.body.hasOwnProperty("precio") &&
      req.body.hasOwnProperty("color")
    ) {
      var data = {
        modelo: req.body.modelo,
        descripcion: req.body.descripcion,
        marca: req.body.marca,
        fotos: req.body.fotos,
        precio: req.body.precio,
        color: req.body.color,
        external_id: uuid.v4(),
      };
      var result = await auto.create(data);
      if (result == null) {
        res.json(401);
        res.json({ msg: "ERROR", tag: "Error al crear auto", code: 400 });
      } else {
        res.status(200);
        res.json({ msg: "OK", code: 200, data: result });
      }
    } else {
      res.status(401);
      res.json({ error: "ERROR", tag: "Datos incompletos", code: 400 });
    }
  }

  async listasAutosVentas(req, res) {
    var listaExistencias = await existencia.findAll({
      attibutes: [["external_id", "id"], "cantidad", "valor", "auto_id"],
    });
    if (listaExistencias == null) {
      res.json({
        msg: "OK",
        tag: "No hay autos disponibles para la venta",
        code: 200,
      });
    } else {
      console.log(listaExistencias[0].auto_id);
      var autosDisponibles = [];
      for (let i = 0; i < listaExistencias.length; i++) {
        if(listaExistencias[i].cantidad > 0){
            var autoA = await auto.findOne({
                where: {id: listaExistencias[i].auto_id},
                attributes: [
                  ["external_id", "id"],
                  "modelo",
                  "descripcion",
                  "marca",
                  "fotos",
                  "precio",
                  "color",
                ],
              });
              autosDisponibles.push(autoA);
        }
      }
      res.status(200);
      res.json({
        msg: "OK",
        data: autosDisponibles,
        code: 200,
      });
    }
  }
  async listar(req, res) {
    var lista = await auto.findAll({
      attributes: [
        ["external_id", "id"],
        "modelo",
        "descripcion",
        "marca",
        "fotos",
        "precio",
        "color",
      ],
    });
    res.status(200);
    if (lista == null) {
      res.json({ msg: "OK", tag: "No hay elementos en la tabla", code: 200 });
    } else {
      res.json({
        msg: "OK",
        tag: "Los elementos guardados son: ",
        data: lista,
      });
    }
  }

  async obtener(req, res) {
    const external = req.params.external;

    const autoF = await auto.findOne({
      where: { external_id: external },
      attributes: [
        ["external_id", "id"],
        "modelo",
        "descripcion",
        "marca",
        "fotos",
        "precio",
        "color",
      ],
    });

    if (autoF == undefined || autoF == null) {
      res.status(400);
      res.json({ msg: "ERROR", tag: "Auto no encontrado", code: 400 });
    } else {
      res.status(200);
      res.json({ msg: "OK", tag: "Auto encontrado", data: autoF });
    }
  }
  async editarAuto(req, res){
    try {
      const external = req.params.external;
      let {modelo, descripcion, marca, fotos, precio, color} = req.body;
      let response = await auto.update(
        { modelo, descripcion, marca, fotos, precio, color },
        { where: {external_id: external}}
      );
      res.status(200);
      res.json({
        msg: "OK",
        tag: "Auto editado",
      });
    } catch (error) {
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: "Error al editar auto",
        code: 401,
      });
    }
  }
}

module.exports = Auto;

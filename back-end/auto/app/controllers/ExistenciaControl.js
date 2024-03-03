"use strict";
var models = require("../models");
var existencia = models.existencia;
var auto = models.auto;
var bodega = models.bodega;
var uuid = require("uuid");

class Existencia {
  async crear(req, res) {
    if (
      req.body.hasOwnProperty("cantidad") &&
      req.body.hasOwnProperty("valor") &&
      req.body.hasOwnProperty("auto_id") &&
      req.body.hasOwnProperty("bodega_id")
    ) {
      var autoA = await auto.findOne({
        where: {
          external_id: req.body.auto_id,
        },
      });
      var bodegaA = await bodega.findOne({
        where: {
          external_id: req.body.bodega_id,
        },
      });
      var data = {
        cantidad: req.body.cantidad,
        valor: req.body.valor,
        auto_id: autoA.id,
        bodega_id: bodegaA.id,
        external_id: uuid.v4(),
      };
      var result = await existencia.create(data);
      if (result == null) {
        res.status(401);
        res.json({
          msg: "ERROR",
          tag: "No se puede crear existencia",
          code: 401,
        });
      } else {
        res.status(200);
        res.json({
          msg: "OK",
          tag: "Existencia creada",
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
    var lista = await existencia.findAll({
      include: [
        { model: models.auto, as: "auto", attributes: ["modelo"] },
        { model: models.bodega, as: "bodega", attributes: ["nombre"] },
      ],
      attibutes: [["external_id", "id"], "cantidad", "valor"],
    });

    res.status(200);
    res.json({
      msg: "OK",
      code: 200,
      datos: lista,
    });
  }

  async obtenerExistencia(req, res) {
    const external = req.params.external;
    var externalA = await existencia.findOne({
      where: {
        external_id: external,
      },
      include: [
        { model: models.auto, as: "auto", attributes: ["modelo"] },
        { model: models.bodega, as: "bodega", attributes: ["nombre"] },
      ],
      attibutes: [["external_id", "id"], "cantidad", "valor"],
    });

    if (externalA == undefined) {
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: "No existe existencia",
        code: 401,
      });
    } else {
      res.status(200);
      res.json({
        msg: "OK",
        tag: "Existencia encontrada",
        data: externalA,
      });
    }
  }

  async editarExistencia(req, res) {
    try {
      const external = req.params.external;
      let { cantidad, valor } = req.body;

      let response = await existencia.update(
        { cantidad, valor },
        { where: { external_id: external } }
      );
      res.status(200);
      res.json({
        msg: "OK",
        tag: "Existencia editada",
      });
    } catch (error) {
      res.status(401);
      res.json({
        msg: "ERROR",
        tag: "Error al editar existencia",
        code: 401,
      });
    }
  }
}

module.exports = Existencia;

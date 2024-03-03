"user strict";
var models = require("../models");
const { validarObjetoLleno } = require("../../utils/index");
var uuid = require("uuid");

var user = models.user;
var rol = models.rol;
var cuenta = models.cuenta; 

class UserControl {
    async crear(req, res){
        if( 
            // req.body.hasOwnProperty("cedula") &&
            req.body.hasOwnProperty("nombres") &&
            req.body.hasOwnProperty("apellidos") &&
            req.body.hasOwnProperty("direccion") && 
            req.body.hasOwnProperty("celular") && 
            req.body.hasOwnProperty("fecha_nac") &&    
            req.body.hasOwnProperty("correo") &&    
            req.body.hasOwnProperty("clave") &&
            req.body.hasOwnProperty("rol") 
        ){
            var rolA = await rol.findOne( {
                where: { external_id: req.body.rol }
            });
            if(rolA != undefined){
                var data = {
                    // cedula: req.body.cedula,
                    nombres: req.body.nombres,
                    apellidos: req.body.apellidos,
                    celular: req.body.celular,
                    fecha_nac: req.body.fecha_nac,
                    direccion: req.body.direccion,
                    rol_id: rolA.id,
                    cuenta: {
                        correo: req.body.correo,
                        clave: req.body.clave
                    },
                    external_id: uuid.v4()
                };
                let transaction = await models.sequelize.transaction();
                try {
                    console.log('antes de create')
                    var result = await user.create(data, {
                        include: [{ model: models.cuenta, as: "cuenta" }],
                        transaction,
                    });
                    console.log('antes del commit');
                    await transaction.commit();
                    if( result === null){
                        res.status(401);
                        res.json( { msg: "ERROR", tag: "No se puede crear", code: 401 });
                    }else{
                        rolA.external_id = uuid.v4();
                        await rolA.save();
                        res.status(203);
                        res.json({ msg: "OK", tag: "usuario y cuenta creada" , code: 200 });
                    }
                } catch (error) {
                    if(transaction) await transaction.rollback();
                    res.status(400);
                    res.json( {msg: "ERROR", tag: "No se puede crear", code: 401});                    
                }
            }else{
                res.json( { msg: "ERROR", tag: "No existe external id de rol", code: 400 })
            }
        }else{
            res.status(400);
            res.json( { msg: "ERROR", tag: "Campos incompletos", code: 400});
        }
    }

    async listar(req, res){
        var lista = await user.findAll( {
            include: [
                {model: models.cuenta, as: "cuenta", attributes: ["correo"]},
                {model: models.rol, as: "rol", attributes: ["nombre"]}
            ],
            attributes: [
                // "cedula",
                ["external_id", "id"],
                "apellidos",
                "nombres",
                "direccion",
                "celular",
                "fecha_nac"
            ],
        });
        res.status(200);
        res.json({msg: "OK", code: 200, datos: lista});
    }
    async obtenerSalesman (req, res){
        var rolA = await rol.findOne({where: {nombre: 'vendedor'}});

        var lista = await user.findAll( {
            where: {rol_id: rolA.id},
            include: [
                {model: models.cuenta, as: "cuenta", attributes: ["correo"]},
                {model: models.rol, as: "rol", attributes: ["nombre"]}
            ],
            attributes: [
                // "cedula",
                ["external_id", "id"],
                "apellidos",
                "nombres",
                "direccion",
                "celular",
                "fecha_nac"
            ],
        });
        res.status(200);
        res.json({msg: "OK", code: 200, datos: lista});
    }
    async obtenerCompradores (req, res){
        var rolA = await rol.findOne({where: {nombre: 'comprador'}});
        // console.log(rolA)
        var lista = await user.findAll( {
            where: { rol_id: rolA.id},
            include: [
                {model: models.cuenta, as: "cuenta", attributes: ["correo"]},
                // {model: models.rol, as: "rol", attributes: ["nombre"]}
            ],
            attributes: [
                ["external_id", "id"],
                "apellidos",
                "nombres",
                "direccion",
                "celular",
                "fecha_nac"
            ],
        });
        res.status(200);
        res.json({msg: "OK", code: 200, datos: lista});
    }
    async obtenerUser(req, res){
        const external = req.params.external;
        var userA = await user.findOne( {
            where: { external_id: external},
        });
        if(userA == undefined ){
            res.status(401);
            res.json({ msg: "ERROR", tag: "Rol no encontrado", code: 401, })
        }else{
            res.status(200);
            res.json({ msg: "OK", code: 200, datos: userA});
        }
    }


}

module.exports = UserControl;
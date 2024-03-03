"use strict";
let jwt = require("jsonwebtoken");
var models = require("../models");
// const {serialize} = require('cookie');

var cuenta = models.cuenta;
class CredencialesControl{

    async inicio_sesion(req, res){
        if(req.body.hasOwnProperty("correo") &&
            req.body.hasOwnProperty("clave")
        ){
            console.log(req.body)
            let cuentaA = await cuenta.findOne( {
                where: { correo: req.body.correo },
                include: [
                    {
                        model: models.user,
                        as: "user",
                        include: [
                            {
                                model: models.rol,
                                as: 'rol',
                                attributes: ["nombre"]
                            }
                        ],
                        attributes: ["apellidos", "nombres", "rol_id", "external_id"],
                    },
                ],
                attributes: [
                    "correo",
                    "clave",
                    "estado",
                    "external_id"
                ],
            });

            if(cuentaA == null){
                console.log('cuenta' + cuentaA);
                res.status(400);
                res.json({msg: "ERROR", tag: "Cuenta no encontrada", code: 400});
            }else{
                if(cuentaA.estado == true){
                    if(cuentaA.clave == req.body.clave){
                        const token_data = {
                            external_id: cuentaA.external_id,
                            rol_id: cuentaA.user.rol_id,
                            rol_name: cuentaA.user.rol.nombre,
                            check: true
                        }
                        require("dotenv").config();
                        const key = process.env.KEY_JWT;
                        console.log("key ", key);
                        const token = jwt.sign(token_data, key, {
                            expiresIn: "2h"
                        });
                        var info = {
                            user: cuentaA.user.apellidos + " " + cuentaA.user.nombres,
                            id: cuentaA.user.external_id,
                            token: token,
                            rol_name: cuentaA.user.rol.nombre,
                            // rol: cuentaA.user.rol_id,
                        };
                        // const serialized = serialize('myToken', token, {
                        //     httpOnly: false,
                        //     secure: false,
                        //     sameSite: 'strict',
                        //     maxAge: 1000 * 60 * 60 * 24 * 30,
                        //     path: '/inicio_sesion'
                        //   });
                        res.cookie("Inicio-sesion", token,{
                            maxAge: 100000,
                            httpOnly: true,
                            secure: false,
                            sameSite: 'lax',
                            path: '/login'
                          })
                        res.status(200);
                        res.json({
                            msg: "OK",
                            data: info,
                            code: 200,
                        })
                    }else{
                        res.status(400);
                        res.json( {msg: "ERROR", tag: "Credenciales incorrectas", code: 400});
                    }
                }else{
                    res.status(400);
                    res.json({ msg: "ERROR", tag: "Cuenta inactivada", error: 400});
                }
            }

        }else{
            res.status(400);
            res.json({
                msg: "ERROR",
                tag: "No hay compos suficientes",
                code: 400
            });
        }
    }
}

module.exports = CredencialesControl;
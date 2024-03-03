var express = require("express");
const loginSeller = require('../utils/isSeller');
var router = express.Router();
const userC = require("../app/controllers/UserControl");
let userControl = new userC();
const rolC = require("../app/controllers/RolControl");
let rolControl = new rolC();
const autoC = require("../app/controllers/AutoControl");
let autoControl = new autoC();
const imagenControlller = require("../app/controllers/ImagenControler");
const credencialesC = require("../app/controllers/CredencialesControl");
let credencialesControl = new credencialesC();
const ordenC = require("../app/controllers/OrdenControl");
let ordenControl = new ordenC();
const existenciaC = require("../app/controllers/ExistenciaControl");
let existenciaControl = new existenciaC();
const bodegaC = require("../app/controllers/BodegaControl");
let bodegaControl = new bodegaC();
const detalleC = require("../app/controllers/DetalleControl");
const isLogin = require("../utils/isLogin");
const isAdmin = require("../utils/isAdmin");
const isSeller = require("../utils/isSeller");
let detalleControl = new detalleC();

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.send("respond with a resource");
});

//login
router.post("/login", credencialesControl.inicio_sesion);

//users
router.get("/get/users", loginSeller, userControl.listar);
router.get("/get/user/:external", isLogin, userControl.obtenerUser);
router.post("/crear/user", loginSeller, userControl.crear);
router.get("/get/users/salesman", loginSeller, userControl.obtenerSalesman);
router.get("/get/users/compradores", loginSeller, userControl.obtenerCompradores)

//rol
router.get("/get/roles", loginSeller, rolControl.listar);
router.get("/get/rol/:external", loginSeller, rolControl.obtenerRol);
router.post("/crear/rol", isAdmin, rolControl.crear);

// orden
router.get("/get/orden/:external", isLogin, ordenControl.obtenerOrden);
router.get("/get/ordenes", isLogin, ordenControl.listar);
router.put("/editar/orden/:external", loginSeller, ordenControl.editarOrden )
router.get("/get/ordenesMes", isLogin, ordenControl.listarMes);
router.get("/get/ordenVendedor/:external", isLogin, ordenControl.listarOrdenesVendedor);
router.post("/crear/orden", isSeller, ordenControl.crear);

// existencias
router.get("/get/existencia/:external",isAdmin, existenciaControl.obtenerExistencia);
router.get("/get/existencias", isAdmin, existenciaControl.listar);
router.post("/crear/existencia", isAdmin, existenciaControl.crear);
router.put("/editar/existencia/:external", isAdmin, existenciaControl.editarExistencia)
//bodega
router.get("/get/bodega/:external", isAdmin, bodegaControl.obtenerBodega);
router.get("/get/bodegas", isAdmin, bodegaControl.listar);
router.post("/crear/bodega", isAdmin, bodegaControl.crear);


//auto
router.get("/get/autos", isLogin, autoControl.listar);
router.get("/get/autosVenta", isLogin, autoControl.listasAutosVentas);
router.get("/get/auto/:external",isLogin, autoControl.obtener);
router.post("/crear/auto", isAdmin, autoControl.crear);
router.put("/editar/auto/:external", isAdmin, autoControl.editarAuto);

// imagenes
// router.post(
//   "/auto/guardarImagen",
//   imagenControlller.upload,
//   imagenControlller.uploadFiles
// );
router.post(
  "/auto/guardarImagenes",
  imagenControlller.uploadImages,
  imagenControlller.uploadFiles
);

//detalle
router.get("/get/detalles", isSeller, detalleControl.listarTodasVentas);
router.get("/get/detalles/:external", isSeller, detalleControl.listarVentasVendedor);

module.exports = router;

"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enviar, enviarImagenes, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken, getUserInformation } from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Crear_auto({ marcass }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [fotos, setFotos] = useState([]);
  const [nombresFotos, setNombresFotos] = useState({})
  const [variableDeFotos, setVariableDeFotos] = useState(true);
  // const [marcas, setMarcas] = useState([]);

  // const [external, setExternal] = useState('');
  const [bodegas, setBodegas] = useState([]);
  useEffect(() => {
    const token = getToken();
    setToken(token);
    const user = getUserInformation();
    // setExternal(user.external);
    obtener("get/bodegas", token).then((info) => {
      setBodegas(info.datos);
    });
  }, []);

  useEffect(() => {}, [bodegas]);

  const validationScheme = Yup.object().shape({
    modelo: Yup.string().required("Modelo requerido"),
    descripcion: Yup.string().required("La descripcion es valida"),
    marca: Yup.string().required("La marca es requerida"), // external
    precio: Yup.string().required("El precio es requerido"),
    color: Yup.string().required("El color es requerido"),
    cantidad: Yup.string().required("La cantidad es requerida"),
    bodega: Yup.string().required("La bodega es requerida")
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {
    // console.log(data)
    let array = [];
    enviarImagenes("auto/guardarImagenes", fotos, token).then((info) => {
      console.log(info);
      mensajes("IMG SAVED", "Gracias");
    });
    for (let i =0; i < fotos.length ; i++) {
      array.push(fotos[i].name);
    }
    let cadena = array.map((valor, indice) => `${valor}`).join("\n");
    console.log(cadena)
    var dataAuto = {
      modelo: data.modelo,
      descripcion: data.descripcion,
      marca: data.marca,
      fotos: cadena,
      precio: data.precio,
      color: data.color,
    };
    enviar("crear/auto", dataAuto, token).then((info) => {
      mensajes("Modelo agregado", "Gracias");
      var dataExistencia = {
        cantidad: data.cantidad,
        valor: parseFloat(data.cantidad) * parseFloat(data.precio),
        auto_id: info.data.external_id,
        bodega_id: data.bodega,
      }
      enviar("crear/existencia", dataExistencia, token).then((info) =>{
        mensajes("OK", "Bodega modificada");
        router.push("/autos");
      })
      // router.push("/autos");
    });
  };

  return (
    <div className="container">
      <p className="h1">Agregar modelo</p>

      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="pills-login"
          role="tabpanel"
          aria-labelledby="tab-login"
        >
          <form onSubmit={handleSubmit(sendData)}>
            <div className="text-center mb-1">
              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-google"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-twitter"></i>
              </button>

              <button type="button" className="btn btn-link btn-floating mx-1">
                <i className="fab fa-github"></i>
              </button>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("modelo")}
                name="modelo"
                id="modelo"
                className={`form-control ${errors.modelo ? "is-invalid" : ""}`}
              />
              <label className="form-label">Modelo</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.modelo?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("descripcion")}
                name="descripcion"
                id="descripcion"
                className={`form-control ${
                  errors.descripcion ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Decripcion</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.descripcion?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <select
                {...register("marca")}
                class="form-select form-select-sm"
                className={`form-control ${errors.marca ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="marca"
              >
                <option key="1" value="HYUNDAI">
                  HYUNDAI
                </option>
                <option key="2" value="TOYOTA">
                  TOYOTA
                </option>
                <option key="3" value="KIA">
                  KIA
                </option>
                <option key="4" value="MAZDA">
                  MAZDA
                </option>
              </select>
              <label className="form-label">Marca</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.marca?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <select
                {...register("color")}
                class="form-select form-select-sm"
                className={`form-control ${errors.color ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="color"
              >
                <option key="1" value="BLANCO">
                  BLANCO
                </option>
                <option key="2" value="ROJO">
                  ROJO
                </option>
                <option key="3" value="NEGRO">
                  NEGRO
                </option>
                <option key="4" value="GRIS">
                  GRIS
                </option>
                <option key="5" value="AZUL">
                  AZUL
                </option>
                <option key="6" value="PLATA">
                  PLATA
                </option>
              </select>
              <label className="form-label">Color</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.color?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("precio")}
                name="precio"
                id="precio"
                className={`form-control ${errors.precio ? "is-invalid" : ""}`}
              />
              <label className="form-label">Precio</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.precio?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                {...register("cantidad")}
                type="number"
                name="cantidad"
                id="cantidad"
                className={`form-control ${
                  errors.cantidad ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Cantidad</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.cantidad?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <select
                {...register("bodega")}
                class="form-select form-select-sm"
                className={`form-control ${errors.bodega ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="bodega"
              >
                {bodegas.map((opcion, index) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
              <label className="form-label">Bodega</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.bodega?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                type="file"
                className={`form-control ${errors.fotos ? "is-invalid" : ""}`}
                name="fotos"
                id="fotos"
                multiple="true"
                onChange={ (e) => {
                  setFotos(e.target.files)
                  setVariableDeFotos(false)
                  console.log(e.target.files)
                }}
              />
              <label className="form-label">Imagenes</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.bodega?.message}
              </div>
            </div>

            <button   disabled={variableDeFotos}
              type="submit" 
              className="btn btn-primary btn-block mb-4">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

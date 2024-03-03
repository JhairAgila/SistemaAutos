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
  const [roles, setRoles] = useState([]);
  useEffect(() => {
    const token = getToken();
    setToken(token);
    const user = getUserInformation();
    // setExternal(user.external);
    obtener("get/roles", token).then((info) => {
      setRoles(info.datos);
    });
  }, []);

  useEffect(() => {}, [roles]);

  const validationScheme = Yup.object().shape({
    nombres: Yup.string().required("Los nombres son requerido"),
    apellidos: Yup.string().required("Los apellidos son requeridos"),
    celular: Yup.string().required("El celular es requerido"), // external
    fecha_nac: Yup.string().required("La fecha de nacimiento es requerida"),
    rol: Yup.string().required("El rol es requerido"),
    correo: Yup.string().required("La correo es requerido"),
    clave: Yup.string().required("La clave es requerida")
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {
    console.log(data)
    
    var dataUser = {
        nombres: data.nombres,
        apellidos: data.apellidos,
        celular: data.celular,
        fecha_nac: data.fecha_nac,
        direccion: data.direccion,
        rol: data.rol,
        correo: data.correo,
        clave: data.clave
    };

    console.log(dataUser);
    enviar("crear/user", dataUser, token).then((info) => {
      mensajes("User agregado", "Gracias");
      router.push("/venta");
    });
  };

  return (
    <div className="container">
      <p className="h1">Crear usuario</p>

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
                {...register("nombres")}
                name="nombres"
                id="nombres"
                className={`form-control ${errors.nombres ? "is-invalid" : ""}`}
              />
              <label className="form-label">Nombres</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.nombres?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("apellidos")}
                name="apellidos"
                id="apellidos"
                className={`form-control ${
                  errors.apellidos ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Apellidos</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.apellidos?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("celular")}
                name="celular"
                id="celular"
                className={`form-control ${
                  errors.celular ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Celular</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.celular?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                {...register("fecha_nac")}
                name="fecha_nac"
                id="fecha_nac"
                type="date"
                className={`form-control ${
                  errors.fecha_nac ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Fecha nacimiento</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.fecha_nac?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                {...register("direccion")}
                name="direccion"
                id="direccion"
                className={`form-control ${
                  errors.direccion ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Direccion</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.direccion?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                {...register("correo")}
                name="correo"
                id="correo"
                className={`form-control ${
                  errors.correo ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Correo</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.correo?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <input
                {...register("clave")}
                name="clave"
                id="clave"
                type="password"
                className={`form-control ${
                  errors.clave ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">clave</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.clave?.message}
              </div>
            </div>
            
            <div className="form-outline mb-1">
              <select
                {...register("rol")}
                class="form-select form-select-sm"
                className={`form-control ${errors.rol ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="rol"
              >
                {roles.map((opcion, index) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombre}
                  </option>
                ))}
              </select>
              <label className="form-label">Rol</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.rol?.message}
              </div>
            </div>
           

            <button type="submit" className="btn btn-primary btn-block mb-4">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

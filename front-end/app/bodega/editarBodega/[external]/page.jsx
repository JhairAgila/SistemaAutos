"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enviar, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken } from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Crear_auto({ params }) {
  const {external} = params;
  const router = useRouter();
  const [token, setToken] = useState("");
  const [valuesForm, setValuesForm] = useState({});

  useEffect(() => {
    const token = getToken();
    setToken(token);
    obtener(`get/bodega/${external}`, token).then( (info) => {
        setValuesForm(info.datos);
        console.log(info.datos)
    });
  }, []);

  useEffect( () => {
    reset(valuesForm);
  }, [valuesForm])

  const validationScheme = Yup.object().shape({
    nombre: Yup.string().required("Nombre es requerido"),
    ubicacion: Yup.string().required("La ubicacion es requerida"),
    tamanio: Yup.string().required("El tamanio es requerida") // external
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {

    var dataA = {
      nombre: data.nombre,
      ubicacion: data.ubicacion,
      tamanio: data.tamanio,
    };
    
    enviar("crear/bodega", dataA, token)
      .then((info) => {
        console.log(info);
        mensajes("Bodega modificada", "Gracias");
        router.push("/bodega");
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
                {...register("nombre")}
                name="nombre"
                id="nombre"
                className={`form-control ${
                  errors.nombre ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Nombre</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.nombre?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("ubicacion")}
                name="ubicacion"
                id="ubicacion"
                className={`form-control ${
                  errors.ubicacion ? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Ubicacion</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.ubicacion?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("tamanio")}
                name="tamanio"
                id="tamanio"
                type="number"
                className={`form-control ${
                  errors.tamanio? "is-invalid" : ""
                }`}
              />
              <label className="form-label">Tamaño(m^2)</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.tamanio?.message}
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

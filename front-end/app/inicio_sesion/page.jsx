"use client";
//import { useEffect, useState } from "react";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";

import { useRouter } from "next/navigation";
import { enviar } from "@/hook/conexion";
import { inicio_sesion } from "@/hook/Autenticacion";
import mensajes from "@/components/Mensajes";
import { estaSesion } from "@/hook/SesionUtilClient";

export default function Inicio_Sesion() {
  // <>
  //router
  const router = useRouter();

  const validationScheme = Yup.object().shape({
    correo: Yup.string().required("Ingrese su correo"),
    clave: Yup.string().required("Ingrese su contraseña"),
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);
  //const formOption = {resolver: yupResolver(validationScheme)};
  //const [register, handleSubmit, reset, formState] = useForm(formOption);
  const { errors } = formState;

  const sendData = (data) => {
    var data = { correo: data.correo, clave: data.clave };
    console.log(data);
    enviar("login", data).then((info) => {
      console.log("dentro de enviar");
      console.log(info);
    });

    inicio_sesion(data).then((info) => {
      console.log(info);
      if (!estaSesion()) {
        mensajes("Error en inicio de sesion ", info[0].msg, "error");
        console.log(texto);
      } else {
        mensajes("Has ingresado en el sistemas", "Bienvenido usuario");
        router.push("/principal");
      }
    });
  };

  return (
    <div className="container">
      <p className="h1">Inicio de sesion</p>

      <div className="tab-content">
        <div
          className="tab-pane fade show active"
          id="pills-login"
          role="tabpanel"
          aria-labelledby="tab-login"
        >
          <form onSubmit={handleSubmit(sendData)}>
            <div className="text-center mb-3">
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


            <div className="form-outline mb-4">
              <input
                {...register("correo")}
                name="correo"
                id="correo"
                className={`form-control ${errors.correo ? "is-invalid" : ""}`}
              />
              <label className="form-label"> Correo </label>
              <div className="alert alert-danger invalid-feedback">
                {errors.correo?.message}
              </div>
            </div>

            <div className="form-outline mb-4">
              <input
                {...register("clave")}
                name="clave"
                id="clave"
                type="password"
                className={`form-control ${errors.clave ? "is-invalid" : ""}`}
              />
              <label className="form-label">Password</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.clave?.message}
              </div>
            </div>
            <p className="text-center">or:</p>

            <ul
              className="nav nav-pills nav-justified mb-3"
              id="ex1"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <a
                  className="nav-link active"
                  id="tab-login"
                  data-mdb-toggle="pill"
                  href="#pills-login"
                  role="tab"
                  aria-controls="pills-login"
                  aria-selected="true"
                >
                  Login
                </a>
              </li>
            </ul>

            <button type="submit" className="btn btn-primary btn-block mb-4">
              Sign in
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

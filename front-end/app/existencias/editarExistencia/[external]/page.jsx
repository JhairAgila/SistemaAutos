"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { editar, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken } from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Editar_existencia({ params }) {
  const { external } = params;
  const router = useRouter();
  const [token, setToken] = useState("");
  const [externalUser, setExternalUser] = useState("");
  const [auto, setAuto] = useState([]);
  const [valuesForm, setValuesForm] = useState({});

  useEffect(() => {
    const token = getToken();
    setToken(token);
    obtener(`get/existencia/${external}`, token).then((info) => {
      setValuesForm(info.data);
      setValuesForm( (prevValues) => ({
        ...prevValues,
        auto: info.data.auto.modelo
      }));
    });
  }, []);

  useEffect(() => {
    reset(valuesForm);
  }, [ valuesForm]);

  const validationScheme = Yup.object().shape({
    cantidad: Yup.string().required("La cantidad es valida"),
    valor: Yup.string().required("EL valor es requerido"),
    auto: Yup.string().required("El auto es requerido"),
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {
    console.log("esternal del auto ", valuesForm.external);

    var data = {
        cantidad: data.cantidad,
        valor: data.valor,
    };
    console.log("data ", data);

    editar(`editar/existencia/${valuesForm.external_id}`, data, token)
      .then((info) => {
        mensajes("Auto modificado", "Gracias");
        router.push("/existencias");
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error);
      });
  };



  return (
    <div className="container">
      <p className="h1">Modificar Existencia</p>
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
                {...register("auto")}
                name="auto"
                id="auto"
                className={`form-control ${
                  errors.auto ? "is-invalid" : ""
                }`}
                disabled={true}
              />
              <label className="form-label">Auto</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.auto?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <input
                {...register("cantidad")}
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
              <input
                {...register("valor")}
                name="valor"
                id="valor"
                className={`form-control ${errors.valor ? "is-invalid" : ""}`}
              />
              <label className="form-label">Valor</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.valor?.message}
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

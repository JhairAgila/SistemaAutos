"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enviar, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken, getUserInformation } from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Crear_auto({ marcass }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [bodegas, setBodegas] = useState([]);
  const [autos, setAutos] = useState([]);
  const [valor, setValor] = useState(0);
  const [cantidad, setCantidad] = useState(0);
  const [precio, setPrecio] = useState(0);

  useEffect(() => {
    const token = getToken();
    setToken(token);
    obtener("get/bodegas", token).then((info) => {
        setBodegas(info.datos);
    });
    obtener("get/autosVenta", token).then( (info) => {
        console.log(info.data);
        setAutos(info.data);
    });
  }, []);

  useEffect(() => {}, [bodegas]);

  const validationScheme = Yup.object().shape({
    cantidad: Yup.string().required("La cantidad es requerido"),
    // valor: Yup.number().required("El valor es requerido"),
    auto: Yup.string().required("El auto es reequerido"),
    bodega: Yup.string().required("La bodega es requerida") 
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {

    var dataA = {
      cantidad: data.cantidad,
      valor: valor,
      auto_id: autos[data.auto].id,
      bodega_id: data.bodega
    };
    console.log(dataA);
    enviar("crear/existencia", dataA, token)
      .then((info) => {
        console.log(info);
        mensajes("Bodega agregada", "Gracias");
        router.push("/existencias");
      });
  };

  return (
    <div className="container">
      <p className="h1">Crear existencia</p>

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
              <label className="form-label">Auto</label>

              <select
                {...register("auto")}
                class="form-select form-select-sm"
                className={`form-control ${errors.auto ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="auto"
                onChange={ (e) => {
                    setPrecio(autos[e.target.value].precio);
                    setValor(autos[e.target.value].precio * cantidad);
                }}
              >
                {autos.map((opcion, index) => (
                  <option key={opcion.id} value={index}>
                    {opcion.modelo}
                  </option>
                ))}
              </select>
              <div className="alert alert-danger invalid-feedback">
                {errors.auto?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Cantidad</label>
              <input
                {...register("cantidad")}
                name="cantidad"
                id="cantidad"
                type="number"
                className={`form-control ${
                  errors.cantidad? "is-invalid" : ""
                }`}
                onChange={ (e) => {
                    setCantidad(e.target.value);
                    setValor(e.target.value * precio); 
                }}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.cantidad?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Valor</label>
              <input
                {...register("valor")}
                name="valor"
                id="valor"
                type="number"
                className={`form-control ${
                  errors.valor? "is-invalid" : ""
                }`}
                value={valor}
                disabled={true}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.valor?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Bodega</label>
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
              <div className="alert alert-danger invalid-feedback">
                {errors.bodega?.message}
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

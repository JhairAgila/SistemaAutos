"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enviar, enviarImagenes, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import {
  getToken,
  getUserInformation,
  getExternal,
} from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Crear_auto({ marcass }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [comprador, setComprador] = useState("");
  const [autoSelected, setAutoSelected] = useState("");
  const [autosSelected, setAutosSelected] = useState([]);
  const [autos, setAutos] = useState([]);
  const [autoValue, setAutoValue] = useState(0);
  const [externalIdVendedor, setExternalIdVendedor] = useState("");
  const [autosVendidos, setAutosVendidos] = useState('');
  const [autosVendidosVendedor, setAutosVendidosVendedor] = useState('');
  useEffect(() => {
    const token = getToken();
    setToken(token);
    console.log(token)
    const externalIdVendedor = getExternal();
    setExternalIdVendedor(externalIdVendedor);
    obtener("get/users/salesman", token).then((info) => {
      console.log(info.datos);
      setUsers(info.datos);
    });
    obtener("get/detalles", token).then( (info) => {
        const resultString = Object.entries(info.data).map(([mes, valor]) => `${mes}: ${valor}`).join(', ');
        if(resultString == ''){
          setAutosVendidos("No hay ventas")
        }else{
          setAutosVendidos(resultString);

        }
    })
  }, []);

  useEffect(() => {
    console.log('');
  }, [users, externalIdVendedor, autos , autosVendidos, autosVendidosVendedor]);

  const validationScheme = Yup.object().shape({
    // user: Yup.string().required("User requerido"),
    auto: Yup.string().required("EL auto es requerido"),
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {
    console.log(subtotal);
    const iva = subtotal * 0.12;
    const total = subtotal + iva;
    var dataVenta = {
      salesman_id: externalIdVendedor,
      consumer_id: comprador,
      subtotal: subtotal,
      iva: iva,
      total: total,
    };
    console.log(dataVenta);
    enviar("crear/orden", dataVenta, token).then((info) => {
      mensajes("Orden creada", "Gracias");
      // router.push("/autos");
    });
  };
  const cambiarVentasVendedor = (id) => {
    obtener(`/get/detalles/${id}`, token).then( (info) => {
        console.log(info.data);
        const resultString = Object.entries(info.data).map(([mes, valor]) => `${mes}: ${valor}`).join(', ');
        setAutosVendidosVendedor(resultString);

    })
  }

  return (
    <div className="container">
      <p className="h1">Autos vendidos</p>

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
            <div class="accordion" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Total de autos vendidos
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    {autosVendidos}
                  </div>
                </div>
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Usuario</label>

              <select
                {...register("modelo")}
                class="form-select form-select-sm"
                className={`form-control ${errors.user ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="user"
                onChange={(e) => {
                  console.log(e.target.value);
                  setComprador(e.target.value);
                  cambiarVentasVendedor(e.target.value)
                }}
              >
                {users.map((opcion, index) => (
                  <option key={opcion.id} value={opcion.id}>
                    {opcion.nombres + " " + opcion.apellidos}
                  </option>
                ))}
              </select>
              <div className="alert alert-danger invalid-feedback">
                {errors.user?.message}
              </div>
            </div>
            <div class="accordion mt-5" id="accordionExample">
              <div class="accordion-item">
                <h2 class="accordion-header">
                  <button
                    class="accordion-button"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#collapseOne"
                    aria-expanded="true"
                    aria-controls="collapseOne"
                  >
                    Total de autos vendidos por el vendedor
                  </button>
                </h2>
                <div
                  id="collapseOne"
                  class="accordion-collapse collapse show"
                  data-bs-parent="#accordionExample"
                >
                  <div class="accordion-body">
                    {autosVendidosVendedor}
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

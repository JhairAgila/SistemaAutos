"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { enviar, enviarImagenes, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken, getUserInformation, getExternal} from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Crear_auto({ marcass }) {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [users, setUsers] = useState([]);
  const [comprador, setComprador] = useState('');
  const [autoSelected, setAutoSelected] = useState('');
  const [autosSelected, setAutosSelected] = useState([]);
  const [autos, setAutos] = useState([]);
  const [subtotal, setSubtotal] = useState(0);
  const [autoValue, setAutoValue] = useState(0);
  const [color, setColor] = useState('');
  const [externalIdVendedor, setExternalIdVendedor] = useState('');
  const [cargoAdicional, setCargoAdicional] = useState(0);
  useEffect(() => {
    const token = getToken();
    setToken(token);
    const externalIdVendedor = getExternal();
    setExternalIdVendedor(externalIdVendedor);
    obtener("get/users/compradores", token).then((info) => {
        console.log(info.datos)
        setUsers(info.datos);
    });
    obtener("get/autosVenta", token).then( (info) => {
        console.log(info.data);
        setAutos(info.data);
    });
  }, []);

  useEffect(() => {
    if(color == 'BLANCO' || color == "PLATA"){
      setCargoAdicional(1000);
    }else{
      setCargoAdicional(0);
    }
  }, [color]);
  useEffect(() => {  }, [users, color, externalIdVendedor, subtotal, autos, autosSelected]);

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
    const iva = subtotal * 0.12;
    const total = subtotal + iva;
    var dataVenta = {
      salesman_id: externalIdVendedor,
      consumer_id: comprador,
      autos: autosSelected,
      subtotal: subtotal,
      iva: iva,
      total: total
    };
    console.log(dataVenta);
    enviar("crear/orden", dataVenta, token).then((info) => {
      mensajes("Orden creada", `Iva: ${iva} ; Total: ${total}`,);
      // router.push("/autos");
    });
  };

  const addAuto = () => {
    // console.log(autoSelected);
    setAutosSelected((prevAutosSelected) => 
    [...prevAutosSelected, autoSelected]);
    setSubtotal((prevSubtotal) => prevSubtotal + autoValue + cargoAdicional);
    // console.log(autosSelected);
  }

  return (
    <div className="container">
      <p className="h1">Venta de autos</p>

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
              <label className="form-label">Usuario</label>

              <select
                {...register("modelo")}
                class="form-select form-select-sm"
                className={`form-control ${errors.user ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="user"
                onChange={ (e) => {
                  console.log(e.target.value);
                  setComprador(e.target.value);
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

            <div className="form-outline mb-1">
              <label className="form-label">Auto</label>

              <select
                {...register("auto")}
                class="form-select form-select-sm"
                className={`form-control ${errors.auto ? "is-invalid" : ""}`}
                aria-label=".form-select-lg example"
                id="auto"
                onChange={ (e) => {
                  let index = e.target.value;
                  setAutoSelected(autos[index].id);
                  setAutoValue(autos[index].precio);
                  setColor(autos[index].color);
                }}
              >
                {autos.map((opcion, index) => (
                  <option key={opcion.id} value={index}>
                    {opcion.modelo} { opcion.color}
                  </option>
                ))}
              </select>
              <div className="alert alert-danger invalid-feedback">
                {errors.auto?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Color</label>
              <input
                name="color"
                id="color"
                className={`form-control `}
                value={color}
                disabled ={true}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.color?.message}
              </div>
            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Precio</label>
              <input
                name="precio"
                id="precio"
                className={`form-control`}
                value={autoValue}
                disabled ={true}
              />

            </div>
            <div className="form-outline mb-1">
              <label className="form-label">Cargo adicional (se aplica si el color es blanco o plata)</label>
              <input
                name="cargoAdicional"
                id="cargoAdicional"
                className={`form-control`}
                value={cargoAdicional}
                disabled ={true}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.cargoAdicional?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <label className="form-label">Subtotal</label>
              <input
                {...register("subtotal")}
                name="subtotal"
                id="subtotal"
                value={subtotal}
                className={`form-control ${errors.subtotal ? "is-invalid" : ""}`}
                disabled={true}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.subtotal?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <label className="form-label">Autos comprados</label>
              <input
                {...register("cantidad")}
                name="cantidad"
                id="cantidad"
                className={`form-control ${errors.subtotal ? "is-invalid" : ""}`}
                value={autosSelected.length}
                disabled ={true}
              />
              <div className="alert alert-danger invalid-feedback">
                {errors.cantidad?.message}
              </div>
            </div>

            <button type="button" onClick={addAuto} className="btn btn-success btn-block m-2">
              Agregar
            </button>
            <button type="submit" className="btn btn-warning btn-block m-2">
              Vender
            </button>
          </form>
        </div>
      </div>
    </div>
  );
  
}

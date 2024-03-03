"use client";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { editar, enviar, enviarImagenes, obtener } from "@/hook/conexion";
import { useEffect, useState } from "react";
import { getToken, getUserInformation } from "@/hook/SesionUtilClient";
import mensajes from "@/components/Mensajes";

export default function Editar_auto({ params }) {
  const { external } = params;
  const router = useRouter();
  const [token, setToken] = useState("");
  const [fotos, setFotos] = useState([]);
  const [auto, setAuto] = useState([]);
  const [valuesForm, setValuesForm] = useState({});
  useEffect(() => {
    const token = getToken();
    setToken(token);
    // const user = getUserInformation();
    // console.log(user);
    // setExternalUser(user.external);
    obtener(`get/auto/${external}`, token).then((info) => {
      console.log(info.data);
      setValuesForm(info.data);
      // setValuesForm((dat) => ({
      //   ...dat,
      //   fotos: "",
      // }));
    });
  }, []);

  useEffect(() => {
    reset(valuesForm);
  }, [valuesForm]);

  const validationScheme = Yup.object().shape({
    modelo: Yup.string().required("El modelo es requerido"),
    descripcion: Yup.string().required("La descripcion es requerida"),
    marca: Yup.string().required("La marca es requerida"),
    // fotos: Yup.string().required("Las fotos son requeridas"),
    precio: Yup.string().required("El precio es requerida"),
    color: Yup.string().required("El color es requerido"),
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  const sendData = (data) => {
    console.log("esternal del auto ", valuesForm.external);
    let array = [];
    if(fotos.length > 0){
      enviarImagenes("auto/guardarImagenes", fotos, token).then((info) => {
        console.log(info);
        mensajes("IMG SAVED", "Gracias");
      });
      for (let i =0; i < fotos.length ; i++) {
        array.push(fotos[i].name);
      }
      let cadena = array.map((valor, indice) => `${valor}`).join("\n");
      console.log(cadena)
      var data = {
        modelo: data.modelo,
        descripcion: data.descripcion,
        marca: data.marca,
        precio: data.precio,
        color: data.color,
        fotos: cadena
      };
    }else{
      var data = {
        modelo: data.modelo,
        descripcion: data.descripcion,
        marca: data.marca,
        precio: data.precio,
        color: data.color,
      };
    }
    console.log(data)
    editar(`editar/auto/${external}`, data, token)
      .then((info) => {
        console.log(info);
        mensajes("Auto modificado", "Gracias");
        router.push("/autos");
      })
      .catch((error) => {
        console.error("Ha ocurrido un error:", error);
      });
  };

  return (
    <div className="container">
      <p className="h1">Modificar Auto</p>
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
              <label className="form-label">Descripcion</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.descripcion?.message}
              </div>
            </div>

            <div className="form-outline mb-1">
              <select
                {...register("marca")}
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
              <input
                type="file"
                className={`form-control ${errors.fotos ? "is-invalid" : ""}`}
                name="fotos"
                id="fotos"
                multiple={true}
                onChange={ (e) => {
                  setFotos(e.target.files)
                }}
              />
              <label className="form-label">Imagenes</label>
              <div className="alert alert-danger invalid-feedback">
                {errors.bodega?.message}
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
              <select
                {...register("color")}
                // className="form-select form-select-sm"
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

            <button type="submit" className="btn btn-primary btn-block mb-4">
              Guardar
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

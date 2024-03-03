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
import Link from "next/link";

export default function Crear_auto({ marcass }) {
  const [token, setToken] = useState("");
  const [ordens, setOrdens] = useState([]);
  const [comprador, setComprador] = useState("");
  const [autoSelected, setAutoSelected] = useState("");
  const [autosSelected, setAutosSelected] = useState([]);
  const [autos, setAutos] = useState([]);
  const [autoValue, setAutoValue] = useState(0);
  const [externalIdVendedor, setExternalIdVendedor] = useState("");
  const [autosVendidos, setAutosVendidos] = useState("");
  const [autosVendidosVendedor, setAutosVendidosVendedor] = useState("");
  useEffect(() => {
    const token = getToken();
    setToken(token);
    console.log(token);
    const externalIdVendedor = getExternal();
    setExternalIdVendedor(externalIdVendedor);
    obtener(`get/ordenVendedor/${externalIdVendedor}`, token).then((info) => {
      console.log(info.datos);
      setOrdens(info.datos);
    });
  }, []);

  useEffect(() => {
    console.log("");
  }, [externalIdVendedor, autos, autosVendidos, autosVendidosVendedor]);

  const validationScheme = Yup.object().shape({
    // user: Yup.string().required("User requerido"),
    auto: Yup.string().required("EL auto es requerido"),
  });

  const formOptions = {
    resolver: yupResolver(validationScheme),
  };

  const { register, handleSubmit, reset, formState } = useForm(formOptions);

  const { errors } = formState;

  return (
    <div>
      <h1> Ordenes hechas </h1>

      <div className="container-fluid">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Fecha emision</th>
              <th>Total</th>
              <th>Vendedor</th>
              <th>Modificar</th>
            </tr>
          </thead>
          <tbody>
            {ordens.map((dato, i) => (
              <tr key={dato.id}>
                <td>{i + 1}</td>

                <td>
                  {(() => {
                    const fechaOriginal = new Date(dato.fecha);
                    const dia = fechaOriginal.getDate();
                    const mes = fechaOriginal.getMonth() + 1;
                    const año = fechaOriginal.getFullYear();

                    const diaFormateado = dia < 10 ? `0${dia}` : dia;
                    const mesFormateado = mes < 10 ? `0${mes}` : mes;

                    return `${diaFormateado}/${mesFormateado}/${año}`;
                  })()}
                </td>
                <td>{dato.total}</td>
                <td> {dato.user.nombres + " " + dato.user.apellidos}</td>
                <td>
                  <Link
                    href={"/misOrdenes/editarOrden/" + dato.external_id}
                    className="btn btn-primary"
                  >
                    Modificar
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

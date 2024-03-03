"use client";
import { getToken, getUser, getUserInformation } from "@/hook/SesionUtilClient";
import { obtener } from "@/hook/conexion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Visualizar_auto() {
  const [existencias, setExistencias] = useState([]);
  const valor = useSearchParams();
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = getToken();
    setToken(token);
    const user = getUserInformation();
    obtener(
      'get/existencias',
      token
    ).then((info) => {
      console.log(info.datos);
      setExistencias(info.datos);
    });
  },[]);

  return (
    <div>
      <h1> Administrar existencias </h1>
      <div className="container-fluid">
        <div className="col-4">
          <Link href="/existencias/crearExistencia" className="btn btn-success">
            Nuevo
          </Link>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Auto</th>
              <th>Cantidad</th>
              <th>Valor</th>
              <th>Bodega</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {existencias.map((dato, i) => (
              <tr key={dato.external_id}>
                <td>{i + 1}</td>
                <td>{dato.auto.modelo}</td>
                <td>{dato.cantidad}</td>
                <td>{dato.valor}</td>
                <td>{dato.bodega.nombre}</td>
                <td>
                {/* TODO: COMPLETAR EDITAR */}
                  <Link
                    href={"/existencias/editarExistencia/" + dato.external_id}
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

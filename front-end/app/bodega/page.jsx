"use client";
import { getToken, getUser, getUserInformation } from "@/hook/SesionUtilClient";
import { obtener } from "@/hook/conexion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function Visualizar_auto() {
  const [bodegas, setBodegas] = useState([]);
  const valor = useSearchParams();
  const [token, setToken] = useState("");
  useEffect(() => {
    const token = getToken();
    setToken(token);
    const user = getUserInformation();
    obtener(
      'get/bodegas',
      token
    ).then((info) => {
      console.log(info.datos);
      setBodegas(info.datos);
    });
  },[]);

  return (
    <div>
      <h1> Administrar bodegas </h1>
      <div className="container-fluid">
        <div className="col-4">
          <Link href="/bodega/crearBodega" className="btn btn-success">
            Nuevo
          </Link>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Nombre</th>
              <th>Ubicacion</th>
              <th>Tamanio</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {bodegas.map((dato, i) => (
              <tr key={dato.id}>
                <td>{i + 1}</td>
                <td>{dato.nombre}</td>
                <td>{dato.ubicacion}</td>
                <td>{dato.tamanio}</td>
                <td>
                {/* TODO: COMPLETAR EDITAR */}
                  <Link
                    href={"/bodega/editarBodega/" + dato.id}
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

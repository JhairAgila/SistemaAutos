"use client";
import { getToken, getUser, getUserInformation } from "@/hook/SesionUtilClient";
import { obtener } from "@/hook/conexion";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
// import img from '../../../back-end/auto/uploads/a.png';
// import img from "./img/a.png";


export default function Visualizar_auto() {
  const [autos, setAutos] = useState([]);
  const valor = useSearchParams();
  const [token, setToken] = useState("");

  useEffect(() => {
    const token = getToken();
    setToken(token);
    const user = getUserInformation();
    obtener(
      "get/autos",
      token
    ).then((info) => {
      // console.log(info.data);
      setAutos(info.data);
      
    });
  }, []);

  return (
    <div>
      <h1> Autos disponibles </h1>
      <div className="container-fluid">
        <div className="col-4">
          <Link href="/autos/crearAuto" className="btn btn-success">
            Nuevo
          </Link>
        </div>
      </div>

      <div className="container-fluid">
        <table className="table table-hover">
          <thead>
            <tr>
              <th>Nro</th>
              <th>Modelo</th>
              <th>Descripcion</th>
              <th>Marca</th>
              <th>Fotos</th>
              <th>Precio</th>
              <th>Color</th>
              <th>Modificar</th>
              <th>Visualizar</th>
            </tr>
          </thead>
          <tbody>
            {autos.map((dato, i) => (
              <tr key={dato.id}>
                <td>{i + 1}</td>
                <td>{dato.modelo}</td>
                <td>{dato.descripcion}</td>
                <td>{dato.marca}</td>
                <td>
                {dato.fotos.split('\n').map((foto, index) => (
                  <Image
                    key={index}
                    src={`/${foto.trim()}`}
                    width={75}
                    height={75}
                    alt={`Foto ${index + 1}`}
                  />
                ))}
                </td>
                <td>{dato.precio}</td>
                <td>{dato.color}</td>

                <td>
                  <Link
                    href={"/autos/editarAuto/" + dato.id}
                    className="btn btn-primary"
                  >
                    Modificar
                  </Link>
                </td>
                <td>
                  <Link
                    href={"/autos/visualizarAuto/" + dato.id}
                    className="btn btn-primary"
                  >
                    Ver
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

"use client";
import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";
// import NavDropdown from "react-bootstrap/NavDropdown";
import { borrarSesion, estaSesion, isAdmin, isVendedor } from "@/hook/SesionUtilClient";
import { useRouter } from "next/navigation";
import mensajes from "./Mensajes";
import Cookie from 'js-cookie';

export default function Menu() {

  const router = useRouter();

  const salir = async () => {
    Cookie.remove("rol");
    Cookie.remove("my-token");
    await borrarSesion();
    mensajes("Gracias", "Hasta la proxima");
    router.push('/');
    router.refresh();
  }

  return (
    <nav
      className="navbar bg-dark navbar-expand-lg bg-body-tertiary"
      data-bs-theme="dark"
    >
      <div className="container-fluid">
      <Link href="/" className="navbar-brand">
          {" "}
          Practica 03
        </Link>
        {!estaSesion() && (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link active" href="/" aria-current="page">
                {" "}
                Principal
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link active" href="/inicio_sesion" aria-current="page">
                {" "}
                Log in
              </Link>
            </li>
            
          </ul>
        </div>
        )}
        

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {isAdmin() && (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" href="/" aria-current="page">
                  {" "}
                  Principal
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/autos" aria-current="page">
                  {" "}
                  Auto
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/existencias" aria-current="page">
                  {" "}
                  Existencias
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/bodega" aria-current="page">
                  {" "}
                  Bodega
                </Link>
              </li>
              
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="/inicio_sesion"
                  aria-current="page"
                  onClick={salir}
                >
                  {" "}
                  Salir{" "}
                </Link>
              </li>
            </ul>
          </div>
        )}
        {isVendedor() && (
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" href="/" aria-current="page">
                  {" "}
                  Principal
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/venta" aria-current="page">
                  {" "}
                  Vender autos
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/autoDespachados" aria-current="page">
                  {" "}
                  Autos despachados
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/misOrdenes" aria-current="page">
                  {" "}
                  Mis ordenes
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link active" href="/user" aria-current="page">
                  {" "}
                  Crear usuario
                </Link>
              </li>
              <li className="nav-item">
                <Link
                  className="nav-link active"
                  href="/inicio_sesion"
                  aria-current="page"
                  onClick={salir}
                >
                  {" "}
                  Salir{" "}
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}

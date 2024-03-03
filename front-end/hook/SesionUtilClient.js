"use client";

export const get = (key) => {
  window.sessionStorage.getItem(key);
};

export const getToken = () => {
  return window.sessionStorage.getItem("token");
};

export const getUser = () => {
  return window.sessionStorage.getItem("user");
};

export const getUserInformation = () => {
  return JSON.parse(window.sessionStorage.getItem("userInformation"));
};

export const getExternal = () => {
  return window.sessionStorage.getItem("external");
};

export const borrarSesion = () => {
  window.sessionStorage.clear();
};

export const estaSesion = () => {
  // if(typeof window !== "undefined"){
  var token = window.sessionStorage.getItem("token");
  return token && (token != "undefined" || token != null || token != "null");
  // }
};

export const isAdmin = () => {
  var token = window.sessionStorage.getItem("token");
  var rol = window.sessionStorage.getItem("rol");

  return token && (token != "undefined" || token != null || token != "null") && rol == "gerente";
}

export const isVendedor = () => {
  var token = window.sessionStorage.getItem("token");
  var rol = window.sessionStorage.getItem("rol");

  return token && (token != "undefined" || token != null || token != "null") && rol == "vendedor";
}

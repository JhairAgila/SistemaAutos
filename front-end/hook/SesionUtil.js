// 'use client';

export const save = (key, data) => {
  window.sessionStorage.setItem(key, data);
};

export const get = (key) => {
  window.sessionStorage.setItem(key, data);
};

export const saveToken = (key) => {
  return window.sessionStorage.setItem("token",key);
};
export const getToken = () => {
  const c = window.sessionStorage.getItem("token"); 
  return c;
};

export const borrarSesion = () => {
  window.sessionStorage.clear();
};

export const estaSesion = () => {
  if( typeof(window) != undefined){
    var token = window.sessionStorage.getItem("token");
    return token && (token != "undefined" || token != null || token != "null");
  }
};

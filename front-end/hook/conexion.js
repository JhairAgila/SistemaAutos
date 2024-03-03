let URL = "http://localhost:3001/api/";

export function url_api() {
  return URL;
}

export async function obtener(recurso, key = "") {
  let headers = {};
  if (key != "") {
    headers["Accept"] = "application/json";
    headers["Content-type"] = "application/json";
    headers["auth-token"] = key;
  }
  // recurso[cache:'no-store'];

  const response = await fetch(URL + recurso, {
    method: "GET",
    headers: headers,
  });

  return await response.json();
}

export async function editar(recurso, data, key =""){
  let headers = {};
  if (key == "") {
    headers["Content-type"] = "application/json";
  } else {
    headers["Accept"] = "application/json";
    headers["Content-type"] = "application/json";
    headers["auth-token"] = key;
  }
  const response = await fetch(URL + recurso, {
    method: "PUT",
    headers: headers,
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function enviar(recurso, data, key = "") {
  let headers = {};
  if (key == "") {
    headers["Content-type"] = "application/json";
  } else {
    headers["Accept"] = "application/json";
    headers["Content-type"] = "application/json";
    headers["auth-token"] = key;
  }
  const response = await fetch(URL + recurso, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(data),
  });
  return await response.json();
}

export async function enviarImagenes(recurso, data, key = "") {
  let headers = {};
  console.log("fotos " + data);
  if (key == "") {
    // headers["Content-type"] = "application/json";
  } else {
    // headers["Accept"] = "application/json";
    // headers["Content-type"] = "application/json";
    headers["auth-token"] = key;
  }

  var formData = new FormData();
  formData.append("fotos", data[key]);
  for (const key in data) {
    formData.append("fotos", data[key]);
    console.log(`FormData ${key}:`, formData.get("fotos"));
  }

  // const fotoss = new FormData(fotos);

  // console.log('FormData ', fotos.get('fotos'));
  const response = await fetch(URL + recurso, {
    method: "POST",
    // headers: headers,
    body: formData,
  });
  return await response;
}

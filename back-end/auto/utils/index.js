function validarObjetoLleno(objeto) {
  for (const clave in objeto) {
    if (
      objeto.hasOwnProperty(clave) &&
      (objeto[clave] === undefined ||
        objeto[clave] === null ||
        objeto[clave] === "")
    ) {
      return false; // Si alguna propiedad está vacía, retorna falso
    }
  }
  return true; // Todas las propiedades están llenas
}
const obtenerMes = (fecha) => new Date(fecha).getMonth();
const obtenerNombreMes = (numeroMes) => {
  const fecha = new Date(Date.UTC(2023, numeroMes, 1));
  return fecha.toLocaleString('es-ES', { month: 'long' }); // 'long' para obtener el nombre completo del mes
};
module.exports = { validarObjetoLleno, obtenerMes, obtenerNombreMes };

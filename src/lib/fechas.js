export function formatearFecha(fechaString) {
    const fecha = new Date(fechaString);
    const hoy = new Date();
  
    fecha.setHours(0, 0, 0, 0);
    hoy.setHours(0, 0, 0, 0);
  
    const msEnUnDia = 1000 * 60 * 60 * 24;
    const diferenciaDias = Math.round((hoy - fecha) / msEnUnDia);
  
    if (diferenciaDias === 0) {
      return "Hoy";
    } else if (diferenciaDias === 1) {
      return "Ayer";
    } else if (diferenciaDias === 2) {
      return "Hace 2 días";
    } else {
      const dia = String(fecha.getDate()).padStart(2, '0');
      const mes = String(fecha.getMonth() + 1).padStart(2, '0');
      const anio = fecha.getFullYear();
      return `${dia}/${mes}/${anio}`;
    }
}

export function formatDateToYMD(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Meses van de 0-11
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
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
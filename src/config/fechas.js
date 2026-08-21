// Helpers de zona horaria (GT-6). PUNTO ÚNICO de conversión para el frontend.
//
// Contexto: el sistema guarda fechas de forma inconsistente (algunas en hora-pared
// GT-6, otras en UTC) en columnas `datetime`. Estos helpers centralizan la LECTURA
// para display, de modo que cuando se migre el almacenamiento a UTC (ver
// backend-hospital-nuevo/NORMALIZACION_ZONA_HORARIA.md) solo haya que ajustar aquí.
//
// Hoy las listas que colorean día/noche reciben la fecha ya como string GT-6
// "YYYY-MM-DD HH:mm:ss", por eso `horaGTde` extrae la hora del string tal cual.
// No cambiar el comportamiento en esta fase: es una centralización 1:1.

// Extrae la hora (0-23) de un string de fecha GT-6 "YYYY-MM-DD HH:mm:ss".
// Devuelve null si no se puede determinar.
export function horaGTde (valor) {
  if (!valor) return null
  const partes = String(valor).split(' ')
  if (partes.length < 2) return null
  const hora = parseInt(partes[1].split(':')[0])
  return Number.isNaN(hora) ? null : hora
}

// Clase de fila según sea horario diurno (07:00–18:59) o nocturno.
// Replica exactamente la lógica que estaba duplicada en cada vista.
export function claseFilaDiaNoche (valor) {
  const hora = horaGTde(valor)
  if (hora === null) return ''
  return (hora >= 7 && hora < 19) ? 'fila-dia' : 'fila-noche'
}

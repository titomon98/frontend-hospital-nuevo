// Etiquetas legibles; el resto se arma del nombre de la columna (id_cuenta -> Id cuenta).
const ETIQUETAS = {
  created_by: 'Ingresado por',
  updated_by: 'Actualizado por',
  reviewed_by: 'Revisado por',
  createdAt: 'Fecha de registro',
  updatedAt: 'Última actualización',
  id: 'No. registro',
  precio_venta: 'Precio de venta',
  ingreso: 'Entrada',
  salida: 'Salida'
}
const etiqueta = (k) => ETIQUETAS[k] || (k.charAt(0).toUpperCase() + k.slice(1)).replace(/_/g, ' ')
const ES_MONTO = /(^|_)(total|subtotal|precio|precio_venta|precio_costo|precio_normal|precio_sobrecargo|costo|costo_base|costo_habitacion|pagado|por_pagar|total_pagado)$/
export const camposDe = (filas) => {
  const keys = []
  filas.forEach(f => Object.keys(f || {}).forEach(k => { if (!keys.includes(k)) keys.push(k) }))
  return keys.map(k => ({
    key: k,
    label: etiqueta(k),
    sortable: true,
    formatter: (v) => (v === null || v === undefined || v === '') ? '' : (ES_MONTO.test(k) && !isNaN(parseFloat(v)) ? `Q${parseFloat(v).toFixed(2)}` : v)
  }))
}
// Solo cuentan los registros activos (estado 1) cuando la fila tiene estado.
export const suma = (filas, campo) => filas
  .filter(f => f.estado === undefined || f.estado === null || Number(f.estado) === 1)
  .reduce((a, f) => a + (parseFloat(f[campo]) || 0), 0)

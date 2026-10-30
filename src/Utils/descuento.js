// Descuento de hospital: tipo 0 = porcentaje sobre el total de la cuenta, 1 = monto fijo en Q.
// Mismas reglas que el backend (utils/descuento y cuentasController.DiscountRequest).
export const TIPOS_DESCUENTO = [
  { value: 0, text: 'Porcentaje (%)' },
  { value: 1, text: 'Monto fijo (Q)' }
]

export function montoDescuento (total, tipo, valor) {
  const v = parseFloat(valor) || 0
  const monto = Number(tipo) === 1 ? v : (parseFloat(total) || 0) * v / 100
  return Math.round(Math.max(0, monto) * 100) / 100
}

// Mensaje de error o '' si el descuento es valido.
export function errorDescuento (total, tipo, valor) {
  const v = parseFloat(valor)
  const t = parseFloat(total) || 0
  if (!(v > 0)) return 'El descuento debe ser mayor a 0'
  if (Number(tipo) === 0 && v > 100) return 'El porcentaje no puede ser mayor a 100'
  if (Number(tipo) === 1 && v > t) return `El descuento no puede ser mayor al total de la cuenta (Q${t.toFixed(2)})`
  return ''
}

// Texto corto para la tabla: "10%" o "Q150.00".
export function etiquetaDescuento (tipo, valor) {
  return Number(tipo) === 1 ? `Q${(parseFloat(valor) || 0).toFixed(2)}` : `${parseFloat(valor) || 0}%`
}

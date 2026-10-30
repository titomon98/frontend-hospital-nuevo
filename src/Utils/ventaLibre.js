// Tipos de linea de venta libre (mismos valores que venta_libre_detalles.tipo).
export const TIPOS_ITEM = [
  { value: 'medicamento', text: 'Medicamento', url: '/medicamentos/list2' },
  { value: 'anestesico', text: 'Anestésico', url: '/medicamentos/anestesicos' },
  { value: 'quirurgico', text: 'Quirúrgico', url: '/quirurgico/list2' },
  { value: 'comun', text: 'Uso común', url: '/comun/list2' },
  { value: 'servicio', text: 'Oxígeno' }
]

export const etiquetaTipo = (tipo) => (TIPOS_ITEM.find(t => t.value === tipo) || {}).text || tipo

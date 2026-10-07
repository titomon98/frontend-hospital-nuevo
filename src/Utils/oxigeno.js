// Servicios de oxígeno (por hora o por cilindro): en las cuentas van en su propio rubro.
const esOxigeno = (c) => ((c.servicio && c.servicio.descripcion) || c.descripcion || '')
  .normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().includes('oxig')

export const totalOxigeno = (consumos) =>
  (consumos || []).filter(esOxigeno).reduce((acc, c) => acc + (parseFloat(c.subtotal) || 0), 0)

// Detalle completo de la cuenta (GET /consumos/detalleCompleto): todo lo cargado,
// una fila por cargo con fecha y hora. Lo usan la cuenta parcial (Excel) y el
// historial de cuenta (Excel y PDF).
import axios from 'axios'
import ExcelJS from 'exceljs'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { apiUrl } from '../config/constant'

export const ORDEN_CATEGORIAS = [
  'HABITACIÓN', 'INTENSIVO', 'SALA DE OPERACIONES', 'MEDICAMENTOS', 'MATERIAL MÉDICO QUIRÚRGICO',
  'ANESTÉSICOS', 'MATERIAL COMÚN', 'OXÍGENO', 'SERVICIOS', 'EMERGENCIAS MÉDICO INTERNO', 'HONORARIOS', 'LABORATORIO'
]

export const cargarDetalle = (idExpediente, todas) =>
  axios.get(apiUrl + `/consumos/detalleCompleto/${idExpediente}${todas ? '?todas=1' : ''}`).then(r => r.data)

const q = (n) => `Q${(Number(n) || 0).toFixed(2)}`
// 'DD/MM/YYYY HH:mm' -> 'YYYYMMDDHHmm' para ordenar.
const clave = (f) => (f || '').replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/, '$3$2$1$4$5')

// Agrupa por categoría (en el orden de la cuenta) y, dentro, por fecha.
const agrupar = (items) => ORDEN_CATEGORIAS
  .map(cat => ({
    categoria: cat,
    items: items.filter(i => i.categoria === cat).sort((a, b) => clave(a.fecha).localeCompare(clave(b.fecha)))
  }))
  .filter(g => g.items.length)

// Bloques a imprimir: uno por cuenta del hospital y uno de laboratorio.
const bloques = (data) => {
  const multi = data.cuentas.length > 1
  const res = data.cuentas.map((c, i) => ({
    titulo: multi
      ? `CUENTA ${i + 1} de ${data.cuentas.length} - ${c.estado} - ingreso ${c.ingreso || '-'}${c.egreso ? ' - egreso ' + c.egreso : ''}`
      : `CUENTA - ${c.estado} - ingreso ${c.ingreso || '-'}${c.egreso ? ' - egreso ' + c.egreso : ''}`,
    grupos: agrupar(c.items),
    total: c.total,
    pie: [
      ['TOTAL CONSUMIDO EN ESTA CUENTA', c.total],
      ...(c.totalRegistrado && Math.abs(c.totalRegistrado - c.total) >= 0.01 ? [['TOTAL REGISTRADO EN CAJA', c.totalRegistrado]] : []),
      ...(c.totalPagado ? [['TOTAL PAGADO', c.totalPagado]] : [])
    ]
  }))
  if (data.examenes.length) {
    res.push({ titulo: 'LABORATORIO', grupos: agrupar(data.examenes), pie: [['TOTAL LABORATORIO', data.totalLab]] })
  }
  return res
}

export const resumenPorCategoria = (data) => {
  const todos = [...data.cuentas.flatMap(c => c.items), ...data.examenes]
  return ORDEN_CATEGORIAS
    .map(cat => ({ categoria: cat, total: todos.filter(i => i.categoria === cat).reduce((a, i) => a + i.total, 0) }))
    .filter(r => r.total)
}

const encabezado = (data, titulo) => [
  'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A. QUETZALTENANGO',
  titulo,
  `PACIENTE: ${data.paciente.nombre}    EXPEDIENTE: ${data.paciente.expediente}`,
  `SITUACIÓN: ${data.paciente.situacion}${data.paciente.egreso ? ' - egreso ' + data.paciente.egreso : ''}`,
  `GENERADO: ${data.generado}`
]

const nombreArchivo = (prefijo, data, ext) => `${prefijo}_${data.paciente.nombre.replace(/\s+/g, '_')}.${ext}`

export async function excelDetalle (data, titulo, prefijo) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Detalle')
  ws.columns = [{ width: 18 }, { width: 28 }, { width: 70 }, { width: 10 }, { width: 16 }, { width: 16 }]
  const moneda = '"Q"#,##0.00'

  encabezado(data, titulo).forEach((t, i) => {
    const r = ws.addRow([t])
    ws.mergeCells(r.number, 1, r.number, 6)
    r.font = { bold: i < 2 }
  })

  for (const b of bloques(data)) {
    ws.addRow([])
    const t = ws.addRow([b.titulo])
    ws.mergeCells(t.number, 1, t.number, 6)
    t.font = { bold: true }
    t.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFD9E1F2' } }
    const h = ws.addRow(['FECHA Y HORA', 'RUBRO', 'DESCRIPCIÓN', 'CANTIDAD', 'PRECIO UNITARIO', 'TOTAL'])
    h.font = { bold: true }
    for (const g of b.grupos) {
      for (const i of g.items) {
        const r = ws.addRow([i.fecha, i.categoria, i.descripcion, i.cantidad, i.precio, i.total])
        r.getCell(5).numFmt = moneda
        r.getCell(6).numFmt = moneda
      }
      const s = ws.addRow(['', '', `SUBTOTAL ${g.categoria}`, '', '', g.items.reduce((a, i) => a + i.total, 0)])
      s.font = { bold: true }
      s.getCell(6).numFmt = moneda
    }
    if (!b.grupos.length) ws.addRow(['', '', 'Sin cargos registrados'])
    for (const [etq, val] of b.pie) {
      const r = ws.addRow(['', '', etq, '', '', val])
      r.font = { bold: true }
      r.getCell(6).numFmt = moneda
    }
  }

  ws.addRow([])
  const rt = ws.addRow(['RESUMEN POR RUBRO'])
  rt.font = { bold: true }
  for (const r of resumenPorCategoria(data)) {
    ws.addRow(['', r.categoria, '', '', '', r.total]).getCell(6).numFmt = moneda
  }
  const tg = ws.addRow(['', 'TOTAL GENERAL', '', '', '', data.totalGeneral])
  tg.font = { bold: true }
  tg.getCell(6).numFmt = moneda
  if (data.totalPagado) {
    const tp = ws.addRow(['', 'TOTAL PAGADO', '', '', '', data.totalPagado])
    tp.getCell(6).numFmt = moneda
  }
  ws.getColumn(3).alignment = { wrapText: true, vertical: 'top' }

  const buffer = await wb.xlsx.writeBuffer()
  const url = window.URL.createObjectURL(new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }))
  const a = document.createElement('a')
  a.href = url
  a.download = nombreArchivo(prefijo, data, 'xlsx')
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  window.URL.revokeObjectURL(url)
}

export function pdfDetalle (data, titulo, prefijo) {
  const doc = new JsPDF({ orientation: 'landscape' })
  let y = 12
  encabezado(data, titulo).forEach((t, i) => {
    doc.setFontSize(i < 2 ? 12 : 9).setFont(undefined, i < 2 ? 'bold' : 'normal')
    doc.text(t, 14, y)
    y += i < 2 ? 6 : 5
  })

  for (const b of bloques(data)) {
    const body = []
    for (const g of b.grupos) {
      g.items.forEach(i => body.push([i.fecha, i.categoria, i.descripcion, i.cantidad, q(i.precio), q(i.total)]))
      body.push([{ content: `SUBTOTAL ${g.categoria}`, colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: q(g.items.reduce((a, i) => a + i.total, 0)), styles: { fontStyle: 'bold' } }])
    }
    if (!b.grupos.length) body.push([{ content: 'Sin cargos registrados', colSpan: 6 }])
    b.pie.forEach(([etq, val]) => body.push([{ content: etq, colSpan: 5, styles: { halign: 'right', fontStyle: 'bold' } }, { content: q(val), styles: { fontStyle: 'bold' } }]))
    doc.autoTable({
      startY: y + 2,
      head: [[{ content: b.titulo, colSpan: 6 }], ['FECHA Y HORA', 'RUBRO', 'DESCRIPCIÓN', 'CANT.', 'P. UNITARIO', 'TOTAL']],
      body,
      theme: 'grid',
      styles: { fontSize: 8, cellPadding: 1.5, textColor: [0, 0, 0] },
      headStyles: { fillColor: [229, 31, 45], textColor: [255, 255, 255] },
      columnStyles: { 0: { cellWidth: 28 }, 1: { cellWidth: 42 }, 3: { cellWidth: 14 }, 4: { cellWidth: 24 }, 5: { cellWidth: 24 } }
    })
    y = doc.lastAutoTable.finalY + 4
  }

  doc.autoTable({
    startY: y + 2,
    head: [['RESUMEN POR RUBRO', 'TOTAL']],
    body: [
      ...resumenPorCategoria(data).map(r => [r.categoria, q(r.total)]),
      [{ content: 'TOTAL GENERAL', styles: { fontStyle: 'bold' } }, { content: q(data.totalGeneral), styles: { fontStyle: 'bold' } }],
      ...(data.totalPagado ? [['TOTAL PAGADO', q(data.totalPagado)]] : [])
    ],
    theme: 'grid',
    tableWidth: 120,
    styles: { fontSize: 9, textColor: [0, 0, 0] },
    headStyles: { fillColor: [229, 31, 45], textColor: [255, 255, 255] }
  })
  doc.save(nombreArchivo(prefijo, data, 'pdf'))
}

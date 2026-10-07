// Detalle completo de la cuenta (GET /consumos/detalleCompleto): todo lo cargado,
// una fila por cargo con fecha y hora. Lo usan la cuenta parcial (Excel) y el
// historial de cuenta (Excel y PDF). Formato por secciones, como la "cuenta de
// hospitalizacion detallada" que usaba caja.
import axios from 'axios'
import ExcelJS from 'exceljs'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { apiUrl } from '../config/constant'

const PRODUCTO = [['FECHA', 'fecha'], ['NOMBRE', 'descripcion'], ['CLASE', 'clase'], ['CANTIDAD', 'cantidad'], ['IMPORTE', 'total']]

// Secciones en el orden de la cuenta; cada una con sus categorias y columnas [titulo, campo].
export const SECCIONES = [
  { titulo: 'USO DE HABITACIÓN', cats: ['HABITACIÓN', 'INTENSIVO'], cols: [['ENTRADA', 'entrada'], ['SALIDA', 'salida'], ['TIPO', 'tipo'], ['NÚMERO', 'numero'], ['ESTANCIA', 'nota'], ['IMPORTE', 'total']] },
  { titulo: 'HONORARIOS MÉDICOS', cats: ['HONORARIOS', 'EMERGENCIAS MÉDICO INTERNO'], cols: [['FECHA', 'fecha'], ['MÉDICO TRATANTE', 'descripcion'], ['IMPORTE', 'total']] },
  { titulo: 'SALA DE OPERACIONES', cats: ['SALA DE OPERACIONES'], cols: [['FECHA', 'fecha'], ['SALA', 'sala'], ['DURACIÓN', 'duracion'], ['IMPORTE', 'total']] },
  { titulo: 'EXÁMENES DE LABORATORIO', cats: ['LABORATORIO'], cols: [['FECHA', 'fecha'], ['NO. ORDEN', 'orden'], ['NOMBRE EXAMEN', 'descripcion'], ['IMPORTE', 'total']] },
  { titulo: 'MEDICAMENTOS SUMINISTRADOS', cats: ['MEDICAMENTOS'], cols: PRODUCTO },
  { titulo: 'ANESTÉSICOS SUMINISTRADOS', cats: ['ANESTÉSICOS'], cols: PRODUCTO },
  { titulo: 'MATERIAL MÉDICO QUIRÚRGICO', cats: ['MATERIAL MÉDICO QUIRÚRGICO'], cols: PRODUCTO },
  { titulo: 'MATERIAL COMÚN', cats: ['MATERIAL COMÚN'], cols: PRODUCTO },
  { titulo: 'OXÍGENO', cats: ['OXÍGENO'], cols: [['FECHA', 'fecha'], ['NOMBRE', 'descripcion'], ['CANTIDAD', 'cantidad'], ['IMPORTE', 'total']] },
  { titulo: 'PERSONAL DE SALA DE OPERACIONES', cats: ['PERSONAL DE SALA DE OPERACIONES'], cols: [['FECHA', 'fecha'], ['DESCRIPCIÓN', 'descripcion'], ['IMPORTE', 'total']] },
  { titulo: 'OTROS SERVICIOS', cats: ['OTROS SERVICIOS'], cols: [['FECHA', 'fecha'], ['NOMBRE', 'descripcion'], ['CANTIDAD', 'cantidad'], ['IMPORTE', 'total']] }
]

export const cargarDetalle = (idExpediente, todas) =>
  axios.get(apiUrl + `/consumos/detalleCompleto/${idExpediente}${todas ? '?todas=1' : ''}`).then(r => r.data)

const q = (n) => `Q${(Number(n) || 0).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
const suma = (items) => items.reduce((a, i) => a + (Number(i.total) || 0), 0)
// 'DD/MM/YYYY HH:mm' -> 'YYYYMMDDHHmm' para ordenar.
const clave = (f) => (f || '').replace(/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2}):(\d{2})$/, '$3$2$1$4$5')

const seccionesDe = (items, todas) => SECCIONES
  .map(s => ({ ...s, items: items.filter(i => s.cats.includes(i.categoria)).sort((a, b) => clave(a.fecha).localeCompare(clave(b.fecha))) }))
  .filter(s => todas || s.items.length)

// Bloques a imprimir. Una sola cuenta (cuenta parcial): un bloque con todas las
// secciones, laboratorio incluido. Varias (historial): un bloque por cuenta y
// el laboratorio aparte, solo con las secciones que tienen cargos.
const bloques = (data) => {
  if (data.cuentas.length <= 1) {
    const c = data.cuentas[0] || { items: [], estado: '', ingreso: '', egreso: '' }
    return [{ titulo: null, secciones: seccionesDe([...c.items, ...data.examenes], true), pie: [] }]
  }
  const res = data.cuentas.map((c, i) => ({
    titulo: `CUENTA ${i + 1} de ${data.cuentas.length} - ${c.estado} - ingreso ${c.ingreso || '-'}${c.egreso ? ' - egreso ' + c.egreso : ''}`,
    secciones: seccionesDe(c.items, false),
    pie: [
      ['TOTAL CONSUMIDO EN ESTA CUENTA', c.total],
      ...(c.totalRegistrado && Math.abs(c.totalRegistrado - c.total) >= 0.01 ? [['TOTAL REGISTRADO EN CAJA', c.totalRegistrado]] : []),
      ...(c.totalPagado ? [['TOTAL PAGADO', c.totalPagado]] : [])
    ]
  }))
  if (data.examenes.length) {
    res.push({ titulo: 'LABORATORIO', secciones: seccionesDe(data.examenes, false), pie: [] })
  }
  return res
}

export const resumenPorCategoria = (data) => {
  const todos = [...data.cuentas.flatMap(c => c.items), ...data.examenes]
  return SECCIONES
    .map(s => ({ categoria: s.titulo, total: suma(todos.filter(i => s.cats.includes(i.categoria))) }))
    .filter(r => r.total)
}

const encabezado = (data, titulo) => [
  'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A.',
  titulo,
  `NOMBRE DEL PACIENTE: ${data.paciente.nombre}`,
  `No. EXPEDIENTE: ${data.paciente.expediente}    MD TRATANTE: ${data.paciente.medico || ''}`,
  `SITUACIÓN: ${data.paciente.situacion}${data.paciente.egreso ? ' - egreso ' + data.paciente.egreso : ''}`,
  `GENERADO: ${data.generado}`
]

const piesGenerales = (data) => [
  ['SUBTOTAL=', data.totalGeneral],
  ['TOTAL=', data.totalGeneral],
  ...(data.totalPagado ? [['TOTAL PAGADO=', data.totalPagado]] : [])
]

const nombreArchivo = (prefijo, data, ext) => `${prefijo}_${data.paciente.nombre.replace(/\s+/g, '_')}.${ext}`

export async function excelDetalle (data, titulo, prefijo) {
  const wb = new ExcelJS.Workbook()
  const ws = wb.addWorksheet('Cuenta detallada')
  ws.columns = [{ width: 20 }, { width: 46 }, { width: 22 }, { width: 14 }, { width: 22 }, { width: 14 }]
  const moneda = '"Q"#,##0.00'
  const fila = (valores, opciones = {}) => {
    const r = ws.addRow(valores)
    if (opciones.bold) r.font = { bold: true }
    if (opciones.merge) ws.mergeCells(r.number, 1, r.number, 6)
    if (opciones.fondo) r.getCell(1).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: opciones.fondo } }
    return r
  }

  encabezado(data, titulo).forEach((t, i) => {
    const r = fila([t], { merge: true, bold: i < 2 })
    if (i < 2) r.alignment = { horizontal: 'center' }
  })

  for (const b of bloques(data)) {
    if (b.titulo) {
      fila([])
      fila([b.titulo], { merge: true, bold: true, fondo: 'FFD9E1F2' })
    }
    for (const s of b.secciones) {
      fila([])
      fila([s.titulo], { merge: true, bold: true, fondo: 'FFEDEDED' })
      fila(s.cols.map(c => c[0]), { bold: true })
      for (const i of s.items) {
        const r = fila(s.cols.map(c => i[c[1]] ?? ''))
        r.getCell(s.cols.length).numFmt = moneda
      }
      fila([`TOTAL: ${q(suma(s.items))}`], { bold: true })
    }
    if (!b.secciones.length) fila(['Sin cargos registrados'])
    for (const [etq, val] of b.pie) {
      const r = fila(['', '', '', '', etq, val], { bold: true })
      r.getCell(6).numFmt = moneda
    }
  }

  fila([])
  for (const [etq, val] of piesGenerales(data)) {
    const r = fila(['', '', '', '', etq, val], { bold: true })
    r.getCell(6).numFmt = moneda
  }
  ws.getColumn(2).alignment = { wrapText: true, vertical: 'top' }

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
  const doc = new JsPDF()
  let y = 12
  encabezado(data, titulo).forEach((t, i) => {
    doc.setFontSize(i < 2 ? 12 : 9).setFont(undefined, i < 2 ? 'bold' : 'normal')
    doc.text(t, i < 2 ? 105 : 14, y, i < 2 ? { align: 'center' } : undefined)
    y += i < 2 ? 6 : 5
  })
  const celda = (i, campo) => (campo === 'total' ? q(i.total) : String(i[campo] ?? ''))

  for (const b of bloques(data)) {
    if (b.titulo) {
      doc.setFontSize(10).setFont(undefined, 'bold')
      doc.text(b.titulo, 14, y + 6)
      y += 8
    }
    for (const s of b.secciones) {
      const n = s.cols.length
      doc.autoTable({
        startY: y + 2,
        head: [[{ content: s.titulo, colSpan: n }], s.cols.map(c => c[0])],
        body: s.items.map(i => s.cols.map(c => celda(i, c[1]))),
        foot: [[{ content: `TOTAL: ${q(suma(s.items))}`, colSpan: n }]],
        theme: 'grid',
        styles: { fontSize: 8, cellPadding: 1.5, textColor: [0, 0, 0] },
        headStyles: { fillColor: [229, 31, 45], textColor: [255, 255, 255] },
        footStyles: { fillColor: [240, 240, 240], textColor: [0, 0, 0], fontStyle: 'bold' },
        columnStyles: { [n - 1]: { halign: 'right', cellWidth: 24 } }
      })
      y = doc.lastAutoTable.finalY + 2
    }
    if (b.pie.length) {
      doc.autoTable({
        startY: y + 1,
        body: b.pie.map(([etq, val]) => [etq, q(val)]),
        theme: 'plain',
        styles: { fontSize: 9, fontStyle: 'bold' },
        margin: { left: 100 }
      })
      y = doc.lastAutoTable.finalY + 2
    }
  }

  doc.autoTable({
    startY: y + 4,
    body: piesGenerales(data).map(([etq, val]) => [etq, q(val)]),
    theme: 'plain',
    styles: { fontSize: 10, fontStyle: 'bold' },
    margin: { left: 120 }
  })
  doc.save(nombreArchivo(prefijo, data, 'pdf'))
}

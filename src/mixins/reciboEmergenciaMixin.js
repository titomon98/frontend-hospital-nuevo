// Lógica compartida para generar, al egresar una emergencia, la hoja de
// emergencia y el recibo provisional (con captura de factura/NIT si faltan).
// Usado por Emergencias.vue (enfermería) y EgresosEmergencia.vue (caja).
//
// El componente que lo use debe tener en su template el modal
// ref="modal-recibo-factura" y disponer de: alertErrorText, alertCountDownError,
// showAlertError y currentUser.
import JsPDF from 'jspdf'
import logoHospital from '@/assets/images/logo.png'
import 'jspdf-autotable'
import axios from 'axios'
import { apiUrl } from '../config/constant'

export default {
  data () {
    return {
      dataPDFsumario: null,
      TotalApagar: 0,
      // Captura de datos de facturacion para el recibo provisional.
      reciboData: null,
      reciboExpedienteId: null,
      facturaRecibo: {
        nombre_factura: '',
        nit_factura: ''
      }
    }
  },
  methods: {
    generarReporteHojaEmergenciaPDF (id) {
      axios.get(apiUrl + `/consumos/hojaEmergencia/${id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.generarHojaEmergenciaPDF(response.data)
          // El recibo provisional se descarga junto a la hoja. Si el paciente aun no
          // tiene datos de facturacion, se piden en un modal antes de generarlo.
          this.prepararReciboProvisional(response.data, id)
        })
        .catch((error) => {
          console.error('Error al generar la hoja de emergencia:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },

    generarHojaEmergenciaPDF (data) {
      const doc = new JsPDF()
      doc.setFontSize(12)
      doc.setFont('times', 'normal')

      // Encabezado
      const anchoPagina = doc.internal.pageSize.getWidth()
      try { doc.addImage(logoHospital, 'PNG', 14, 8, 28, 28) } catch (e) { console.error('logo hoja emergencia:', e) }
      doc.setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES', 46, 18)
      doc.text('DE OCCIDENTE S.A. QUETZALTENANGO', 46, 25)
      doc.setTextColor(255, 0, 0)
      doc.text(`No. ${data.numeroHoja || ''}`, 160, 18)
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.text('HOJA DE EMERGENCIAS', anchoPagina / 2, 38, { align: 'center' })
      doc.setFontSize(12)
      doc.setFont(undefined, 'normal')

      // Fecha y hora de ingreso (reales)
      const fechaObj = new Date(data.fechaIngreso + 'T' + (data.horaIngreso || '00:00'))
      const fechaFormateada = fechaObj.toLocaleDateString('es-ES')
      const horaFormateada = fechaObj.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', hour12: true })

      // Información del paciente
      doc.text(`FECHA: ${fechaFormateada}`, 20, 45)
      doc.text(`HORA: ${horaFormateada}`, 120, 45)
      doc.text(`NOMBRE DEL PACIENTE: ${data.nombre}`, 20, 55)
      doc.text(`EDAD: ${data.edad}`, 20, 65)
      doc.text(`TELÉFONO: ${data.telefono}`, 150, 65)
      doc.text(`DIRECCIÓN: ${data.direccion}`, 20, 75)
      // Campos de texto que pueden ser largos: se ajustan a varias líneas para que no se corten.
      let y = 85
      const anchoTexto = anchoPagina - 40
      const escribirLargo = (texto) => {
        const lineas = doc.splitTextToSize(texto, anchoTexto)
        doc.text(lineas, 20, y)
        y += lineas.length * 7
      }
      escribirLargo(`MOTIVO DE LA CONSULTA: ${data.motivo || ''}`)
      escribirLargo(`DIAGNÓSTICO: ${data.diagnostico || ''}`)
      escribirLargo(`TRATAMIENTO: ${data.tratamiento || ''}`)
      doc.text(`MÉDICO TRATANTE: ${data.medico}`, 20, y)
      doc.text(`SE HOSPITALIZA: ${data.seHospitaliza ? 'Sí' : 'No'}`, 130, y)
      y += 7
      doc.text(`MÉDICO INTERNO: ${data.medicoInterno || ''}`, 20, y)
      y += 10

      doc.text('EXÁMENES DE LABORATORIO:', 20, y)
      y += 7
      doc.text(data.examenes || '', 20, y)
      y += 13

      doc.text('MEDICINA Y MATERIAL MÉDICO QUIRÚRGICO:', 20, y)

      let totalY = y
      doc.text('MEDICINA', 20, totalY += 7)
      doc.text('___________________________', 20, totalY += 1)
      doc.text(`Q. ${data.totalMedicamentos.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('MATERIAL QUIRÚRGICO', 20, totalY += 7)
      doc.text('___________________________', 20, totalY += 1)
      doc.text(`Q. ${data.totalQuirurgico.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('ANESTÉSICOS', 20, totalY += 7)
      doc.text('___________________________', 20, totalY += 1)
      doc.text(`Q. ${data.totalAnestesicos.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('MATERIAL COMÚN', 20, totalY += 7)
      doc.text('___________________________', 20, totalY += 1)
      doc.text(`Q. ${data.totalComun.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('OTROS', 20, totalY += 7)
      doc.text('___________________________', 20, totalY += 1)
      doc.text(`Q. ${data.totalOtros.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      const subtotalConsumos = data.totalMedicamentos + data.totalQuirurgico + data.totalAnestesicos + data.totalComun + data.totalOtros

      doc.text('TOTAL ............................................................................................................', 20, totalY += 7)
      doc.text(`Q. ${subtotalConsumos.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY += 3

      doc.text('DERECHO DE EMERGENCIA .....................................................................', 20, totalY += 7)
      doc.text(`Q. ${data.totalDerechoEmergencia.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('LABORATORIOS ...........................................................................................', 20, totalY += 7)
      doc.text(`Q. ${data.totalExamenes.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      const subtotal = subtotalConsumos + data.totalDerechoEmergencia + data.totalExamenes

      doc.text('SUBTOTAL ....................................................................................................', 20, totalY += 7)
      doc.text(`Q. ${subtotal.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('RX ...................................................................................................................', 20, totalY += 7)
      doc.text(`Q. 0.00`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('HONORARIOS ...............................................................................................', 20, totalY += 7)
      doc.text(`Q. ${data.totalHonorarios.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('TOTAL A PAGAR: .........................................................................................', 20, totalY += 7)
      doc.text(`Q. ${data.totalAPagar.toFixed(2)}`, 150, totalY -= 1)
      doc.text('_________________', 150, totalY += 1)
      totalY -= 1

      doc.text('OBSERVACIONES:', 20, totalY += 14)
      doc.text(data.observaciones || '', 20, totalY += 7)
      doc.text('NOMBRE Y FIRMA MÉDICO INTERNO:', 20, totalY += 50)

      this.TotalApagar = data.totalAPagar
      doc.save('hoja_emergencias.pdf')
    },

    // Convierte un monto en quetzales a su cantidad en letras (para el recibo provisional).
    numeroALetras (valor) {
      const num = Math.abs(Number(valor) || 0)
      const entero = Math.floor(num)
      const centavos = Math.round((num - entero) * 100)

      const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
      const diez19 = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
      const decenas = ['', '', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
      const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

      const aLetras = (x) => { // 0..999
        if (x === 0) return 'CERO'
        if (x === 100) return 'CIEN'
        let txt = ''
        const c = Math.floor(x / 100)
        const resto = x % 100
        if (c) txt += centenas[c] + ' '
        if (resto > 0) {
          if (resto < 10) txt += unidades[resto]
          else if (resto < 20) txt += diez19[resto - 10]
          else {
            const d = Math.floor(resto / 10)
            const u = resto % 10
            if (resto < 30) txt += 'VEINTI' + unidades[u].toLowerCase()
            else txt += decenas[d] + (u ? ' Y ' + unidades[u] : '')
          }
        }
        return txt.trim().toUpperCase()
      }

      let palabras
      if (entero < 1000) palabras = aLetras(entero)
      else {
        const miles = Math.floor(entero / 1000)
        const resto = entero % 1000
        const milesTxt = (miles === 1 ? 'MIL' : aLetras(miles).replace(/UNO$/, 'UN') + ' MIL')
        palabras = milesTxt + (resto ? ' ' + aLetras(resto) : '')
      }

      // Apócope ante sustantivo masculino: UNO/VEINTIUNO -> UN/VEINTIUN quetzal(es)
      palabras = palabras.replace(/UNO$/, 'UN')
      const moneda = entero === 1 ? 'QUETZAL' : 'QUETZALES'
      if (centavos === 0) return `${palabras} ${moneda} EXACTOS`
      return `${palabras} ${moneda} CON ${String(centavos).padStart(2, '0')}/100`
    },

    // Si el expediente ya tiene datos de facturacion genera el recibo; si no, abre
    // el modal para capturarlos antes de generarlo.
    prepararReciboProvisional (data, idExpediente) {
      if (data.nombreFactura && data.nitFactura) {
        this.generarReciboProvisionalPDF(data)
        return
      }
      this.reciboData = data
      this.reciboExpedienteId = idExpediente
      this.facturaRecibo.nombre_factura = data.nombreFactura || ''
      this.facturaRecibo.nit_factura = data.nitFactura || ''
      this.$refs['modal-recibo-factura'].show()
    },
    confirmarFacturaRecibo () {
      if (!this.facturaRecibo.nombre_factura || !this.facturaRecibo.nit_factura) {
        this.alertErrorText = 'Ingrese el nombre y el NIT para la factura'
        this.alertCountDownError = 5
        return
      }
      const me = this
      axios.put(apiUrl + '/expedientes/updateFactura', {
        id: me.reciboExpedienteId,
        nombre_factura: me.facturaRecibo.nombre_factura,
        nit_factura: me.facturaRecibo.nit_factura,
        user: me.currentUser.user
      })
        .then(() => {
          me.reciboData.nombreFactura = me.facturaRecibo.nombre_factura
          me.reciboData.nitFactura = me.facturaRecibo.nit_factura
          me.generarReciboProvisionalPDF(me.reciboData)
          me.$refs['modal-recibo-factura'].hide()
        })
        .catch((error) => {
          me.alertErrorText = 'No se pudieron guardar los datos de facturación'
          me.alertCountDownError = 5
          console.error('Error updateFactura:', error)
        })
    },
    generarReciboProvisionalPDF (data) {
      const doc = new JsPDF()
      const anchoPagina = doc.internal.pageSize.getWidth()
      const total = Number(data.totalAPagar) || 0
      const fechaEmision = new Date().toLocaleString('es-GT', {
        timeZone: 'America/Guatemala',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      })

      // Se imprimen dos copias en la misma hoja (paciente y hospital), separadas por una línea de corte.
      const dibujarRecibo = (offsetY) => {
        doc.setFont('times', 'normal')
        doc.setFontSize(10)
        doc.text(`Fecha de Emision:   ${fechaEmision}`, anchoPagina - 15, offsetY, { align: 'right' })

        try { doc.addImage(logoHospital, 'PNG', 15, offsetY + 3, 22, 22) } catch (e) { console.error('logo recibo:', e) }

        doc.setFont(undefined, 'bold')
        doc.setFontSize(12)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A.', anchoPagina / 2, offsetY + 12, { align: 'center' })
        doc.setFontSize(14)
        doc.text('RECIBO PROVISIONAL', anchoPagina / 2, offsetY + 21, { align: 'center' })

        doc.setFontSize(11)
        doc.text(`ID EMERGENCIA: ${data.idEmergencia || ''}`, anchoPagina / 2, offsetY + 31, { align: 'center' })

        doc.setFont(undefined, 'normal')
        let y = offsetY + 41
        const x = 20
        doc.text(`NOMBRE DEL PACIENTE: ${data.nombre || ''}`, x, y); y += 9
        doc.text(`TOTAL DE LA CUENTA A PAGAR: Q${total.toFixed(2)}`, x, y); y += 9

        const letras = `CANTIDAD EN LETRAS: ${this.numeroALetras(total)}`
        const lineasLetras = doc.splitTextToSize(letras, anchoPagina - 40)
        doc.text(lineasLetras, x, y); y += lineasLetras.length * 7 + 2

        doc.text('POR CONCEPTO DE: Emergencia', x, y); y += 9
        doc.text(`FACTURA A NOMBRE DE: ${data.nombreFactura || ''}`, x, y)
        doc.text(`NIT: ${data.nitFactura || ''}`, anchoPagina - 70, y); y += 11

        doc.setFontSize(9)
        const nota = 'NOTA: ESTE ES UN DOCUMENTO PROVISIONAL PARA QUE EL DÍA HÁBIL SIGUIENTE PUEDA PASAR A CAJA A RECOGER SUS RESPECTIVAS FACTURAS PRESENTANDO ESTE COMPROBANTE'
        const lineasNota = doc.splitTextToSize(nota, anchoPagina - 40)
        doc.text(lineasNota, x, y); y += lineasNota.length * 5 + 4

        // Línea de corte punteada
        doc.setLineDashPattern([2, 2], 0)
        doc.line(10, y, anchoPagina - 10, y)
        doc.setLineDashPattern([], 0)
      }

      dibujarRecibo(12)
      dibujarRecibo(doc.internal.pageSize.getHeight() / 2 + 6)

      doc.save('recibo_provisional.pdf')
    }
  }
}

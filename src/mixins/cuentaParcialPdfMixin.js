// Hoja de cuenta parcial/total (PDF) a partir del id de expediente. Movida de
// Caja/CuentasPorCobrar para reusarla (p. ej. Panel de administracion). El
// componente debe tener alertErrorText y showAlertError.
import axios from 'axios'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import { apiUrl } from '../config/constant'
import { totalOxigeno } from '../Utils/oxigeno'

export default {
  methods: {
    generarReporteCuentaParcial (id, nombres, apellidos) {
      axios.get(apiUrl + `/consumos/cuentaParcial/${id}`)
        .then((response) => {
          const nombrePaciente = nombres + ' ' + apellidos
          const fechaIngreso = response.data.fechaFormateada
          this.generarPDF_CuentaParcial(response.data, nombrePaciente, fechaIngreso)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    async generarPDF_CuentaParcial (data, nombrePaciente, FechaIngreso) {
      // Fecha del informe: la del egreso (hora GT); si aun no egresa, la de hoy.
      const fechaActual = data.fechaEgreso ? new Date(`${data.fechaEgreso}T${data.horaEgreso || '00:00:00'}`) : new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES')
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }
      const horaFormateada = fechaActual.toLocaleTimeString('es-ES', opcionesHora)

      let mensajeDias

      if (!FechaIngreso) {
        mensajeDias = 'NO ASIGNADA'
      } else {
        const fechaIngreso = new Date(FechaIngreso)
        const diferenciaMs = fechaActual - fechaIngreso
        mensajeDias = Math.max(1, Math.floor(diferenciaMs / (1000 * 60 * 60 * 24)))
      }
      // Dias cobrados por el backend (corte 2 PM): 46 horas son 2 dias, no 1 ni 3.
      if (data && data.diasEstancia) mensajeDias = data.diasEstancia
      const hospitalizacion = data.costoTotal ?? 0

      try {
        const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
        const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoAnestesicosTotal = (data.consumosAnestesicos || []).reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        // Los servicios se muestran sumados dentro de material médico quirúrgico.
        const OxigenoTotal = totalOxigeno(data.consumos)
        const MaterialQuirurgicoConServicios = ConsumoQuirurgicosTotal + ConsumoTotal - OxigenoTotal
        const ExamenesTotal = data.examenes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

        const TotalGeneral =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoAnestesicosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalGeneral2 =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoAnestesicosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalApagar = TotalGeneral2 + TotalHonorarios
        const doc = new JsPDF()

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A. QUETZALTENANGO', 110, 10, { align: 'center' })

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('CUENTA TOTAL DE PACIENTE', 110, 14, { align: 'center' })

        doc.setFontSize(8).setFont(undefined, 'normal')
        doc.text('NOMBRE DEL PACIENTE:', 14, 20)
        doc.text(`${nombrePaciente}`, 50, 20)
        doc.text('_____________________________________________________________________________________________', 50, 21)

        doc.text('CUARTO NO.:', 14, 27)
        doc.text(`${data.numerohabitacion}`, 40, 27)
        doc.text('__________', 35, 28)

        doc.text('TIPO DE SERVICIO:', 60, 27)
        doc.text(`${data.tipoServicio || ''}`, 87, 27)
        doc.text('___________________________', 87, 28)

        doc.text('D/ESTANCIA: ', 130, 27)
        doc.text(`${mensajeDias}`, 170, 27)
        doc.text('_____________________________', 150, 28)

        doc.text('MD TRATANTE:', 14, 34)
        doc.text(`${data.nombremedico}`, 36, 34)
        doc.text('______________________________________________________________________________________________________', 36, 35)
        doc.autoTable({
          body: [
            ['HOSPITALIZACION', `Q${hospitalizacion.toFixed(2)}`],
            ['SALA DE OPERACIONES', `Q${ServicioSalaOperacionesTotal.toFixed(2)}`],
            ['CONSUMO MEDICAMENTOS', `Q${ConsumoMedicamentosTotal.toFixed(2)}`],
            ['MATERIAL MEDICO QUIRÚRGICO', `Q${MaterialQuirurgicoConServicios.toFixed(2)}`],
            ['ANESTESICOS', `Q${ConsumoAnestesicosTotal.toFixed(2)}`],
            ['MATERIAL COMÚN', `Q${ConsumoComunTotal.toFixed(2)}`],
            ['OXÍGENO', `Q${OxigenoTotal.toFixed(2)}`],
            ['RECUPERACION', ''],
            ['INTENSIVO', `Q 0.00`],
            ['EMERGENCIAS  Medico Interno', ''],
            ['OTROS', ''],
            ['TOTAL HOSPITALIZACION =', `Q${TotalGeneral2.toFixed(2)}`],
            // Descuento aprobado: solo si la cuenta lo tiene (el laboratorio va en su caja).
            ...(Number(data.descuentoAplicado) > 0 ? [[`DESCUENTO APLICADO (${data.descuentoPorcentaje}%) =`, `-Q${Number(data.descuentoAplicado).toFixed(2)}`]] : []),
            ['TOTAL MENOS DESCUENTO =', `Q${(TotalGeneral - (Number(data.descuentoAplicado) || 0)).toFixed(2)}`]
          ],
          startY: 41,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' }
          },
          didParseCell: function (data) {
            const rowIndex = data.row.index
            const colIndex = data.column.index
            if (rowIndex >= 12 && colIndex === 0) {
              data.cell.styles.halign = 'right'
            }
          }
        })

        const nextTableStartY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(12).setFont(undefined, 'normal')
        doc.text(`FECHA ${fechaFormateada} ${horaFormateada}`, 14, nextTableStartY)

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('HONORARIOS MEDICOS Y OTROS SERVICIOS', 100, nextTableStartY + 15, { align: 'center' })

        const tableRows = medicosOrdenados.map((medico, index) => [
          index + 1,
          medico.medico.nombre,
          medico.descripcion,
          `Q${(Number(medico.total) || 0).toFixed(2)}`
        ])

        doc.autoTable({
          head: [['#', 'MEDICO', 'DESCRIPCION', 'VALOR']],
          body: tableRows,
          startY: nextTableStartY + 20,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          headStyles: { fillColor: [255, 255, 255], textColor: [0, 0, 0], fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        const nextTableStartY2 = doc.lastAutoTable.finalY + 10

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('LIQUIDACION', 100, nextTableStartY2, { align: 'center' })

        doc.autoTable({
          body: [
            ['TOTAL HOSPITALIZACION', `Q${TotalGeneral2.toFixed(2)}`],
            ['TOTAL LAB. BIOMEDICO E.O. S.A.', `Q${ExamenesTotal.toFixed(2)}`],
            ['TOTAL HONORARIOS MEDICOS Y OTROS SERVICIOS', `Q${TotalHonorarios.toFixed(2)}`],
            // Liquidacion para el paciente: incluye laboratorio (lo que se guarda en la cuenta, TotalApagar, no).
            ['TOTAL A PAGAR =', `Q${(TotalApagar + ExamenesTotal).toFixed(2)}`]
          ],
          startY: nextTableStartY2 + 5,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2, textColor: [0, 0, 0] },
          columnStyles: {
            0: { halign: 'left' },
            1: { halign: 'left' }
          },
          didParseCell: function (data) {
            const rowIndex = data.row.index
            const colIndex = data.column.index
            if (rowIndex >= 3 && colIndex === 0) {
              data.cell.styles.halign = 'right'
            }
          }
        })

        const nextTableStartY3 = doc.lastAutoTable.finalY + 10

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('_______________________________________', 110, nextTableStartY3, { align: 'center' })
        doc.text('Nombre y Firma del Cajero', 110, nextTableStartY3 + 5, { align: 'center' })

        doc.save(`cuenta_Total_Paciente ${nombrePaciente}.PDF`)
      } catch (error) {
        console.log(error)
        console.error('Error al generar el reporte:', error)
      }
    }
  }
}

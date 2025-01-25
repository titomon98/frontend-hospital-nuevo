<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">REPORTES EXAMENES</h4>
            <div>
              <b-form-group label="Seleccione el tipo de reporte que quiere generar" v-slot="{ ariaDescribedby }">
                <b-form-radio-group
                  id="radio-group-2"
                  v-model="selectedArea"
                  :aria-describedby="ariaDescribedby"
                  name="radio-sub-component"
                  @change="selectedReport = null; reportItems = []; startDate = null; endDate = null;"
                >
                  <b-form-radio value="1" @change="onReportChange()">Reporte general de exámenes</b-form-radio>
                  <b-form-radio value="2" @change="onReportChange()">Reporte de exámenes más realizados y menos realizados</b-form-radio>
                  <b-form-radio value="3" @change="onReportChange()">Reporte de exámenes realizados hoy</b-form-radio>
                  <b-form-radio value="4" @change="onReportChange()">Reporte de exámenes por médico referente</b-form-radio>
                </b-form-radio-group>
              </b-form-group>
            </div>
            <div v-if="selectedArea === '4'">
              <b-form-group label="Seleccionar Medico">
                <v-select
                  name="medico"
                  v-model="selectedMedico"
                  :options="medicos"
                  :filterable="false"
                  placeholder="Seleccione el médico"
                  @search="onSearchDatosMedicos">

                  <template v-slot:option="option">
                    {{ option.nombre }}
                  </template>
                  <template slot="selected-option" slot-scope="option">
                    {{ option.nombre }}
                  </template>
                </v-select>
              </b-form-group>
            </div>
            <div>
              <label for="start-date">Fecha de inicio</label>
              <b-form-datepicker
                id="start-date"
                v-model="startDate"
                placeholder="Seleccione la fecha de inicio"
                class="mb-2"
              ></b-form-datepicker>
            </div>
            <div>
              <label for="end-date">Fecha de fin</label>
              <b-form-datepicker
                id="end-date"
                v-model="endDate"
                placeholder="Seleccione la fecha de fin"
                class="mb-2"
              ></b-form-datepicker>
            </div>
            <div v-if="selectedArea != null && startDate && endDate">
              <b-button variant="primary" @click="validarPDF">Generar PDF</b-button>
              <b-button variant="primary" @click="validarEXCEL">Descargar Excel</b-button>
            </div>
          </template>
          <template v-slot:headerAction> </template>
          <template v-slot:body>
            <b-table
              hover
              ref="reportTable"
              :items="reportItems"
              :select-mode="'single'"
              selectable
            >
            </b-table>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { xray } from '../../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import moment from 'moment'
import logo from '../../../../assets/images/login/logoLab.jpg'
import { apiUrl } from '../../../../config/constant'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import axios from 'axios'

export default {
  name: 'CuentasPendientes',
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      reportItems: [],
      reportFields: [
        { key: 'total', label: 'Total', sortable: true }
      ],
      selectedReport: null,
      startDate: null,
      endDate: null,
      selectedArea: '1',
      pdf_select: 1,
      id_medico: null,
      NombreMedico: null,
      selectedMedico: null,
      medicos: []
    }
  },
  watch: {
    selectedMedico (newValue) {
      if (newValue) {
        this.id_medico = newValue.id
        this.NombreMedico = newValue.nombre
      } else {
        this.pacientes = []
        this.formVoucher.cantidad = 0
        console.log('Ningun medico seleccionado, pacientes limpiados')
      }
    }
  },
  methods: {
    onReportChange () {
      if (this.selectedArea === '1') {
        this.pdf_select = 1
      } else if (this.selectedArea === '2') {
        this.pdf_select = 2
      } else if (this.selectedArea === '3') {
        this.pdf_select = 3
      } else if (this.selectedArea === '4') {
        this.pdf_select = 4
      }
      this.$nextTick(() => {
        this.$refs.reportTable.refresh()
      })
    },

    validarPDF () {
      if (!this.startDate || !this.endDate) {
        alert('Por favor, seleccione las fechas antes de continuar.')
        this.selectedReport = null
        return
      }
      this.ReporteExamenes(this.startDate, this.endDate)
    },

    onSearchDatosMedicos (search, loading) {
      if (search.length) {
        loading(true)
        this.onSearchMedicos(search, loading)
      }
    },
    onSearchMedicos (search, loading) {
      axios.get(apiUrl + '/voucher/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicos = response.data.Medicos
        loading(false)
      })
    },

    ReporteExamenes (fechainicio, fechafin) {
      if (this.pdf_select === 1) {
        axios.get(apiUrl + '/reporte/laboratio/examenesGeneral',
          {
            params: {
              fechaInicio: fechainicio,
              fechaFin: fechafin
            }
          })
          .then((response) => {
            this.generarPDFexamenes(response.data, fechainicio, fechafin)
            console.log(response.data)
          })
          .catch((error) => {
            console.error('Error al onbtener datos para el reporte 1:', error)
            this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
            this.showAlertError()
          })
      } else if (this.pdf_select === 2) {
        axios.get(apiUrl + '/reporte/laboratio/MasMenosRealizados',
          {
            params: {
              fechaInicio: fechainicio,
              fechaFin: fechafin
            }
          })
          .then((response) => {
            this.generarPDFexamenes(response.data, fechainicio, fechafin)
            console.log(response.data)
          })
          .catch((error) => {
            console.error('Error al onbtener datos para el reporte 1:', error)
            this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
            this.showAlertError()
          })
      } else if (this.pdf_select === 3) {
        axios.get(apiUrl + '/reporte/laboratio/examenesDiarios',
          {
            params: {
              fechaInicio: fechainicio,
              fechaFin: fechafin
            }
          })
          .then((response) => {
            this.generarPDFexamenes(response.data, fechainicio, fechafin)
            console.log(response.data)
          })
          .catch((error) => {
            console.error('Error al onbtener datos para el reporte 1:', error)
            this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
            this.showAlertError()
          })
      } else if (this.pdf_select === 4) {
        axios.get(apiUrl + '/reporte/laboratio/porMedico',
          {
            params: {
              idMedico: this.id_medico,
              fechaInicio: fechainicio,
              fechaFin: fechafin
            }
          })
          .then((response) => {
            this.generarPDFexamenes(response.data, fechainicio, fechafin)
            console.log(response.data)
          })
          .catch((error) => {
            console.error('Error al onbtener datos para el reporte 1:', error)
            this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
            this.showAlertError()
          })
      }
    },
    generarPDFexamenes (data, FechaInicio, FechaFin) {
      const examenes = data
      const fechaInicio = FechaInicio
      const fechaFin = FechaFin

      try {
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('LABORATORIO BIOMÉDICO E.O S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })

        if (this.pdf_select === 1) {
          doc.setFontSize(16)
          doc.text('Reporte General de Exámenes', 105, 50, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

          const tableRows = []
          examenes.forEach((examen, index) => {
            tableRows.push([
              index + 1,
              examen.nombreExamen,
              `${moment(examen.fechaInicio).format('DD/MM/YYYY')} -${moment(examen.fechaFin).format('DD/MM/YYYY')}`,
              `Q ${examen.totalGenerado.toFixed(2)}`
            ])
          })

          doc.autoTable({
            head: [['#', 'Nombre del Examen', 'Rango Fechas', 'Total Generado']],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
          })

          doc.save(`reporte_General_examenes_${fechaInicio}_a_${fechaFin}.pdf`)
        } else if (this.pdf_select === 2) {
          doc.setFontSize(16)
          doc.text('Reporte de Exámenes Más Realizados y Menos Realizados', 105, 50, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

          const tableRows = []
          examenes.forEach((examen, index) => {
            tableRows.push([
              index + 1,
              examen.examenes_almacenado.nombre,
              `${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`,
              `${examen.cantidad}`
            ])
          })

          doc.autoTable({
            head: [['#', 'Nombre del Examen', 'Rango Fechas', 'Total Realizados']],
            body: tableRows,
            startY: 70,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
          })

          doc.save(`reporte_examenes_Mas_y_Menos_Realizados_${fechaInicio}_a_${fechaFin}.pdf`)
        } else if (this.pdf_select === 3) {
          // REPORTE 3 EXAMENS POR DIA
          const ExamenesPorEstado = {
            1: { estado: 'En progreso', examenes: [] },
            2: { estado: 'Pagados', examenes: [] },
            3: { estado: 'Con resultados', examenes: [] },
            4: { estado: 'Anulados', examenes: [] }
          }
          examenes.forEach((examen) => {
            if (ExamenesPorEstado[examen.estado]) {
              ExamenesPorEstado[examen.estado].examenes.push({
                nombre_examen: examen.nombre_examen,
                nombre_paciente: examen.nombre_paciente,
                total: `Q ${examen.total.toFixed(2)}`,
                fecha: `${moment(examen.fecha).format('DD/MM/YYYY')}`,
                estado: ExamenesPorEstado[examen.estado].estado
              })
            }
          })
          doc.setFontSize(16)
          doc.text('Reporte de Exámenes Diarios', 105, 50, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

          let currentY = 65

          Object.keys(ExamenesPorEstado).forEach((key) => {
            const { estado, examenes } = ExamenesPorEstado[key]

            if (examenes.length > 0) {
              doc.setFontSize(14)
              doc.text(`Examenes ${estado}`, 14, currentY)

              const tableRows = []
              examenes.forEach((examen, i) => {
                tableRows.push([
                  i + 1,
                  examen.nombre_examen,
                  examen.nombre_paciente,
                  examen.total,
                  examen.fehca,
                  examen.estado
                ])
              })

              doc.autoTable({
                head: [['#', 'Nombre del Examen', 'Nombre del Paciente', 'Total', 'Fecha', 'Estado']],
                body: tableRows,
                startY: currentY + 5,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 2 },
                headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [240, 240, 240] }
              })

              currentY = doc.lastAutoTable.finalY + 10
              if (currentY > 270) {
                doc.addPage()
                currentY = 20
              }
            }
          })

          doc.save(`reporte_examenes_diarios_${fechaInicio}_a_${fechaFin}.pdf`)
        } else if (this.pdf_select === 4) {
          // REPORTE 4 POR MEDICO REFERENTE
          const examenesOrdenados = examenes.flatMap((grupo) => grupo.examenes)
          const ExamenesPorEstado = {
            1: { estado: 'En progreso', examenesOrdenados: [] },
            2: { estado: 'Pagados', examenesOrdenados: [] },
            3: { estado: 'Con resultados', examenesOrdenados: [] },
            4: { estado: 'Anulados', examenesOrdenados: [] }
          }

          examenesOrdenados.forEach((examen) => {
            if (ExamenesPorEstado[examen.estado]) {
              ExamenesPorEstado[examen.estado].examenesOrdenados.push({
                nombre_examen: examen.nombre_examen,
                nombre_paciente: examen.nombre_paciente,
                total: `Q ${Number(examen.total).toFixed(2)}`,
                fecha: moment(examen.fecha).format('DD/MM/YYYY'),
                estado: ExamenesPorEstado[examen.estado].estado
              })
            }
          })
          doc.setFontSize(16)
          doc.text('Reporte Examenes por Medico', 105, 50, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })
          doc.setFontSize(12)
          doc.text(`MEDICO: ${this.NombreMedico}`, 105, 65, { align: 'center' })

          let currentY = 75
          Object.keys(ExamenesPorEstado).forEach((key) => {
            const { estado, examenesOrdenados } = ExamenesPorEstado[key]

            if (examenesOrdenados.length > 0) {
              doc.setFontSize(14)
              doc.text(`Examenes ${estado}`, 14, currentY)

              const tableRows = []
              examenesOrdenados.forEach((examen, i) => {
                tableRows.push([
                  i + 1,
                  examen.nombre_examen,
                  examen.nombre_paciente,
                  examen.total,
                  examen.fecha,
                  examen.estado
                ])
              })

              doc.autoTable({
                head: [['#', 'Nombre del Examen', 'Nombre del Paciente', 'Total', 'Fecha', 'Estado']],
                body: tableRows,
                startY: currentY + 5,
                theme: 'grid',
                styles: { fontSize: 10, cellPadding: 2 },
                headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
                alternateRowStyles: { fillColor: [240, 240, 240] }
              })

              currentY = doc.lastAutoTable.finalY + 10
              if (currentY > 270) {
                doc.addPage()
                currentY = 20
              }
            }
          })

          doc.save(`reporte_examenes_por_medico_${fechaInicio}_a_${fechaFin}.pdf`)
        }
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.')
      }
    }
  }
}
</script>

<template>
  <b-container fluid>
    <b-alert
      :variant="alertVariant"
      :show="alertCountDown"
      dismissible
      fade
      @dismissed="alertCountDown=0"
      class="bg-white"
    >
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-alert
      :show="alertCountDownError"
      dismissible
      fade
      @dismissed="alertCountDownError=0"
      class="text-white bg-danger"
    >
      <div class="iq-alert-text">{{ alertErrorText }}</div>
    </b-alert>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Pedidos</h4>
            <div class="iq-search-bar mt-2">
              <div class="row">
                <div class="col-sm">
                  <b-form action="#" class="searchbox">
                  </b-form>
                </div>
                <div class="col-sm">
                </div>
              </div>
            </div>
          </template>
          <template v-slot:headerAction>
            <b-button variant="success" v-b-modal.modal-reporte-pedidos class="mt-3">
              <i class="ri-file-chart-line"></i> Generar reporte
            </b-button>
          </template>
          <template v-slot:body>
            <b-tabs>
              <b-tab title="Pedidos medicamento" active><PedidosMedicamento/></b-tab>
              <b-tab title="Pedidos material común" lazy><PedidosComun/></b-tab>
              <b-tab title="Pedidos material quirurgico" lazy><PedidosQuirurgico/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>

    <!-- Modal: generar reporte de pedidos surtidos por tipo, area y fecha -->
    <b-modal
      id="modal-reporte-pedidos"
      ref="modal-reporte-pedidos"
      title="Generar reporte de pedidos surtidos"
      size="lg"
      hide-footer
    >
      <b-form @submit.prevent="generarReporte">
        <b-row>
          <b-col md="6">
            <b-form-group label="Tipo de producto:">
              <b-form-select v-model="reporte.tipo" :options="tipoOptions"></b-form-select>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Área:">
              <b-form-select v-model="reporte.area" :options="areaOptions"></b-form-select>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Filtro por fecha:">
          <b-form-radio-group v-model="reporte.modo" :options="modoOptions"></b-form-radio-group>
        </b-form-group>
        <b-row v-if="reporte.modo === 'rango'">
          <b-col md="6">
            <b-form-group label="Fecha inicial:">
              <b-form-input type="date" v-model="reporte.fechaInicio"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Fecha final:">
              <b-form-input type="date" v-model="reporte.fechaFin"></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row v-else>
          <b-col md="6">
            <b-form-group label="Día:">
              <b-form-input type="date" v-model="reporte.dia"></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="12">
            <small class="text-muted">
              El día operativo va de las 8:00 AM del día elegido a las 7:59 AM del día siguiente.
            </small>
          </b-col>
        </b-row>
        <div class="text-right mt-3">
          <b-button variant="secondary" @click="$bvModal.hide('modal-reporte-pedidos')">Cancelar</b-button>
          <b-button variant="success" v-anti-doble type="button" class="ml-2" @click="generarReporte">Generar PDF</b-button>
        </div>
      </b-form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import PedidosComun from './PedidosComun.vue'
import PedidosMedicamento from './PedidosMedicamento.vue'
import PedidosQuirurgico from './PedidosQuirurgico.vue'
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'

export default {
  name: 'PedidosParent',
  components: {
    PedidosComun,
    PedidosMedicamento,
    PedidosQuirurgico
  },
  data () {
    return {
      patient: {},
      patientId: 0,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      reporte: {
        tipo: 'medicamentos',
        area: '',
        modo: 'rango',
        fechaInicio: '',
        fechaFin: '',
        dia: ''
      },
      tipoOptions: [
        { value: 'medicamentos', text: 'Medicamentos' },
        { value: 'comunes', text: 'Material común' },
        { value: 'quirurgicos', text: 'Material quirúrgico' },
        { value: 'todos', text: 'Todos los tipos' }
      ],
      areaOptions: [
        { value: '', text: 'Todas las áreas' },
        { value: 'Quirofano', text: 'Quirófano' },
        { value: 'Hospitalizacion', text: 'Hospitalización' },
        { value: 'Intensivo', text: 'Intensivo' },
        { value: 'Emergencia', text: 'Emergencia' }
      ],
      modoOptions: [
        { value: 'rango', text: 'Entre dos fechas' },
        { value: 'dia', text: 'Día específico (8am–8am)' }
      ]
    }
  },
  mounted () {
    xray.index()
  },
  beforeMount () {
    this.patientId = this.$route.params.id
    this.getPatient(this.patientId)
  },
  methods: {
    getPatient (id) {
      let me = this
      axios.get(apiUrl + `/paciente/get?id=${id}`)
        .then(response => {
          me.patient = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    backToPatients () {
      this.$router.push({ name: 'patient.patients' })
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    /* Genera el reporte de pedidos surtidos: pide los datos y arma el PDF */
    async generarReporte () {
      const me = this
      const r = this.reporte
      if (r.modo === 'rango' && (!r.fechaInicio || !r.fechaFin)) {
        me.alertVariant = 'danger'
        me.showAlertError()
        me.alertErrorText = 'Debe indicar la fecha inicial y la final'
        return
      }
      if (r.modo === 'dia' && !r.dia) {
        me.alertVariant = 'danger'
        me.showAlertError()
        me.alertErrorText = 'Debe indicar el día'
        return
      }
      try {
        const params = { tipo: r.tipo, area: r.area, modo: r.modo }
        if (r.modo === 'rango') {
          params.fechaInicio = r.fechaInicio
          params.fechaFin = r.fechaFin
        } else {
          params.dia = r.dia
        }
        const response = await axios.get(apiUrl + '/reporte/pedidos/surtidos', { params })
        const payload = response.data
        if (!payload.data || payload.data.length === 0) {
          me.alertVariant = 'warning'
          me.showAlert()
          me.alertText = 'No se encontraron pedidos surtidos con esos filtros'
          return
        }
        me.construirPdf(payload)
        me.$refs['modal-reporte-pedidos'].hide()
      } catch (error) {
        me.alertVariant = 'danger'
        me.showAlertError()
        me.alertErrorText =
          (error.response && error.response.data && error.response.data.msg) ||
          'Ha ocurrido un error al generar el reporte'
        console.error('There was an error!', error)
      }
    },
    /* Construye y descarga el PDF a partir de los datos del backend */
    construirPdf (payload) {
      const tipoLabel = (this.tipoOptions.find(t => t.value === payload.tipo) || {}).text || payload.tipo
      const areaLabel = payload.area === 'Todas'
        ? 'Todas las áreas'
        : (this.areaOptions.find(a => a.value === payload.area) || {}).text || payload.area

      const doc = new JsPDF()
      doc.setFontSize(16)
      doc.text('Reporte de pedidos surtidos - ' + tipoLabel, 105, 18, { align: 'center' })
      doc.setFontSize(11)
      doc.text('Área: ' + areaLabel, 14, 30)
      const periodo = payload.modo === 'dia'
        ? 'Día operativo: ' + moment(payload.desde).format('DD/MM/YYYY HH:mm') + ' a ' + moment(payload.hasta).format('DD/MM/YYYY HH:mm')
        : 'Rango: ' + moment(payload.desde).format('DD/MM/YYYY') + ' a ' + moment(payload.hasta).format('DD/MM/YYYY')
      doc.text(periodo, 14, 37)
      doc.text('Pedidos surtidos: ' + payload.total_registros, 14, 44)

      const conTipo = payload.tipo === 'todos'
      const head = conTipo
        ? [['Fecha surtido', 'Código pedido', 'Tipo', 'Producto', 'Cantidad', 'Destino']]
        : [['Fecha surtido', 'Código pedido', 'Producto', 'Cantidad', 'Destino']]
      const body = payload.data.map(d => conTipo
        ? [d.fecha, d.codigoPedido, d.tipoProducto, d.producto, d.cantidad, d.destino]
        : [d.fecha, d.codigoPedido, d.producto, d.cantidad, d.destino])
      const foot = conTipo
        ? [['', '', '', 'Total cantidad', payload.total_cantidad, '']]
        : [['', '', 'Total cantidad', payload.total_cantidad, '']]

      autoTable(doc, {
        startY: 50,
        head: head,
        body: body,
        foot: foot,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [40, 118, 74] },
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' }
      })

      const nombre = 'Reporte_surtidos_' + payload.tipo + '_' + (payload.area || 'Todas') + '.pdf'
      doc.save(nombre)
    }
  }
}
</script>

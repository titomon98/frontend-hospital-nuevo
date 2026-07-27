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
              <h4 class="card-title mt-3">Productos pendientes de surtir</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar producto..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
              <b-button variant="success" v-b-modal.modal-reporte-pedidos class="mt-3">
                <i class="ri-file-chart-line"></i> Generar reporte
              </b-button>
          </template>
          <template v-slot:body>
            <datatable-heading
              :changePageSize="changePageSizes"
              :searchChange="searchChange"
              :from="from"
              :to="to"
              :total="total"
              :perPage="perPage"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable"
              class="table-divided order-with-arrow"
              :api-url="apiBase"
              :query-params="makeQueryParams"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fields"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <!-- Destino -->
              <div slot="destino" slot-scope="props">
                <b-badge :variant="props.rowData.destino === 2 ? 'info' : 'primary'">
                  {{ props.rowData.destino === 2 ? 'Quirófano' : 'Enfermería' }}
                </b-badge>
              </div>
              <!-- Accion: surtir esta linea -->
              <template slot="acciones" slot-scope="props">
                <b-button
                  v-anti-doble
                  size="sm"
                  variant="primary"
                  @click="surtirLinea(props.rowData)"
                  >Surtir</b-button
                >
              </template>
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
    </b-row>

    <!-- Modal: generar reporte de consumos por tipo, area y fecha -->
    <b-modal
      id="modal-reporte-pedidos"
      ref="modal-reporte-pedidos"
      title="Generar reporte de consumos"
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
          <b-button variant="success" v-anti-doble type="submit" class="ml-2">Generar PDF</b-button>
        </div>
      </b-form>
    </b-modal>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'

export default {
  name: 'Pedidos',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/detalle_pedidos/getPendientes',
      fields: [
        {
          name: 'pedido.codigoPedido',
          sortField: 'id_pedido',
          title: 'Código de Pedido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Producto',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'text-muted'
        },
        {
          name: '__slot:destino',
          title: 'Destino',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: '__slot:acciones',
          title: 'Acción',
          titleClass: '',
          dataClass: 'text-muted'
        }
      ],
      // Estado del formulario de reporte.
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
        { value: 'quirurgicos', text: 'Material quirúrgico' }
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
  methods: {
    /* Genera el reporte de consumos: pide los datos al backend y arma el PDF */
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
        const response = await axios.get(apiUrl + '/reporte/pedidos/consumos', { params })
        const payload = response.data
        if (!payload.data || payload.data.length === 0) {
          me.alertVariant = 'warning'
          me.showAlert()
          me.alertText = 'No se encontraron consumos con esos filtros'
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
      doc.text('Reporte de consumos - ' + tipoLabel, 105, 18, { align: 'center' })
      doc.setFontSize(11)
      doc.text('Área: ' + areaLabel, 14, 30)
      const periodo = payload.modo === 'dia'
        ? 'Día operativo: ' + moment(payload.desde).format('DD/MM/YYYY HH:mm') + ' a ' + moment(payload.hasta).format('DD/MM/YYYY HH:mm')
        : 'Rango: ' + moment(payload.desde).format('DD/MM/YYYY') + ' a ' + moment(payload.hasta).format('DD/MM/YYYY')
      doc.text(periodo, 14, 37)
      doc.text('Registros: ' + payload.total_registros, 14, 44)

      autoTable(doc, {
        startY: 50,
        head: [['Fecha', 'Producto', 'Cuenta', 'Cantidad', 'Precio', 'Total']],
        body: payload.data.map(d => [d.fecha, d.producto, d.cuenta, d.cantidad, d.precio_venta, d.total]),
        foot: [['', '', '', '', 'Total general', payload.total_general]],
        styles: { fontSize: 8 },
        headStyles: { fillColor: [40, 118, 74] },
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' }
      })

      const nombre = 'Reporte_' + payload.tipo + '_' + (payload.area || 'Todas') + '.pdf'
      doc.save(nombre)
    },
    /* Surtir una linea individual del pedido */
    surtirLinea (item) {
      const me = this
      axios
        .post(apiUrl + '/detallePedidos/surtir', {
          id: item.id
        })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha surtido "' + item.descripcion + '" exitosamente'
          // La linea surtida deja de estar pendiente, se refresca el listado
          // para que desaparezca de la vista.
          me.$refs.vuetable.refresh()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText =
            (error.response && error.response.data && error.response.data.msg) ||
            'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'id',
        order: sortOrder[0] ? sortOrder[0].direction : 'desc',
        page: currentPage,
        limit: this.perPage,
        search: this.search
      }
    },
    changePageSizes (perPage) {
      this.perPage = perPage
      this.$refs.vuetable.refresh()
    },
    searchChange (val) {
      this.search = val.toLowerCase()
      this.$refs.vuetable.refresh()
    },
    onPaginationData (paginationData) {
      this.from = paginationData.from
      this.to = paginationData.to
      this.total = paginationData.total
      this.lastPage = paginationData.last_page
      this.items = paginationData.data
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    }
  }
}
</script>

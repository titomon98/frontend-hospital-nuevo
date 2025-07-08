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
    <b-modal id="modal-1-bank" ref="modal-1-bank" title="Agregar banco">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-form-group label="Nombre:">
          <b-form-input
            v-model.trim="$v.form.name.$model"
            :state="!$v.form.name.$error"
            placeholder="Ingresar nombre del banco"
          ></b-form-input>
          <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-pdf" ref="modal-pdf" title="Generar PDF" size="xl">
      <div id="previewContainer">
        <iframe :src="previewURL" width="100%" height="700px"></iframe>
      </div>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="descargarpdf()">Guardar</b-button>
        <b-button variant="danger" @click="closeModal('pdf')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Cortes</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-form-group label="Fecha:">
                      <b-form-input type="date" v-model="selectedDate"></b-form-input>
                      <b-button
                        @click="getReport()"
                        class="mb-2 mt-2 button-spacing"
                        size="sm"
                        variant="dark"
                      >Ver reporte por día</b-button>
                    </b-form-group>
                    <b-form action="#" class="searchbox">
                      <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                      <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                    </b-form>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
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
              <!-- Estado -->
              <div slot="estado" slot-scope="props">
                <h5 v-if="props.rowData.estado == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>PENDIENTE DE PAGO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>PAGADA</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    @click="setData(props.rowData)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver detalle</b-button>
                </b-button-group>
              </template>
              <!-- Paginacion -->
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>

import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { mapGetters } from 'vuex'
import moment from 'moment'
import logo from '../../../../../src/assets/images/logo.png'

export default {
  name: 'Bank',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    this.selectedDate = `${yyyy}-${mm}-${dd}`
  },
  mounted () {
    xray.index()
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      detalle: [],
      pagoCuentas: [],
      pdf: new JsPDF(),
      pdfName: '',
      previewURL: '',
      selectedDate: null,
      encabezado: {
        id: 0,
        fecha: null,
        nit: null,
        usuario: null,
        total: null
      },
      form: {
        id: 0,
        name: '',
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/cuentas/payList',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'expediente.nombres',
          sortField: 'expediente.nombres',
          title: 'Nombres',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Numero de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'total',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total_pagado',
          sortField: 'total_pagado',
          title: 'Total pagado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'pendiente_de_pago',
          sortField: 'pendiente_de_pago',
          title: 'Pendiente de pago',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_corte',
          sortField: 'fecha_corte',
          title: 'Fecha de corte',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      fieldsCampos: [
        {
          key: 'Descripcion',
          label: 'Descripcion',
          sortable: true
        },
        {
          key: 'costo',
          label: 'Costo',
          sortable: true
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        name: { required }
      },
      selectedDate: { required }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-bank'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-bank'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    formatFecha (fecha) {
      const [year, month, day] = fecha.split('-')
      return `${day}-${month}-${year}`
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        if (action === 'save') {
          this.onSave()
        } else if (action === 'update') {
          this.onUpdate()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    /* setData (data) {
      this.form.name = data.nombre
      this.form.state = data.estado
      this.form.id = data.id
    }, */
    setData (data) {
      this.form.id = data.id
      this.form.name = data.nombres
      this.getDetail(data.id, data)
    },
    getDetail (num, data) {
      this.pagoCuentas = []
      axios.get(apiUrl + '/cuentas/getByAccount', {
        params: {
          id: num
        }
      }).then((response) => {
        this.detalle = response.data
        response.data.forEach(element => {
          if (element.detalle_pago_cuentas.length > 0) {
            element.detalle_pago_cuentas.forEach(i => {
              this.pagoCuentas.push(i)
            })
          }
        })
        console.log(this.pagoCuentas)
        this.printSale(data, 1)
      })
    },
    getReport () {
      axios.get(apiUrl + '/cuentas/listCortesPerDate', {
        params: {
          fecha_corte: this.selectedDate
        }
      }).then((response) => {
        this.detalle = response.data
        this.printSale(response.data, 2)
      })
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/banco/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el banco ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* Guardar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide();
      axios.put(apiUrl + '/banco/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el banco ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('update')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    onState () {
      let me = this
      if (this.form.state === 1) {
        axios
          .put(apiUrl + '/banco/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el banco ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-bank'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/banco/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el banco ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-bank'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
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
    },
    printSale (data, type) {
      this.arrayDetalles = type === 1 ? this.detalle
        : data.map(item => ({
          expediente: item.expediente.expediente,
          nombres: item.expediente.nombres,
          apellidos: item.expediente.apellidos,
          numero: item.numero,
          total: item.total,
          totalPagado: item.total_pagado,
          fecha: item.createdAt,
          tipo: item.tipo
        }))
      if (this.arrayDetalles.length > 0) {
        this.$refs['modal-pdf'].show()
        var altura = 1
        var ahora = new Date()
        this.encabezado.id = type === 1 ? data.id : null
        this.encabezado.fecha = new Date().toLocaleDateString('es-us', data.fecha)

        this.pdf = new JsPDF({
          unit: 'cm',
          format: [14, 21.5]
        })
        var ingreso = moment(ahora).format('DD/MM/YYYY')
        var imgData = logo
        this.pdf.addImage(imgData, 'PNG', 1.5, 0.2, 3, 3)
        this.pdf.setFontSize(7).setFont(undefined, 'bold')
        this.pdf.text('Hospital de Especialidades', 1.5, 3.3)
        this.pdf.setFontSize(10).setFont(undefined, 'bold')
        if (type === 1) {
          this.pdf.text('Detalle de cuenta ' + data.numero + ' - Paciente: ' + data.expediente.nombres + ' ' + data.expediente.apellidos, 5, altura)
          this.pdfName = 'DetalleCuenta' + data.id + '.pdf'
          altura = altura + 0.5
          this.pdf.text('Total: ' + data.total, 5, altura)
          altura = altura + 0.5
          this.pdf.text('Total pagado: ' + data.total_pagado, 5, altura)
          altura = altura + 0.5
          this.pdf.text('Pendiente de pago: ' + data.pendiente_de_pago, 5, altura)
        } else {
          var arrayHospi = []
          var arrayEmergencia = []
          var ArrayQuirofano = []
          var ArrayIntensivo = []
          var medioDePago = []
          var totHospi = 0
          var totEmergencia = 0
          var totQuirofano = 0
          var totIntensivo = 0
          this.arrayDetalles.forEach(item => {
            if (item.tipo === 1) {
              arrayHospi.push(item)
              totHospi = parseFloat(totHospi) + parseFloat(item.totalPagado)
            } else if (item.tipo === 2) {
              totEmergencia = parseFloat(totEmergencia) + parseFloat(item.totalPagado)
              arrayEmergencia.push(item)
            } else if (item.tipo === 3) {
              ArrayQuirofano.push(item)
              totQuirofano = parseFloat(totQuirofano) + parseFloat(item.totalPagado)
            } else if (item.tipo === 4) {
              ArrayIntensivo.push(item)
              totIntensivo = parseFloat(totIntensivo) + parseFloat(item.totalPagado)
            }
          })
          data.forEach(item => {
            if (item.detalle_pago_cuentas.length > 0) {
              item.detalle_pago_cuentas.forEach(i => {
                medioDePago.push(i)
              })
            }
          })
          var tot = 0
          var totPagado = 0
          var totPendiente = 0
          data.forEach(item => {
            tot = parseFloat(tot) + parseFloat(item.total)
            totPagado = parseFloat(totPagado) + parseFloat(item.total_pagado)
            totPendiente = parseFloat(totPendiente) + parseFloat(item.pendiente_de_pago)
          })
          this.pdf.text('Corte del día ' + this.selectedDate, 5, altura)
          this.pdfName = 'Corte del día ' + this.selectedDate + '.pdf'
          altura = altura + 0.5
          this.pdf.text('Total: Q.' + tot, 5, altura)
          altura = altura + 0.5
          this.pdf.text('Total pagado: Q.' + totPagado, 5, altura)
          altura = altura + 0.5
          this.pdf.text('Pendiente de pago: Q.' + totPendiente, 5, altura)
        }
        // Encabezado
        altura = altura + 0.5
        this.pdf.text('Fecha de generación: ' + ingreso, 5, altura)
        altura = altura + 0.5
        this.pdf.text('Informe generado por: ', 5, altura)
        this.pdf.setFontSize(10).setFont(undefined, 'normal')
        this.pdf.text(this.currentUser.user, 8.75, altura)
        altura = altura + 0.5
        // Tabla
        if (type === 1) {
          autoTable(this.pdf, {
            columns: [{ header: 'Descripción', dataKey: 'Descripcion' }, { header: 'Costo', dataKey: 'costo' }, { header: 'Fecha', dataKey: 'createdAt' }],
            body: this.detalle,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          autoTable(this.pdf, {
            columns: [{ header: 'Efectivo', dataKey: 'efectivo' }, { header: 'Tarjeta', dataKey: 'tarjeta' }, { header: 'Recargo', dataKey: 'recargoTarjeta' }, { header: 'Depósito', dataKey: 'deposito' }, { header: 'Cheque', dataKey: 'cheque' }, { header: 'Seguro', dataKey: 'seguro' }, { header: 'Transferencia', dataKey: 'transferencia' }],
            body: this.pagoCuentas,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
        } else {
          altura = altura + 0.5
          this.pdf.text('Hospitalización Q.' + totHospi, 1.5, altura)
          autoTable(this.pdf, {
            columns: [{ header: 'Expediente', dataKey: 'expediente' }, { header: 'Nombre', dataKey: 'nombres' }, { header: 'Apellido', dataKey: 'apellidos' }, { header: 'Fecha de Pago', dataKey: 'fecha' }, { header: 'Total', dataKey: 'total' }, { header: 'Total pagado', dataKey: 'totalPagado' }],
            body: arrayHospi,
            startY: altura + 0.5,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          let finalY = this.pdf.lastAutoTable.finalY || 10
          this.pdf.text('Emergencia Q.' + totEmergencia, 1.5, finalY + 0.5)
          autoTable(this.pdf, {
            columns: [{ header: 'Expediente', dataKey: 'expediente' }, { header: 'Nombre', dataKey: 'nombres' }, { header: 'Apellido', dataKey: 'apellidos' }, { header: 'Fecha de Pago', dataKey: 'fecha' }, { header: 'Total', dataKey: 'total' }, { header: 'Total pagado', dataKey: 'totalPagado' }],
            body: arrayEmergencia,
            startY: finalY + 1,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          finalY = this.pdf.lastAutoTable.finalY || 10
          this.pdf.text('Quirófano Q.' + totQuirofano, 1.5, finalY + 0.5)
          autoTable(this.pdf, {
            columns: [{ header: 'Expediente', dataKey: 'expediente' }, { header: 'Nombre', dataKey: 'nombres' }, { header: 'Apellido', dataKey: 'apellidos' }, { header: 'Fecha de Pago', dataKey: 'fecha' }, { header: 'Total', dataKey: 'total' }, { header: 'Total pagado', dataKey: 'totalPagado' }],
            body: ArrayQuirofano,
            startY: finalY + 1,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          finalY = this.pdf.lastAutoTable.finalY || 10
          this.pdf.text('Intensivo Q.' + totIntensivo, 1.5, finalY + 0.5)
          autoTable(this.pdf, {
            columns: [{ header: 'Expediente', dataKey: 'expediente' }, { header: 'Nombre', dataKey: 'nombres' }, { header: 'Apellido', dataKey: 'apellidos' }, { header: 'Fecha de Pago', dataKey: 'fecha' }, { header: 'Total', dataKey: 'total' }, { header: 'Total pagado', dataKey: 'totalPagado' }],
            body: ArrayIntensivo,
            startY: finalY + 1,
            margin: { top: 5 },
            headStyles: {
              fontSize: 5,
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          finalY = this.pdf.lastAutoTable.finalY || 10
          this.pdf.text('Medios de pago', 1.5, finalY + 0.5)
          autoTable(this.pdf, {
            columns: [{ header: 'Efectivo', dataKey: 'efectivo' }, { header: 'Tarjeta', dataKey: 'tarjeta' }, { header: 'Recargo', dataKey: 'recargoTarjeta' }, { header: 'Depósito', dataKey: 'deposito' }, { header: 'Cheque', dataKey: 'cheque' }, { header: 'Seguro', dataKey: 'seguro' }, { header: 'Transferencia', dataKey: 'transferencia' }],
            startY: finalY + 1,
            body: medioDePago,
            margin: { top: 5 },
            headStyles: {
              fillColor: [21, 21, 21],
              textColor: [225, 225, 225],
              fontSize: 5,
              fontStyle: 'bold'
            },
            bodyStyles: {
              fontSize: 5
            }
          })
          const totalPages = this.pdf.getNumberOfPages()

          for (let i = 1; i <= totalPages; i++) {
            this.pdf.setPage(i)
            altura = 1
            this.pdf.addImage(imgData, 'PNG', 1.5, 0.2, 3, 3)
            this.pdf.setFontSize(7).setFont(undefined, 'bold')
            this.pdf.text('Hospital de Especialidades', 1.5, 3.3)
            this.pdf.setFontSize(10).setFont(undefined, 'bold')
            this.pdf.text('Corte del día ' + this.selectedDate, 5, altura)
            altura = altura + 0.5
            this.pdf.text('Total: Q.' + tot, 5, altura)
            altura = altura + 0.5
            this.pdf.text('Total pagado: Q.' + totPagado, 5, altura)
            altura = altura + 0.5
            this.pdf.text('Pendiente de pago: Q.' + totPendiente, 5, altura)
            altura = altura + 0.5
            this.pdf.text('Fecha de generación: ' + ingreso, 5, altura)
            altura = altura + 0.5
            this.pdf.text('Informe generado por: ', 5, altura)
            this.pdf.setFontSize(10).setFont(undefined, 'normal')
            this.pdf.text(this.currentUser.user, 8.75, altura)
            this.pdf.setFontSize(5).setFont(undefined, 'normal')
            this.pdf.text(i + '/' + totalPages, 12, 1)
            altura = altura + 0.5
            // drawHeader(doc);
          }
        }
        var pdfData = this.pdf.output('blob')
        // Convert PDF to data URL
        var pdfURL = URL.createObjectURL(pdfData)
        this.previewURL = pdfURL
      } else {
        this.alertVariant = 'danger'
        this.showAlert()
        this.alertText = 'No se encontraron datos.'
      }
    },
    descargarpdf () {
      this.pdf.save(this.pdfName)
    }
  }
}
</script>

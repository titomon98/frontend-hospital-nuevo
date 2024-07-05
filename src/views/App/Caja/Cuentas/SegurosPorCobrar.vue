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
    <b-modal id="modal-1-traslado" ref="modal-1-traslado" title="Trasladar paciente">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea trasladar el paciente: {{ form.nombres }} ?
      </h6>
      <b-form @submit="$event.preventDefault()">
        <b-col >
          <b-form-group label="Área a la que desea trasladar:">
            <b-form-radio-group
                      id="radio-group-2"
                      v-model="selectedTrasOption"
                      :options="optionsTraslado"
                      name="radio-options"
                    ></b-form-radio-group>
            <div v-if="selectedTrasOption==1 || selectedTrasOption==4">
              Habitación
              <v-select
              ref="selectHab"
              v-model="selectedHab"
              :options="habitaciones"
              label="numero"
              value="id"></v-select>
            </div>
          </b-form-group>
        </b-col>
      </b-form>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onValidate()
                  this.selectedHab = null
          "
          >Ingresar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-1-traslado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-pay" ref="modal-2-pay" title="Pagar seguro" size="xl">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6>¿Desea cobrar el seguro de {{this.form.nombres}} {{this.form.apellidos}}?</h6>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onPay()
        "
          >Aceptar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-pay')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-deactivate" ref="modal-3-deactivate" title="Desactivar seguro">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea desactivar el seguro: {{ form.id }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onDeactivate()
                  $bvModal.hide('modal-3-deactivate')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-deactivate')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-bank" ref="modal-4-bank" title="Activar banco">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea activar al banco: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-bank')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-bank')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Seguros por cobrar</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
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
                <h5 v-if="props.rowData.solvente == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>SOLVENTE</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else-if="props.rowData.solvente == 0">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>PENDIENTE DE PAGO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>DESACTIVADO</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                  v-if="props.rowData.solvente === 0"
                    v-b-tooltip.top="'Pagar'"
                    @click="
                      setData(props.rowData)
                      $bvModal.show('modal-2-pay')
                    "
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-money'"
                  /></b-button>
                  <b-button
                    v-if="props.rowData.solvente <= 1"
                    v-b-tooltip.top="'Desactivar'"
                    @click="
                      setData(props.rowData)
                      $bvModal.show('modal-3-deactivate')
                    "
                    class="mb-2"
                    size="sm"
                    variant="outline-danger"
                    ><i :class="'fa fa-trash'"
                  /></b-button>
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
    this.getHabitaciones(0)
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
      totPagado: 0,
      form: {
        id: 0,
        assurance: 0,
        nombres: '',
        apellidos: '',
        expediente: '',
        cui: '',
        state: 1,
        numero: 1,
        total_pagado: 0,
        pendiente_de_pago: 0,
        total: 0
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      selectedPayment: [], // Must be an array reference!
      paymentOptions: [
        { text: 'Efectivo', value: 1 },
        { text: 'Tarjeta', value: 2 },
        { text: 'Depósito', value: 3 },
        { text: 'Cheque', value: 4 },
        { text: 'Seguro', value: 5 },
        { text: 'Transferencia', value: 6 }
      ],
      paymentType: {
        Efectivo: 0,
        Tarjeta: 0,
        Deposito: 0,
        Cheque: 0,
        Seguro: 0,
        Transferencia: 0
      },
      paymentSum: 0,
      alertVariant: '',
      selectedHab: null,
      habitaciones: [],
      selectedAccount: null,
      totalPayment: 0,
      cuentas: [],
      selectedTrasOption: 1,
      optionsTraslado: [
        { text: 'Quirófano', value: 3 },
        { text: 'Hospitalización', value: 1 },
        { text: 'Intensivos', value: 4 }
      ],
      apiBase: apiUrl + '/seguros/debtList',
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
          name: 'no_poliza',
          sortField: 'no_poliza',
          title: 'Numero de Póliza',
          dataClass: 'list-item-heading'
        },
        {
          name: 'aseguradora.nombre',
          sortField: 'aseguradora.nombre',
          title: 'Aseguradora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'aseguradora.telefono',
          sortField: 'aseguradora.telefono',
          title: 'Teléfono de la aseguradora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_asegurado',
          sortField: 'nombre_asegurado',
          title: 'Persona asegurada',
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
      fieldsAccounts: [
        {
          key: 'numero',
          label: 'Numero',
          sortable: true
        },
        {
          key: 'motivo',
          label: 'Motivo',
          sortable: true
        },
        {
          key: 'pendiente_de_pago',
          label: 'Total a pagar',
          sortable: true
        },
        {
          key: 'total',
          label: 'Total',
          sortable: true
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        name: { required }
      }
    }
  },
  methods: {
    onRowSelected (items) {
      this.selectedAccount = items[0].id
      this.totalPayment = items[0].pendiente_de_pago
      this.totPagado = items[0].total_pagado
    },
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
          this.$refs['modal-1-traslado'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-pay'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.selectedHab === null && (this.selectedTrasOption === 1 || this.selectedTrasOption === 4)) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        this.onState()
        this.$bvModal.hide('modal-1-traslado')
      }
    },
    setData (data) {
      this.form.name = data.nombres
      this.form.apellidos = data.apellidos
      this.form.state = data.estado
      this.form.id = data.id
      this.form.numero = data.numero
      this.form.total_pagado = data.total_pagado
      this.form.pendiente_de_pago = data.pendiente_de_pago
      this.form.total = data.total
      this.cuentas[0] = data
      this.selectedAccount = data.id
      this.totalPayment = data.pendiente_de_pago
      this.totPagado = data.total_pagado
      console.log(this.cuentas)
      //this.getCuentas(data.id)
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
    onDeactivate () {
      console.log(this.form.id)
      let me = this
      axios
        .put(apiUrl + '/seguros/deactivate', {
          id: this.form.id
        })
        .then((response) => {
          me.alertVariant = 'warning'
          me.showAlert()
          me.alertText = 'Se ha desactivado el banco ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
        })
    },
    onPay () {
      console.log(this.form.id)
      let me = this
      axios
        .put(apiUrl + '/seguros/paid', {
          id: this.form.id
        })
        .then((response) => {
          me.$refs['modal-2-pay'].hide()
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha desactivado el banco ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
        })
    },
    onState () {
      let me = this
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption
        })
        .then((response) => {
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha trasladado el paciente ' + me.form.nombres + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-1-traslado'].hide()
          if (this.selectedTrasOption === 1 || this.selectedTrasOption === 4) {
            axios
              .put(apiUrl + '/habitaciones/inUse', {
                id: this.selectedHab.id,
                ocupante: this.form.id
              })
              .then((res) => {
                this.selectedHab = null
                console.log(this.selectedHab)
                this.getHabitaciones(0).then(me.$refs.selectHab.refresh())
              })
          }
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    onPatientQuit () {
      this.paymentSum = parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro) + parseFloat(this.paymentType.Transferencia)
      if (this.paymentSum !== parseFloat(this.totalPayment)) {
        this.alertErrorText = 'El total a pagar no concuerda con el total ingresado'
        this.showAlertError()
      } else {
        let me = this

        axios.put(apiUrl + '/cuentas/deactivate',
            {
              id: this.selectedAccount,
              total_pagado: parseFloat(this.totPagado) + parseFloat(this.paymentSum),
              pendiente_de_pago: parseFloat(parseFloat(this.totalPayment) - parseFloat(this.paymentSum)),
              efectivo: this.paymentType.Efectivo,
              tarjeta: this.paymentType.Tarjeta,
              deposito: this.paymentType.Deposito,
              cheque: this.paymentType.Cheque,
              seguro: this.paymentType.Seguro,
              transferencia: this.paymentType.Transferencia,
              total: this.paymentSum,
              tipo: 'finiquito'
            })
            .then(
              this.selectedAccount = null,
              this.paymentType.Efectivo = 0,
              this.paymentType.Tarjeta = 0,
              this.paymentType.Deposito = 0,
              this.paymentType.Cheque = 0,
              this.paymentType.Seguro = 0,
              this.paymentType.transferencia = 0,
              this.paymentSum = 0
            )
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha egresado el paciente ' + me.form.nombres + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-2-pay'].hide()

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
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/get', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
        console.log(response.data)
      })
    },
    getCuentas (num) {
      axios.get(apiUrl + '/cuentas/getByExp', {
        params: {
          id: num
        }
      }).then((response) => {
        this.cuentas = response.data
        console.log(response.data)
      })
    },
    inputPaymentType (inptPay) {
      this.paymentType = inptPay
    }
  }
}
</script>

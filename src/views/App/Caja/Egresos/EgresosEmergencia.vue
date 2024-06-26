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
    <b-modal id="modal-2-egreso" ref="modal-2-egreso" title="Egresar paciente">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6>¿Desea dar egreso al paciente {{this.form.nombres}} {{this.form.apellidos}}?</h6>
      <template>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onPatientQuit()
        "
          >Aceptar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-egreso')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-bank" ref="modal-3-bank" title="Desactivar banco">
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
        ¿Desea desactivar el banco: {{ form.name }} ?
      </h6>
      <template>
        <div>
          <b-form-group label="Motivo del egreso:">
            <b-form-radio-group
                      id="radio-group-egreso"
                      v-model="selectedQuitOption"
                      :options="optionsQuit"
                      name="radio-options-2"
                    ></b-form-radio-group>
          </b-form-group>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-bank')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-bank')"
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
              <h4 class="card-title mt-3">Egresos emergencia</h4>
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
                <h5 v-if="props.rowData.estado == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong></strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>EN EMERGENCIAS</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Egresar paciente'"
                    @click="
                      setData(props.rowData)
                      $bvModal.show('modal-2-egreso')
                    "
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Trasladar paciente'"
                    @click="
                      setData(props.rowData);
                      $bvModal.show('modal-1-traslado');
                    "
                    class="mb-2"
                    size="sm"
                    :variant="'outline-danger'">
                    <i
                      :class="'fas fa-heart'"
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
        nombres: '',
        apellidos: '',
        expediente: '',
        cui: '',
        state: 1
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
      selectedQuitOption: 6,
      optionsQuit: [
        { text: 'Fallecido', value: 0 },
        { text: 'Egreso normal', value: 7 },
        { text: 'Contraindicado', value: 8 },
        { text: 'Referido', value: 9 }
      ],
      selectedTrasOption: 1,
      optionsTraslado: [
        { text: 'Quirófano', value: 3 },
        { text: 'Hospitalización', value: 1 },
        { text: 'Intensivos', value: 4 }
      ],
      apiBase: apiUrl + '/expedientes/listEmergencia',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombres',
          sortField: 'nombres',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'apellidos',
          sortField: 'appellidos',
          title: 'Apellidos',
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
          key: 'seleccion',
          label: 'Selección',
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
          this.$refs['modal-2-egreso'].hide()
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
      this.getCuentas(data.id)
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
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption,
          estado_anterior: 5
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

          let me = this
          axios
            .put(apiUrl + '/expedientes/changeState', {
              id: this.form.id,
              estado: this.selectedQuitOption,
              estado_anterior: 4
            })
            .then((response) => {
              me.alertVariant = 'info'
              me.showAlert()
              me.alertText = 'Se ha egresado el paciente ' + me.form.nombres + ' exitosamente'
              me.$refs.vuetable.refresh()
              me.$refs['modal-2-egreso'].hide()
            })
            .catch((error) => {
              me.alertVariant = 'danger'
              me.showAlertError()
              me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
              console.error('There was an error!', error)
            })

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
      })
    },
    inputPaymentType (inptPay) {
      this.paymentType = inptPay
    }
  }
}
</script>

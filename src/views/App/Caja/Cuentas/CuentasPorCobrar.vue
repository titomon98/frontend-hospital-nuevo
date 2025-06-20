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
    <b-modal id="modal-2-account" ref="modal-2-account" title="Pagar cuenta" size="xl">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <template>
        <div>
          <h6>Cuentas activas para {{this.form.nombres}} {{this.form.apellidos}}</h6>
          <b-card>
            <b-card-body>
              <b-table
                hover
                :items="cuentas"
                :fields="fieldsAccounts"
                :select-mode="'single'"
                selectable
              >
              </b-table>
              <b-form-group label="Seleccione métodos para pagar:" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  id="checkbox-group-1"
                  v-model="selectedPayment"
                  :options="paymentOptions"
                  :aria-describedby="ariaDescribedby"
                  name="flavour-1"
                ></b-form-checkbox-group>
              </b-form-group>
              <div v-if="selectedPayment.indexOf(1) !== -1">
                Efectivo
                <b-input :type="'number'" id="CashTypeInput" ref="CashTypeInput" v-model="paymentType.Efectivo" />
              </div>
              <div v-if="selectedPayment.indexOf(2) !== -1">
                Tarjeta
                <b-input :type="'number'" id="CardTypeInput" ref="CardTypeInput" v-model="paymentType.Tarjeta" />
                Recargo (%)
                <b-input :type="'number'" id="CardRechargeTypeInput" ref="CardRechargeTypeInput" v-model="paymentType.Tarjeta" />
              </div>
              <div v-if="selectedPayment.indexOf(3) !== -1">
                Depósito
                <b-input :type="'number'" id="DepositTypeInput" ref="DepositTypeInput" v-model="paymentType.Deposito" />
              </div>
              <div v-if="selectedPayment.indexOf(4) !== -1">
                Cheque
                <b-input :type="'number'" id="CheckTypeInput" ref="CheckTypeInput" v-model="paymentType.Cheque" />
              </div>
              <div v-if="selectedPayment.indexOf(5) !== -1">
                Seguro
                <b-input :type="'number'" id="InsuranceTypeInput" ref="InsuranceTypeInput" v-model="paymentType.Seguro" />
                Seleccione un seguro
                <v-select
                  ref="selectAssurance"
                  v-model="selectAssurance"
                  :options="assurances"
                  label="no_poliza"
                  value="id"></v-select>
              </div>
              <div v-if="selectedPayment.indexOf(6) !== -1">
                Transferencia
                <b-input :type="'number'" id="InsuranceTypeInput" ref="InsuranceTypeInput" v-model="paymentType.Transferencia" />
              </div>
              <div>
                <strong> TOTAL INGRESADO: {{ parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Recargo*this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro) + parseFloat(this.paymentType.Transferencia) }}</strong>
              </div>
              <div>
                <strong> TOTAL A PAGAR: {{ this.totalPayment }}</strong>
              </div>
            </b-card-body>
            <div>

            </div>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onPatientQuit()
        "
          >Aceptar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-account')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-discount" ref="modal-3-discount" title="Solicitar descuento">
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
        ¿Desea solicitar un descuento para: {{ form.name }} {{ form.apellidos }} ?
      </h6>
      <label for="discountAmount">Descuento (%):</label>
      <b-input
        type="number"
        id="discountAmount"
        ref="discountAmount"
        v-model="discountAmount"
        min="0"
        max="100"
        placeholder="Ingrese porcentaje de descuento"
      />
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="requestDiscount()"
          >Solicitar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-discount')"
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
              <h4 class="card-title mt-3">Cuentas por cobrar</h4>
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
                    ><h6 class="success"><strong>PENDIENTE DE PAGO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>EN EMERGENCIAS</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Estado descuento -->
               <div slot="solicitud_descuento" slot-scope="props">
                <h5 v-if="props.rowData.solicitud_descuento == 3">
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>SIN DESCUENTO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-if="props.rowData.solicitud_descuento == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>Q. {{props.rowData.descuento}}</strong></h6></b-badge
                  >
                </h5>
                <h5 v-if="props.rowData.solicitud_descuento == 2">
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>PENDIENTE APROBACIÓN</strong></h6></b-badge
                  >
                </h5>
                <h5 v-if="props.rowData.solicitud_descuento == 0">
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>SIN DESCUENTO</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <h5 v-if="props.rowData.expediente.estado == 1 || props.rowData.expediente.estado == 3 || props.rowData.expediente.estado == 4 || props.rowData.expediente.estado == 5">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>PACIENTE NO EGRESADO</strong></h6></b-badge
                  >
                </h5>
                <div v-else>
                  <div class="button-container" v-if="props.rowData.solicitud_descuento == 3">
                    <b-button
                      @click="
                        setData(props.rowData)
                        $bvModal.show('modal-2-account')
                      "
                      class="mb-2 button-spacing"
                      size="sm"
                      variant="dark"
                    >Cobrar</b-button>

                    <b-button
                    @click="generarReporteCuentaParcial(props.rowData.id, props.rowData.expediente.nombres, props.rowData.expediente.apellidos)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Cuenta Total</b-button>

                  </div>
                  <div class="button-container" v-else-if="props.rowData.solicitud_descuento == 2">
                    <b-badge variant="light"
                      ><h6 class="danger"><strong>EN ESPERA</strong></h6></b-badge
                    >
                  </div>
                  <div class="button-container" v-else>
                    <b-button
                      @click="
                        setData(props.rowData)
                        $bvModal.show('modal-2-account')
                      "
                      class="mb-2 button-spacing"
                      size="sm"
                      variant="dark"
                    >Cobrar</b-button>
                  </div>
                </div>
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
import { mapGetters } from 'vuex'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'CuentasPorCobrarHospital',
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
      totPagado: 0,
      assurances: [],
      selectAssurance: null,
      expediente: 0,
      form: {
        id: 0,
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
        Recargo: 0,
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
      apiBase: apiUrl + '/cuentas/debtList',
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
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
          dataClass: 'list-item-heading'
        },
        {
          name: 'pendiente_de_pago',
          sortField: 'pendiente_de_pago',
          title: 'Pendiente de pago',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        },
        {
          name: '__slot:solicitud_descuento',
          title: 'Solicitud descuento',
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
          this.$refs['modal-2-account'].hide()
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
      this.form.name = data.expediente.nombres
      this.form.apellidos = data.expediente.apellidos
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
      this.expediente = data.id_expediente
      this.onLoadAssurances(data.id_expediente)
      // this.getCuentas(data.id)
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
          user: me.currentUser.user
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
    onLoadAssurances (data) {
      console.log(data)
      axios.get(apiUrl + '/seguros/getByExp', {
        params: { id_expediente: data }
      })
        .then((resp) => {
          this.assurances = resp.data
          console.log(resp)
        })
    },
    requestDiscount () {
      if (this.discountAmount <= 0) {
        this.alertErrorText = 'El descuento debe ser mayor a 0.00'
        this.showAlertError()
      } else if (this.discountAmount > this.totalPayment) {
        this.alertErrorText = `El descuento debe ser menor a ${this.totalPayment}`
        this.showAlertError()
      } else {
        axios.post(apiUrl + '/cuentas/requestDiscount', {
          form: {
            id: this.form.id,
            solicitud_descuento: 2,
            descuento: parseFloat(this.discountAmount)
          }
        })
          .then((tipo) => {
            this.discountAmount = 0
            this.$bvModal.hide('modal-3-discount')
            this.$refs.vuetable.refresh()
          }
          )
          .catch((error) => {
            console.error(error)
          })
      }
    },
    onPatientQuit () {
      this.paymentSum = parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro) + parseFloat(this.paymentType.Transferencia)
      if (this.paymentSum !== parseFloat(this.totalPayment)) {
        this.alertErrorText = 'El total a pagar neto no concuerda con el total ingresado'
        this.showAlertError()
      } else {
        let me = this
        console.log(this.selectedAccount)
        console.log(this.id_seguro)
        axios.put(apiUrl + '/cuentas/deactivate',
          {
            id: this.selectedAccount,
            total_pagado: parseFloat(this.totPagado) + parseFloat(this.paymentSum),
            pendiente_de_pago: parseFloat(parseFloat(this.totalPayment) - parseFloat(this.paymentSum)),
            efectivo: this.paymentType.Efectivo,
            tarjeta: this.paymentType.Tarjeta,
            recargoTarjeta: this.paymentType.Recargo * this.paymentType.Tarjeta,
            deposito: this.paymentType.Deposito,
            cheque: this.paymentType.Cheque,
            seguro: this.paymentType.Seguro,
            transferencia: this.paymentType.Transferencia,
            total: this.paymentSum,
            id_seguro: this.seguro > 0 ? this.selectAssurance.id : 0,
            id_expediente: this.expediente,
            tipo: 'finiquito'
          })
          .then(
            this.selectedAccount = null,
            this.paymentType.Efectivo = 0,
            this.paymentType.Tarjeta = 0,
            this.paymentType.Recargo = 0,
            this.paymentType.Deposito = 0,
            this.paymentType.Cheque = 0,
            this.paymentType.Seguro = 0,
            this.paymentType.transferencia = 0,
            this.paymentSum = 0,
            this.selectAssurance = null
          )
          .catch((error) => {
            console.error(error)
          })
        me.alertVariant = 'info'
        me.showAlert()
        me.alertText = 'Se ha egresado el paciente ' + me.form.nombres + ' exitosamente'
        me.$refs.vuetable.refresh()
        me.$refs['modal-2-account'].hide()

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
    },

    generarReporteCuentaParcial (id, nombres, apellidos) {
      console.log(nombres)
      axios.get(apiUrl + `/consumos/sumario/${id}`)
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
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES')
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }
      const horaFormateada = fechaActual.toLocaleTimeString('es-ES', opcionesHora)

      let mensajeDias

      if (!FechaIngreso) {
        mensajeDias = 'NO ASIGNADA'
      } else {
        const fechaIngreso = new Date(FechaIngreso)
        const diferenciaMs = fechaActual - fechaIngreso
        const diasDiferencia = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24))
        mensajeDias = diasDiferencia
      }

      let hospitalizacion

      if (mensajeDias >= 2) {
        hospitalizacion = data.costo2 * mensajeDias
      } else {
        hospitalizacion = data.costo1
      }

      try {
        const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
        const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ExamenesTotal = data.examenes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

        const TotalGeneral =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ExamenesTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalGeneral2 =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalApagar = TotalGeneral2 + TotalHonorarios + ExamenesTotal
        const doc = new JsPDF()

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 10, { align: 'center' })

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('CUENTA TOTAL DE PACIENTE', 110, 14, { align: 'center' })

        doc.setFontSize(8).setFont(undefined, 'normal')
        doc.text('NOMBRE DEL PACIENTE:', 14, 20)
        doc.text(`${nombrePaciente}`, 50, 20)
        doc.text('_____________________________________________________________________________________________', 50, 21)

        doc.text('CUARTRO NO.:', 14, 27)
        doc.text(`${data.numerohabitacion}`, 40, 27)
        doc.text('__________', 35, 28)

        doc.text('TIPO DE SERVICIO:', 60, 27)
        doc.text('', 87, 27)
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
            ['MATERIAL MEDICO QUIRÚRGICO', `Q${ConsumoQuirurgicosTotal.toFixed(2)}`],
            ['ANESTESICOS', ''],
            ['MATERIAL COMÚN', `Q${ConsumoComunTotal.toFixed(2)}`],
            ['SERVICIOS', `Q${ConsumoTotal.toFixed(2)}`],
            ['RECUPERACION', ''],
            ['INTENSIVO', `Q 0.00`],
            ['EMERGENCIAS  Medico Interno', ''],
            ['OTROS', ''],
            ['TOTAL HOSPITALIZACION =', `Q${TotalGeneral2.toFixed(2)}`],
            ['TOTAL LAB. BIOMEDICO E.O. S.A. =', `Q${ExamenesTotal.toFixed(2)}`],
            ['TOTAL MENOS DESCUENTO =', `Q${TotalGeneral.toFixed(2)}`]
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
            if (rowIndex >= 11 && colIndex === 0) {
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
            ['TOTAL A PAGAR =', `Q${TotalApagar.toFixed(2)}`]
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
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    }
  }
}
</script>

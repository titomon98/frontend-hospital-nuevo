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
    <b-modal id="modal-2-account" ref="modal-2-account" title="Guardar Factura" size="xl">
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
        <div v-if = "HasFact==0">
          <h6>Generar factura</h6>
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
              nit
              <b-input id="nitFact" ref="nitFact" v-model="nitFact" />
              Número
              <b-input id="numeroFact" ref="numeroFact" v-model="numeroFact" />
              Serie
              <b-input id="serieFact" ref="serieFact" v-model="serieFact" />
              Referencia
              <b-input id="referenciaFact" ref="referenciaFact" v-model="referenciaFact" />
              <b-form-group label="File">
                <b-form-file
                  v-model="images"
                  accept="image/*"
                  multiple
                  placeholder="Subir una imagen..."
                  drop-placeholder="Suelta una imagen aquí..."></b-form-file>
                  <b-alert variant="danger" v-if="errorImage" dismissible>{{ errorImage }}</b-alert>
              </b-form-group>
              <b-row>
                <b-col cols="12" class="text-center">
                  <div v-if="base64Images.length">
                    <h5>Imagen:</h5>
                    <img :src="base64Images" alt="Preview" class="img-preview"/>
                  </div>
                </b-col>
              </b-row>
            </b-card-body>
            <div>

            </div>
          </b-card>
        </div>
        <div v-if = "HasFact==1">
          <h6>Verificar factura</h6>
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
              <h6>
                NIT: {{nitFact}}
                <div v-if="nitFact===''">
                  <b-input id="nitFact" ref="nitFact" v-model="nitFact" />
                </div>
              </h6>
              <h6>
                Número: {{numeroFact}}
                <div v-if="numeroFact===''">
                  <b-input id="numeroFact" ref="numeroFact" v-model="numeroFact" />
                </div>
              </h6>
              <h6>
                Serie: {{serieFact}}
                <div v-if="serieFact===''">
                  <b-input id="serieFact" ref="serieFact" v-model="serieFact" />
                </div>
              </h6>
              <h6>
                Referencia: {{referenciaFact}}
                <div v-if="referenciaFact===''">
                  <b-input id="referenciaFact" ref="referenciaFact" v-model="referenciaFact" />
                </div>
              </h6>
              <b-row>
                <b-col cols="12" class="text-center">
                  <div v-if="emptyImage===0">
                    <h6>Imagen:</h6>
                    <img :src="base64Images" alt="Preview" class="img-preview"/>
                  </div>
                  <div v-else>
                    <b-form-group label="File">
                      <b-form-file
                        v-model="images"
                        accept="image/*"
                        multiple
                        placeholder="Subir una imagen..."
                        drop-placeholder="Suelta una imagen aquí..."></b-form-file>
                        <b-alert variant="danger" v-if="errorImage" dismissible>{{ errorImage }}</b-alert>
                    </b-form-group>
                    <b-row>
                      <b-col cols="12" class="text-center">
                        <div v-if="base64Images.length">
                          <h5>Imagen:</h5>
                          <img :src="base64Images" alt="Preview" class="img-preview"/>
                        </div>
                      </b-col>
                    </b-row>
                  </div>
                </b-col>
              </b-row>
            </b-card-body>
            <div>

            </div>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button v-if="HasFact===0" variant="primary" @click="
          createFact()
        "
          >Guardar factura</b-button
        >
        <b-button v-if="HasFact===1 && (nitFact === '' || numeroFact === '' || serieFact === '' || referenciaFact === '' || emptyImage === 1)" variant="primary" @click="
          updateFact()
        "
          >Guardar cambios</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-account')"
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
              <h4 class="card-title mt-3">Mostrar facturas</h4>
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
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                  <div class="button-container">
                  <b-button
                    @click="
                      setData(props.rowData)
                      $bvModal.show('modal-2-account')
                    "
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Mostrar factura</b-button>
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
import { xray } from '../../../config/pluginInit'
import DatatableHeading from '../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Facturacion',
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
    this.getFacts()
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
      emptyImage: 1,
      base64Images: [],
      images: [],
      HasFact: 0,
      factsList: [],
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
  watch: {
    images (newVal) {
      if (newVal && newVal.length) {
        this.createBase64Image(newVal)
      } else {
        this.base64Images = []
      }
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
    createBase64Image (FileList) {
      if (FileList.length > 1) {
        // this.errorImage = 'Sólo puedes subir 1 imagen'
        this.images = []
      } else {
        this.base64Images = []
        // this.errorImage = null
        Array.from(FileList).forEach(file => {
          if (file.size > 2 * 1024 * 1024) {
            this.errorImage = 'El tamaño máximo por imagen es de 2MB'
            this.images = []
            return
          }
          const reader = new FileReader()
          reader.onload = (event) => {
            this.base64Images.push(event.target.result)
          }

          reader.readAsDataURL(file)
        })
      }
    },
    onRowSelected (items) {
      this.selectedAccount = items[0].id
      this.totalPayment = items[0].pendiente_de_pago
      this.totPagado = items[0].total_pagado
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
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
      this.nitFact = ''
      this.numeroFact = ''
      this.serieFact = ''
      this.referenciaFact = ''
      this.imagen = ''
      this.HasFact = 0
      this.base64Images = []
      this.emptyImage = 1
      if (this.factsList.find(e => e.id_cuenta_hospital === data.id)) {
        const elementFound = this.factsList.find(e => e.id_cuenta_hospital === data.id)
        this.HasFact = 1
        this.nitFact = elementFound.nit
        this.numeroFact = elementFound.numero
        this.serieFact = elementFound.serie
        this.referenciaFact = elementFound.referencia_factura
        this.base64Images[0] = elementFound.imagen
        if (elementFound.imagen !== ' ') {
          this.emptyImage = 0
        }
        console.log(this.emptyImage)
        console.log('HASFACCCCCTS :)')
      } else {
        this.HasFact = 0
        console.log('NOOOOOOOOOOOOTHASFACCCCCTS :(')
      }
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
      this.expediente = data.id_expediente

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
    createFact () {
      let me = this
      axios.post(apiUrl + '/facturas/create',
        {
          nit: this.nitFact,
          total: this.totPagado,
          id_cuenta_laboratoio: 0,
          id_cuenta_hospital: this.form.id,
          imagen: this.base64Images ? this.base64Images : ' ',
          numero: this.numeroFact,
          serie: this.serieFact,
          id_usuario: this.expediente,
          referencia_factura: this.referenciaFact
        })
        .then(
          this.selectedAccount = null,
          this.paymentType.Efectivo = 0,
          this.paymentType.Tarjeta = 0,
          this.paymentType.Deposito = 0,
          this.paymentType.Cheque = 0,
          this.paymentType.Seguro = 0,
          this.paymentType.transferencia = 0,
          this.paymentSum = 0,
          this.selectAssurance = null
        )
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
      me.alertVariant = 'info'
      me.showAlert()
      me.alertText = 'Se ha guardado la factura exitosamente'
      me.$refs.vuetable.refresh()
      me.$refs['modal-2-account'].hide()
      this.getFacts()
    },
    updateFact () {
      let me = this
      axios.post(apiUrl + '/facturas/update',
        {
          nit: this.nitFact,
          id_cuenta_laboratoio: 0,
          id_cuenta_hospital: this.form.id,
          imagen: this.base64Images ? this.base64Images : '',
          numero: this.numeroFact,
          serie: this.serieFact,
          referencia_factura: this.referenciaFact
        })
        .then(
          this.selectedAccount = null,
          this.paymentType.Efectivo = 0,
          this.paymentType.Tarjeta = 0,
          this.paymentType.Deposito = 0,
          this.paymentType.Cheque = 0,
          this.paymentType.Seguro = 0,
          this.paymentType.transferencia = 0,
          this.paymentSum = 0,
          this.selectAssurance = null
        )
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
      me.alertVariant = 'info'
      me.showAlert()
      me.alertText = 'Se ha guardado la factura exitosamente'
      me.$refs.vuetable.refresh()
      this.getFacts()
      me.$refs['modal-2-account'].hide()
    },
    getFacts () {
      axios.get(apiUrl + '/facturas/getList')
        .then(res => {
          this.factsList = res.data
          console.log(res)
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
        console.log(response.data)
      })
    },
    inputPaymentType (inptPay) {
      this.paymentType = inptPay
    }
  }
}
</script>
<style scoped>
  .img-preview {
    max-width: 100%;
    max-height: 200px;
    height: auto;
    margin-top: 1rem;
    border: 1px solid #dee2e6;
    border-radius: .25rem;
    transition: opacity 0.3s ease-in-out;
  }
</style>

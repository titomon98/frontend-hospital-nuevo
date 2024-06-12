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
    <b-modal id="modal-password" ref="modal-password" title="Comprobar contraseña">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form-group label="Contraseña:">
          <b-form-input
            type="password"
            v-model.trim="password"
            placeholder="Ingresar contraseña"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onLogin('login')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('login')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-1" ref="modal-1" title="Agregar medicamento">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form-group label="Medicamento:">
          <v-select
            name="medicine"
            v-model="$v.formMedicamento.medicine.$model"
            :state="!$v.formMedicamento.medicine.$error"
            :options="medicines"
            :filterable="false"
            placeholder="Seleccione el medicamento"
            @search="onSearch"
          >
            <template v-slot:spinner="{ loading }">
              <div v-show="loading">Cargando...</div>
            </template>
            <template v-slot:option="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
          </v-select>
          <div v-if="$v.formMedicamento.medicine.$error" class="invalid-feedback-vselect">
            Debe seleccionar el medicamento
          </div>
         </b-form-group>
        <div v-if="$v.formMedicamento.medicine.$invalid" class="invalid-feedback">
          Debe ingresar el medicamento
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formMedicamento.cantidad.$model"
            :state="!$v.formMedicamento.cantidad.$error"
            placeholder="Ingresar Cantidad"
          ></b-form-input>
        </b-form-group>
        <div v-if="$v.formMedicamento.cantidad.$invalid" class="invalid-feedback">
          Debe ingresar la cantidad
        </div>
        <b-form-group label="Fecha de vencimiento:">
          <b-form-input
            type="date"
            v-model.trim="formMedicamento.vencimiento"
            placeholder="Ingresar Vencimiento"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onValidate('medicamento')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('medicamento')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2" ref="modal-2" title="Agregar material quirúrgico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form-group label="Material quirúrgico:">
          <v-select
            name="quirurgico"
            v-model="$v.formMedicamento.medicine.$model"
            :state="!$v.formMedicamento.medicine.$error"
            :options="quirurgicos"
            :filterable="false"
            placeholder="Seleccione el material quirúrgico"
            @search="onSearchQuirurgicos"
          >
            <template v-slot:spinner="{ loading }">
              <div v-show="loading">Cargando...</div>
            </template>
            <template v-slot:option="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
          </v-select>
          <div v-if="$v.formMedicamento.medicine.$error" class="invalid-feedback-vselect">
            Debe seleccionar el medicamento
          </div>
         </b-form-group>
        <div v-if="$v.formMedicamento.medicine.$invalid" class="invalid-feedback">
          Debe ingresar el medicamento
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formMedicamento.cantidad.$model"
            :state="!$v.formMedicamento.cantidad.$error"
            placeholder="Ingresar Cantidad"
          ></b-form-input>
        </b-form-group>
        <div v-if="$v.formMedicamento.cantidad.$invalid" class="invalid-feedback">
          Debe ingresar la cantidad
        </div>
        <b-form-group label="Fecha de vencimiento:">
          <b-form-input
            type="date"
            v-model.trim="formMedicamento.vencimiento"
            placeholder="Ingresar Vencimiento"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onValidate('quirurgico')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('quirurgico')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3" ref="modal-3" title="Agregar material común">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form-group label="Material común:">
          <v-select
            name="comun"
            v-model="$v.formMedicamento.medicine.$model"
            :state="!$v.formMedicamento.medicine.$error"
            :options="comunes"
            :filterable="false"
            placeholder="Seleccione el material común"
            @search="onSearchComunes"
          >
            <template v-slot:spinner="{ loading }">
              <div v-show="loading">Cargando...</div>
            </template>
            <template v-slot:option="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre + ' Proveedor: ' + option.proveedore.nombre }}
            </template>
          </v-select>
          <div v-if="$v.formMedicamento.medicine.$error" class="invalid-feedback-vselect">
            Debe seleccionar el medicamento
          </div>
         </b-form-group>
        <div v-if="$v.formMedicamento.medicine.$invalid" class="invalid-feedback">
          Debe ingresar el medicamento
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formMedicamento.cantidad.$model"
            :state="!$v.formMedicamento.cantidad.$error"
            placeholder="Ingresar Cantidad"
          ></b-form-input>
        </b-form-group>
        <div v-if="$v.formMedicamento.cantidad.$invalid" class="invalid-feedback">
          Debe ingresar la cantidad
        </div>
        <b-form-group label="Fecha de vencimiento:">
          <b-form-input
            type="date"
            v-model.trim="formMedicamento.vencimiento"
            placeholder="Ingresar Vencimiento"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onValidate('comun')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('comun')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <h5 class="card-title mt-3">Datos de generales de ingreso</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="3">
                <b-form-group label="Factura:">
                  <b-form-input
                    v-model.trim="$v.factura.$model"
                    :state="!$v.factura.$error"
                    placeholder="Ingresar de factura de ingreso"
                  ></b-form-input>
                </b-form-group>
                <div v-if="$v.factura.$invalid" class="invalid-feedback">
                  Debe ingresar el factura
                </div>
              </b-col>
              <b-col md="3">
                <b-form-group label="Fecha ingreso:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.fecha.$model"
                    :state="!$v.fecha.$error"
                    placeholder="Ingresar fecha de factura de ingreso"
                  ></b-form-input>
                </b-form-group>
                <div v-if="$v.fecha.$invalid" class="invalid-feedback">
                  Debe ingresar el fecha
                </div>
              </b-col>
              <b-col md="3">
                <b-form-group label="Descripción:">
                  <b-form-input
                    v-model.trim="$v.descripcion.$model"
                    :state="!$v.descripcion.$error"
                    placeholder="Ingresar descripcion de factura de ingreso"
                  ></b-form-input>
                </b-form-group>
                <div v-if="$v.descripcion.$invalid" class="invalid-feedback">
                  Debe ingresar el descripcion
                </div>
              </b-col>
            </b-row>
            <h5 class="card-title mt-3">Medicamentos para ingreso</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Agregar medicamento:">
                  <b-button variant="info" v-b-modal.modal-1>AGREGAR MEDICAMENTO</b-button>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Agregar material quirúrgico:">
                  <b-button variant="info" v-b-modal.modal-2>AGREGAR MATERIAL QUIRÚRGICO</b-button>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Agregar material común:">
                  <b-button variant="info" v-b-modal.modal-3>AGREGAR MATERIAL COMÚN</b-button>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Aqui comenzar con detalles -->
            <br>
            <br>
            <table class="table table-hover product_item_list c_table theme-color mb-0">
              <thead>
                  <tr>
                      <th>Acciones</th>
                      <th>Descripción</th>
                      <th>Cantidad</th>
                      <th>Total</th>
                  </tr>
              </thead>
              <tbody>
                  <tr v-for="details in arrayDetalles" :key="details.id">
                    <td>
                        <template>
                            <button type="button" class="btn btn-danger btn-sm" @click="deleteDetail(details.id, details.total)">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </template>
                    </td>
                    <td v-text="details.descripcion"></td>
                    <td v-text="details.cantidad"></td>
                    <td v-text="details.total"></td>
                  </tr>
              </tbody>
            </table>
            <table class="table table-hover product_item_list c_table theme-color mb-0" v-if="arrayDetalles.length > 0">
              <tbody>
                  <tr>
                      <th></th>
                      <th></th>
                      <th>Total: </th>
                      <th>{{ formatQuetzales(granTotal)}}</th>
                  </tr>
              </tbody>
            </table>
            <br>
            <br>
            <b-button variant="dark" v-if="arrayDetalles.length > 0" @click="onValidateAll()">AGREGAR INGRESO CON FACTURA</b-button>
          </template>

        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import createNumberMask from 'text-mask-addons/dist/createNumberMask'
import { mapGetters } from 'vuex'

export default {
  name: 'IngresoFactura',
  components: {
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  beforeDestroy () {
    // console.log('Aqui vamos a meter la validacion')
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
      paciente: null,
      granTotal: 0.0,
      enviarTotal: 0.0,
      id_usuario: 0,
      factura: '',
      password: '',
      fecha: null,
      descripcion: '',
      formMedicamento: {
        id: 0,
        cantidad: null,
        vencimiento: null,
        medicine: [],
        total: '',
        is_medicine: false,
        is_quirurgico: false,
        is_comun: false
      },
      medicine: [],
      quirurgico: [],
      comun: [],
      existencia_medicina: 0,
      arrayDetalles: [],
      medicines: [],
      quirurgicos: [],
      comunes: [],
      pacientes: [],
      total_array: 0,
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripcion',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
          dataClass: 'list-item-heading'
        }
      ],
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      mask_quetzal: createNumberMask({
        prefix: 'Q ',
        suffix: '',
        includeThousandsSeparator: true,
        thousandsSeparatorSymbol: ',',
        allowDecimal: true,
        decimalSymbol: '.',
        decimalLimit: 2, // how many digits allowed after the decimal
        integerLimit: 10, // limit length of integer numbers
        allowNegative: false,
        allowLeadingZeroes: false
      })
    }
  },
  validations () {
    return {
      formMedicamento: {
        medicine: {
          required
        },
        cantidad: {
          required
        }
      },
      factura: { required },
      fecha: { required },
      descripcion: { required }
    }
  },
  methods: {
    addMedicine () {
      let me = this
      me.total_array = me.total_array + 1
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_costo) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
        vencimiento: me.formMedicamento.vencimiento,
        total: nuevoTotal,
        id: me.total_array,
        id_medicine: me.formMedicamento.medicine.id,
        is_medicine: true
      }
      this.granTotal = this.granTotal + nuevoTotal
      me.arrayDetalles.push(medicamento)
      me.closeModal('medicamento')
    },
    addQuirurgico () {
      let me = this
      me.total_array = me.total_array + 1
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_costo) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
        vencimiento: me.formMedicamento.vencimiento,
        total: nuevoTotal,
        id: me.total_array,
        id_medicine: me.formMedicamento.medicine.id,
        is_quirurgico: true
      }
      this.granTotal = this.granTotal + nuevoTotal
      me.arrayDetalles.push(medicamento)
      me.closeModal('quirurgico')
    },
    addComun () {
      let me = this
      me.total_array = me.total_array + 1
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_costo) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
        vencimiento: me.formMedicamento.vencimiento,
        total: nuevoTotal,
        id: me.total_array,
        id_medicine: me.formMedicamento.medicine.id,
        is_comun: true
      }
      this.granTotal = this.granTotal + nuevoTotal
      me.arrayDetalles.push(medicamento)
      me.closeModal('comun')
    },
    deleteDetail (id, total) {
      let me = this
      me.granTotal = me.granTotal - total
      const objWithIdIndex = me.arrayDetalles.findIndex((obj) => obj.id === id)
      if (objWithIdIndex > -1) {
        me.arrayDetalles.splice(objWithIdIndex, 1)
      }
    },
    closeModal (action) {
      switch (action) {
        case 'medicamento': {
          this.$v.$reset()
          this.$refs['modal-1'].hide()
          this.resetData()
          break
        }
        case 'quirurgico': {
          this.$v.$reset()
          this.$refs['modal-2'].hide()
          this.resetData()
          break
        }
        case 'comun': {
          this.$v.$reset()
          this.$refs['modal-3'].hide()
          this.resetData()
          break
        }
        case 'save': {
          this.$v.$reset()
          this.resetData()
          break
        }
        case 'login': {
          this.$v.$reset()
          this.$refs['modal-password'].hide()
          this.resetData()
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        if (action === 'medicamento') {
          if (this.formMedicamento.cantidad > 0) {
            this.addMedicine()
          } else {
            console.log(this.formMedicamento.cantidad)
            this.alertErrorText = 'La cantidad del producto debe ser mayor a 0'
            this.showAlertError()
          }
        } else if (action === 'quirurgico') {
          if (this.formMedicamento.cantidad > 0) {
            this.addQuirurgico()
          } else {
            console.log(this.formMedicamento.cantidad)
            this.alertErrorText = 'La cantidad del producto debe ser mayor a 0'
            this.showAlertError()
          }
        } else if (action === 'comun') {
          if (this.formMedicamento.cantidad > 0) {
            this.addComun()
          } else {
            console.log(this.formMedicamento.cantidad)
            this.alertErrorText = 'La cantidad del producto debe ser mayor a 0'
            this.showAlertError()
          }
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    onValidateAll () {
      this.$v.$touch()
      this.id_usuario = this.currentUser.id
      this.formMedicamento.medicine = 'Ingresar'
      this.formMedicamento.cantidad = 'Ingresar'
      if (this.$v.$error !== true) {
        this.onLogin('validate')
      } else {
        this.alertText = 'Ha ocurrido un error en el ingreso'
        this.showAlertError()
      }
    },
    resetData () {
      this.formMedicamento.medicine = null
      this.formMedicamento.cantidad = null
      this.formMedicamento.total = null
      this.formMedicamento.id = null
      this.formMedicamento.vencimiento = null
    },
    onLogin (action) {
      let me = this
      if (action === 'validate') {
        this.$refs['modal-password'].show()
      } else if (action === 'login') {
        axios.post(apiUrl + '/validatePassword', {
          id_usuario: me.id_usuario,
          password: me.password
        })
          .then((response) => {
            me.onSave()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = error.response.data.message
            console.error('Error!', error)
          })
      }
    },
    /* Guardar */
    onSave () {
      const me = this
      me.enviarTotal = me.granTotal
      axios.post(apiUrl + '/ingresos/create', {
        detalle: me.arrayDetalles,
        factura: me.factura,
        fecha: me.fecha,
        descripcion: me.descripcion,
        id_usuario: me.id_usuario,
        total: me.enviarTotal
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el ingreso exitosamente'
          me.closeModal('save')
          me.arrayDetalles = []
          me.paciente = null
          me.granTotal = 0.0
          me.password = ''
          me.closeModal('login')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search,
          search_exam: this.search_exam,
          columna: this.columna.value
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search,
          search_exam: this.search_exam,
          columna: this.columna.value
        }
    },
    changePageSizes (perPage) {
      this.perPage = perPage
      this.$refs.vuetable.refresh()
    },
    searchChange (val) {
      this.search = val.toLowerCase()
      this.search_exam = val.toLowerCase()
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
    changeTypeSearch (columna) {
      this.columna = columna
    },
    onSearch (search, loading) {
      if (search.length) {
        loading(true)
        this.searching(search, loading)
      }
    },
    onSearchQuirurgicos (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingQuirurgico(search, loading)
      }
    },
    onSearchComunes (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingComun(search, loading)
      }
    },
    converMaskToNumber (number) {
      var myNumber = ''
      for (var i = 0; i < number.length; i += 1) {
        if (
          number.charAt(i) === 'Q' ||
          number.charAt(i) === '€' ||
          number.charAt(i) === '$' ||
          number.charAt(i) === '%' ||
          number.charAt(i) === ',' ||
          number.charAt(i) === ' '
        ) {
          continue
        } else {
          myNumber += number.charAt(i)
        }
      }
      return parseFloat(myNumber).toFixed(2)
    },
    formatQuetzales (amount) {
      let num = parseFloat(amount)
      let formatted
      formatted = num.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')
      return (amount = 'Q ' + formatted)
    },
    searching (search, loading) {
      axios.get(apiUrl + '/medicamentos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicines = response.data
        loading(false)
      })
    },
    searchingQuirurgico (search, loading) {
      axios.get(apiUrl + '/quirurgico/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.quirurgicos = response.data
        loading(false)
      })
    },
    searchingComun (search, loading) {
      axios.get(apiUrl + '/comun/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.comunes = response.data
        loading(false)
      })
    }
  }
}
</script>

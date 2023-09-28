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
              {{ 'Nombre: '+ option.nombre}}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre}}
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
              {{ 'Nombre: '+ option.nombre}}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre}}
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
              {{ 'Nombre: '+ option.nombre}}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre}}
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
    <b-modal id="modal-4" ref="modal-4" title="Vender paquete">
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
        <b-form-group label="Paquete:">
          <v-select
            name="paquete"
            v-model="$v.formMedicamento.medicine.$model"
            :state="!$v.formMedicamento.medicine.$error"
            :options="paquetes"
            :filterable="false"
            placeholder="Seleccione el paquete"
            @search="onSearchPaquetes"
          >
            <template v-slot:spinner="{ loading }">
              <div v-show="loading">Cargando...</div>
            </template>
            <template v-slot:option="option">
              {{ 'Nombre: '+ option.nombre + ' Precio: '+ option.total}}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ 'Nombre: '+ option.nombre + ' Precio: '+ option.total}}
            </template>
          </v-select>
          <div v-if="$v.formMedicamento.medicine.$error" class="invalid-feedback-vselect">
            Debe seleccionar el paquete
          </div>
         </b-form-group>
        <div v-if="$v.formMedicamento.medicine.$invalid" class="invalid-feedback">
          Debe ingresar el paquete
        </div>
      </b-form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="setPaquete(formMedicamento.medicine)"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('paquete')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <h5 class="card-title mt-3">Datos de generales de paquete</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Vender paquete:">
                  <b-button variant="info" v-b-modal.modal-4>AGREGAR PAQUETE</b-button>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Nombre:">
                  <h6>{{ form.nombre }}</h6>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Precio:">
                  <h6>{{ form.total }}</h6>
                </b-form-group>
              </b-col>
            </b-row>
            <h5 class="card-title mt-3">Medicamentos para paquete</h5>
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
                      <th>Cantidad sugerida</th>
                      <th>Cantidad utilizada</th>
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
                    <td v-text="details.sugerida"></td>
                  </tr>
              </tbody>
            </table>
            <table class="table table-hover product_item_list c_table theme-color mb-0" v-if="arrayDetalles.length > 0">
              <tbody>
                  <tr>
                      <th></th>
                      <th></th>
                      <th>Total sugerido: </th>
                      <th>{{ formatQuetzales(granTotal)}}</th>
                  </tr>
                  <tr>
                    <th></th>
                    <th></th>
                    <th>Total a cobrar: </th>
                    <th><b-form-input
                      type="number"
                      v-model.trim="enviarTotal"
                    ></b-form-input></th>
                  </tr>
              </tbody>
            </table>
            <br>
            <br>
            <b-button variant="dark" v-if="arrayDetalles.length > 0" @click="onValidateAll()">AGREGAR PAQUETE</b-button>
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
  name: 'Sales',
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
      formMedicamento: {
        id: 0,
        cantidad: null,
        medicine: [],
        total: '',
        is_medicine: false,
        is_quirurgico: false,
        is_comun: false
      },
      form: {
        nombre: '',
        total: null
      },
      medicine: [],
      paquete: [],
      quirurgico: [],
      comun: [],
      existencia_medicina: 0,
      arrayDetalles: [],
      medicines: [],
      quirurgicos: [],
      comunes: [],
      paquetes: [],
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
      }
    }
  },
  methods: {
    setPaquete (data) {
      console.log(data)
      this.form.nombre = data.nombre
      this.form.total = data.total
      this.arrayDetalles = data.detalle_paquetes
      let cantidad = this.arrayDetalles.length
      for (let i = 0; i < cantidad; i++) {
        this.arrayDetalles[i].sugerida = this.arrayDetalles[i].cantidad
      }
      this.closeModal('paquete')
    },
    addMedicine () {
      let me = this
      me.total_array = me.total_array + 1
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_venta) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
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
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_venta) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
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
      let nuevoTotal = (parseFloat(me.formMedicamento.medicine.precio_venta) * me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        descripcion: me.formMedicamento.medicine.nombre,
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
        case 'paquete': {
          this.$v.$reset()
          this.$refs['modal-4'].hide()
          this.resetData()
          break
        }
        case 'save': {
          this.$v.$reset()
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
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos, o si ya le puso nombre al paquete'
        this.showAlertError()
      }
    },
    onValidateAll () {
      this.$v.$touch()
      this.id_usuario = this.currentUser.id
      this.formMedicamento.medicine = 'Ingresar'
      this.formMedicamento.cantidad = 'Ingresar'
      if (this.$v.$error !== true) {
        this.onSave()
      } else {
        this.alertText = 'Ha ocurrido un error en el paquete'
        this.showAlertError()
      }
    },
    resetData () {
      this.formMedicamento.medicine = null
      this.formMedicamento.cantidad = null
      this.formMedicamento.total = null
      this.formMedicamento.id = null
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/paquetes/vender', {
        detalle: me.arrayDetalles,
        nombre: me.nombre,
        id_usuario: me.id_usuario,
        total: me.enviarTotal
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado la venta exitosamente'
          me.closeModal('save')
          me.arrayDetalles = []
          me.paciente = null
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
    onSearchPaquetes (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingPaquete(search, loading)
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
    },
    searchingPaquete (search, loading) {
      axios.get(apiUrl + '/paquetes/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.paquetes = response.data
        loading(false)
      })
    }
  }
}
</script>

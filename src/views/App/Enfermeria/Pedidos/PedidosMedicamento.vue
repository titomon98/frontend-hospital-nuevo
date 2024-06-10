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
    <b-modal id="modal-1-pedidos-med" ref="modal-1-pedidos-med" title="Agregar medicamento">
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
            v-model.trim="$v.formMedicamento.id_medicine.$model"
            :options="medicamentos"
            :reduce="med => med.value"
            :state="!$v.formMedicamento.id_medicine.$error"
            label="text"
            @input="onChangeMedicamento"
          ></v-select>
          <div v-if="$v.formMedicamento.id_medicine.required.$invalid" class="invalid-feedback">
            Debe seleccionar un medicamento
          </div>
         </b-form-group>
        <div v-if="$v.formMedicamento.id_medicine.$invalid" class="invalid-feedback">
          Debe ingresar el medicamento
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formMedicamento.cantidad.$model"
            :state="!$v.formMedicamento.cantidad.$error"
            :min=1
            :max="max_cant"
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
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:body>
            <h5 class="card-title mt-3">Datos de generales del pedido</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Código de pedido:">
                  <b-form-input
                    v-model.trim="$v.form.codigoPedido.$model"
                    :state="!$v.form.codigoPedido.$error"
                    placeholder="Ingresar código del pedido"
                  ></b-form-input>
                </b-form-group>
                <div v-if="$v.form.codigoPedido.$invalid" class="invalid-feedback">
                  Debe ingresar el código
                </div>
              </b-col>
              <b-col md="4">
                <b-form-group label="Fecha:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.fecha.$model"
                    :state="!$v.form.fecha.$error"
                  ></b-form-input>
                  <div v-if="$v.form.fecha.required.$invalid" class="invalid-feedback">
                    Debe ingresar la fecha
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <h5 class="card-title mt-3">Medicamentos para pedido</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Agregar medicamento:">
                  <b-button variant="info" v-b-modal.modal-1-pedidos-med>AGREGAR MEDICAMENTO</b-button>
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
                      <th>Nombre</th>
                      <th>Cantidad</th>
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
                    <td v-text="details.nombre"></td>
                    <td v-text="details.cantidad"></td>
                  </tr>
              </tbody>
            </table>
            <br>
            <br>
            <b-button variant="dark" v-if="arrayDetalles.length > 0" @click="onValidateAll()">AGREGAR PEDIDO</b-button>
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
import { mapGetters } from 'vuex'

const today = new Date().toISOString().split('T')[0]

export default {
  name: 'CrearPedido',
  components: {
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.fetchPedidos()
    this.fetchMedicamentos()
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
      id: 0,
      arrayDetalles: [],
      medicamentos: [],
      pedidos: [],
      total_array: 0,
      max_cant: 0,
      formMedicamento: {
        id_medicine: 0,
        cantidad: null,
        medicine: '',
        existencias_actuales: 0
      },
      form: {
        id: 0,
        codigoPedido: '',
        cantidadUnidades: 0,
        fecha: today,
        id_usuario: 0,
        estado: 1,
        medicamentoId: 0
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/pedidos/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'codigoPedido',
          sortField: 'codigoPedido',
          title: 'Código de pedido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidadUnidades',
          sortField: 'cantidadUnidades',
          title: 'Cantidad de unidades',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        codigoPedido: { required },
        fecha: { required },
        cantidadUnidades: { required },
        medicamentoId: { required }
      },
      formMedicamento: {
        id_medicine: {
          required
        },
        cantidad: {
          required
        }
      }
    }
  },
  methods: {
    fetchMedicamentos () {
      axios.get(apiUrl + '/medicamentos/list')
        .then((response) => {
          this.medicamentos = response.data.map(medicamento => ({
            value: medicamento.id,
            text: medicamento.nombre,
            existencias_actuales: medicamento.existencia_actual
          }))
          // console.log('meds', response.data)
        })
        .catch((error) => {
          console.error('Error fetching medicamentos:', error)
          this.alertErrorText = 'Error al cargar los medicamentos'
          this.showAlertError()
        })
    },
    fetchPedidos () {
      axios.get(apiUrl + '/pedidos/getPerYear')
        .then((response) => {
          this.pedidos = response.data.map(pedido => ({
            value: pedido.id,
            text: pedido.codigoPedido
          }))
          var ceros = '0'
          if (this.pedidos.length < 10) {
            ceros = '000'
          } else if (this.pedidos.length < 100 && this.pedidos.length > 9) {
            ceros = '00'
          } else if (this.pedidos.length < 1000 && this.pedidos.length > 99) {
            ceros = '0'
          } else {
            ceros = ''
          }
          this.form.codigoPedido = 'P' + ceros + this.pedidos.length + '-' + today.split('-')[0]
          // console.log('meds', response.data)
        })
        .catch((error) => {
          console.error('Error fetching pedidos:', error)
          this.alertErrorText = 'Error al cargar los pedidos'
          this.showAlertError()
        })
    },
    addMedicine () {
      let me = this
      me.total_array = me.total_array + 1
      let medicine_ = me.medicamentos.find(med => med.value === me.formMedicamento.id_medicine)
      medicine_.existencias_actuales = parseInt(medicine_.existencias_actuales) - parseInt(me.formMedicamento.cantidad)
      let medicamento = {
        cantidad: me.formMedicamento.cantidad,
        nombre: medicine_.text,
        existencias_actuales: parseInt(medicine_.existencias_actuales) - parseInt(me.formMedicamento.cantidad),
        id_medicine: me.formMedicamento.id_medicine,
        is_medicine: true,
        is_quirurgico: false,
        is_comun: false
      }
      this.form.cantidadUnidades += me.formMedicamento.cantidad
      me.arrayDetalles.push(medicamento)
      me.closeModal('medicamento')
    },
    deleteDetail (id, total) {
      let me = this
      const objWithIdIndex = me.arrayDetalles.findIndex((obj) => obj.id === id)
      if (objWithIdIndex > -1) {
        me.arrayDetalles.splice(objWithIdIndex, 1)
      }
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.formMedicamento.id_medicine = 0
          this.formMedicamento.cantidad = 0
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save' : {
          this.$v.$reset()
          this.$refs['modal-1-pedidos-med'].hide()
          this.formMedicamento.id_medicine = 0
          this.formMedicamento.cantidad = 0
          break
        }
        case 'medicamento': {
          this.$v.formMedicamento.$reset()
          this.$refs['modal-1-pedidos-med'].hide()
          this.formMedicamento.id_medicine = 0
          this.formMedicamento.cantidad = 0
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-pedidos-med'].hide()
          this.formMedicamento.id_medicine = 0
          this.formMedicamento.cantidad = 0
          break
        }
        case 'ver': {
          this.$v.$reset()
          this.$refs['modal-ver-pedidos-med'].hide()
          this.formMedicamento.id_medicine = 0
          this.formMedicamento.cantidad = 0
          break
        }
      }
    },
    onValidate (action) {
      this.$v.formMedicamento.$touch()
      console.log(this.$v.$error)
      if (this.$v.$error !== true) {
        if (this.formMedicamento.cantidad > 0) {
          if (this.formMedicamento.cantidad <= this.max_cant) {
            this.addMedicine()
          } else {
            this.alertErrorText = 'La cantidad de producto debe ser menor a la existencia actual del producto (' + this.max_cant + ').'
            this.showAlertError()
          }
        } else {
          this.alertErrorText = 'La cantidad de producto debe ser mayor a 0.'
          this.showAlertError()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos, o si ya le puso un código al pedido'
        this.showAlertError()
      }
    },
    onValidateAll () {
      this.id_usuario = this.currentUser.id
      this.form.estado = 1
      this.form.medicamentoId = 1
      this.$v.form.$touch()
      if (this.total_array > 0) {
        if (this.$v.$error !== true) {
          this.onSave()
          this.fetchPedidos()
        } else {
          this.alertText = 'Ha ocurrido un error en el pedido'
          this.showAlertError()
        }
      } else {
        this.alertText = 'Debe ingresar medicamentos al pedido.'
        this.showAlertError()
      }
    },
    resetData () {
      this.formMedicamento.medicine = null
      this.formMedicamento.cantidad = null
      this.formMedicamento.existencias_actuales = null
      this.formMedicamento.id_medicine = null
    },
    /* Guardar */
    onSave () {
      const me = this
      console.log('idUser', this.currentUser.id)
      axios.post(apiUrl + '/pedidos/create', {
        detalle: me.arrayDetalles,
        codigoPedido: me.form.codigoPedido,
        fecha: me.form.fecha,
        id_usuario: me.currentUser.id,
        estado: 1,
        medicamentoId: 1,
        cantidadUnidades: me.form.cantidadUnidades
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el pedido exitosamente'
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
    onChangeMedicamento () {
      let medicine_ = this.medicamentos.find(med => med.value === this.formMedicamento.id_medicine)
      this.max_cant = medicine_.existencias_actuales
      this.formMedicamento.cantidad = 0
    }
  }
}
</script>

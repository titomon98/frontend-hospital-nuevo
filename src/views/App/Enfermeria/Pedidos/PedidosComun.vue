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
    <b-modal id="modal-1-pedidos-com" ref="modal-1-pedidos-com" title="Agregar producto comun">
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
        <b-form-group label="Producto común:">
          <v-select
            v-model.trim="$v.formComun.id_comun.$model"
            :options="comunes"
            :reduce="com => com.value"
            :state="!$v.formComun.id_comun.$error"
            label="text"
            placeholder="Seleccione el producto común"
            @input="onChangeComun"
          ></v-select>
          <label>{{this.existencias_selected_com}}</label>
          <div v-if="$v.formComun.id_comun.required.$invalid" class="invalid-feedback">
            Debe seleccionar un producto común
          </div>
         </b-form-group>
        <div v-if="$v.formComun.id_comun.$invalid" class="invalid-feedback">
          Debe ingresar el producto común
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formComun.cantidad.$model"
            :state="!$v.formComun.cantidad.$error"
            :min=1
            :max="max_cant"
            placeholder="Ingresar Cantidad"
          ></b-form-input>
        </b-form-group>
        <div v-if="$v.formComun.cantidad.$invalid" class="invalid-feedback">
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
                    readonly
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
              <b-col md="4">
                <b-form-group label="Pedido a:">
                  <b-row md="4">
                    <input type="radio" id="farmacia" value="0" v-model="$v.form.picked.$model" />
                    <label for="farmacia" class="mt-2 ml-1">Farmacia</label>
                  </b-row>
                  <b-row md="4">
                    <input type="radio" id="quirofano" value="1" v-model="$v.form.picked.$model" />
                    <label for="quirofano" class="mt-2 ml-1">Quirófano</label>
                  </b-row>
                </b-form-group>
              </b-col>
            </b-row>
            <h5 class="card-title mt-3">Comunes para pedido</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Agregar producto común:">
                  <b-button variant="info" v-b-modal.modal-1-pedidos-com>AGREGAR PRODUCTO COMÚN</b-button>
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
    this.fetchComunes()
    this.fetchPedidos()
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
      comunes: [],
      pedidos: [],
      total_array: 0,
      max_cant: 0,
      existencias_selected_com: '',
      formComun: {
        id_comun: null,
        cantidad: null,
        comun: null,
        existencias_actuales: null
      },
      form: {
        id: 0,
        codigoPedido: '',
        cantidadUnidades: 0,
        fecha: today,
        id_usuario: 0,
        estado: 1,
        picked: 0,
        comunId: 0
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
        comunId: { required },
        picked: { required }
      },
      formComun: {
        id_comun: {
          required
        },
        cantidad: {
          required
        }
      }
    }
  },
  methods: {
    fetchComunes () {
      axios.get(apiUrl + '/comun/list')
        .then((response) => {
          this.comunes = response.data.map(comun => ({
            value: comun.id,
            text: comun.nombre,
            existencias_actuales: comun.existencia_actual
          }))
          console.log('coms', response.data)
        })
        .catch((error) => {
          console.error('Error fetching comunes:', error)
          this.alertErrorText = 'Error al cargar los productos comunes'
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
    addNewCom () {
      let me = this
      me.total_array = me.total_array + 1
      let comun_ = me.comunes.find(com => com.value === me.formComun.id_comun)

      let comun = {
        cantidad: me.formComun.cantidad,
        nombre: comun_.text,
        existencias_actuales: parseInt(comun_.existencias_actuales) - parseInt(me.formComun.cantidad),
        id_comun: me.formComun.id_comun,
        is_medicine: false,
        is_quirurgico: false,
        is_comun: true
      }
      let comunId_ = me.comunes.findIndex(com => com.value === this.formComun.id_comun)
      this.comunes[comunId_].existencias_actuales = parseInt(comun_.existencias_actuales) - parseInt(me.formComun.cantidad)
      this.form.cantidadUnidades = parseInt(this.form.cantidadUnidades) + parseInt(me.formComun.cantidad)
      me.arrayDetalles.push(comun)
    },
    addComun () {
      let me = this
      if (me.arrayDetalles.length > 0) {
        let comFound = this.arrayDetalles.findIndex(com => com.comun === me.formComun.comun)
        if (comFound === null || comFound === undefined || comFound < 0) {
          this.addNewCom()
        } else {
          me.arrayDetalles[comFound].cantidad = parseInt(me.arrayDetalles[comFound].cantidad) + parseInt(me.formComun.cantidad)
          console.log(me.arrayDetalles[comFound])
        }
      } else {
        this.addNewCom()
      }
      me.closeModal('comun')
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
          this.formComun.id_comun = null
          this.formComun.cantidad = null
          this.existencias_selected_com = ''
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save' : {
          this.$v.$reset()
          this.$refs['modal-1-pedidos-com'].hide()
          this.formComun.id_comun = null
          this.formComun.cantidad = null
          this.existencias_selected_com = ''
          this.picked = 0
          break
        }
        case 'comun': {
          this.$v.formComun.$reset()
          this.$refs['modal-1-pedidos-com'].hide()
          this.formComun.id_comun = null
          this.formComun.cantidad = null
          this.existencias_selected_com = ''
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-pedidos-com'].hide()
          this.formComun.id_comun = null
          this.formComun.cantidad = null
          this.existencias_selected_com = ''
          break
        }
        case 'ver': {
          this.$v.$reset()
          this.$refs['modal-ver-pedidos-com'].hide()
          this.formComun.id_comun = null
          this.formComun.cantidad = null
          this.existencias_selected_com = ''
          break
        }
      }
    },
    onValidate (action) {
      this.$v.formComun.$touch()
      console.log(this.$v.$error)
      if (this.$v.$error !== true) {
        if (this.formComun.cantidad > 0) {
          if (this.formComun.cantidad <= this.max_cant) {
            this.addComun()
          } else {
            this.alertErrorText = 'La cantidad de producto debe ser menor a la existencia actual del producto (' + this.max_cant + ').'
            this.showAlertError()
          }
        } else {
          console.log(this.formComun.cantidad)
          this.alertErrorText = 'La cantidad del producto debe ser mayor a 0'
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
      this.form.comunId = 1
      this.$v.form.$touch()
      if (this.total_array > 0) {
        if (this.$v.$error !== true) {
          this.fetchPedidos()
          this.onSave()
        } else {
          this.alertText = 'Ha ocurrido un error en el pedido'
          this.showAlertError()
        }
      } else {
        this.alertText = 'Debe ingresar productos comunes al pedido.'
        this.showAlertError()
      }
    },
    resetData () {
      this.formComun.comun = null
      this.formComun.cantidad = null
      this.formComun.existencias_actuales = null
      this.formComun.id_comun = null
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
        comunId: 1,
        cantidadUnidades: me.form.cantidadUnidades
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el pedido exitosamente'
          me.fetchPedidos()
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
    onChangeComun () {
      let comun_ = this.comunes.find(com => com.value === this.formComun.id_comun)
      this.max_cant = comun_.existencias_actuales
      this.existencias_selected_com = comun_.existencias_actuales + ' unidades en existencia.'
    }
  }
}
</script>

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
    <b-modal id="modal-1-pedidos-qui" ref="modal-1-pedidos-qui" title="Agregar producto quirúrgico">
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
        <b-form-group label="Quirurgico:">
          <v-select
            v-model.trim="$v.formQuirurgico.id_quirurgico.$model"
            :options="quirurgicos"
            :reduce="quir => quir.value"
            :state="!$v.formQuirurgico.id_quirurgico.$error"
            label="text"
            placeholder="Seleccione el producto quirúrgico"
            @input="onChangeQuirurgico"
          ></v-select>
          <label>{{this.existencias_selected_qui}}</label>
          <div v-if="$v.formQuirurgico.id_quirurgico.required.$invalid" class="invalid-feedback">
            Debe seleccionar un producto quirúrgico
          </div>
         </b-form-group>
        <div v-if="$v.formQuirurgico.id_quirurgico.$invalid" class="invalid-feedback">
          Debe ingresar el producto quirúrgico
        </div>
        <b-form-group label="Cantidad:">
          <b-form-input
            type="number"
            v-model.trim="$v.formQuirurgico.cantidad.$model"
            :state="!$v.formQuirurgico.cantidad.$error"
            :min=1
            :max="max_cant"
            placeholder="Ingresar Cantidad"
          ></b-form-input>
        </b-form-group>
        <div v-if="$v.formQuirurgico.cantidad.$invalid" class="invalid-feedback">
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
            <h5 class="card-title mt-3">Quirurgicos para pedido</h5>
            <hr>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Agregar producto quirúrgico:">
                  <b-button variant="info" v-b-modal.modal-1-pedidos-qui>AGREGAR PRODUCTO QUIRÚRGICO</b-button>
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
    this.fetchQuirurgicos()
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
      quirurgicos: [],
      pedidos: [],
      total_array: 0,
      max_cant: 0,
      existencias_selected_qui: '',
      formQuirurgico: {
        id_quirurgico: null,
        cantidad: null,
        quirurgico: null,
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
        quirurgicoId: 0
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
        quirurgicoId: { required },
        picked: { required }
      },
      formQuirurgico: {
        id_quirurgico: {
          required
        },
        cantidad: {
          required
        }
      }
    }
  },
  methods: {
    fetchQuirurgicos () {
      axios.get(apiUrl + '/quirurgico/list')
        .then((response) => {
          this.quirurgicos = response.data.map(quirurgico => ({
            value: quirurgico.id,
            text: quirurgico.nombre,
            existencias_actuales: quirurgico.existencia_actual
          }))
          // console.log('meds', response.data)
        })
        .catch((error) => {
          console.error('Error fetching quirurgicos:', error)
          this.alertErrorText = 'Error al cargar los quirurgicos'
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
    addNewQui () {
      let me = this
      me.total_array = me.total_array + 1
      let quirurgico_ = me.quirurgicos.find(qui => qui.value === me.formQuirurgico.id_quirurgico)

      let quirurgico = {
        cantidad: me.formQuirurgico.cantidad,
        nombre: quirurgico_.text,
        existencias_actuales: parseInt(quirurgico_.existencias_actuales) - parseInt(me.formQuirurgico.cantidad),
        id_quirurgico: me.formQuirurgico.id_quirurgico,
        is_quirurgico: true,
        is_medicine: false,
        is_comun: false
      }
      let quirurgicoId_ = me.quirurgicos.findIndex(qui => qui.value === this.formQuirurgico.id_quirurgico)
      this.quirurgicos[quirurgicoId_].existencias_actuales = parseInt(quirurgico_.existencias_actuales) - parseInt(me.formQuirurgico.cantidad)

      this.form.cantidadUnidades = parseInt(this.form.cantidadUnidades) + parseInt(me.formQuirurgico.cantidad)
      me.arrayDetalles.push(quirurgico)
    },
    addQuirurgico () {
      let me = this
      if (me.arrayDetalles.length > 0) {
        let quiFound = this.arrayDetalles.findIndex(qui => qui.id_quirurgico === me.formQuirurgico.id_quirurgico)
        if (quiFound === null || quiFound === undefined || quiFound < 0) {
          this.addNewQui()
        } else {
          me.arrayDetalles[quiFound].cantidad = parseInt(me.arrayDetalles[quiFound].cantidad) + parseInt(me.formQuirurgico.cantidad)
          console.log(me.arrayDetalles[quiFound])
        }
      } else {
        this.addNewQui()
      }
      me.closeModal('quirurgico')
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
          this.formQuirurgico.id_quirurgico = null
          this.formQuirurgico.cantidad = null
          this.existencias_selected_qui = null
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save' : {
          this.$v.$reset()
          this.$refs['modal-1-pedidos-qui'].hide()
          this.formQuirurgico.id_quirurgico = null
          this.formQuirurgico.cantidad = null
          this.existencias_selected_qui = null
          this.picked = 0
          break
        }
        case 'quirurgico': {
          this.$v.formQuirurgico.$reset()
          this.$refs['modal-1-pedidos-qui'].hide()
          this.formQuirurgico.id_quirurgico = null
          this.formQuirurgico.cantidad = null
          this.existencias_selected_qui = null
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-pedidos-qui'].hide()
          this.formQuirurgico.id_quirurgico = null
          this.formQuirurgico.cantidad = null
          this.existencias_selected_qui = null
          break
        }
        case 'ver': {
          this.$v.$reset()
          this.$refs['modal-ver-pedidos-qui'].hide()
          this.formQuirurgico.id_quirurgico = null
          this.formQuirurgico.cantidad = null
          this.existencias_selected_qui = null
          break
        }
      }
    },
    onValidate (action) {
      this.$v.formQuirurgico.$touch()
      console.log(this.$v.$error)
      if (this.$v.$error !== true) {
        if (this.formQuirurgico.cantidad > 0) {
          if (this.formQuirurgico.cantidad <= this.max_cant) {
            this.addQuirurgico()
          } else {
            this.alertErrorText = 'La cantidad de producto debe ser menor a la existencia actual del producto (' + this.max_cant + ').'
            this.showAlertError()
          }
        } else {
          console.log(this.formQuirurgico.cantidad)
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
      this.form.quirurgicoId = 1
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
        this.alertText = 'Debe ingresar productos quirúrgicos al pedido.'
        this.showAlertError()
      }
    },
    resetData () {
      this.formQuirurgico.quirurgico = null
      this.formQuirurgico.cantidad = null
      this.formQuirurgico.existencias_actuales = null
      this.formQuirurgico.id_quirurgico = null
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
        quirurgicoId: 1,
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
    onChangeQuirurgico () {
      let quirurgico_ = this.quirurgicos.find(qui => qui.value === this.formQuirurgico.id_quirurgico)
      this.max_cant = quirurgico_.existencias_actuales
      this.existencias_selected_qui = quirurgico_.existencias_actuales + ' unidades en existencia.'
    }
  }
}
</script>

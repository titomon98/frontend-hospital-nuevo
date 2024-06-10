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
    <b-modal id="modal-1-pedido-med" ref="modal-1-pedido-med" title="Agregar pedido">
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
        <b-form-group label="Fecha:">
          <b-form-input
            v-model.trim="$v.form.fecha.$model"
            :state="!$v.form.fecha.$error"
            placeholder="Ingresar fecha del pedido"
          ></b-form-input>
          <div v-if="$v.form.fecha.required.$invalid" class="invalid-feedback">
            Debe ingresar la fecha
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
    <b-modal id="modal-ver-pedidos-med" ref="modal-ver-pedidos-med" size="lg" title="Detalle de pedido">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-row class="ml-2">
        <b-col md="4">
          <b-form-group label="Nombre:">
            <h6>{{ form.nombre }}</h6>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Precio total:">
            <h6>{{ total }}</h6>
          </b-form-group>
        </b-col>
        <b-col md="4">
          <b-form-group label="Persona que ingresó:">
            <h6>{{ form.usuario.nombre + ' ' + form.usuario.apellidos }}</h6>
          </b-form-group>
        </b-col>
      </b-row>
      <br>
      <br>
      <table class="table table-hover product_item_list c_table theme-color mb-0">
        <thead>
            <tr>
                <th>Descripción</th>
                <th>Cantidad</th>
                <th>Total</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="details in arrayDetalles" :key="details.id">
              <td v-text="details.descripcion"></td>
              <td v-text="details.cantidad"></td>
              <td v-text="details.subtotal"></td>
            </tr>
        </tbody>
      </table>
      <br>
      <template #modal-footer="{}">
        <b-button variant="danger" @click="closeModal('ver')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-pedidos-med" ref="modal-3-pedidos-med" title="Desactivar pedido">
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
        ¿Desea desactivar el pedido: {{ form.nombre }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onState()
                $bvModal.hide('modal-3-pedidos-med')"
        >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-pedidos-med')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-modal id="modal-4-pedidos-med" ref="modal-4-pedidos-med" title="Activar pedido">
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
        ¿Desea activar al pedido: {{ form.nombre }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onState()
                $bvModal.hide('modal-4-pedidos-med')"
        >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-pedidos-med')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-row>
    <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Pedidos</h4>
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
                    ><h6 class="success"><strong>ACTIVO</strong></h6></b-badge
                >
                </h5>
                <h5 v-else>
                <b-badge variant="light"
                    ><h6 class="danger"><strong>INACTIVO</strong></h6></b-badge
                >
                </h5>
            </div>
            <!-- Botones -->
            <template slot="actions" slot-scope="props">
                <b-button-group>
                <b-button
                    v-b-tooltip.top="'Ver'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-ver-pedidos-med
                    class="mb-2"
                    size="sm"
                    variant="outline-success"
                    ><i :class="'fas fa-eye'"
                /></b-button>
                <b-button
                    v-b-tooltip.top="
                    props.rowData.estado == 1 ? 'Desactivar' : 'Activar'"
                    @click="
                    setData(props.rowData);
                    props.rowData.estado == 1
                        ? $bvModal.show('modal-3-pedidos-med')
                        : $bvModal.show('modal-4-pedidos-med');
                    "
                    class="mb-2"
                    size="sm"
                    :variant="
                    props.rowData.estado == 1 ? 'outline-danger' : 'outline-info'">
                    <i
                    :class="
                        props.rowData.estado == 1
                        ? 'fas fa-trash-alt'
                        : 'fas fa-check'"
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
  name: 'Pedidos',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
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
      id: 0,
      arrayDetalles: [],
      form: {
        id: 0,
        codigoPedido: '',
        cantidadUnidades: 0,
        fecha: '',
        usuario: {
          nombre: '',
          apellidos: ''
        },
        tipo: '',
        estado: 1
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
        tipo: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.codigoPedido = ''
          this.form.cantidadUnidades = 0
          this.form.fecha = 0
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-pedidos-med'].hide()
          this.form.id = 0
          this.form.codigoPedido = ''
          this.form.cantidadUnidades = 0
          this.form.fecha = 1
          this.arrayDetalles = []
          break
        }
        case 'ver': {
          this.$v.$reset()
          this.$refs['modal-ver-pedidos-med'].hide()
          this.form.id = 0
          this.form.codigoPedido = ''
          this.form.cantidadUnidades = 0
          this.form.fecha = 1
          this.arrayDetalles = []
          break
        }
      }
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
    setData (data) {
      this.arrayDetalles = data.detalle_pedidos
      this.form.nombre = data.codigoPedido
      this.form.total = data.cantidadUnidades
      this.form.state = data.fecha
      this.form.usuario = data.usuario
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/pedidos/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el pedido ' + me.form.nombre + ' exitosamente'
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
      axios.put(apiUrl + '/pedidos/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el pedido ' + me.form.nombre + ' exitosamente'
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
          .put(apiUrl + '/pedidos/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el pedido ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-pedidos-med'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErr8orText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/pedidos/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el pedido ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-pedidos-med'].hide()
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
    }
  }
}
</script>

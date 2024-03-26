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
    <b-modal id="modal-ver-ingreso" ref="modal-ver-ingreso" size="lg" title="Detalle de ingreso">
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
        <b-col md="3">
          <b-form-group label="Descripcion:">
            <h6>{{ form.descripcion }}</h6>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Fecha de ingreso:">
            <h6>{{ form.fecha }}</h6>
          </b-form-group>
        </b-col>
        <b-col md="3">
          <b-form-group label="Precio total:">
            <h6>{{ total }}</h6>
          </b-form-group>
        </b-col>
        <b-col md="3">
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
      <b-row class="ml-2">
        <b-col md="6">
          <h5>Total factura: {{ total }}</h5>
        </b-col>
      </b-row>
      <template #modal-footer="{}">
        <b-button variant="danger" @click="closeModal('ver')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-ingreso" ref="modal-3-ingreso" title="Desactivar ingreso">
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
        ¿Desea desactivar el ingreso con factura: {{ form.factura }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onState()
                $bvModal.hide('modal-3-ingreso')"
        >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-ingreso')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-modal id="modal-confirmar-ingreso" ref="modal-confirmar-ingreso" title="Confirmar ingreso">
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
        ¿Desea confirmar el ingreso con factura: {{ form.factura }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onConfirm()
        $bvModal.hide('modal-confirmar-ingreso')"
        >Confirmar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-confirmar-ingreso')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-row>
    <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ingresos sin factura</h4>
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
              <button v-if="props.rowData.estado === 2" type="button" class="btn btn-info" disabled>PENDIENTE DE INGRESO</button>
              <button v-if="props.rowData.estado === 1" type="button" class="btn btn-success" disabled>INGRESADO</button>
              <button v-if="props.rowData.estado === 0" type="button" class="btn btn-danger" disabled>ANULADO</button>
            </div>
            <!-- Botones -->
            <template slot="actions" slot-scope="props">
                <b-button-group>
                <b-button
                    v-b-tooltip.top="'Ver'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-ver-ingreso
                    class="mb-2"
                    size="sm"
                    variant="outline-success"
                    ><i :class="'fas fa-eye'"
                /></b-button>
                <b-button
                    v-if="props.rowData.estado === 2"
                    v-b-tooltip.top="'Confirmar ingreso'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-confirmar-ingreso
                    class="mb-2"
                    size="sm"
                    variant="outline-info"
                    ><i :class="'fas fa-check'"
                /></b-button>
                <b-button
                    v-if="props.rowData.estado === 1"
                    v-b-tooltip.top="'Desactivar'"
                    @click="
                    setData(props.rowData);
                    $bvModal.show('modal-3-ingreso')
                    "
                    class="mb-2"
                    size="sm"
                    :variant="'outline-danger'">
                    <i
                    :class="'fas fa-trash-alt'"
                /></b-button>
                <!-- <b-button
                    v-if="props.rowData.estado === 0"
                    v-b-tooltip.top="'Activar'"
                    @click="
                    setData(props.rowData);
                    $bvModal.show('modal-4-ingreso')
                    "
                    class="mb-2"
                    size="sm"
                    :variant="
                    'outline-info'">
                    <i
                    :class="'fas fa-check'"
                /></b-button> -->
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
  name: 'Ingresos',
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
        factura: '',
        fecha: null,
        descripcion: '',
        precio_costo: 0.0,
        precio_venta: 0.0,
        usuario: {
          nombre: '',
          apellidos: ''
        },
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/ingresos/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'factura',
          sortField: 'factura',
          title: 'Factura',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripcion',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
        factura: { required },
        fecha: { required },
        descripcion: { required },
        precio_costo: { required },
        precio_venta: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.factura = ''
          this.form.descripcion = ''
          this.form.fecha = ''
          this.form.precio_costo = 0
          this.form.precio_venta = 0
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-ingreso'].hide()
          this.form.id = 0
          this.form.factura = ''
          this.form.descripcion = ''
          this.form.fecha = ''
          this.form.total = 0
          this.form.state = 1
          this.arrayDetalles = []
          break
        }
        case 'ver': {
          this.$v.$reset()
          this.$refs['modal-ver-ingreso'].hide()
          this.form.id = 0
          this.form.factura = ''
          this.form.descripcion = ''
          this.form.fecha = ''
          this.form.total = 0
          this.form.state = 1
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
      this.arrayDetalles = data.detalle_ingresos
      this.form.factura = data.factura
      this.form.descripcion = data.descripcion
      this.form.fecha = data.fecha
      this.form.total = data.total
      this.form.state = data.estado
      this.form.id = data.id
      this.form.usuario = data.usuario
      this.total = data.total
    },
    onUpdate () {
      const me = this
      axios.put(apiUrl + '/ingresos/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el ingreso ' + me.form.id + ' exitosamente'
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
          .put(apiUrl + '/ingresos/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el ingreso ' + me.form.id + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-ingreso'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErr8orText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/ingresos/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el ingreso ' + me.form.id + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-ingreso'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    onConfirm () {
      let me = this
      axios
        .put(apiUrl + '/ingresos/confirm', {
          id: this.form.id
        })
        .then((response) => {
          me.alertVariant = 'warning'
          me.showAlert()
          me.alertText = 'Se ha confirmado el ingreso ' + me.form.id + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-confirmar-ingreso'].hide()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErr8orText = 'Ha ocurrido un error, por favor intente más tarde'
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
    }
  }
}
</script>

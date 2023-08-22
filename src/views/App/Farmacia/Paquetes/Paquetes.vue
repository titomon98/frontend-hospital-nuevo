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
    <b-modal id="modal-2-paquete" ref="modal-2-paquete" title="Editar paquete">
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
        <b-form-group label="Nombre:">
        <b-form-input
            v-model.trim="$v.form.nombre.$model"
            :state="!$v.form.nombre.$error"
            placeholder="Ingresar nombre del paquete"
        ></b-form-input>
        <div v-if="$v.form.nombre.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
        </div>
        </b-form-group>
        <b-form-group label="Precio costo:">
        <b-form-input
        type="number"
            v-model.trim="$v.form.precio_costo.$model"
            :state="!$v.form.precio_costo.$error"
            placeholder="Ingresar precio costo del paquete"
        ></b-form-input>
        <div v-if="$v.form.precio_costo.required.$invalid" class="invalid-feedback">
            Debe ingresar el precio costo
        </div>
        </b-form-group>
        <b-form-group label="Precio venta:">
        <b-form-input
        type="number"
            v-model.trim="$v.form.precio_venta.$model"
            :state="!$v.form.precio_venta.$error"
            placeholder="Ingresar precio de venta del paquete"
        ></b-form-input>
        <div v-if="$v.form.precio_venta.required.$invalid" class="invalid-feedback">
            Debe ingresar el precio de venta
        </div>
        </b-form-group>
    </b-form>
    <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('update')"
        >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('update')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-modal id="modal-3-paquete" ref="modal-3-paquete" title="Desactivar paquete">
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
        ¿Desea desactivar el paquete: {{ form.nombre }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onState()
                $bvModal.hide('modal-3-paquete')"
        >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-paquete')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-modal id="modal-4-paquete" ref="modal-4-paquete" title="Activar paquete">
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
        ¿Desea activar al paquete: {{ form.nombre }} ?
    </h6>
    <template #modal-footer="{}">
        <b-button
        type="submit"
        variant="primary"
        @click="onState()
                $bvModal.hide('modal-4-paquete')"
        >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-paquete')"
        >Cancelar</b-button
        >
    </template>
    </b-modal>
    <b-row>
    <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Paquetes</h4>
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
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-paquete
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
                /></b-button>
                <b-button
                    v-b-tooltip.top="
                    props.rowData.estado == 1 ? 'Desactivar' : 'Activar'"
                    @click="
                    setData(props.rowData);
                    props.rowData.estado == 1
                        ? $bvModal.show('modal-3-paquete')
                        : $bvModal.show('modal-4-paquete');
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
  name: 'Paquetes',
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
      form: {
        id: 0,
        nombre: '',
        precio_costo: 0.0,
        precio_venta: 0.0,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/paquetes/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombre',
          sortField: 'nombre',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_costo',
          sortField: 'precio_costo',
          title: 'Precio costo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio venta',
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
        nombre: { required },
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
          this.form.nombre = ''
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
          this.$refs['modal-2-paquete'].hide()
          this.form.id = 0
          this.form.nombre = ''
          this.form.precio_costo = 0
          this.form.precio_venta = 0
          this.form.state = 1
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
      this.form.nombre = data.nombre
      this.form.precio_costo = data.precio_costo
      this.form.precio_venta = data.precio_venta
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/paquetes/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el paquete ' + me.form.nombre + ' exitosamente'
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
      axios.put(apiUrl + '/paquetes/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el paquete ' + me.form.nombre + ' exitosamente'
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
          .put(apiUrl + '/paquetes/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el paquete ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-paquete'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErr8orText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/paquetes/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el paquete ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-paquete'].hide()
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

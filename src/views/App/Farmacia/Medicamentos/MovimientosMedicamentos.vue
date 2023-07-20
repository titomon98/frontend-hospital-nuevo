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
    <b-modal id="modal-1-movimiento" ref="modal-1-movimiento" title="Agregar movimiento">
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
        <b-form-group label="Medicamento:">
            <v-select
              name="medicamentos"
              v-model="$v.form.medicamento.$model"
              :state="!$v.form.medicamento.$error"
              :options="medicamentos"
              :filterable="false"
              placeholder="Seleccione la medicamento"
              @search="onSearchMedicamentos"
            >
              <template v-slot:spinner="{ loading }">
                <div v-show="loading">Cargando...</div>
              </template>
              <template v-slot:option="option">
                {{ 'Nombre: '+ option.nombre + ' Existencia: ' + option.existencia_actual }}
              </template>
              <template slot="selected-option" slot-scope="option">
                {{ 'Nombre: '+ option.nombre + ' Existencia: ' + option.existencia_actual }}
              </template>
            </v-select>
            <div v-if="$v.form.medicamento.$error" class="invalid-feedback-vselect">
              Debe seleccionar la medicamento
            </div>
          </b-form-group>
          <b-form-group label="Cantidad:">
            <b-form-input
              type="number"
              v-model.trim="$v.form.cantidad.$model"
              :state="!$v.form.cantidad.$error"
              placeholder="Ingresar cantidad"
            ></b-form-input>
            <div v-if="$v.form.cantidad.required.$invalid" class="invalid-feedback">
              Debe ingresar cantidad
            </div>
          </b-form-group>
          <b-row class="ml-2">
            <b-col md="6">
              <b-form-group label="Tipo de movimiento:">
                <b-form-radio v-model="form.movimiento" value="ENTRADA" @change="changeCheck" name="customRadio1">Ingreso de medicamentos</b-form-radio>
                <b-form-radio v-model="form.movimiento" value="SALIDA" @change="changeCheck" name="customRadio1">Salida de medicamentos</b-form-radio>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group v-if="form.movimiento === 'ENTRADA'" label="Precio costo individual:">
                <b-form-input
                  type="number"
                  v-model.trim="form.precio_costo"
                  placeholder="Ingresar precio costo"
                ></b-form-input>
              </b-form-group>
              <b-form-group v-else-if="form.movimiento === 'SALIDA'" label="Precio venta individual:">
                <b-form-input
                  type="number"
                  v-model.trim="form.precio_venta"
                  placeholder="Ingresar precio venta"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
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
    <b-modal id="modal-2-movimiento" ref="modal-2-movimiento" title="Editar movimiento">
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
        <b-form-group label="Medicamento:">
            <v-select
              name="medicamentos"
              v-model="$v.form.medicamento.$model"
              :state="!$v.form.medicamento.$error"
              :options="medicamentos"
              :filterable="false"
              placeholder="Seleccione la medicamento"
              @search="onSearchMedicamentos"
            >
              <template v-slot:spinner="{ loading }">
                <div v-show="loading">Cargando...</div>
              </template>
              <template v-slot:option="option">
                {{ 'Nombre: '+ option.nombre + ' Existencia: ' + option.existencia_actual }}
              </template>
              <template slot="selected-option" slot-scope="option">
                {{ 'Nombre: '+ option.nombre + ' Existencia: ' + option.existencia_actual }}
              </template>
            </v-select>
            <div v-if="$v.form.medicamento.$error" class="invalid-feedback-vselect">
              Debe seleccionar la medicamento
            </div>
          </b-form-group>
          <b-form-group label="Cantidad:">
            <b-form-input
              type="number"
              v-model.trim="$v.form.cantidad.$model"
              :state="!$v.form.cantidad.$error"
              placeholder="Ingresar cantidad"
            ></b-form-input>
            <div v-if="$v.form.cantidad.required.$invalid" class="invalid-feedback">
              Debe ingresar cantidad
            </div>
          </b-form-group>
          <b-row class="ml-2">
            <b-col md="6">
              <b-form-group label="Tipo de movimiento:">
                <b-form-radio v-model="form.movimiento" value="ENTRADA" @change="changeCheck" name="customRadio1">Ingreso de medicamentos</b-form-radio>
                <b-form-radio v-model="form.movimiento" value="SALIDA" @change="changeCheck" name="customRadio1">Salida de medicamentos</b-form-radio>
              </b-form-group>
            </b-col>
            <b-col md="6">
              <b-form-group v-if="form.movimiento === 'ENTRADA'" label="Precio costo individual:">
                <b-form-input
                  type="number"
                  v-model.trim="form.precio_costo"
                  placeholder="Ingresar precio costo"
                ></b-form-input>
              </b-form-group>
              <b-form-group v-else-if="form.movimiento === 'SALIDA'" label="Precio venta individual:">
                <b-form-input
                  type="number"
                  v-model.trim="form.precio_venta"
                  placeholder="Ingresar precio venta"
                ></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
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
    <b-modal id="modal-3-movimiento" ref="modal-3-movimiento" title="Desactivar movimiento">
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
        ¿Desea desactivar el movimiento?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-movimiento')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-movimiento')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-movimiento" ref="modal-4-movimiento" title="Activar movimiento">
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
        ¿Desea activar el movimiento ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-movimiento')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-movimiento')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Movimientos medicamentos</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-movimiento>AGREGAR NUEVO</b-button>
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
                    v-b-modal.modal-2-movimiento
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
                        ? $bvModal.show('modal-3-movimiento')
                        : $bvModal.show('modal-4-movimiento');
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
import { mapGetters } from 'vuex'

export default {
  name: 'MovimientosMedicamentos',
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
      medicamentos: [],
      form: {
        id: 0,
        cantidad: 0,
        medicamento: null,
        movimiento: 'ENTRADA',
        precio_costo: null,
        precio_venta: null,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/medicamentos_movimientos/list',
      fields: [
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'existencia_previa',
          sortField: 'existencia_previa',
          title: 'Existencia previa',
          dataClass: 'list-item-heading'
        },
        {
          name: 'existencia_nueva',
          sortField: 'existencia_nueva',
          title: 'Existencia nueva',
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
          name: 'movimiento',
          sortField: 'movimiento',
          title: 'Movimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripcion',
          dataClass: 'list-item-heading'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        cantidad: { required },
        movimiento: { required },
        medicamento: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.cantidad = 0
          this.form.movimiento = 'ENTRADA'
          this.form.medicamento = null
          this.form.precio_costo = null
          this.form.precio_venta = null
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.form.id = 0
          this.form.cantidad = 0
          this.form.movimiento = 'ENTRADA'
          this.form.medicamento = null
          this.form.precio_costo = null
          this.form.precio_venta = null
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-movimiento'].hide()
          this.form.id = 0
          this.form.cantidad = 0
          this.form.movimiento = 'ENTRADA'
          this.form.medicamento = null
          this.form.precio_costo = null
          this.form.precio_venta = null
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        if (action === 'save') {
          if (parseInt(this.form.cantidad) < 1) {
            this.alertErrorText = 'Debe ser un número mayor a 0'
            this.showAlertError()
          } else if (parseInt(this.form.cantidad) > this.form.medicamento.existencia_actual && this.form.movimiento === 'SALIDA') {
            this.alertErrorText = 'No hay suficiente existencia del producto'
            this.showAlertError()
          } else if (this.form.movimiento === 'SALIDA' && this.form.precio_venta === null) {
            this.alertErrorText = 'Debe ingresar el precio de salida'
            this.showAlertError()
          } else if (this.form.movimiento === 'ENTRADA' && this.form.precio_costo === null) {
            this.alertErrorText = 'Debe ingresar el precio de entrada'
            this.showAlertError()
          } else {
            this.onSave()
          }
        } else if (action === 'update') {
          this.onUpdate()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    setData (data) {
      this.form.cantidad = data.cantidad
      this.form.movimiento = data.movimiento
      this.form.medicamento = data.medicamento
      this.form.precio_costo = data.precio_costo
      this.form.precio_venta = data.precio_venta
      this.form.state = data.estado
      this.form.id = data.id
    },
    onSave () {
      const me = this
      const currentUser = this.currentUser
      axios.post(apiUrl + '/medicamentos_movimientos/create', {
        form: me.form,
        currentUser: currentUser
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el movimiento exitosamente'
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
      axios.put(apiUrl + '/medicamentos_movimientos/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el movimiento exitosamente'
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
          .put(apiUrl + '/medicamentos_movimientos/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el movimiento exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-movimiento'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/medicamentos_movimientos/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el movimiento exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-movimiento'].hide()
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
    },
    onSearchMedicamentos (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingMedicamentos(search, loading)
      }
    },
    searchingMedicamentos (search, loading) {
      axios.get(apiUrl + '/medicamentos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicamentos = response.data
        loading(false)
      })
    },
    changeCheck () {
      if (this.movimiento === 'ENTRADA') {
        this.form.precio_venta = null
      } else {
        this.form.precio_costo = null
      }
    }
  }
}
</script>

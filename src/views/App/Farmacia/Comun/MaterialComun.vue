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
    <b-modal id="modal-1-comun" size="xl" ref="modal-1-comun" title="Agregar material comun">
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
        <b-row class="ml-2">
          <b-col md="8">
            <b-form-group label="Nombre:">
              <b-form-input
                v-model.trim="$v.form.name.$model"
                :state="!$v.form.name.$error"
                placeholder="Ingresar nombre del material quirurgico"
              ></b-form-input>
              <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                Debe ingresar el nombre
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Inventariado:">
              <b-form-radio v-model="form.inventariado" value="INVENTARIADO" name="customRadio1">Inventariado</b-form-radio>
              <b-form-radio v-model="form.inventariado" value="NO INVENTARIADO" name="customRadio1">No inventariado</b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Costo:">
              <b-form-input
                v-model.trim="$v.form.precio_costo.$model"
                :state="!$v.form.precio_costo.$error"
                placeholder="Ingresar costo del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_costo.required.$invalid" class="invalid-feedback">
                Debe ingresar el costo
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Existencia mínima:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima.$model"
                :state="!$v.form.existencia_minima.$error"
                placeholder="Ingresar existencia minima del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Existencia actual:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual.$model"
                :state="!$v.form.existencia_actual.$error"
                placeholder="Ingresar existencia actual del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Marca:">
              <v-select
                name="marca"
                v-model="$v.form.marca.$model"
                :state="!$v.form.marca.$error"
                :options="marcas"
                :filterable="false"
                placeholder="Seleccione la marca"
                @search="onSearchMarca"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.marca.$error" class="invalid-feedback-vselect">
                Debe seleccionar la marca
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Presentación:">
              <v-select
                name="presentacion"
                v-model="$v.form.presentacion.$model"
                :state="!$v.form.presentacion.$error"
                :options="presentaciones"
                :filterable="false"
                placeholder="Seleccione la presentacion"
                @search="onSearchPresentacion"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.presentacion.$error" class="invalid-feedback-vselect">
                Debe seleccionar la presentacion
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Proveedor:">
              <v-select
                name="proveedor"
                v-model="$v.form.proveedor.$model"
                :state="!$v.form.proveedor.$error"
                :options="proveedores"
                :filterable="false"
                placeholder="Seleccione el proveedor"
                @search="onSearchProveedor"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.proveedor.$error" class="invalid-feedback-vselect">
                Debe seleccionar el proveedor
              </div>
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
    <b-modal id="modal-2-comun" size="xl" ref="modal-2-comun" title="Editar material comun">
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
        <b-row class="ml-2">
          <b-col md="8">
            <b-form-group label="Nombre:">
              <b-form-input
                v-model.trim="$v.form.name.$model"
                :state="!$v.form.name.$error"
                placeholder="Ingresar nombre del material quirurgico"
              ></b-form-input>
              <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                Debe ingresar el nombre
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Inventariado:">
              <b-form-radio v-model="form.inventariado" value="INVENTARIADO" name="customRadio1">Inventariado</b-form-radio>
              <b-form-radio v-model="form.inventariado" value="NO INVENTARIADO" name="customRadio1">No inventariado</b-form-radio>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Costo:">
              <b-form-input
                v-model.trim="$v.form.precio_costo.$model"
                :state="!$v.form.precio_costo.$error"
                placeholder="Ingresar costo del medicamento"
              ></b-form-input>
              <div v-if="$v.form.precio_costo.required.$invalid" class="invalid-feedback">
                Debe ingresar el costo
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Existencia mínima:">
              <b-form-input
                v-model.trim="$v.form.existencia_minima.$model"
                :state="!$v.form.existencia_minima.$error"
                placeholder="Ingresar existencia minima del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_minima.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia minima
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Existencia actual:">
              <b-form-input
                v-model.trim="$v.form.existencia_actual.$model"
                :state="!$v.form.existencia_actual.$error"
                placeholder="Ingresar existencia actual del medicamento"
              ></b-form-input>
              <div v-if="$v.form.existencia_actual.required.$invalid" class="invalid-feedback">
                Debe ingresar la existencia actual
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Marca:">
              <v-select
                name="marca"
                v-model="$v.form.marca.$model"
                :state="!$v.form.marca.$error"
                :options="marcas"
                :filterable="false"
                placeholder="Seleccione la marca"
                @search="onSearchMarca"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.marca.$error" class="invalid-feedback-vselect">
                Debe seleccionar la marca
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Presentación:">
              <v-select
                name="presentacion"
                v-model="$v.form.presentacion.$model"
                :state="!$v.form.presentacion.$error"
                :options="presentaciones"
                :filterable="false"
                placeholder="Seleccione la presentacion"
                @search="onSearchPresentacion"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.presentacion.$error" class="invalid-feedback-vselect">
                Debe seleccionar la presentacion
              </div>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Proveedor:">
              <v-select
                name="proveedor"
                v-model="$v.form.proveedor.$model"
                :state="!$v.form.proveedor.$error"
                :options="proveedores"
                :filterable="false"
                placeholder="Seleccione el proveedor"
                @search="onSearchProveedor"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombre }}
                </template>
              </v-select>
              <div v-if="$v.form.proveedor.$error" class="invalid-feedback-vselect">
                Debe seleccionar el proveedor
              </div>
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
    <b-modal id="modal-3-comun" ref="modal-3-comun" title="Desactivar material comun">
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
        ¿Desea desactivar el material comun: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-comun')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-comun')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-comun" ref="modal-4-comun" title="Activar material comun">
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
        ¿Desea activar al material comun: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-comun')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-comun')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Material común</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-comun>AGREGAR NUEVO</b-button>
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
                    v-b-modal.modal-2-comun
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
                        ? $bvModal.show('modal-3-comun')
                        : $bvModal.show('modal-4-comun');
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
  name: 'Bank',
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
      marcas: [],
      presentaciones: [],
      proveedores: [],
      form: {
        id: 0,
        name: '',
        precio_costo: 0,
        existencia_minima: 0,
        existencia_actual: 0,
        inventariado: 'INVENTARIADO',
        marca: null,
        proveedor: null,
        presentacion: null,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/comun/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombre',
          sortField: 'name',
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
          name: 'existencia_minima',
          sortField: 'existencia_minima',
          title: 'Existencia minima',
          dataClass: 'list-item-heading'
        },
        {
          name: 'existencia_actual',
          sortField: 'existencia_actual',
          title: 'Existencia actual',
          dataClass: 'list-item-heading'
        },
        {
          name: 'inventariado',
          sortField: 'inventariado',
          title: 'Inventariado',
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
        name: { required },
        precio_costo: { required },
        existencia_minima: { required },
        existencia_actual: { required },
        marca: { required },
        presentacion: { required },
        proveedor: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-comun'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-comun'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.precio_costo = 0
          this.form.existencia_minima = 0
          this.form.existencia_actual = 0
          this.form.inventariado = 'INVENTARIADO'
          this.form.marca = null
          this.form.presentacion = null
          this.form.proveedor = null
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
      this.form.name = data.nombre
      this.form.state = data.estado
      this.form.precio_costo = data.precio_costo
      this.form.existencia_minima = data.existencia_minima
      this.form.existencia_actual = data.existencia_actual
      this.form.inventariado = data.inventariado
      this.form.marca = data.marca
      this.form.presentacion = data.presentacione
      this.form.proveedor = data.proveedore
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/comun/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el material comun ' + me.form.name + ' exitosamente'
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
      axios.put(apiUrl + '/comun/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el material comun ' + me.form.name + ' exitosamente'
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
          .put(apiUrl + '/comun/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el material comun ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-comun'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/comun/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el material comun ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-comun'].hide()
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
    onSearchMarca (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingMarcas(search, loading)
      }
    },
    searchingMarcas (search, loading) {
      axios.get(apiUrl + '/marca/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.marcas = response.data
        loading(false)
      })
    },
    onSearchPresentacion (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingPresentaciones(search, loading)
      }
    },
    searchingPresentaciones (search, loading) {
      axios.get(apiUrl + '/presentacion/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.presentaciones = response.data
        loading(false)
      })
    },
    onSearchProveedor (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingProveedor(search, loading)
      }
    },
    searchingProveedor (search, loading) {
      axios.get(apiUrl + '/proveedor/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.proveedores = response.data
        loading(false)
      })
    }
  }
}
</script>

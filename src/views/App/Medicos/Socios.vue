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
    <b-modal id="modal-1-socios" ref="modal-1-socios" title="Agregar socio">
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
        <b-form-group label="Médicos:">
          <v-select
            name="medico"
            v-model="$v.form.medico.$model"
            :state="!$v.form.medico.$error"
            :options="medicos"
            :filterable="false"
            placeholder="Seleccione el médico"
            @search="onSearchMedico"
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
          <div v-if="$v.form.medico.$error" class="invalid-feedback-vselect">
            Debe seleccionar el médico
          </div>
        </b-form-group>
        <b-form-group label="Acciones:">
          <b-form-input
            v-model.trim="$v.form.acciones.$model"
            :state="!$v.form.acciones.$error"
            placeholder="Ingresar acciones del socio"
          ></b-form-input>
          <div v-if="$v.form.acciones.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de acciones
          </div>
        </b-form-group>
        <b-form-group label="Inicio:">
          <b-form-input
            type="date"
            v-model.trim="$v.form.inicio.$model"
            :state="!$v.form.inicio.$error"
            placeholder="Ingresar fecha de inicio del socio"
          ></b-form-input>
          <div v-if="$v.form.inicio.required.$invalid" class="invalid-feedback">
            Debe ingresar el inicio
          </div>
        </b-form-group>
        <b-form-group label="Final:">
          <b-form-input
            type="date"
            v-model.trim="form.final"
            placeholder="Ingresar fecha final del socio"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Observaciones:">
          <b-form-input
            v-model.trim="form.observaciones"
            placeholder="Ingresar observaciones del socio"
          ></b-form-input>
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
    <b-modal id="modal-2-socios" ref="modal-2-socios" title="Editar socio">
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
        <b-form-group label="Médicos:">
          <v-select
            name="medico"
            v-model="$v.form.medico.$model"
            :state="!$v.form.medico.$error"
            :options="medicos"
            :filterable="false"
            placeholder="Seleccione el médico"
            @search="onSearchMedico"
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
          <div v-if="$v.form.medico.$error" class="invalid-feedback-vselect">
            Debe seleccionar el médico
          </div>
        </b-form-group>
        <b-form-group label="Acciones:">
          <b-form-input
            v-model.trim="$v.form.acciones.$model"
            :state="!$v.form.acciones.$error"
            placeholder="Ingresar acciones del socio"
          ></b-form-input>
          <div v-if="$v.form.acciones.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de acciones
          </div>
        </b-form-group>
        <b-form-group label="Inicio:">
          <b-form-input
            type="date"
            v-model.trim="$v.form.inicio.$model"
            :state="!$v.form.inicio.$error"
            placeholder="Ingresar fecha de inicio del socio"
          ></b-form-input>
          <div v-if="$v.form.inicio.required.$invalid" class="invalid-feedback">
            Debe ingresar el inicio
          </div>
        </b-form-group>
        <b-form-group label="Final:">
          <b-form-input
            type="date"
            v-model.trim="form.final"
            placeholder="Ingresar fecha final del socio"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Observaciones:">
          <b-form-input
            v-model.trim="form.observaciones"
            placeholder="Ingresar observaciones del socio"
          ></b-form-input>
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
    <b-modal id="modal-3-socios" ref="modal-3-socios" title="Desactivar socio">
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
        ¿Desea desactivar el socio ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-socios')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-socios')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-socios" ref="modal-4-socios" title="Activar socio">
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
        ¿Desea activar al socio ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-socios')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-socios')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Socios</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-socios>AGREGAR NUEVO</b-button>
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
                    v-b-modal.modal-2-socios
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
                        ? $bvModal.show('modal-3-socios')
                        : $bvModal.show('modal-4-socios');
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
import { xray } from '../../../config/pluginInit'
import DatatableHeading from '../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'

export default {
  name: 'Socios',
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
      medicos: [],
      form: {
        id: 0,
        medico: null,
        acciones: '',
        inicio: '',
        final: '',
        observaciones: '',
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/socios/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'medico.nombre',
          sortField: 'medico.nombre',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'acciones',
          sortField: 'acciones',
          title: 'Acciones',
          dataClass: 'list-item-heading'
        },
        {
          name: 'inicio',
          sortField: 'inicio',
          title: 'Fecha de inicio',
          dataClass: 'list-item-heading'
        },
        {
          name: 'final',
          sortField: 'final',
          title: 'Fecha final',
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
        acciones: { required },
        medico: { required },
        inicio: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.medico = null
          this.form.acciones = ''
          this.form.inicio = ''
          this.form.final = ''
          this.form.observaciones = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-socios'].hide()
          this.form.id = 0
          this.form.medico = null
          this.form.acciones = ''
          this.form.inicio = ''
          this.form.final = ''
          this.form.observaciones = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-socios'].hide()
          this.form.id = 0
          this.form.medico = null
          this.form.acciones = ''
          this.form.inicio = ''
          this.form.final = ''
          this.form.observaciones = ''
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
      this.form.medico = data.medico
      this.form.acciones = data.acciones
      this.form.inicio = data.inicio
      this.form.final = data.final
      this.form.observaciones = data.observaciones
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/socios/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el socio exitosamente'
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
      axios.put(apiUrl + '/socios/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el socio exitosamente'
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
          .put(apiUrl + '/socios/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el socio exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-socios'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/socios/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el socio exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-socios'].hide()
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
    onSearchMedico (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingMedicos(search, loading)
      }
    },
    searchingMedicos (search, loading) {
      axios.get(apiUrl + '/medicos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicos = response.data
        loading(false)
      })
    }
  }
}
</script>

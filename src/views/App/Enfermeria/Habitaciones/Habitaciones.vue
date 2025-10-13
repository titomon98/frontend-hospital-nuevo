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
    <b-modal id="modal-2-habitaciones" ref="modal-2-habitaciones" title="Editar habitación">
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
        <b-form-group label="Número:">
          <b-form-input
            v-model.trim="$v.form.numero.$model"
            :state="!$v.form.numero.$error"
            placeholder="Ingresar número de la habitación"
          ></b-form-input>
          <div v-if="$v.form.numero.required.$invalid" class="invalid-feedback">
            Debe ingresar el número de la habitación
          </div>
        </b-form-group>
        <b-form-group label="Costo ambulatorio de habitación:">
          <b-form-input
            v-model.trim="$v.form.costo_ambulatorio.$model"
            :state="!$v.form.costo_ambulatorio.$error"
            placeholder="Ingresar costo ambulatorio de la habitación"
            type="number"
          ></b-form-input>
          <div v-if="$v.form.costo_ambulatorio.required.$invalid" class="invalid-feedback">
            Debe ingresar el costo ambulatorio de la habitación
          </div>
        </b-form-group>
        <b-form-group label="Costo diario de habitación:">
          <b-form-input
            v-model.trim="$v.form.costo_diario.$model"
            :state="!$v.form.costo_diario.$error"
            placeholder="Ingresar costo diario de la habitación"
            type="number"
          ></b-form-input>
          <div v-if="$v.form.costo_diario.required.$invalid" class="invalid-feedback">
            Debe ingresar el costo diario de la habitación
          </div>
        </b-form-group>
        <b-form-group label="Costo diario de habitación:">
          <b-form-input
            v-model.trim="$v.form.costo_diario.$model"
            :state="!$v.form.costo_diario.$error"
            placeholder="Ingresar costo diario de la habitación"
            type="number"
          ></b-form-input>
          <div v-if="$v.form.costo_diario.required.$invalid" class="invalid-feedback">
            Debe ingresar el costo diario de la habitación
          </div>
        </b-form-group>
        <b-form-group label="Costo para estudio de sueño de habitación:">
          <b-form-input
            v-model.trim="$v.form.costo_estudio_de_sueno.$model"
            :state="!$v.form.costo_estudio_de_sueno.$error"
            placeholder="Ingresar costo para estudio de sueño de la habitación"
            type="number"
          ></b-form-input>
          <div v-if="$v.form.costo_estudio_de_sueno.required.$invalid" class="invalid-feedback">
            Debe ingresar el costo para estudio de sueño de la habitación
          </div>
        </b-form-group>
        <b-form-group label="Costo para quimioterapia de habitación:">
          <b-form-input
            v-model.trim="$v.form.costo_quimioterapia.$model"
            :state="!$v.form.costo_quimioterapia.$error"
            placeholder="Ingresar costo para quimioterapia de la habitación"
            type="number"
          ></b-form-input>
          <div v-if="$v.form.costo_quimioterapia.required.$invalid" class="invalid-feedback">
            Debe ingresar el costo para quimioterapia de la habitación
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
    <b-modal id="modal-3-habitaciones" ref="modal-3-habitaciones" title="Desactivar habitaciones">
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
        ¿Desea desactivar habitaciones: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-habitaciones')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-habitaciones')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-habitaciones" ref="modal-4-habitaciones" title="Activar habitaciones">
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
        ¿Desea activar al habitaciones: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-habitaciones')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-habitaciones')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Habitaciones</h4>
               <div class="iq-search-bar mt-2">
                <b-form @submit.prevent class="searchbox">
                    <b-input
                      id="search"
                      v-model="search"
                      placeholder="Buscar..."
                      @input="searchChange"
                    />
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
              :fields="userFields()"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <!-- Estado -->
              <div slot="estado" slot-scope="props">
                <h5 v-if="props.rowData.estado == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>DISPONIBLE</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else-if="props.rowData.estado == 2">
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>OCUPADA</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else-if="props.rowData.estado == 0">
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>NO DISPONIBLE</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-habitaciones
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    :disabled="!hasPermission([9, 5])"
                    ><i :class="'fas fa-pencil-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="
                      props.rowData.estado == 1 ? 'Desactivar' : 'Activar'"
                    @click="
                      setData(props.rowData);
                      props.rowData.estado == 1
                        ? $bvModal.show('modal-3-habitaciones')
                        : $bvModal.show('modal-4-habitaciones');
                    "
                    class="mb-2"
                    size="sm"
                    :variant="
                      props.rowData.estado == 1 ? 'outline-danger' : 'outline-info'"
                      :disabled="!hasPermission([9, 5])"
                      >
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
  name: 'Habitaciones',
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
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 15,
      search: '',
      form: {
        id: 0,
        name: '',
        numero: 0,
        costo_ambulatorio: 0,
        costo_diario: 0,
        costo_estudio_de_sueno: 0,
        costo_quimioterapia: 0,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/habitaciones/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Numero',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo',
          sortField: 'tipo',
          title: 'Tipo de habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'costo_diario',
          sortField: 'costo_diario',
          title: 'Precio de habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'costo_ambulatorio',
          sortField: 'costo_ambulatorio',
          title: 'Precio ambulatorio',
          dataClass: 'list-item-heading'
        },
        {
          name: 'costo_estudio_de_sueno',
          sortField: 'costo_estudio_de_sueno',
          title: 'Precio estudio de sueño',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      fields2: [
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Numero',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo',
          sortField: 'tipo',
          title: 'Tipo de habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      items: []
    }
  },
  validations () {
    return {
      form: {
        numero: { required },
        costo_ambulatorio: { required },
        costo_diario: { required },
        costo_estudio_de_sueno: { required },
        costo_quimioterapia: { required }
      }
    }
  },
  methods: {
    userFields () {
      const type = this.currentUser?.user_type
      return [9, 10, 11].includes(type) ? this.fields2 : this.fields
    },
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-habitaciones'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-habitaciones'].hide()
          this.form.id = 0
          this.form.name = ''
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
      this.form.numero = data.numero
      this.form.costo_ambulatorio = data.costo_ambulatorio
      this.form.costo_diario = data.costo_diario
      this.form.costo_estudio_de_sueno = data.costo_estudio_de_sueno
      this.form.costo_quimioterapia = data.costo_quimioterapia
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/habitaciones/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado la habitación ' + me.form.name + ' exitosamente'
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
      axios.put(apiUrl + '/habitaciones/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado la habitación ' + me.form.name + ' exitosamente'
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
          .put(apiUrl + '/habitaciones/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado la habitación ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-habitaciones'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/habitaciones/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado la habitación ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-habitaciones'].hide()
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

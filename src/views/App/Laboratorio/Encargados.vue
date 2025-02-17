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
    <b-modal id="modal-1-encargados" ref="modal-1-encargados" title="Agregar encargado">
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
        <b-col md="6">
        <b-form-group label="Nombres:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.nombres.$model"
            :class="{'is-invalid': $v.form.nombres.$error}"
            placeholder="Ingresar nombres"
            ></b-form-input>
        </b-form-group>
        </b-col>
        <b-col md="6">
        <b-form-group label="Apellidos:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.apellidos.$model"
            :class="{'is-invalid': $v.form.apellidos.$error}"
            placeholder="Ingresar apellidos"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Usuario:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.usuario.$model"
            :class="{'is-invalid': $v.form.usuario.$error}"
            placeholder="Ingresar usuario"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Contacto:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.contacto.$model"
            :class="{'is-invalid': $v.form.contacto.$error}"
            placeholder="Ingresar contacto"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Tipo de encargado:">
          <v-select
            name="type"
            v-model = "selectedType"
            :options="tipos"
            :reduce="type => type.value"
            placeholder="Seleccione un tipo de encargado"
            label='text'
            @search="onSearchType"/>
        </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onSave()
                  $bvModal.hide('modal-1-encargados')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-1-encargados')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-encargados" ref="modal-2-encargados" title="Editar encargado">
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
        <b-col md="6">
        <b-form-group label="Nombres:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.nombres.$model"
            :class="{'is-invalid': $v.form.nombres.$error}"
            placeholder="Ingresar nombres"
            ></b-form-input>
        </b-form-group>
        </b-col>
        <b-col md="6">
        <b-form-group label="Apellidos:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.apellidos.$model"
            :class="{'is-invalid': $v.form.apellidos.$error}"
            placeholder="Ingresar apellidos"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Usuario:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.usuario.$model"
            :class="{'is-invalid': $v.form.usuario.$error}"
            placeholder="Ingresar usuario"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Contacto:">
            <b-form-input
            type="text"
            v-model.trim="$v.form.contacto.$model"
            :class="{'is-invalid': $v.form.contacto.$error}"
            placeholder="Ingresar contacto"
            ></b-form-input>
        </b-form-group>
        </b-col>
      </b-row>
      <b-row class="ml-2">
        <b-col md="6">
        <b-form-group label="Tipo de encargado:">
          <v-select
            name="type"
            v-model = "selectedType"
            :options="tipos"
            :reduce="type => type.value"
            placeholder="Seleccione un tipo de encargado"
            label='text'
            @search="onSearchType"/>
        </b-form-group>
        </b-col>
      </b-row>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onValidate('update')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-encargados')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-encargados" ref="modal-3-encargados" title="Desactivar encargados">
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
        ¿Desea desactivar al encargado: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-encargados')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-encargados')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-encargados" ref="modal-4-encargados" title="Activar encargados">
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
        ¿Desea activar al encargado: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-encargados')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-encargados')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Encargados</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-encargados>AGREGAR NUEVO</b-button>
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
                    v-b-modal.modal-2-encargados
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
                        ? $bvModal.show('modal-3-encargados')
                        : $bvModal.show('modal-4-encargados');
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
  name: 'Encargados',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.fetchTypes()
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
        nombres: '',
        apellidos: '',
        usuario: '',
        contacto: '',
        id_tipo_encargado: 0,
        state: 1
      },
      tipos: [],
      selectedType: '',
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/encargados/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombres',
          sortField: 'nombres',
          title: 'Nombres',
          dataClass: 'list-item-heading'
        },
        {
          name: 'apellidos',
          sortField: 'apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'usuario',
          sortField: 'usuario',
          title: 'Usuario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'contacto',
          sortField: 'contacto',
          title: 'Contacto',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipos_encargado.tipo',
          sortField: 'tipo',
          title: 'Tipo de encargado',
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
        nombres: { required },
        apellidos: { required },
        contacto: { required },
        usuario: { required },
        id_tipo_encargado: { required }
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
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-encargados'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.nombres = ''
          this.form.apellidos = ''
          this.form.usuarios = ''
          this.form.id_tipo_encargado = 0
          this.selectedType = 0
          this.form.contacto = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-encargados'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.nombres = ''
          this.form.apellidos = ''
          this.form.usuarios = ''
          this.form.id_tipo_encargado = 0
          this.selectedType = 0
          this.form.contacto = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      console.log(this.form)
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
      this.form.nombres = data.nombres
      this.form.apellidos = data.apellidos
      this.form.usuario = data.usuario
      this.form.contacto = data.contacto
      this.form.id_tipo_encargado = data.tipos_encargado.id
      this.selectedType = data.selectedType
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      me.form.id_tipo_encargado = me.selectedType
      axios.post(apiUrl + '/encargados/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado al encargado ' + me.form.nombre + ' exitosamente'
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
      me.form.id_tipo_encargado = me.selectedType
      console.log(me.form)
      // this.$refs["modalSave"].hide();
      axios.put(apiUrl + '/encargados/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado al encargado ' + me.form.nombres + ' ' + me.form.apellidos + ' exitosamente'
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
          .put(apiUrl + '/encargados/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado la habitación ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-encargados'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/encargados/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado la habitación ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-encargados'].hide()
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
    fetchTypes (search, loading) {
      axios.get(apiUrl + '/tipos_encargados/get',
        {
          params: {
            search: search
          }
        }).then((response) => {
        this.tipos = response.data.map(tipo => ({
          value: tipo.id,
          text: tipo.tipo
        }))
        loading(false)
      })
    },
    onSearchType (search, loading) {
      if (search.length) {
        loading(true)
        this.fetchTypes(search, loading)
      }
    }
  }
}
</script>

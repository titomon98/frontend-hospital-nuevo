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
    <b-modal id="modal-1-create" ref="modal-1-create" title="Agregar seguro">
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
        <b-form-group label="Póliza:">
          <b-input id="poliza" ref="poliza" v-model="poliza" />
        </b-form-group>
        <b-form-group label="Asegurado:">
          <b-input id="nombreAsegurado" ref="nombreAsegurado" v-model="nombreAsegurado" />
        </b-form-group>
        <b-form-group label="Teléfono del asegurado:">
          <b-input id="telefonoAsegurado" ref="telefonoAsegurado" v-model="telefonoAsegurado" />
        </b-form-group>
        <b-form-group label="Correo del asegurado:">
          <b-input id="correoAsegurado" ref="correoAsegurado" v-model="correoAsegurado" />
        </b-form-group>
        <div>Aseguradora</div>
        <v-select
              ref="selectAseg"
              v-model="selectedAseg"
              :options="aseguradoras"
              label="nombre"
              value="id"></v-select>
        <div>Pacientes</div>
        <v-select
              ref="selectAseg"
              v-model="selectedExp"
              :options="expedientes"
              label="nombres"
              value="id"></v-select>
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
    <b-modal id="modal-2-contract" ref="modal-2-contract" title="Editar contrato">
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
            placeholder="Ingresar nombre del contrato"
          ></b-form-input>
          <div v-if="$v.form.nombre.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
        <b-form-group label="Contenido:">
          <quill-editor
            ref="myQuillEditor"
            v-model="form.contrato"
            :options="editorOption"
            theme="snow"
          />
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
    <b-modal id="modal-3-contract" ref="modal-3-contract" title="Desactivar contrato">
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
        ¿Desea desactivar el contrato: {{ form.nombre }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-contract')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-contract')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-contract" ref="modal-4-contract" title="Activar contrato">
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
        ¿Desea activar al contrato: {{ form.nombre }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-contract')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-contract')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-5-create" ref="modal-5-create" title="Agregar seguro">
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
          <b-input id="placeName" ref="placeName" v-model="placeName" />
        </b-form-group>
        <b-form-group label="placePhone:">
          <b-input id="placePhone" ref="placePhone" v-model="placePhone" />
        </b-form-group>

      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidateAseguradora()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Seguros</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary" @click="getInsurancesCompanies(); getExpedients()" v-b-modal.modal-1-create>AGREGAR SEGURO</b-button>
            <b-button variant="primary" @click="getInsurancesCompanies(); getExpedients()" v-b-modal.modal-5-create :disabled="!hasPermission([5, 7])">AGREGAR ASEGURADORA</b-button>
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
                <h5 v-if="props.rowData.solvente == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>SOLVENTE</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else-if="props.rowData.solvente == 0">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>PENDIENTE DE PAGO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>DESACTIVADO</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-contract
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
                        ? $bvModal.show('modal-3-contract')
                        : $bvModal.show('modal-4-contract');
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
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
import { mapGetters } from 'vuex'

export default {
  name: 'Contratos',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    quillEditor
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
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['clean']
          ]
        }
      },
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      form: {
        id: 0,
        contrato: '',
        nombre: '',
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/seguros/list',
      selectedAseg: null,
      aseguradoras: [],
      expedientes: [],
      selectedExp: null,
      fields: [
        {
          name: 'expediente.nombres',
          sortField: 'expediente.nombres',
          title: 'Nombres',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'no_poliza',
          sortField: 'no_poliza',
          title: 'Numero de Póliza',
          dataClass: 'list-item-heading'
        },
        {
          name: 'aseguradora.nombre',
          sortField: 'aseguradora.nombre',
          title: 'Aseguradora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'aseguradora.telefono',
          sortField: 'aseguradora.telefono',
          title: 'Teléfono de la aseguradora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_asegurado',
          sortField: 'nombre_asegurado',
          title: 'Persona asegurada',
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
        contrato: { required },
        nombre: { required }
      }
    }
  },
  methods: {
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.contrato = ''
          this.form.nombre = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-create'].hide()
          this.form.id = 0
          this.form.contrato = ''
          this.form.nombre = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-contract'].hide()
          this.form.id = 0
          this.form.contrato = ''
          this.form.nombre = ''
          this.form.state = 1
          break
        }
        case 'place': {
          this.$v.$reset()
          this.$refs['modal52-create'].hide()
          this.form.id = 0
          this.form.contrato = ''
          this.form.nombre = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.selectedAseg !== null && this.poliza !== '' && this.nombreAsegurado !== '' && this.selectedExp !== null) {
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
      this.form.contrato = data.contrato
      this.form.nombre = data.nombre
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onValidateAseguradora () {
      axios.post(apiUrl + '/aseguradoras/create', {
        telefono: this.placePhone,
        nombre: this.placeName
      }).then((res) => {
        this.$refs['modal-5-create'].hide()
        this.alertVariant = 'success'
        this.showAlert()
        this.alertText = 'Se ha creado la aseguradora exitosamente'
      })
    },
    onSave () {
      const me = this
      axios.post(apiUrl + '/seguros/create', {
        id_expediente: this.selectedExp,
        id_aseguradora: this.selectedAseg,
        no_poliza: this.poliza,
        nombre_asegurado: this.nombreAsegurado,
        tel_asegurado: this.telefonoAsegurado,
        correo_asegurado: this.correoAsegurado
      })
        .then((response) => {
          me.selectAseg = null
          me.selectedExp = null
          me.no_poliza = ''
          me.nombre_asegurado = ''
          me.tel_asegurado = ''
          me.correoAsegurado = ''
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el contrato exitosamente'
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
      axios.put(apiUrl + '/contrato/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el contrato exitosamente'
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
          .put(apiUrl + '/contrato/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el contrato exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-contract'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/contrato/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el contrato exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-contract'].hide()
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
    getInsurancesCompanies () {
      axios.get(apiUrl + '/aseguradoras/get').then((response) => {
        this.aseguradoras = response.data
        console.log(response.data)
      })
    },
    getExpedients () {
      axios.get(apiUrl + '/expedientes/getAll').then((response) => {
        this.expedientes = response.data
        console.log(response.data)
      })
    }
  }
}
</script>

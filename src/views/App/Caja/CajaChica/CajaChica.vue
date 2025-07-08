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
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Caja Chica</h4>
            </template>
            <template v-slot:headerAction>
          </template>
          <template v-slot:body>
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
                <b-input
                  id="fecha"
                  ref="fecha"
                  v-model="fecha"
                  type="date"
                  placeholder="Ingrese la fecha"
                  />
              </b-form-group>
              <b-form-group label="Proveedor:">
                <b-input
                  id="proveedorNombre"
                  ref="proveedorNombre"
                  v-model="proveedorNombre"
                  placeholder="Ingrese el proveedor"
                />
              </b-form-group>
              <b-form-group label="Cantidad:">
                <b-input
                  id="cajaCant"
                  ref="cajaCant"
                  v-model="cajaCant"
                  placeholder="Ingrese la cantidad a retirar"
                  type="number"
                  min="0.0"
                  step="0.1"
                />
              </b-form-group>
              <b-form-group label="Descripción:">
                <b-input
                  id="cajaDesc"
                  ref="cajaDesc"
                  v-model="cajaDesc"
                  placeholder="Ingrese la descripción del retiro"
                />
              </b-form-group>
              <b-form-group label="Rubro de caja chica">
                <v-select
                  ref="selectedRubro"
                  v-model="selectedRubro"
                  :options="rubros"
                  label="nombre"
                  value="id"
                  placeholder="Ingrese el rubro del retiro"
                >
                </v-select>
              </b-form-group>
            </b-form>
            <b-button variant="primary" @click="onValidate('save')">RETIRAR DINERO</b-button>
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
import { mapGetters } from 'vuex'

export default {
  name: 'CajaChica',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    this.getRubros()
    xray.index()
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
        nombre: '',
        state: 1
      },
      cajaCant: null,
      cajaDesc: null,
      proveedorNombre: null,
      fecha: null,
      selectedRubro: null,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/cajaChica/list',
      rubros: [],
      fields: [
        {
          name: 'fecha',
          sortField: 'fecha',
          title: 'Fecha',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'proveedor',
          sortField: 'proveedor',
          title: 'Proveedor',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'rubro.nombre',
          sortField: 'rubro.nombre',
          title: 'Rubro',
          dataClass: 'list-item-heading'
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Creado por',
          dataClass: 'list-item-heading'
        }
      ]
    }
  },
  validations () {
    return {
      fecha: { required },
      proveedorNombre: { required },
      cajaCant: { required },
      cajaDesc: { required },
      selectedRubro: { required }
    }
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
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
          this.form.id = 0
          this.form.nombre = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.cajaDesc !== null && this.cajaCant !== null && this.fecha !== null && this.selectedRubro && this.proveedorNombre) {
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
      this.form.state = data.estado
      this.form.id = data.id
    },
    onSave () {
      const me = this
      const localForm = {
        fecha: me.fecha,
        selectedRubro: me.selectedRubro,
        cajaCant: me.cajaCant,
        cajaDesc: me.cajaDesc,
        proveedorNombre: me.proveedorNombre
      }
      axios.post(apiUrl + '/cajaChica/create', {
        form: localForm,
        user: me.currentUser.user
      })
        .then((response) => {
          me.fecha = null
          me.selectedRubro = null
          me.cajaCant = null
          me.cajaDesc = null
          me.proveedorNombre = null
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el registro exitosamente'
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
    getRubros () {
      axios.get(apiUrl + '/rubros/get').then((response) => {
        this.rubros = response.data
      })
    }
  }
}
</script>

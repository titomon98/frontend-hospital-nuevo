<template>
  <b-container fluid>
    <b-modal id="modal-1" ref="modal-1" title="Agregar usuario">
      <form>
        <div class="col-md-12 mb-3">
          <label for="user">Usuario</label>
          <input
            required
            type="text"
            class="form-control"
            id="user"
            v-model.trim="$v.form.user.$model"
            :state="!$v.form.user.$error"
            placeholder="Ingresar usuario"
          >
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
        <div class="col-md-12 mb-3">
          <label for="password">Contraseña</label>
          <input
            required
            type="password"
            class="form-control"
            id="password"
            v-model.trim="$v.form.password.$model"
            :state="!$v.form.password.$error"
            placeholder="Ingresar contraseña"
          >
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
        <div class="col-md-12 mb-3">
          <label for="type">Tipo de usuario</label>
          <v-select
            name="type"
            v-model="$v.form.userType.$model"
            :state="!$v.form.userType.$error"
            :options="typeOptions"
            label="nombre"
            placeholder="Seleccione tipo de usuario"
          />
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
      </form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onValidate('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2" ref="modal-2" title="Editar especialidad">
      <form>
        <div class="col-md-12 mb-3">
          <label for="user">Usuario</label>
          <input
            required
            type="text"
            class="form-control"
            id="user"
            v-model.trim="$v.form.user.$model"
            :state="!$v.form.user.$error"
            placeholder="Ingresar usuario"
          >
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
        <div class="col-md-12 mb-3">
          <label for="password">Contraseña</label>
          <input
            required
            type="text"
            class="form-control"
            id="password"
            v-model.trim="$v.form.password.$model"
            :state="!$v.form.password.$error"
            placeholder="Ingresar contraseña"
          >
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
        <div class="col-md-12 mb-3">
          <label for="type">Tipo de usuario</label>
          <v-select
            name="type"
            v-model="$v.form.userType.$model"
            :state="!$v.form.userType.$error"
            :options="typeOptions"
            label="nombre"
            placeholder="Seleccione tipo de usuario"
          />
          <div class="valid-feedback">
            Looks good!
          </div>
          <div class="invalid-feedback">Example invalid feedback text</div>
        </div>
      </form>
      <template #modal-footer="{}">
        <b-button  variant="primary" @click="onValidate('update')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('update')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3" ref="modal-3" title="Desactivar especialidad">
      <h6 class="my-4">
        ¿Desea desactivar el usuario: {{ form.user }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4" ref="modal-4" title="Activar especialidad">
      <h6 class="my-4">
        ¿Desea activar el usuario: {{ form.user }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Personal</h4>
              <div class="iq-search-bar mt-2">
                <div class="row">
                  <div class="col-sm">
                    <b-form action="#" class="searchbox">
                        <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                        <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                    </b-form>
                  </div>
                  <div class="col-sm">
                    <b-dropdown
                      id="ddown1"
                      :text="columna.nombre"
                      variant="outline-dark"
                      class="mr-1 float-md-left btn-group"
                      size="xs"
                    >
                      <b-dropdown-item
                        v-for="(search, index) in options"
                        :key="index"
                        @click="changeTypeSearch(search)"
                        >{{ search.nombre }}</b-dropdown-item
                      >
                    </b-dropdown>
                  </div>
                </div>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1>AGREGAR NUEVO</b-button>
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
                    v-b-modal.modal-2
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
                        ? $bvModal.show('modal-3')
                        : $bvModal.show('modal-4');
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
// import VuetablePagination from 'vuetable-2/src/components/VuetablePagination.vue'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'

export default {
  name: 'Users',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
    // 'vuetablePagination': VuetablePagination
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
    axios.get(apiUrl + '/type/get').then((response) => {
      this.typeOptions = response.data
    })
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
        user: '',
        password: '',
        userType: [],
        state: 1
      },
      apiBase: apiUrl + '/user/list',
      typeOptions: [],
      options: [
        { value: '1', nombre: 'Usuario' },
        { value: '2', nombre: 'Tipo usuario' }
      ],
      columna: { value: '1', nombre: 'Usuario' },
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
          // width: "15%",
        },
        {
          name: 'user',
          sortField: 'user',
          title: 'Usuario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo_usuario.nombre',
          sortField: 'user',
          title: 'Tipo de usuario',
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
        user: { required },
        password: { required },
        userType: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.user = ''
          this.form.password = ''
          this.form.userType = []
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1'].hide()
          this.form.id = 0
          this.form.user = ''
          this.form.password = ''
          this.form.userType = []
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2'].hide()
          this.form.id = 0
          this.form.user = ''
          this.form.password = ''
          this.form.userType = []
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
      }
    },
    setData (data) {
      this.form.user = data.user
      this.form.state = data.estado
      this.form.id = data.id
      this.form.userType = data.tipo_usuario
    },
    /* Guardar */
    onSave () {
      const me = this
      // this.$refs["modalSave"].hide();
      axios.post(apiUrl + '/user/create', {
        form: me.form })
        .then((response) => {
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          // this.errorMessage = error.message;
          console.error('Error!', error)
        })
    },
    /* Guardar */
    onUpdate () {
      const me = this
      axios.put(apiUrl + '/user/update', {
        form: me.form })
        .then((response) => {
          me.$refs.vuetable.refresh()
          me.closeModal('update')
        })
        .catch((error) => {
          // this.errorMessage = error.message;
          console.error('Error!', error)
        })
    },
    onState () {
      let me = this
      if (this.form.state === 1) {
        axios
          .put(apiUrl + '/user/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.$refs.vuetable.refresh()
            me.$refs['modal-3'].hide()
          })
          .catch((error) => {
            // this.errorMessage = error.message;
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/user/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.$refs.vuetable.refresh()
            me.$refs['modal-4'].hide()
          })
          .catch((error) => {
            // this.errorMessage = error.message;
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
          search: this.search,
          columna: this.columna.value
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search,
          columna: this.columna.value
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
    changeTypeSearch (columna) {
      this.columna = columna
    }
  }
}
</script>

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
    <b-modal id="modal-1-createExamen" ref="modal-1-createExamen" title="Agregar Examen">
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
            v-model.trim="varNombreExamen"
            placeholder="Ingresar nombre del examen"
          ></b-form-input>
          <div v-if="varNombreExamen === ''" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
        <b-form-group label="Precio normal:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioNormal"
            placeholder="Ingresar precio normal"
          ></b-form-input>
          <div v-if="varPrecioNormal === 0 || varPrecioNormal === null" class="invalid-feedback">
            Debe ingresar el precio normal
          </div>
        </b-form-group>
        <b-form-group label="Precio con sobrecargo:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioSobrecargo"
            placeholder="Ingresar precio con sobrecargo"
          ></b-form-input>
          <div v-if="varPrecioSobrecargo === 0 || varPrecioSobrecargo === null" class="invalid-feedback">
            Debe ingresar el precio con sobrecargo
          </div>
        </b-form-group>
      </b-form>
      <b-form-group label="Tipo de examen:">
          <b-form-input
            v-model.trim="varTipo"
            placeholder="Ingresar tipo del examen"
          ></b-form-input>
          <div v-if="varTipo === ''" class="invalid-feedback">
            Debe ingresar el tipo
          </div>
        </b-form-group>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onCreateTest()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-1-createExamen')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-updateExamen" ref="modal-2-updateExamen" title="Actualizar Examen">
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
            v-model.trim="varNombreExamen"
            placeholder="Ingresar nombre del examen"
          ></b-form-input>
          <div v-if="varNombreExamen === ''" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
        <b-form-group label="Precio normal:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioNormal"
            placeholder="Ingresar precio normal"
          ></b-form-input>
          <div v-if="varPrecioNormal === 0 || varPrecioNormal === null" class="invalid-feedback">
            Debe ingresar el precio normal
          </div>
        </b-form-group>
        <b-form-group label="Precio con sobrecargo:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioSobrecargo"
            placeholder="Ingresar precio con sobrecargo"
          ></b-form-input>
          <div v-if="varPrecioSobrecargo === 0 || varPrecioSobrecargo === null" class="invalid-feedback">
            Debe ingresar el precio con sobrecargo
          </div>
        </b-form-group>
      </b-form>
      <b-form-group label="Tipo de examen:">
          <b-form-input
            v-model.trim="varTipo"
            placeholder="Ingresar tipo del examen"
          ></b-form-input>
          <div v-if="varTipo === ''" class="invalid-feedback">
            Debe ingresar el tipo
          </div>
        </b-form-group>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onUpdateTest()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-2-updateExamen')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-equipo" ref="modal-3-equipo" title="Desactivar equipo">
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
        ¿Desea desactivar el equipo: {{ form.nombre }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-equipo')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-equipo')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-equipo" ref="modal-4-equipo" title="Activar equipo">
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
        ¿Desea activar al equipo: {{ form.nombre }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-equipo')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-equipo')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-5-campos" ref="modal-5-campos" title="Campos" size="xl">
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
        Campos de {{ form.nombreExamen }}
      </h6>
      <b-table ref="table_campos"
        hover
        :items="campos"
        :fields="fieldsCampos"
        :select-mode="'single'"
        selectable
      >
        <template #cell(show_details)="row">
          <b-button size="sm" @click="
            row.toggleDetails
            " class="mr-2">
            Editar
          </b-button>
        </template>

        <template #row-details="row">
          <b-card @show="
            this.varNombreCampo = row.item.nombre">
            <b-form @submit="$event.preventDefault()">
              <b-form-group label="Nombre:">
                <b-form-input
                  v-model.trim="varNombreCampo"
                  :placeholder= row.item.nombre
                  default
                ></b-form-input>
                <div v-if="varNombreCampo === ''" class="invalid-feedback">
                Debe ingresar el nombre
                </div>
              </b-form-group>
              <b-form-group label="Valor mínimo:">
                <b-form-input
                  type="number"
                  v-model.trim="varValorMinimo"
                  :placeholder=row.itemvalor_minimo
                ></b-form-input>
                <div v-if="varValorMinimo === 0 || varValorMinimo === null" class="invalid-feedback">
                  Debe ingresar el valor mínimo
                </div>
              </b-form-group>
              <b-form-group label="Valor máximo:">
                <b-form-input
                  type="number"
                  v-model.trim="varValorMaximo"
                  :placeholder=row.item.valor_maximo
                ></b-form-input>
                <div v-if="varValorMaximo === 0 || varValorMaximo === null" class="invalid-feedback">
                  Debe ingresar el valor máximo
                </div>
              </b-form-group>
            </b-form>
            <b-form-group label="Unidades:">
                <b-form-input
                  v-model.trim="varUnidades"
                  :placeholder=row.item.unidades
                ></b-form-input>
                <div v-if="varUnidades === ''" class="invalid-feedback">
                  Debe ingresar las unidades
                </div>
              </b-form-group>
              <b-button variant="primary" @click="onUpdateAttributes(row.item)">Guardar</b-button>
              <b-button variant="danger" @click="row.toggleDetails">Cancelar</b-button
          >
            </b-card>
        </template>
      </b-table>
      <b-card>
        AGREGAR CAMPO
        <b-form @submit="$event.preventDefault()">
          <b-form-group label="Nombre:">
            <b-form-input
              v-model.trim="varNombreCampo"
              placeholder= "Ingresar nombre"
              default
            ></b-form-input>
            <div v-if="varNombreCampo === ''" class="invalid-feedback">
            Debe ingresar el nombre
            </div>
          </b-form-group>
          <b-form-group label="Valor mínimo:">
            <b-form-input
              type="number"
              v-model.trim="varValorMinimo"
              placeholder="Ingresar valor mínimo"
            ></b-form-input>
            <div v-if="varValorMinimo === 0 || varValorMinimo === null" class="invalid-feedback">
              Debe ingresar el valor mínimo
            </div>
          </b-form-group>
          <b-form-group label="Valor máximo:">
            <b-form-input
              type="number"
              v-model.trim="varValorMaximo"
              placeholder="Ingresar valor máximo"
            ></b-form-input>
            <div v-if="varValorMaximo === 0 || varValorMaximo === null" class="invalid-feedback">
              Debe ingresar el valor máximo
            </div>
          </b-form-group>
        </b-form>
        <b-form-group label="Unidades:">
            <b-form-input
              v-model.trim="varUnidades"
              placeholder="Ingresar unidades"
            ></b-form-input>
            <div v-if="varUnidades === ''" class="invalid-feedback">
              Debe ingresar las unidades
            </div>
          </b-form-group>
          <b-button variant="primary" @click="onNewAttribute()">Guardar</b-button>
          <b-button variant="danger" @click="this.$refs['modal-5-campos'].hide()">Cancelar</b-button
      >
      </b-card>
      <template #modal-footer="{}">
        <b-button variant="danger" @click="$bvModal.hide('modal-5-campos')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Exámenes disponibles en laboratorio</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-createExamen>AGREGAR NUEVO</b-button>
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
                    @click="setDataEdit(props.rowData)"
                    v-b-modal.modal-2-updateExamen
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Campos'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-5-campos
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
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
  name: 'ExamenesAlmacenados',
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
      campos: [],
      fieldsCampos: [
        {
          key: 'nombre',
          label: 'Campo',
          sortable: true
        },
        {
          key: 'valor_minimo',
          label: 'Mínimo',
          sortable: true
        },
        {
          key: 'valor_maximo',
          label: 'Máximo',
          sortable: true
        },
        {
          key: 'unidades',
          label: 'Unidades',
          sortable: true
        },
        {
          key: 'show_details',
          label: 'Acciones',
          sortable: true
        }
      ],
      form: {
        id: 0,
        nombreExamen: '',
        cantidad_usos: 0,
        precio_publico: 0.0,
        gasto_unico: 0.0,
        fecha_adquisicion: '',
        existencia: 0,
        state: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/laboratoriosAlmacenados/list',
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
          name: 'precio_normal',
          sortField: 'precio_normal',
          title: 'Precio normal',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_sobrecargo',
          sortField: 'precio_sobrecargo',
          title: 'Precio con sobrecargo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo_examen',
          sortField: 'tipo_examen',
          title: 'Tipo',
          dataClass: 'list-item-heading'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        nombre: { required },
        cantidad_usos: { required },
        precio_publico: { required },
        gasto_unico: { required },
        fecha_adquisicion: { required },
        existencia: { required }
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
          this.form.cantidad_usos = 0
          this.form.precio_publico = 0
          this.form.gasto_unico = 0
          this.form.fecha_adquisicion = ''
          this.form.existencia = 0
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-createExamen'].hide()
          this.form.id = 0
          this.form.nombre = ''
          this.form.cantidad_usos = 0
          this.form.precio_publico = 0
          this.form.gasto_unico = 0
          this.form.fecha_adquisicion = ''
          this.form.existencia = 0
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-equipo'].hide()
          this.form.id = 0
          this.form.nombre = ''
          this.form.cantidad_usos = 0
          this.form.precio_publico = 0
          this.form.gasto_unico = 0
          this.form.fecha_adquisicion = ''
          this.form.existencia = 0
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
      this.form.id = data.id
      this.form.nombreExamen = data.nombre
      this.getDetail(data.id)
    },
    setDataEdit (data) {
      this.form.id = data.id
      this.form.nombreExamen = data.nombre
      this.varNombreExamen = data.nombre
      this.varPrecioNormal = data.precio_normal
      this.varPrecioSobrecargo = data.precio_sobrecargo
      this.varTipo = data.tipo_examen
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/equipos/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el equipo ' + me.form.nombre + ' exitosamente'
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
      axios.put(apiUrl + '/equipos/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el equipo ' + me.form.nombre + ' exitosamente'
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
          .put(apiUrl + '/equipos/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el equipo ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-equipo'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/equipos/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el equipo ' + me.form.nombre + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-equipo'].hide()
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
    getDetail (num) {
      axios.get(apiUrl + '/campoLaboratorio/getByExamen', {
        params: {
          id_examenes_almacenados: num
        }
      }).then((response) => {
        this.campos = response.data
      })
    },
    onCreateTest () {
      if (this.varTipo === '' || this.varNombreExamen === '' || this.varPrecioNormal === 0 || this.varPrecioNormal === null || this.varPrecioSobrecargo === 0 || this.varPrecioSobrecargo === null
      ) {
        this.alertErrorText = 'Verifique los datos ingresados'
        this.showAlertError()
      } else {
        let me = this
        axios.post(apiUrl + '/laboratoriosAlmacenados/create',
          {
            nombre: this.varNombreExamen,
            precio_normal: this.varPrecioNormal,
            precio_sobrecargo: this.varPrecioSobrecargo,
            tipo_examen: this.varTipo
          })
          .then((res) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha egresado el paciente ' + me.form.nombreExamen + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-1-createExamen'].hide()
            this.varNombreExamen = ''
            this.varPrecioNormal = 0
            this.varPrecioSobrecargo = 0
            this.varTipo = ''
            this.form.nombreExamen = ''
          }
          )
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    onUpdateTest () {
      if (this.varTipo === '' || this.varNombreExamen === '' || this.varPrecioNormal === 0 || this.varPrecioNormal === null || this.varPrecioSobrecargo === 0 || this.varPrecioSobrecargo === null
      ) {
        this.alertErrorText = 'Verifique los datos ingresados'
        this.showAlertError()
      } else {
        let me = this
        axios.put(apiUrl + '/laboratoriosAlmacenados/update',
          {
            id: this.form.id,
            nombre: this.varNombreExamen,
            precio_normal: this.varPrecioNormal,
            precio_sobrecargo: this.varPrecioSobrecargo,
            tipo_examen: this.varTipo
          })
          .then((res) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha modificado el examen exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-2-update'].hide()
            this.varNombreExamen = ''
            this.varPrecioNormal = 0
            this.varPrecioSobrecargo = 0
            this.varTipo = ''
            this.form.nombreExamen = ''
          }
          )
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    onUpdateAttributes (num) {
      if (this.varNombreCampo === '') {
        this.varNombreCampo = num.nombre
      }
      if (this.varValorMaximo === 0 || this.varValorMaximo === null) {
        this.varValorMaximo = num.valor_maximo
      }
      if (this.varValorMinimo === 0 || this.valor_minimo === null) {
        this.varValorMinimo = num.valor_minimo
      }
      if (this.varUnidades === '') {
        this.varUnidades = num.unidades
      }
      axios.put(apiUrl + '/campoLaboratorio/update', {
        id: num.id,
        nombre: this.varNombreCampo,
        valor_maximo: this.varValorMaximo,
        valor_minimo: this.varValorMinimo,
        unidades: this.varUnidades
      })
        .then((res) => {
          this.getDetail(num.id_examenes_almacenados)
          this.alertVariant = 'info'
          this.showAlertError()
          this.alertErrorText = 'Se ha modificado el campo ' + this.varNombreCampo + ' exitosamente'
          this.$refs.table_campos.refresh()
          // this.$refs['modal-1-createExamen'].hide()
          this.varNombreCampo = ''
          this.varValorMaximo = 0
          this.varValorMinimo = 0
          this.varUnidades = ''
        }
        )
        .catch((error) => {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    onNewAttribute () {
      if (this.varNombreCampo === '' || this.varValorMaximo === 0 || this.varValorMaximo === null || this.varValorMinimo === 0 || this.valor_minimo === null || this.varUnidades === '') {
        this.alertErrorText = 'Verifique los datos ingresados'
        this.showAlertError()
      } else {
        axios.post(apiUrl + '/campoLaboratorio/create', {
          id_examenes_almacenados: this.form.id,
          nombre: this.varNombreCampo,
          valor_maximo: this.varValorMaximo,
          valor_minimo: this.varValorMinimo,
          unidades: this.varUnidades
        })
          .then((res) => {
            this.getDetail(this.form.id)
            this.alertVariant = 'info'
            this.alertText = 'Se ha añadido el campo ' + this.varNombreCampo + ' exitosamente'
            this.showAlert()
            this.$refs.table_campos.refresh()
            this.varNombreCampo = ''
            this.varValorMaximo = 0
            this.varValorMinimo = 0
            this.varUnidades = ''
          }
          )
          .catch((error) => {
            this.alertVariant = 'danger'
            this.showAlertError()
            this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    }
  }
}
</script>

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
        <b-form-group label="Precio ordinario:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioNormal"
            placeholder="Ingresar Precio ordinario"
          ></b-form-input>
          <div v-if="varPrecioNormal === 0 || varPrecioNormal === null" class="invalid-feedback">
            Debe ingresar el Precio ordinario
          </div>
        </b-form-group>
        <b-form-group label="Precio costo:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioCosto"
            placeholder="Ingresar Precio ordinario"
          ></b-form-input>
          <div v-if="varPrecioCosto === 0 || varPrecioCosto === null" class="invalid-feedback">
            Debe ingresar el Precio costo
          </div>
        </b-form-group>
        <b-form-group label="Precio extraordinario:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioSobrecargo"
            placeholder="Ingresar Precio extraordinario"
          ></b-form-input>
          <div v-if="varPrecioSobrecargo === 0 || varPrecioSobrecargo === null" class="invalid-feedback">
            Debe ingresar el Precio extraordinario
          </div>
        </b-form-group>
      </b-form>
      <b-form-group label="Tipo de examen:">
          <v-select
            name="tipo"
            v-model="varTipo"
            :options="tipos"
            :filterable="false"
            placeholder="Ingresar tipo del examen"
          >
            <template v-slot:option="option">
              {{ option.nombre }}
            </template>
            <template v-slot:selected-option="option">
              {{ option.nombre }}
            </template>
          </v-select>
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
        <b-form-group label="Precio ordinario:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioNormal"
            placeholder="Ingresar Precio ordinario"
          ></b-form-input>
          <div v-if="varPrecioNormal === 0 || varPrecioNormal === null" class="invalid-feedback">
            Debe ingresar el Precio ordinario
          </div>
        </b-form-group>
        <b-form-group label="Precio costo:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioCosto"
            placeholder="Ingresar Precio ordinario"
          ></b-form-input>
          <div v-if="varPrecioCosto === 0 || varPrecioCosto === null" class="invalid-feedback">
            Debe ingresar el Precio costo
          </div>
        </b-form-group>
        <b-form-group label="Precio extraordinario:">
          <b-form-input
            type="number"
            v-model.trim="varPrecioSobrecargo"
            placeholder="Ingresar Precio extraordinario"
          ></b-form-input>
          <div v-if="varPrecioSobrecargo === 0 || varPrecioSobrecargo === null" class="invalid-feedback">
            Debe ingresar el Precio extraordinario
          </div>
        </b-form-group>
      </b-form>
      <b-form-group label="Tipo de examen:">
          <v-select
            name="tipo"
            v-model="varTipo"
            :options="tipos"
            :filterable="false"
            placeholder="Ingresar tipo del examen"
          >
            <template v-slot:option="option">
              {{ option.nombre }}
            </template>
            <template v-slot:selected-option="option">
              {{ option.nombre }}
            </template>
          </v-select>
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
          <b-button size="sm" @click="()=>{
            setDataAttribute(row.item)
            row.toggleDetails()
          }
            " class="mr-2" @close="clearDataAttribute()">
            Editar
          </b-button>
        </template>

        <template #row-details="row">
          <b-card
            >
            <b-form @submit="$event.preventDefault()">
              <b-form-group label="Nombre:">
                <b-form-input
                  v-model.trim="varNombreCampoEdit"
                  :placeholder= row.item.nombre
                  default
                ></b-form-input>
                <div v-if="varNombreCampoEdit === ''" class="invalid-feedback">
                Debe ingresar el nombre
                </div>
              </b-form-group>
              <b-form-group label="valor de referencia mínimo:">
                <b-form-input
                  type="number"
                  v-model.trim="varValorMinimoEdit"
                  :placeholder=row.itemvalor_minimo
                ></b-form-input>
                <div v-if="varValorMinimoEdit < 0 || varValorMinimoEdit === null" class="invalid-feedback">
                  Debe ingresar el valor de referencia mínimo
                </div>
              </b-form-group>
              <b-form-group label="valor de referencia máximo:">
                <b-form-input
                  type="number"
                  v-model.trim="varValorMaximoEdit"
                  :placeholder=row.item.valor_maximo
                ></b-form-input>
                <div v-if="varValorMaximoEdit === 0 || varValorMaximoEdit === null" class="invalid-feedback">
                  Debe ingresar el valor de referencia máximo
                </div>
              </b-form-group>
            </b-form>
            <b-form-group label="Unidades:">
                <b-form-input
                  v-model.trim="varUnidadesEdit"
                  :placeholder=row.item.unidades
                ></b-form-input>
                <div v-if="varUnidadesEdit === ''" class="invalid-feedback">
                  Debe ingresar las unidades
                </div>
              </b-form-group>
              <b-button variant="primary" @click="onUpdateAttributes(row.item)">Guardar</b-button>
              <b-button variant="danger" @click="()=>{
                clearDataAttribute()
                row.toggleDetails()
              }
              ">Cancelar</b-button
          >
            </b-card>
        </template>
      </b-table>
      <b-card ref="newAttributeCard">
        AGREGAR CAMPO
        <b-form @submit="$event.preventDefault()">
          <b-form-group label="Nombre:">
            <b-form-input
              ref="input1"
              v-model="varNombreCampo"
              placeholder= "Ingresar nombre"
              default
            ></b-form-input>
            <div v-if="varNombreCampo === ''" class="invalid-feedback">
            Debe ingresar el nombre
            </div>
          </b-form-group>
          <b-form-group label="valor de referencia mínimo:">
            <b-form-input
              ref="input2"
              type="number"
              v-model="varValorMinimo"
              placeholder="Ingresar valor de referencia mínimo"
            ></b-form-input>
            <div v-if="varValorMinimo === 0 || varValorMinimo === null" class="invalid-feedback">
              Debe ingresar el valor de referencia mínimo
            </div>
          </b-form-group>
          <b-form-group label="valor de referencia máximo:">
            <b-form-input
              ref="input3"
              type="number"
              v-model="varValorMaximo"
              placeholder="Ingresar valor de referencia máximo"
            ></b-form-input>
            <div v-if="varValorMaximo === 0 || varValorMaximo === null" class="invalid-feedback">
              Debe ingresar el valor de referencia máximo
            </div>
          </b-form-group>
        </b-form>
        <b-form-group label="Unidades:">
            <b-form-input
              ref="input4"
              v-model="varUnidades"
              placeholder="Ingresar unidades"
            ></b-form-input>
            <div v-if="varUnidades === ''" class="invalid-feedback">
              Debe ingresar las unidades
            </div>
          </b-form-group>
          <b-button variant="primary" @click="onNewAttribute()">Guardar</b-button>
          <b-button variant="danger" @click="this.$refs['modal-5-campos'].hide()">Cancelar</b-button>
          <b-button @click="clearDataAttribute">Limpiar</b-button>
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
                <div class="button-container">
                  <b-button
                    @click="setDataEdit(props.rowData)"
                    v-b-modal.modal-2-updateExamen
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Actualizar examen</b-button>

                  <b-button
                    @click="setData(props.rowData)"
                    v-b-modal.modal-5-campos
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Verificar campos</b-button>
                </div>
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
    this.getTipos()
  },
  data () {
    return {
      varTipo: '',
      varPrecioSobrecargo: 0,
      varPrecioNormal: 0,
      varPrecioCosto: 0,
      varNombreExamen: '',
      varNombreCampo: '',
      varValorMaximo: 0,
      varValorMinimo: 0,
      varUnidades: '',
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      campos: [],
      tipos: [],
      fieldsCampos: [
        {
          key: 'nombre',
          label: 'Campo',
          sortable: true
        },
        {
          key: 'valor_minimo',
          label: 'Valor de Referencia Mínimo',
          sortable: true
        },
        {
          key: 'valor_maximo',
          label: 'Valor de Referencia Máximo',
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
          title: 'Precio ordinario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_sobrecargo',
          sortField: 'precio_sobrecargo',
          title: 'Precio extraordinario',
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
          this.form.precio_costo = 0
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
          this.form.precio_costo = 0
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
          this.form.precio_costo = 0
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
    setDataAttribute (data) {
      this.varNombreCampoEdit = data.nombre
      this.varValorMaximoEdit = data.valor_maximo
      this.varValorMinimoEdit = data.valor_minimo
      this.varUnidadesEdit = data.unidades
    },
    clearDataAttribute () {
      console.log(this.varNombreCampo)
      console.log('CLEAR')
      this.varNombreCampo = ''
      this.varValorMaximo = 0
      this.varValorMinimo = 0
      this.varUnidades = ''
      /* this.$refs['input3'].value = 0
      this.$refs['input4'].value = ' ' */
      console.log(this.varNombreCampo)
    },
    setDataEdit (data) {
      this.form.id = data.id
      this.form.nombreExamen = data.nombre
      this.varNombreExamen = data.nombre
      this.varPrecioNormal = data.precio_normal
      this.varPrecioCosto = data.precio_costo
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
      if (this.varTipo === '' || this.varNombreExamen === '' || this.varPrecioNormal === 0 || this.varPrecioNormal === null || this.varPrecioCosto === 0 || this.varPrecioCosto === null || this.varPrecioSobrecargo === 0 || this.varPrecioSobrecargo === null
      ) {
        this.alertErrorText = 'Verifique los datos ingresados'
        this.showAlertError()
      } else {
        let me = this
        axios.post(apiUrl + '/laboratoriosAlmacenados/create',
          {
            nombre: this.varNombreExamen,
            precio_normal: this.varPrecioNormal,
            precio_costo: this.varPrecioCosto,
            precio_sobrecargo: this.varPrecioSobrecargo,
            tipo_examen: this.varTipo.nombre
          })
          .then((res) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha egresado el paciente ' + me.form.nombreExamen + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-1-createExamen'].hide()
            this.varNombreExamen = ''
            this.varPrecioNormal = 0
            this.varPrecioCosto = 0
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
      if (this.varTipo === '' || this.varNombreExamen === '' || this.varPrecioNormal === 0 || this.varPrecioNormal === null || this.varPrecioCosto === 0 || this.varPrecioCosto === null || this.varPrecioSobrecargo === 0 || this.varPrecioSobrecargo === null
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
            precio_costo: this.varPrecioCosto,
            precio_sobrecargo: this.varPrecioSobrecargo,
            tipo_examen: this.varTipo.nombre
          })
          .then((res) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha modificado el examen exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-2-update'].hide()
            this.varNombreExamen = ''
            this.varPrecioNormal = 0
            this.varPrecioCosto = 0
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
      if (this.varNombreCampoEdit === '') {
        this.varNombreCampoEdit = num.nombre
      }
      if (this.varValorMaximoEdit === 0 || this.varValorMaximoEdit === null) {
        this.varValorMaximoEdit = num.valor_maximo
      }
      if (this.varValorMinimoEdit === 0 || this.varValorMinimoEdit === null) {
        this.varValorMinimoEdit = num.valor_minimo
      }
      if (this.varUnidadesEdit === '') {
        this.varUnidadesEdit = num.unidades
      }
      axios.put(apiUrl + '/campoLaboratorio/update', {
        id: num.id,
        nombre: this.varNombreCampoEdit,
        valor_maximo: this.varValorMaximoEdit,
        valor_minimo: this.varValorMinimoEdit,
        unidades: this.varUnidadesEdit
      })
        .then((res) => {
          this.getDetail(num.id_examenes_almacenados)
          this.alertVariant = 'info'
          this.showAlertError()
          this.alertErrorText = 'Se ha modificado el campo ' + this.varNombreCampoEdit + ' exitosamente'
          this.$refs.table_campos.refresh()
          // this.$refs['modal-1-createExamen'].hide()
          this.varNombreCampoEdit = ''
          this.varValorMaximoEdit = 0
          this.varValorMinimoEdit = 0
          this.varUnidadesEdit = ''
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
      if (this.varNombreCampo === '' || this.varValorMaximo === 0 || this.varValorMaximo === null || this.varValorMinimo < 0 || this.valor_minimo === null || this.varUnidades === '') {
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
            this.varNombreCampo = ''
          }
          )
          .catch((error) => {
            this.alertVariant = 'danger'
            this.showAlertError()
            this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    async getTipos () {
      await axios.get(apiUrl + '/tipos_examenes/get')
        .then((response) => {
          this.tipos = response.data.slice()
        })
    }
  }
}
</script>

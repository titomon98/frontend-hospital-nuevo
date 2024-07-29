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
    <b-modal id="modal_agregar" size="xl" ref="modal_agregar" title="Ingresar nuevo examen">
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
          <b-col md="6">
            <b-form-group label="Nombre:">
              <b-form-input
                v-model.trim="$v.form.nombre.$model"
                :state="!$v.form.nombre.$error"
                placeholder="Ingresar nombre paciente"
              ></b-form-input>
              <div v-if="$v.form.nombre.required.$invalid" class="invalid-feedback">
                Debe ingresar el nombre
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="CUI:">
              <b-form-input
                v-model.trim="$v.form.cui.$model"
                :state="!$v.form.cui.$error"
                placeholder="Ingresar CUI paciente"
              ></b-form-input>
              <div v-if="$v.form.cui.required.$invalid" class="invalid-feedback">
                Debe ingresar el CUI
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Comisión:">
              <b-form-input
                v-model.trim="$v.form.comision.$model"
                :state="!$v.form.comision.$error"
                placeholder="Ingresar Comisión"
              ></b-form-input>
              <div v-if="$v.form.comision.required.$invalid" class="invalid-feedback">
                Debe ingresar Comisión
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Total:">
              <b-form-input
                v-model.trim="$v.form.total.$model"
                :state="!$v.form.total.$error"
                placeholder="Ingresar el total"
              ></b-form-input>
              <div v-if="$v.form.total.required.$invalid" class="invalid-feedback">
                Debe ingresar el total
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Correo Electronico:">
              <b-form-input
                v-model.trim="$v.form.correo.$model"
                :state="!$v.form.correo.$error"
                placeholder="Debe ingresar el correo electronico"
              ></b-form-input>
              <div v-if="$v.form.correo.required.$invalid" class="invalid-feedback">
                Debe ingresar el correo electronico
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="Número Celular:">
              <b-form-input
                v-model.trim="$v.form.whatsapp.$model"
                :state="!$v.form.whatsapp.$error"
                placeholder="Ingresar el numero de celular"
              ></b-form-input>
              <div v-if="$v.form.whatsapp.required.$invalid" class="invalid-feedback">
                Debe ingresar el numero de celular
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Numero Muestra:">
              <b-form-input
                v-model.trim="$v.form.numero_muestra.$model"
                :state="!$v.form.numero_muestra.$error"
                placeholder="Ingresar el numero de muestra"
              ></b-form-input>
              <div v-if="$v.form.numero_muestra.required.$invalid" class="invalid-feedback">
                Debe ingresar el numero de muestra
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Referido:">
              <b-form-input
                v-model.trim="$v.form.referido.$model"
                :state="!$v.form.referido.$error"
                placeholder="Ingresar Rerido"
              ></b-form-input>
              <div v-if="$v.form.referido.required.$invalid" class="invalid-feedback">
                Ingresar Rerido
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Pagado:">
              <b-form-input
                v-model.trim="$v.form.pagado.$model"
                :state="!$v.form.pagado.$error"
                placeholder="Ingresar Lo pagado"
              ></b-form-input>
              <div v-if="$v.form.pagado.required.$invalid" class="invalid-feedback">
                Ingresar Pagado
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Por pagar:">
              <b-form-input
                v-model.trim="$v.form.por_pagar.$model"
                :state="!$v.form.por_pagar.$error"
                placeholder="Ingresar Lo que esta por pagar"
              ></b-form-input>
              <div v-if="$v.form.por_pagar.required.$invalid" class="invalid-feedback">
                Ingrese lo que esta por pagar
              </div>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="4">
            <b-form-group label="Encargado:">
              <v-select
                name="type"
                v-model="form.id_encargado"
                :options="encargados"
                :filterable="false"
                placeholder="Seleccione un encargado"
                @search="onSearchEncargado"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>
                <template v-slot:option="option">
                  {{ 'Nombre: '+ option.nombres }}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{ 'Nombre: '+ option.nombres }}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="4">
            <b-form-group label="Tipo de Examen:">
              <v-select
                name="type"
                v-model="form.id_examenes_almacenados"
                :options="examenes_almacenados"
                :filterable="false"
                placeholder="Seleccione el Examen"
                @search="onSearch_id_examenes_almacenados"
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
    <b-modal id="modal-add-resultados" size="lg" ref="modal-add-resultados" title="Agregar Resultados">
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
          <b-col md="6">
            <b-form-group label="Tipo Examen">
              <v-select
                name="type"
                v-model="formResultado.tipo"
                :options="tipo_examenes"
                :filterable="false"
                placeholder="Seleccione el Examen"
                @search="onSearch_tipoExamen"
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
            </b-form-group>
          </b-col>
        </b-row>
            <b-form-group label="Resultado:">
              <quill-editor
              v-model="formResultado.resultado"
              :options="editorOptions"
              class="custom-editor">
            </quill-editor>
            </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidateResultado('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('resultado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-ver-resultados" ref="modal-ver-resultados" title="Ver Resultados">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <vuetable
          ref="vuetableResultados"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseResultado"
          :query-params="makeQueryParamsResultado"
          :per-page="perPageResultado"
          :reactive-api-url="true"
          :fields="fieldsResultado"
          pagination-path
          @vuetable:pagination-data="onPaginationDataResultado"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar PDF'"
                @click="voucherData(props.rowData)"
                class="mb-2"
                size="sm"
                variant="outline-info"
                ><i :class="'fas fa-money-bill'"
              /></b-button>
            </b-button-group>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationResultado"
          @vuetable-pagination:change-page="onChangePageResultado"
        />
      <template #modal-footer="{}">
        <b-button variant="danger" @click="closeModal('ver-resultado')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">EXAMENES REALIZADOS</h3>
            </div>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal_agregar>AGREGAR NUEVO</b-button>
          </template>
          <template v-slot:body>
            <div class="row mb-3">
              <div class="col-md-4">
                <b-form-group label="Fecha Desde:">
                  <b-form-input type="date" v-model="fechaDesde"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Fecha Hasta:">
                  <b-form-input type="date" v-model="fechaHasta"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-button variant="primary" @click="realizarBusqueda">Buscar</b-button>
              </div>
            </div>
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
                <div class="button-container">
                  <b-button
                    @click="addResultado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar resultado</b-button>

                  <b-button
                    @click="verResultado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver resultado</b-button>

                  <b-button
                    @click="anular(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="danger"
                  >Anular Examen</b-button>
                </div>
              </b-button-group>
              </template>
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
import IqCard from '../../../components/xray/cards/iq-card'
import { apiUrl } from '../../../config/constant'
import moment from 'moment'
import DatatableHeading from '../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap'
import axios from 'axios'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Examenes',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    IqCard,
    quillEditor
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  data: () => {
    return {

      editorOptions: {
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Escribir contenido del resultado',
        theme: 'snow'
      },

      tipo_examenes: [],
      formResultado: {
        id: null,
        tipo: '',
        resultado: null
      },
      id_ver_Resultado: null,
      fromResultado: 0,
      toResultado: 0,
      totalResultado: 0,
      perPageResultado: 5,
      searchResultado: '',
      fechaDesdeResultado: null,
      fechaHastaResultado: null,
      apiBaseResultado: '',
      fieldsResultado: [
        {
          name: 'tipo',
          sortField: 'tipo',
          title: 'TIPO EXAMEN',
          dataClass: 'list-item-heading'
        },
        {
          name: 'resultados',
          sortField: 'resultado',
          title: 'RESULTADO EXAMEN',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_hora',
          sortField: 'fecha_hora',
          title: 'Fecha y Hora',
          dataClass: 'list-item-heading'
        }
      ],

      examenes_almacenados: [],
      encargados: [],
      anularExamen: 3,
      form: {
        id: 0,
        nombre: '',
        cui: 0,
        comision: '',
        total: 0,
        correo: '',
        whatsapp: '',
        numero_muestra: 0,
        existencia_actual: 0,
        referido: '',
        id_encargado: null,
        pagado: 0,
        por_pagar: 0,
        id_examenes_almacenados: null
      },

      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',

      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      fechaDesde: null,
      fechaHasta: null,
      apiBase: apiUrl + '/Examenes_realizados/list',
      slickOptions: {
        centerMode: false,
        centerPadding: '60px',
        slidesToShow: 5,
        slidesToScroll: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '30',
            slidesToShow: 3
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '15',
            slidesToShow: 1
          }
        }]
      },
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
          name: 'cui',
          sortField: 'cui',
          title: 'CUI',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total a Pagar',
          dataClass: 'list-item-heading'
        },
        {
          name: 'whatsapp',
          sortField: 'whatsapp',
          title: 'Celular',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero_muestra',
          sortField: 'numero_muestra',
          title: 'Numero de Muestra',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_encargago',
          sortField: 'nombre_encargago',
          title: 'Nombre de Encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'pagado',
          sortField: 'pagado',
          title: 'Pagado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'por_pagar',
          sortField: 'por_pagar',
          title: 'Por Pagar',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_examen',
          sortField: 'nombre_examen',
          title: 'Examen Realizado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_hora',
          sortField: 'fecha_hora',
          title: 'Fecha y Hora',
          dataClass: 'list-item-heading'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        nombre: { required },
        cui: { required },
        comision: { required },
        total: { required },
        correo: { required },
        whatsapp: { required },
        numero_muestra: { required },
        referido: { required },
        pagado: { required },
        por_pagar: { required }
      }
    }
  },
  methods: {
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal_agregar'].hide()
          this.form.id = 0
          this.form.nombre = ''
          this.form.cui = 0
          this.form.comision = ''
          this.form.total = 0
          this.form.correo = ''
          this.form.whatsapp = ''
          this.form.numero_muestra = ''
          this.form.existencia_actual = 0
          this.form.referido = ''
          this.form.id_encargago = null
          this.form.pagado = 0
          this.form.por_pagar = 0
          this.form.id_examenes_almacenados = null
          break
        }
        case 'resultado': {
          this.$v.$reset()
          this.$refs['modal-add-resultados'].hide()
          this.formResultado.id = null
          this.formResultado.tipo = ''
          this.formResultado.resultado = null
          break
        }
        case 'ver-resultado': {
          this.$refs['modal-ver-resultados'].hide()
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
    onValidateResultado (action) {
      if (this.formResultado.resultado != null) {
        console.log(this.formResultado)
        if (action === 'save') {
          this.onSaveResultado()
        } else if (action === 'update') {
          this.onUpdate()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    /* ACTUALIZAR ESTADO */
    anular (id) {
      const me = this
      console.log(id)
      const ruta = apiUrl + `/Examenes_realizados/update?id=${id}`
      axios.put(ruta, {
        form: me.anularExamen
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha ANULADO el examen'
          me.$refs.vuetable.refresh()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* FIN ACTUALIZAR ESTADO */
    /* GUARDAR */
    addResultado (id) {
      this.$refs['modal-add-resultados'].show()
      console.log(id)
      this.formResultado.id = id
    },
    onSaveResultado () {
      const me = this
      axios.post(apiUrl + '/detalleExamenRealizado/create', {
        form: me.formResultado })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ingresado el resultado del examen' + me.formResultado.tipo + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('resultado')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    onSave () {
      const me = this
      axios.post(apiUrl + '/Examenes_realizados/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ingresado al pasciente ' + me.form.nombre + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
          this.$refs.vuetable.refresh()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    onSearch_tipoExamen (search, loading) {
      if (search.length) {
        loading(true)
        this.searching_tipoExamen(search, loading)
      }
    },
    searching_tipoExamen (search, loading) {
      axios.get(apiUrl + '/TipoExamenAlmacenado/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.tipo_examenes = response.data
        loading(false)
      })
    },
    onSearch_id_examenes_almacenados (search, loading) {
      if (search.length) {
        loading(true)
        this.searching_id_examenes_almacenados(search, loading)
      }
    },
    searching_id_examenes_almacenados (search, loading) {
      axios.get(apiUrl + '/examenesAlmacenados/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.examenes_almacenados = response.data
        loading(false)
      })
    },
    onSearchEncargado (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingEncargado(search, loading)
      }
    },
    searchingEncargado (search, loading) {
      axios.get(apiUrl + '/encargadoExamen/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.encargados = response.data
        loading(false)
      })
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    realizarBusqueda () {
      this.$refs.vuetable.refresh()
      this.fechaDesde = null
      this.fechaHasta = null
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
        order: sortOrder[0] ? sortOrder[0].direction : 'desc',
        page: currentPage,
        limit: this.perPage,
        search: this.search,
        fechaDesde: this.fechaDesde ? moment(this.fechaDesde).format('YYYY-MM-DD') : null,
        fechaHasta: this.fechaHasta ? moment(this.fechaHasta).format('YYYY-MM-DD') : null
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
      this.items = paginationData.data.map(item => {
        item.fecha_hora = moment(item.fecha_hora).format('DD/MM/YYYY HH:mm')
        return {
          id: item.id,
          nombre: item.expediente,
          cui: item.cui,
          total: item.total,
          whatsapp: item.whatsapp,
          numero_muestra: item.numero_muestra,
          nombre_encargago: item.nombre_encargago,
          pagado: item.pagado,
          por_pagar: item.por_pagar,
          nombre_examen: item.nombre_examen,
          fecha_hora: item.fecha_hora
        }
      })
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },

    verResultado (id) {
      this.$refs['modal-ver-resultados'].show()
      console.log(id)
      this.apiBaseResultado = apiUrl + `/detalleExamenRealizado/list?id=${id}`
    },
    realizarBusquedaResultado () {
      this.$refs.vuetableResultado.refresh()
      this.fechaDesdeResultado = null
      this.fechaHastaResultado = null
    },
    makeQueryParamsResultado (sortOrderResultado, currentPageResultado, perPageResultado) {
      return {
        criterio: sortOrderResultado[0] ? sortOrderResultado[0].sortField : 'createdAt',
        order: sortOrderResultado[0] ? sortOrderResultado[0].direction : 'desc',
        page: currentPageResultado,
        limit: this.perPageResultado,
        search: this.searchResultado,
        fechaDesdeResultado: this.fechaDesdeResultado ? moment(this.fechaDesdeResultado).format('YYYY-MM-DD') : null,
        fechaHastaResultado: this.fechaHastaResultado ? moment(this.fechaHastaResultado).format('YYYY-MM-DD') : null
      }
    },
    changePageSizesResultado (perPage) {
      this.perPageResultado = perPage
      this.$refs.vuetableResultado.refresh()
    },
    searchChangeResultado (val) {
      this.searchResultado = val.toLowerCase()
      this.$refs.vuetableResultado.refresh()
    },
    onPaginationDataResultado (paginationData) {
      this.fromResultado = paginationData.from
      this.toResultado = paginationData.to
      this.totalResultado = paginationData.total
      this.lastPageResultado = paginationData.last_page
      this.itemsResultado = paginationData.data.map(item => {
        item.fecha_hora = moment(item.fecha_hora).format('DD/MM/YYYY HH:mm')
        return {
          resultados: item.resultados,
          tipo: item.tipo,
          fecha_hora: item.fecha_hora
        }
      })
      this.$refs.paginationResultado.setPaginationData(paginationData)
    },
    onChangePageResultado (page) {
      this.$refs.vuetableResultado.changePage(page)
    }
  }
}
</script>
<style>
.iq-card-body{
flex: unset;
}
.center-text {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%; /* Adjust this if needed */
  text-align: center;
}
.table {
width: 100%;
border-collapse: collapse;
}
/* Estilo para las celdas de encabezado */
.table th {
background-color: #f0f0f0; /* Color de fondo claro */
text-align: center;
padding: 10px;
border: 1px solid #ddd; /* Borde sutil */
}
/* Estilo para las celdas de datos */
.table td {
text-align: center;
padding: 8px;
border: 1px solid #ddd;
}
/* Estilo para filas alternas */
.table tr:nth-child(even) {
background-color: #f9f9f9; /* Color de fondo más claro para filas alternas */
}

.custom-editor {
  height: 350px; /* Adjust the height as needed */
}
.custom-editor .ql-editor {
  color: #333; /* Adjust the color value to make the text darker */
}

</style>

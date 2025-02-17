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
          <b-col md="4">
            <div style="text-align: left;">
              <h3 class="card-title">DATOS DEL PACIENTE</h3>
            </div>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="6">
            <b-form-group label="Nombre Paciente">
              <v-select
                name="type"
                v-model="selectedExpediente"
                :options="expedientesExamenes"
                :filterable="false"
                placeholder="Seleccione o Ingrese al Paciente"
                @search="onSearch_expediente"
              >
                <template v-slot:spinner="{ loading }">
                  <div v-show="loading">Cargando...</div>
                </template>

                <template v-slot:option="option">
                  {{ 'Nombre: ' + option.nombres + ', ' + (option.apellidos || '') + ' CUI: ' + option.cui }}
                </template>

                <template slot="selected-option" slot-scope="option">
                  {{ option.nombres + ' ' + (option.apellidos || '') }}
                </template>
              </v-select>
              <b-form-text>
                Ingrese el nombre y apellido separados por una coma (e.g., JUAN, PEREZ)
              </b-form-text>
            </b-form-group>
          </b-col>
          <b-col md="5">
            <b-form-checkbox
            v-model.trim="form.examenExterior"
              class="custom-checkbox"
              unchecked-value="false"
              checked-value="true"
            >
              Examen de laboratorio externo
            </b-form-checkbox>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="CUI:">
              <b-form-input
                v-model.trim="form.cui"
                placeholder="Ingresar CUI paciente"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Edad:">
              <b-form-input
                v-model.trim="$v.form.edad.$model"
                :state="!$v.form.edad.$error"
                placeholder="Ingresar la edad del paciente"
                type="number"
              ></b-form-input>
              <div v-if="$v.form.edad.required.$invalid" class="invalid-feedback">
                Debe ingresar la edad del paciente
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Nombre del medico:">
              <v-select
                name="medico"
                v-model="form.comision"
                :options="medicos"
                :filterable="false"
                placeholder="Seleccione el médico"
                @search="onSearchDatosMedicos"
              >
                <template v-slot:option="option">
                  {{ option.nombre}}
                </template>
                <template slot="selected-option" slot-scope="option">
                  {{option.nombre}}
                </template>
              </v-select>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Total:">
              <b-form-input
                disabled
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
                v-model.trim="form.correo"
                placeholder="Debe ingresar el correo electronico"
              ></b-form-input>
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
                type="number"
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
                type="number"
              ></b-form-input>
              <div v-if="$v.form.numero_muestra.required.$invalid" class="invalid-feedback">
                Debe ingresar el numero de muestra
              </div>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="Referido:">
              <b-form-input
                v-model="form.referido"
                placeholder="Ingresar Referido"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="3">
            <b-form-group label="Nombre para Factura:">
              <b-form-input
                v-model.trim="form.factura"
                placeholder="Debe ingresar el nombre para facturar"
              ></b-form-input>
            </b-form-group>
          </b-col>
          <b-col md="3">
            <b-form-group label="NIT">
              <b-form-input
                v-model.trim="form.nit"
                placeholder="Ingresar el NIT para factura"
              ></b-form-input>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="7">
            <div style="text-align: left;">
              <h3 class="card-title">SELECCIONAR EXAMEN/ES A REALIZAR</h3>
            </div>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="12">
            <b-form-group label="Tipo de Examen:">
              <div v-if="isLoading">
                <p>Cargando...</p>
              </div>
              <Multiselect
                v-model="selectedExamenes"
                :options="examenes_almacenadosBuscar"
                :multiple="true"
                :close-on-select="false"
                :clear-on-select="false"
                :preserve-search="true"
                placeholder="Seleccionar exámenes"
                label="nombre"
                track-by="id"
                @search-change="onSearch_id_examenes_almacenados"
                :pagination="true"
                :page="currentPageExa"
                @page-change="onPageChangeExa"
              >
                <!-- Personalización de las opciones mientras el usuario busca -->
                <template v-slot:option="{ option }">
                  <div class="custom-option">
                    <strong>{{ option.nombre }}</strong> --
                    <small>Precio normal: Q{{ option.precio_normal }}</small> |
                    <small>Extraordinario: Q{{ option.precio_sobrecargo }}</small>
                  </div>
                </template>

                <!-- Personalización de cómo se muestran los seleccionados -->
                <template v-slot:selection="{ values, search, isOpen }">
                  <span class="multiselect__single" v-if="values.length && !isOpen">
                    {{ values.length }} exámenes seleccionados
                  </span>
                </template>
              </Multiselect>

              <!-- Mostrar la lista de exámenes seleccionados -->
              <div>
                <ul class="selected-options-list" v-if="selectedExamenes.length > 0">
                  <li v-for="(examen, index) in selectedExamenes" :key="examen.id">
                    {{ index + 1 }}. {{ examen.nombre }} - Precio normal: {{ examen.precio_normal }} - Precio extraordinario: {{ examen.precio_sobrecargo }}
                  </li>
                </ul>
              </div>
            </b-form-group>
          </b-col>
        </b-row>
      </b-form>
      <template #modal-footer="{}">

        <div class="ml-auto"> <span class="mr-2">Total: Q{{ TotalAPagar }}</span></div>

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
      <b-form @submit.prevent="onSubmit">
        <b-table :items="this.camposResulado" :fields="this.fieldsCampos" striped hover small responsive>
          <template #cell(resultado)="data">
            <b-form-input
              v-model="data.item.resultado"
              type="text"
              placeholder="agregar el resultado"
            ></b-form-input>
          </template>
        </b-table>
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
        <template slot-scope="props">
          <td :style="{ color: this.getColorForAlarma (props.rowData.alarma)}">
            {{ props.rowData.alarma }}
          </td>
        </template>
      </vuetable>

      <vuetable-pagination-bootstrap
        ref="paginationResultado"
        @vuetable-pagination:change-page="onChangePageResultado"
      />

      <template #modal-footer="{}" >
        <b-button variant="danger" @click="closeModal('verresultado')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-anular-examen" title="Confirmar Anulación" @ok="confirmarAnulacion(examenId)">
      <p>¿Está seguro de que desea anular este examen?</p>
    </b-modal>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">AREA DE EXAMENES</h3>
            </div>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal_agregar>AGREGAR NUEVO</b-button>
          </template>
          <template v-slot:body>
            <h4 class="card-title">EXAMENES SOLICITADOS  Y PENDIENTES DE PAGO</h4>
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
                  <!-- <b-button
                    @click="addResultado(props.rowData.id, props.rowData.id_examenes_almacenados)"
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
                    @click="ImprimirResultado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Imprimir Resultado</b-button> -->

                  <b-button
                  @click="mostrarConfirmacionAnulacion(props.rowData.id)"
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
      <b-col sm="12">
        <iq-card>
          <template v-slot:body>
            <h4 class="card-title">EXAMENES PAGADOS Y PENDIENTES DE RESULTADO</h4>
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
              :changePageSize="changePageSizes2"
              :searchChange="searchChange2"
              :from="from2"
              :to="to2"
              :total="total2"
              :perPage="perPage2"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable2"
              class="table-divided order-with-arrow"
              :api-url="apiBase2"
              :query-params="makeQueryParams2"
              :per-page="perPage2"
              :reactive-api-url="true"
              :fields="fields2"
              pagination-path
              @vuetable:pagination-data="onPaginationData2"
            >
            <!-- Botones -->
            <template slot="actions" slot-scope="props">
              <b-button-group>
                <div class="button-container">
                 <b-button
                    @click="addResultado(props.rowData.id, props.rowData.id_examenes_almacenados, props.rowData)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar resultado</b-button>
                </div>
              </b-button-group>
            </template>
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination2"
                @vuetable-pagination:change-page="onChangePage2"
              />
          </template>
        </iq-card>
      </b-col>
      <b-col sm="12">
        <iq-card>
          <template v-slot:body>
            <h4 class="card-title">EXAMENES REALIZADOS (FINALIZADOS)</h4>
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
              :changePageSize="changePageSizes3"
              :searchChange="searchChange3"
              :from="from3"
              :to="to3"
              :total="total3"
              :perPage="perPage3"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable3"
              class="table-divided order-with-arrow"
              :api-url="apiBase3"
              :query-params="makeQueryParams3"
              :per-page="perPage3"
              :reactive-api-url="true"
              :fields="fields3"
              pagination-path
              @vuetable:pagination-data="onPaginationData3"
            >
            <!-- Botones -->
            <template slot="actions" slot-scope="props">
              <b-button-group>
                <div class="button-container">
                  <b-button
                    @click="verResultado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver resultado</b-button>

                  <b-button
                    @click="ImprimirResultado(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Imprimir Resultado</b-button>
                </div>
              </b-button-group>
              </template>
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination3"
                @vuetable-pagination:change-page="onChangePage3"
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
/* import { quillEditor } from 'vue-quill-editor' */
import logo from '../../../../src/assets/images/logoLab.jpg'
import Multiselect from 'vue-multiselect'
import JsPDF from 'jspdf'
export default {
  name: 'Examenes',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    IqCard,
    /* quillEditor */
    Multiselect
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
        id_campo: '',
        id_tipo: '',
        resultado: null,
        alarma: ''
      },
      camposResulado: [],
      campos: [],
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
        { name: 'campo', title: 'Campo de Examen', sortField: 'campo' },
        { name: 'tipo_examen', title: 'Tipo de Examen', sortField: 'tipo_examen' },
        { name: 'resultado', title: 'Resultado', sortField: 'resultado' },
        { name: 'valor_minimo', title: 'Valor Mínimo', sortField: 'valor_minimo' },
        { name: 'valor_maximo', title: 'Valor Máximo', sortField: 'valor_maximo' },
        { name: 'alarma', title: 'Alarma', sortField: 'alarma' },
        { name: 'fecha_hora', title: 'Fecha y Hora', sortField: 'fecha_hora' }
      ],
      fieldsCampos: [
        { key: 'nombre', label: 'Nombre' },
        { key: 'unidades', label: 'Unidades' },
        { key: 'resultado', label: 'Resultado' }
      ],
      isLoading: false,
      examenes_almacenados: [],
      examenes_almacenadosBuscar: [],
      selectedExamenes: [],
      currentPageExa: 1,
      expedientesExamenes: [],
      selectedExpediente: null,
      selectedExamenAlmacenado: null,
      encargados: [],
      medicos: [],
      anularExamen: 3,
      TotalAPagar: 0,
      examenId: null,
      form: {
        id: 0,
        nombre: '',
        apellido: '',
        edad: null,
        cui: 'NO DISPONIBLE',
        comision: '',
        total: 0,
        correo: '',
        whatsapp: '',
        numero_muestra: 0,
        existencia_actual: 0,
        referido: '',
        factura: null,
        nit: null,
        id_encargado: null,
        pagado: 0,
        por_pagar: 0,
        id_examenes_almacenados: null,
        NewExpediente: false,
        examenExterior: false
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
      apiBase2: apiUrl + '/Examenes_realizados/list2',
      apiBase3: apiUrl + '/Examenes_realizados/list3',
      from2: 0,
      to2: 0,
      total2: 0,
      perPage2: 5,
      search2: '',
      from3: 0,
      to3: 0,
      total3: 0,
      perPage3: 5,
      search3: '',
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
          name: 'edad',
          sortField: 'edad',
          title: 'Edad',
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
      ],
      fields2: [
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
          name: 'edad',
          sortField: 'edad',
          title: 'Edad',
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
      ],
      fields3: [
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
          name: 'edad',
          sortField: 'edad',
          title: 'Edad',
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
        edad: { required },
        comision: { required },
        total: { required },
        whatsapp: { required },
        numero_muestra: { required },
        pagado: { required },
        por_pagar: { required }
      }
    }
  },
  watch: {
    selectedExpediente (newValue) {
      if (newValue.cui) {
        this.form.nombre = newValue.nombres + ' ' + newValue.apellidos
        this.form.cui = newValue.cui
        this.form.whatsapp = newValue.telefono
        this.form.id_expediente = newValue.id
      } else {
        const [nombres, apellidos] = newValue.nombres.split(',').map(str => str.trim())
        this.form.nombre = nombres.toUpperCase()
        this.form.apellido = apellidos ? apellidos.toUpperCase() : ''
        this.form.NewExpediente = true

        if (!this.$v.form.nombre.$error) {
          const [nombres, apellidos] = newValue.nombres.split(',').map(str => str.trim())
          this.form.nombre = nombres.toUpperCase()
          this.form.apellido = apellidos ? apellidos.toUpperCase() : ''
          this.form.NewExpediente = true
        }
      }
    },
    selectedExamenes (newValue) {
      if (newValue) {
        this.TotalAPagar = newValue.reduce((total, examen) => parseFloat(total) + parseFloat(examen.precio_normal), 0)
        this.form.total = this.TotalAPagar
        this.form.id_examenes_almacenados = newValue.map(examen => examen.id)
        this.form.por_pagar = this.TotalAPagar
      } else {
        console.log('ERROR AL CARGAR EL TOTAL A PAGAR EN LA FUNCION WATCH')
      }
    }
  },
  methods: {
    getColorForAlarma (alarma) {
      return alarma === 'SI' ? 'text-danger-custom' : 'text-safe'
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal_agregar'].hide()
          this.form.id = 0
          this.form.nombre = ''
          this.form.cui = 0
          this.form.edad = null
          this.form.comision = ''
          this.form.total = 0
          this.form.correo = ''
          this.form.whatsapp = ''
          this.form.numero_muestra = ''
          this.form.existencia_actual = 0
          this.form.referido = ''
          this.form.id_encargado = null
          this.form.pagado = 0
          this.form.por_pagar = 0
          this.form.nit = null
          this.form.factura = null
          this.form.id_examenes_almacenados = null
          this.examenes_almacenados = []
          this.expedientesExamenes = []
          this.selectedExpediente = null
          this.encargados = []
          this.TotalAPagar = 0
          this.isLoading = false
          this.selectedExamenes = []
          this.currentPageExa = 1
          this.examenes_almacenadosBuscar = []
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
        case 'verresultado': {
          this.$v.$reset()
          this.$refs['modal-ver-resultados'].hide()
          break
        }
      }
    },
    mostrarConfirmacionAnulacion (id) {
      this.examenId = id
      this.$bvModal.show('modal-anular-examen')
    },
    confirmarAnulacion (id) {
      this.anular(id)
      this.$bvModal.hide('modal-anular-examen')
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
    /* ACTUALIZAR ESTADO */
    anular (id) {
      const me = this
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

    /* AREA PARA GUARDAR, LISTAR Y VER EXAMENES */
    onSave () {
      const me = this
      axios.post(apiUrl + '/Examenes_realizados/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ingresado al paciente ' + me.form.nombre + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs.vuetable2.refresh()
          me.$refs.vuetable3.refresh()
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

    onSearch_expediente (search, loading) {
      if (search.length) {
        loading(true)
        this.searching_expediente(search, loading)
      }
    },
    searching_expediente (search, loading) {
      axios.get(apiUrl + '/expedientes/getSearcExamenes',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        if (!response.data.some(option => option.nombres + ' ' + option.apellidos === search)) {
          response.data.unshift({ nombres: search })
        }
        this.expedientesExamenes = response.data
        loading(false)
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
      this.isLoading = true
      const params = {
        search: search,
        page: this.currentPageExa,
        perPage: this.$refs.vuetable.perPage
      }

      axios.get(apiUrl + '/examenesAlmacenadosBuscar/getSearch', { params })
        .then((response) => {
          console.log(response.data.data)
          this.examenes_almacenadosBuscar = response.data.data
          this.$refs.vuetableBuscar.setData(response.data)
          this.isLoading = false
        })
        .catch((error) => {
          console.error('Error al buscar exámenes:', error)
          this.isLoading = false
        })
    },
    onPageChangeExa (page) {
      this.currentPageExa = page
      this.onSearch_id_examenes_almacenados('')
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
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'updatedAt',
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
          fecha_hora: item.fecha_hora
        }
      })
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },

    makeQueryParams2 (sortOrder2, currentPage2, perPage2) {
      return {
        criterio: sortOrder2[0] ? sortOrder2[0].sortField : 'updatedAt',
        order: sortOrder2[0] ? sortOrder2[0].direction : 'desc',
        page: currentPage2,
        limit: this.perPage2,
        search: this.search2,
        fechaDesde: this.fechaDesde ? moment(this.fechaDesde).format('YYYY-MM-DD') : null,
        fechaHasta: this.fechaHasta ? moment(this.fechaHasta).format('YYYY-MM-DD') : null
      }
    },
    changePageSizes2 (perPage) {
      this.perPage2 = perPage
      this.$refs.vuetable2.refresh()
    },
    searchChange2 (val) {
      this.search2 = val.toLowerCase()
      this.$refs.vuetable2.refresh()
    },
    onPaginationData2 (paginationData) {
      this.from2 = paginationData.from
      this.to2 = paginationData.to
      this.total2 = paginationData.total
      this.lastPage2 = paginationData.last_page
      this.items2 = paginationData.data.map(item => {
        item.fecha_hora = moment(item.fecha_hora).format('DD/MM/YYYY HH:mm')
        return {
          fecha_hora: item.fecha_hora
        }
      })
      this.$refs.pagination2.setPaginationData(paginationData)
    },
    onChangePage2 (page) {
      this.$refs.vuetable2.changePage(page)
    },
    makeQueryParams3 (sortOrder3, currentPage3, perPage3) {
      return {
        criterio: sortOrder3[0] ? sortOrder3[0].sortField : 'updatedAt',
        order: sortOrder3[0] ? sortOrder3[0].direction : 'desc',
        page: currentPage3,
        limit: this.perPage3,
        search: this.search3,
        fechaDesde: this.fechaDesde ? moment(this.fechaDesde).format('YYYY-MM-DD') : null,
        fechaHasta: this.fechaHasta ? moment(this.fechaHasta).format('YYYY-MM-DD') : null
      }
    },
    changePageSizes3 (perPage) {
      this.perPage3 = perPage
      this.$refs.vuetable3.refresh()
    },
    searchChange3 (val) {
      this.search3 = val.toLowerCase()
      this.$refs.vuetable3.refresh()
    },
    onPaginationData3 (paginationData) {
      this.from3 = paginationData.from
      this.to3 = paginationData.to
      this.total3 = paginationData.total
      this.lastPage3 = paginationData.last_page
      this.items3 = paginationData.data.map(item => {
        item.fecha_hora = moment(item.fecha_hora).format('DD/MM/YYYY HH:mm')
        return {
          fecha_hora: item.fecha_hora
        }
      })
      this.$refs.pagination3.setPaginationData(paginationData)
    },
    onChangePage3 (page) {
      this.$refs.vuetable3.changePage(page)
    },

    /* AREA PARA AGREGAR, VER E IMPRIMIR RESULTADOS */

    ImprimirResultado (id) {
      this.apiBaseResultado = apiUrl + `/detalleExamenRealizado/get?id=${id}`

      axios.get(this.apiBaseResultado)
        .then((response) => {
          this.generarPDF(response.data)
        })
        .catch((error) => {
          console.error('Error al obtener los detalles del examen:', error)
        })
    },
    addResultado (id, idexamen) {
      this.$refs['modal-add-resultados'].show()
      this.formResultado.id = id
      this.getFieldsByExamenId(idexamen)
    },

    getFieldsByExamenId (examenId) {
      axios.get(apiUrl + '/campoLaboratorio/getByExamenId', {
        params: {
          id: examenId
        }
      })
        .then((response) => {
          this.camposResulado = response.data.map(item => ({
            id: item.id,
            nombre: item.nombre,
            unidades: item.unidades,
            resultado: '',
            id_tipo: item.id_examenes_almacenados
          }))
          const campos = response.data
          this.campos = campos
        })
        .catch((error) => {
          console.error('Error al obtener los campos del examen:', error)
        })
    },
    onSaveResultados () {
      const me = this
      const resultados = this.camposResulado.map(campo => ({
        id: me.formResultado.id,
        id_campo: campo.id,
        id_tipo: campo.id_tipo,
        resultado: campo.resultado
      }))

      axios.post(apiUrl + '/detalleExamenRealizado/create', { resultados })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se han ingresado los resultados de los exámenes exitosamente'
          me.$refs.vuetable2.refresh()
          me.$refs.vuetable3.refresh()
          me.closeModal('resultado')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error al guardar los resultados!', error)
        })
    },
    onValidateResultado (action) {
      const camposConErrores = this.camposResulado.filter(campo => campo.resultado === '' || campo.resultado == null)
      if (camposConErrores.length > 0) {
        this.alertErrorText = 'Revisa que todos los campos de resultado estén llenos.'
        this.showAlertError()
        return
      }
      this.onSaveResultados()
    },
    verResultado (id) {
      this.$refs['modal-ver-resultados'].show()
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
          fecha_hora: item.fecha_hora,
          alamar: item.alarma
        }
      })
      this.$refs.paginationResultado.setPaginationData(paginationData)
    },
    onChangePageResultado (page) {
      this.$refs.vuetableResultado.changePage(page)
    },
    // GENERAR PDF DE RESULTADOS
    generarPDF (Data) {
      const data = Data.map(item => ({
        campo: item.campo,
        tipo_examen: item.tipo_examen,
        resultado: parseFloat(item.resultado).toFixed(2),
        unidades: item.unidades,
        intervalo: `${parseFloat(item.valor_minimo).toFixed(2)} - ${parseFloat(item.valor_maximo).toFixed(2)}`,
        alarma: item.alarma !== null ? item.alarma : ''
      }))

      const doc = new JsPDF()

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('LABORATORIO BIOMÉDICO E.O. S.A.', 110, 20, { align: 'center' })

      // Título del reporte
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text(`RESULTADOS DE EXAMENES`, 105, 30, { align: 'center' })

      // Tipo de examen
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text(`${data.tipo_examen}`, 105, 50, { align: 'center' })

      // Tabla de resultados
      doc.autoTable({
        head: [['Prueba', 'Resultado', 'Alarma', 'Unidades', 'Intervalo de referencia']],
        body: data.map(item => [
          item.campo,
          item.resultado,
          item.alarma,
          item.unidades,
          item.intervalo
        ]),
        startY: 60,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Resultados_Examen_${moment().format('YYYY-MM-DD')}.pdf`)
    },

    // AREA DE MEDICOS
    onSearchDatosMedicos (search, loading) {
      if (search.length) {
        loading(true)
        this.onSearchMedicos(search, loading)
      }
    },
    onSearchMedicos (search, loading) {
      axios.get(apiUrl + '/voucher/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.medicos = response.data.Medicos
        loading(false)
      })
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

/* Estilos para el Multiselect */
.multiselect {
  border: 1px solid #ced4da; /* Borde gris claro */
  border-radius: 4px;
  padding: 0.375rem 0.75rem; /* Espaciado interno */
}

.multiselect__tags {
  background-color: #f8f9fa; /* Fondo gris muy claro */
  border-radius: 4px;
  padding: 0.25rem;
}

.multiselect__tag {
  background-color: #e2e3e5; /* Fondo gris claro para las etiquetas */
  color: #343a40; /* Texto oscuro */
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
  margin-right: 0.25rem;
}

.multiselect__tag-icon:focus,
.multiselect__tag-icon:hover {
  background-color: #c82333; /* Rojo al pasar el mouse o enfocar */
}

/* Estilos para la lista de opciones seleccionadas */
.selected-options-list {
  list-style: decimal; /* Números en la lista */
  padding-left: 1.5rem;
}
.text-danger-custom {
  color: red;
  font-weight: bold;
}
.custom-checkbox .custom-control-label::before {
    background-color: #e9ecef;
    border: 2px solid #adb5bd;
}
.custom-checkbox .custom-control-input:checked~.custom-control-label::before {
    background-color: #198754;
    border-color: #198754;
}
.custom-checkbox .custom-control-input:focus~.custom-control-label::before {
    box-shadow: 0 0 0 0.25rem rgba(25, 135, 84, 0.25);
}
</style>

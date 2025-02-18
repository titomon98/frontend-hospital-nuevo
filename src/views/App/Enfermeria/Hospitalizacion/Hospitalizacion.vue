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
    <b-modal id="modal-traslado" ref="modal-traslado" title="Trasladar paciente">
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
        ¿Desea trasladar el paciente: {{ form.nombres }} ?
      </h6>
      <b-form @submit="$event.preventDefault()">
        <b-col >
          <b-form-group label="Área a la que desea trasladar:">
            <b-form-radio-group
                      id="radio-group-2"
                      v-model="selectedTrasOption"
                      :options="optionsTraslado"
                      name="radio-options"
                    ></b-form-radio-group>
            <div v-if="selectedTrasOption==4">
              Habitación
              <v-select
              ref="selectHab"
              v-model="selectedHab"
              :options="habitaciones"
              label="numero"
              value="id"></v-select>
            </div>
          </b-form-group>
        </b-col>
      </b-form>
      <div>
          Ingrese un motivo para el traslado
        </div>
        <div>
          <b-input id="motivoTraslado" ref="motivoTraslado" v-model="motivoTrasladoHospi" />
        </div>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="
            onRelocation()
            this.selectedHab = null
          "
          >Ingresar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-traslado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-add-receta" ref="modal-add-receta" title="Contenido de receta">
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
        <b-form-group label="Contenido:">
          <quill-editor v-model="form.receta" :options="editorOptions" class="custom-editor"></quill-editor>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveReceta()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-ver-receta" ref="modal-ver-receta" title="Ver recetas">
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
          ref="vuetableRecetas"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseReceta"
          :query-params="makeQueryParamsReceta"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsReceta"
          pagination-path
          @vuetable:pagination-data="onPaginationDataReceta"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
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
          ref="paginationReceta"
          @vuetable-pagination:change-page="onChangePageReceta"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-receta')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-add-servicio" ref="modal-add-servicio" title="Añadir consumo de servicio">
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
        <b-form-group label="Servicio a agregar:">
          <v-select
            name="servicio"
            v-model="servicio"
            :options="servicios"
            :filterable="false"
            placeholder="Seleccione un servicio a agregar"
            @search="onSearchServicios"
          >
            <template v-slot:option="option">
              {{ option.descripcion + ' - Precio: ' + option.precio }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ option.descripcion + ' - Precio: ' + option.precio }}
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Cantidad:">
          <b-form-input
            v-model.trim="form.cantidad"
            placeholder="Ingresar cantidad utilizada"
            type="number"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveServicio('add-servicio')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-ver-servicio" size="lg" ref="modal-ver-servicio" title="Ver consumos">
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
          ref="vuetableConsumos"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseConsumo"
          :query-params="makeQueryParamsConsumo"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsConsumo"
          pagination-path
          @vuetable:pagination-data="onPaginationDataConsumo"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
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
          ref="paginationConsumo"
          @vuetable-pagination:change-page="onChangePageConsumo"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-servicio')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-add-honorarios" size="lg" ref="modal-add-honorarios" title="Agregar honorarios a medico">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form  @submit="$event.preventDefault()">
        <b-form-group label="Seleccionar Medico">
          <v-select
            v-model="honorario.medico"
            :options="medicos"
            item-text="nombre"
            item-value="id"
            label="nombre"
            :filterable="false"
            placeholder="Seleccione un médico"
            @search="onSearchMedicos"
            required
          >
            <template v-slot:option="option">
              {{ option.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ option.nombre }}
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Descripción">
          <b-form-textarea
            v-model="honorario.descripcion"
            placeholder="Ingrese una descripción"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Total de honorarios">
          <b-form-input
            v-model.trim="honorario.total"
            placeholder="Ingresar Total Honorarios"
            type="number"
            required
          ></b-form-input>
        </b-form-group>
      </b-form>
        <template #modal-footer>
          <b-button variant="primary" @click="agregarHonorario()">Guardar</b-button>
          <b-button variant="danger" @click="closeModal('add-honorarios')">Cancelar</b-button>
        </template>
    </b-modal>
    <b-modal id="modal-ver-honorarios" size="lg" ref="modal-ver-honorarios" title="Ver honorarios">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-table striped hover :items="honorarios" :fields="fieldsHonorarios">
        <template #cell(nombreMedico)="row">
          {{ row.item.medico.nombre }}
        </template>
      </b-table>
      <b-pagination
        v-if="pagination.total > 0"
        v-model="pagination.currentPage"
        :total-rows="pagination.total"
        :per-page="pagination.perPage"
        @change="onChangePageHonorario"
      ></b-pagination>
      <template #modal-footer>
        <b-button variant="danger" @click="closeModal('ver-honorarios')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-1-movimiento" size="lg" ref="modal-1-movimiento" title="Agregar Consumo de Insumos">
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
        <b-form-group label="Agregar Insumo:">
            <b-row md="3" class="ml-5 mt-negativo-r1">
              <input type="radio" id="medicamento" value="0" v-model="$v.form.selected_insumo.$model" @change="this.onSelectChange"/>
              <label for="medicamento" class="mt-2 ml-1">Medicamento</label>
            </b-row>
            <b-row md="3" class="ml-5 mt-negativo">
              <input type="radio" id="quirurgico" value="1" v-model="$v.form.selected_insumo.$model" @change="this.onSelectChange"/>
              <label for="quirurgico" class="mt-2 ml-1">Quirúrgico</label>
            </b-row>
            <b-row md="3" class="ml-5 mt-negativo">
              <input type="radio" id="uso_comun" value="2" v-model="$v.form.selected_insumo.$model" @change="this.onSelectChange" />
              <label for="uso_comun" class="mt-2 ml-1">Uso común</label>
            </b-row>
            <v-select
              name="medicamentos"
              v-model.trim="$v.formMe.id_medicine.$model"
              :options="medicamentos"
              :filterable="true"
              :reduce="med => med.value"
              :state="!$v.formMe.id_medicine.$error"
              placeholder="Seleccione el insumo"
              label='text'
              @input="onChangeMedicamento"
            ></v-select>
            <label>{{this.existencias_selected_med}}</label>
          </b-form-group>
          <b-form-group label="Cantidad:">
            <b-form-input
              type="number"
              v-model.trim="$v.formMe.cantidad.$model"
              :state="!$v.formMe.cantidad.$error"
              :min=1
              :max="max_cant"
              placeholder="Ingresar Cantidad"
            ></b-form-input>
          </b-form-group>
          <br>
          <h5>CONSUMOS REALIZADOS</h5>
          <b-tabs content-class="mt-3">
          <b-tab title="Medicamento" active>
            <vuetable
              ref="vuetableConsumoInsumos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoMedicamento"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoMedicamento"

            >
            </vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>
          <b-tab title="Quirúrgico">
            <vuetable
              ref="vuetableConsumoQuirurgicos"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoQuirurgico"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoQuirurgico"
              pagination-path
              @vuetable:pagination-data="onPaginationDataConsumo"
            >
            </vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onChangePageConsumo"
            />
          </b-tab>
          <b-tab title="Común">
            <vuetable
              ref="vuetableConsumoComunes"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiBaseConsumoComun"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumo"
              pagination-path
              @vuetable:pagination-data="onPaginationDataConsumoInsumo"
            >
            </vuetable>
            <vuetable-pagination-bootstrap
              ref="paginationConsumo"
              @vuetable-pagination:change-page="onPaginationDataConsumoInsumo"
            />
          </b-tab>
        </b-tabs>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click=" onSave()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="reporteModal" title="Reporte de Cuenta Parcial" size="lg">
      <div class="modal-body">
        <p><strong>Total consumo de servicios:</strong> Q{{ reporte.ConsumoTotal }}</p>
        <p><strong>Total consumo de materiales comunes:</strong> Q{{ reporte.ConsumoComunTotal }}</p>
        <p><strong>Total consumo de medicamentos:</strong> Q{{ reporte.ConsumoMedicamentosTotal }}</p>
        <p><strong>Total consumo de materialesquirúrgicos:</strong> Q{{ reporte.ConsumoQuirurgicosTotal }}</p>
        <p><strong>Total de exámenes realizados:</strong> Q{{ reporte.ExamenesTotal }}</p>
        <p><strong>Total de servicios en sala de operaciones:</strong> Q{{ reporte.ServicioSalaOperacionesTotal }}</p>
        <hr />
        <p><strong><u>Total deuda:</u> Q{{ reporte.TotalDeuda }}</strong></p>
      </div>
      <template #modal-footer>
        <b-button variant="primary" @click="generarPDF_CuentaParcial">Generar Excel</b-button>
        <b-button variant="secondary" @click="$bvModal.hide('reporteModal')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-modal id="HistorialCuenta" title="Historial de las Cuentas" size="lg">
      <div class="modal-body">
        <p><strong>Total consumo de servicios:</strong> Q{{ reporteHisotiral.ConsumoTotal }}</p>
        <p><strong>Total consumo de materiales comunes:</strong> Q{{ reporteHisotiral.ConsumoComunTotal }}</p>
        <p><strong>Total consumo de medicamentos:</strong> Q{{ reporteHisotiral.ConsumoMedicamentosTotal }}</p>
        <p><strong>Total consumo de materialesquirúrgicos:</strong> Q{{ reporteHisotiral.ConsumoQuirurgicosTotal }}</p>
        <p><strong>Total de exámenes realizados:</strong> Q{{ reporteHisotiral.ExamenesTotal }}</p>
        <p><strong>Total de servicios en sala de operaciones:</strong> Q{{ reporteHisotiral.ServicioSalaOperacionesTotal }}</p>
        <hr />
        <!-- <p><strong><u>Total deuda:</u> Q{{ reporteHisotiral.TotalDeuda }}</strong></p> -->
      </div>
      <template #modal-footer>
        <b-button variant="primary" @click="generarPDF_Historial">Generar PDF</b-button>
        <b-button variant="secondary" @click="$bvModal.hide('HistorialCuenta')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Hospitalización</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
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
              :fields="fields"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <div class="button-container">
                  <b-button
                    @click="traslado(props.rowData.id)
                    setData(props.rowData)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Trasladar</b-button>

                  <b-button
                    @click="addReceta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar receta</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="verReceta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver recetas</b-button>

                  <b-button
                    @click="addServicio(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar servicios</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="verServicio(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver servicios</b-button>

                  <b-button
                    @click="showModal('modal-add-honorarios'); obtenerIdCuenta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar honorarios</b-button>

                  <b-button
                  v-if="props.rowData.nombres !== 'PENDIENTE' "
                    @click="showModal('modal-ver-honorarios'); getDataHonorarios(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver honorarios</b-button>
                  <b-button
                    v-b-tooltip.top="'Agregar consumo'"
                    @click="showModal('modal-1-movimiento'); getConsumoMedicamentos(props.rowData.id); obtenerIdCuenta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                   >Consumos</b-button>

                   <b-button
                    @click="generarReporteCuentaParcial(props.rowData.id, props.rowData.nombres, props.rowData.apellidos)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Cuenta parcial</b-button>

                   <b-button
                    @click="generarHistorialCuentas(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                   >Historial Cuenta</b-button>

                  <!-- <b-button
                    v-b-tooltip.top="'Aregar consumo'"
                    @click="showModal('modal-1-movimiento'); obtenerIdCuenta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Agregar consumo</b-button>
                  <b-button
                    v-b-tooltip.top="'Ver consumos'"
                    @click="getConsumoMedicamentos(props.rowData.id);"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                   >Ver consumo</b-button> -->
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
import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import { quillEditor } from 'vue-quill-editor'
import moment from 'moment'
import { mapGetters } from 'vuex'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import ExcelJS from 'exceljs'

export default {
  name: 'Hospitalizacion',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    quillEditor
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.searchingMedicamentos()
    this.getHabitaciones(0)
  },
  mounted () {
    xray.index()
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  data () {
    return {
      from: 0,
      motivoTrasladoHospi: '',
      habitaciones: [],
      selectedHab: null,
      to: 0,
      total: 0,
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
        placeholder: 'Escribir contenido de la receta',
        theme: 'snow'
      },
      perPage: 5,
      search: '',
      existencias_selected_med: null,
      max_cant: 0,
      form: {
        id: 0,
        name: '',
        state: 1,
        selectedOption: 'quirofano',
        receta: null,
        id_receta: null,
        cantidad: null,
        selected_insumo: '0'
      },
      servicio: null,
      selectedTrasOption: 4,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/expedientes/listHospitalizacion',
      apiBaseReceta: '',
      apiBaseConsumo: '',
      apiBaseConsumoMedicamento: '',
      apiBaseConsumoQuirurgico: '',
      apiBaseConsumoComun: '',
      optionsTraslado: [
        { text: 'Quirófano', value: 3 },
        { text: 'Emergencia', value: 5 },
        { text: 'Intensivos', value: 4 }
      ],
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
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'apellidos',
          sortField: 'apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente',
          sortField: 'expediente',
          title: 'Expediente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'medico.nombre',
          sortField: 'medico.nombre',
          title: 'Médico tratante',
          dataClass: 'list-item-heading'
        },
        {
          name: 'habitacione.numero',
          title: 'Habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso_reciente',
          sortField: 'fecha_ingreso_reciente',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'hora_ingreso_reciente',
          sortField: 'hora_ingreso_reciente',
          title: 'Hora de ingreso',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsReceta: [
        {
          name: 'contenido',
          sortField: 'contenido',
          title: 'Indicaciones',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Creación',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumo: [
        {
          name: 'servicio.descripcion',
          sortField: 'servicio.descripcion',
          title: 'Nombre del servicio',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'subtotal',
          sortField: 'subtotal',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de consumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Creación',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumo: [
        {
          name: 'comune.nombre',
          sortField: 'comune.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoQuirurgico: [
        {
          name: 'quirurgico.nombre',
          sortField: 'quirurgico.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsConsumoInsumoMedicamento: [
        {
          name: 'medicamento.nombre',
          sortField: 'medicamento.nombre',
          title: 'Nombre del insumo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'precio_venta',
          sortField: 'precio_venta',
          title: 'Precio unitario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Subtotal',
          dataClass: 'list-item-heading'
        }
      ],
      servicios: [],
      honorario: {
        medico: null,
        descripcion: '',
        total: null
      },
      idCuentaSeleccionada: null,
      medicos: [],
      apiBaseHonorarios: apiUrl + '/detalle_honorarios',
      honorarios: [],
      fieldsHonorarios: [
        { key: 'medico.nombre', label: 'Nombre del Médico' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'total', label: 'Total' }
      ],
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
      },
      currentExpedienteId: null,
      medicamentos: [],
      formMe: {
        id_cuenta: 0,
        id_medicine: null,
        cantidad: null,
        medicamento: null,
        state: 1,
        precio_venta: 0,
        existencias_actuales: null,
        movimiento: 'SALIDAH'
      },
      /* AREA DE REPORTES */
      reporte: {
        ConsumoTotal: '0.00',
        ConsumoComunTotal: '0.00',
        ConsumoMedicamentosTotal: '0.00',
        ConsumoQuirurgicosTotal: '0.00',
        ExamenesTotal: '0.00',
        ServicioSalaOperacionesTotal: '0.00',
        TotalDeuda: '0.00'
      },
      dataPDFsumario: null,
      nombrePaciente: null,
      fechaIngreso: null,
      dataPDF_Historial: null,
      reporteHisotiral: {
        ConsumoTotal: '0.00',
        ConsumoComunTotal: '0.00',
        ConsumoMedicamentosTotal: '0.00',
        ConsumoQuirurgicosTotal: '0.00',
        ExamenesTotal: '0.00',
        ServicioSalaOperacionesTotal: '0.00',
        TotalDeuda: '0.00'
      }
    }
  },
  validations () {
    return {
      form: {
        name: { required },
        selected_insumo: { required }
      },
      formMe: {
        id_medicine: {
          required
        },
        cantidad: {
          required
        }
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
          this.form.selected_insumo = '0'
          this.existencias_selected_med = null
          this.formMe.precio_venta = 0
          this.formMe.existencias_actuales = null
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'traslado': {
          this.$v.$reset()
          this.$refs['modal-traslado'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'add-receta': {
          this.$v.$reset()
          this.$refs['modal-add-receta'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'ver-receta': {
          this.$v.$reset()
          this.$refs['modal-ver-receta'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.id_receta = null
          break
        }
        case 'add-servicio': {
          this.$v.$reset()
          this.$refs['modal-add-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.form.cantidad = null
          this.servicio = null
          this.form.servicio = null
          break
        }
        case 'ver-servicio': {
          this.$v.$reset()
          this.$refs['modal-ver-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'ver-honorarios': {
          this.$v.$reset()
          this.$refs['modal-ver-honorarios'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          this.honorarios = []
          this.pagination.currentPage = 1
          this.pagination.total = 0
          this.honorario = {
            medico: null,
            descripcion: '',
            total: null
          }
          break
        }
        case 'add-honorarios': {
          this.$v.$reset()
          this.$refs['modal-add-honorarios'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formMe.id_cuenta = 0
          this.formMe.cantidad = 0
          this.formMe.medicamento = null
          this.formMe.movimiento = 'SALIDAH'
          this.form.selected_insumo = '0'
          this.existencias_selected_med = null
          break
        }
        case 'SaveQuirurgico': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formQui.id_cuenta = 0
          this.formQui.cantidad = 0
          this.formQui.quirurgico = null
          this.formQui.movimiento = 'SALIDAQ'
          this.existencias_selected_med = null
          break
        }
        case 'SaveComunes': {
          this.$v.$reset()
          this.$refs['modal-1-movimiento'].hide()
          this.formCom.id_cuenta = 0
          this.formCom.cantidad = 0
          this.formCom.quirurgico = null
          this.formCom.movimiento = 'SALIDAQ'
          this.existencias_selected_med = null
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
    calcularEdad (Fecha) {
      if (!Fecha) return ''
      const FECHA = moment(Fecha, 'DD-MM-YYYY').format('YYYY-MM-DD')
      const hoy = new Date()
      const nacimiento = new Date(FECHA)
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mesCumpleanos = nacimiento.getMonth()
      const diaCumpleanos = nacimiento.getDate()

      if (hoy.getMonth() < mesCumpleanos || (hoy.getMonth() === mesCumpleanos && hoy.getDate() < diaCumpleanos)) {
        edad--
      }
      return edad
    },
    onSave () {
      if (this.formMe.cantidad > 0) {
        if (this.formMe.cantidad <= this.max_cant) {
          if (this.form.selected_insumo === '0') {
            this.onSaveMedicamento()
          } else if (this.form.selected_insumo === '1') {
            this.onSaveQuirurgico()
          } else {
            this.onSaveComunes()
          }
        } else {
          this.alertErrorText = 'La cantidad de producto debe ser menor a la existencia actual del producto (' + this.max_cant + ').'
          this.showAlertError()
        }
      } else {
        this.alertErrorText = 'La cantidad de producto debe ser mayor a 0.'
        this.showAlertError()
      }
    },
    onSaveMedicamento () {
      const me = this
      me.formMe.id_cuenta = me.idCuentaSeleccionada
      const currentUser = this.currentUser
      axios.post(apiUrl + '/detalle_consumo_medicamentos/create', {
        form: me.formMe,
        currentUser: currentUser
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el movimiento exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          console.error('Error!', error)
        })
    },
    onSaveQuirurgico () {
      const me = this
      me.formMe.id_cuenta = me.idCuentaSeleccionada
      const currentUser = this.currentUser
      axios.post(apiUrl + '/detalle_consumo_quirugicos/create', {
        form: me.formMe,
        currentUser: currentUser
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el movimiento exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          console.error('Error!', error)
        })
    },
    onSaveComunes () {
      const me = this
      me.formMe.id_cuenta = me.idCuentaSeleccionada
      const currentUser = this.currentUser
      axios.post(apiUrl + '/detalle_consumo_comun/create', {
        form: me.formMe,
        currentUser: currentUser
      })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el movimiento exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          console.error('Error!', error)
        })
    },
    traslado (id) {
      this.$refs['modal-traslado'].show()
      this.form.id = id
    },
    saveTraslado () {
      const me = this
      axios.put(apiUrl + '/expedientes/changeStatus', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha trasladado el expediente exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('traslado')
          me.form.id = 0
          me.form.selectedOption = 'quirofano'
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    addReceta (id) {
      this.$refs['modal-add-receta'].show()
      this.form.id = id
    },
    saveReceta () {
      const me = this
      if (me.form.receta !== null) {
        axios.post(apiUrl + '/recetas/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado la receta exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-receta')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      }
    },
    verReceta (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataRecetas(id)
      this.form.id_receta = id
    },
    addServicio (id) {
      this.$refs['modal-add-servicio'].show()
      this.form.id = id
    },
    saveServicio () {
      const me = this
      if (me.servicio.id !== null && me.form.cantidad !== null) {
        me.form.servicio = me.servicio
        me.form.descripcion = 'Añadido en hospitalización'
        axios.post(apiUrl + '/consumos/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado el consumo de un servicio exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-servicio')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      } else {
        me.alertVariant = 'danger'
        me.showAlertError()
        me.alertErrorText = 'Por favor llene los campos solicitados'
      }
    },
    verServicio (id) {
      this.$refs['modal-ver-servicio'].show()
      this.getDataConsumos(id)
      this.form.id_consumo = id
    },
    addhonorarios (id) {
      this.obtenerIdCuenta(id)// Obtener id_cuenta ANTES de mostrar el modal
      this.$refs['modal-add-honorarios'].show()
    },
    agregarHonorario () {
      try {
        axios.post(apiUrl + '/detalle_honorarios/created', {
          id_medico: this.honorario.medico.id,
          id_cuenta: this.idCuentaSeleccionada,
          descripcion: this.honorario.descripcion,
          total: this.honorario.total,
          lugar: 'Hospitalización'
        })
        this.$refs['modal-add-honorarios'].hide()
        this.honorario = {
          medico: null,
          descripcion: '',
          total: null
        }
      } catch (error) {
        console.error(error)
        this.alertErrorText = 'Error al agregar honorarios'
        this.showAlertError()
      }
    },
    showModal (modalId) {
      this.$bvModal.show(modalId)
    },
    verHonorarios (id) {
      this.obtenerIdCuenta(id)
      this.$refs['modal-ver-honorarios'].show()
    },
    /* Guardar */
    onUpdate () {
      const me = this
      axios.put(apiUrl + '/expedientes/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el expediente ' + me.form.nombre + ' exitosamente'
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
      this.items = paginationData.data.map(item => {
        item.nacimiento = moment(item.nacimiento).format('DD/MM/YYYY')
        item.edad = this.calcularEdad(item.nacimiento)
        item.fecha_ingreso_reciente = moment(item.fecha_ingreso_reciente).format('DD/MM/YYYY')
        return {
          nacimiento: item.nacimiento,
          edad: item.edad
        }
      })
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
    makeQueryParamsReceta (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataReceta (paginationData) {
      this.fromP = paginationData.from
      this.toP = paginationData.to
      this.totalP = paginationData.total
      this.lastPageP = paginationData.last_page
      this.items = paginationData.data
      this.$refs.paginationReceta.setPaginationData(paginationData)
    },
    onChangePageReceta (page) {
      this.$refs.vuetableRecetas.changePage(page)
    },
    getDataRecetas (id) {
      this.form.id = id
      this.apiBaseReceta = apiUrl + `/recetas/getId?id=${id}`
    },
    onSearchServicios (search, loading) {
      if (search.length) {
        this.searchingServicios(search, loading)
      }
    },
    searchingServicios (search, loading) {
      axios.get(apiUrl + '/servicios/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.servicios = response.data
      })
    },
    makeQueryParamsConsumo (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataConsumo (paginationData) {
      this.fromP = paginationData.from
      this.toP = paginationData.to
      this.totalP = paginationData.total
      this.lastPageP = paginationData.last_page
      this.items = paginationData.data
      this.$refs.paginationConsumo.setPaginationData(paginationData)
    },
    onChangePageConsumo (page) {
      this.$refs.vuetableConsumos.changePage(page)
    },
    getDataConsumos (id) {
      this.form.id = id
      this.apiBaseConsumo = apiUrl + `/consumos/getId?id=${id}`
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
      })
    },
    onSearchMedicos (search, loading) {
      if (search.length) {
        this.searchingMedicos(search, loading)
      }
    },
    makeQueryParamsHonorarios (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: perPage
        }
        : {
          criterio: 'createdAt',
          order: 'desc',
          page: currentPage,
          limit: perPage
        }
    },
    onPaginationDataHonorarios (paginationData) {
      this.honorarios = paginationData.data
      this.pagination.total = paginationData.total
      this.pagination.currentPage = Math.floor((paginationData.from - 1) / this.pagination.perPage) + 1
    },
    onChangePageHonorario (page) {
      this.pagination.currentPage = page
      this.getDataHonorarios(this.currentExpedienteId)
    },
    async obtenerIdCuenta (idExpediente) {
      try {
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${idExpediente}`)
        if (response.data && response.data.id) {
          this.idCuentaSeleccionada = response.data.id
        } else {
          console.error('En AddHonorarios No se encontró ninguna cuenta para el expediente:', idExpediente)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener la cuenta:', error)
      }
    },
    async getDataHonorarios (idExpediente) {
      try {
        this.currentExpedienteId = idExpediente
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${idExpediente}`)
        if (response.data && response.data.id) {
          const idcuenta = response.data.id
          const response2 = await axios.get(apiUrl + `/detalle_honorarios/getSearch?search=${idcuenta}&page=${this.pagination.currentPage}&limit=${this.pagination.perPage}`)
          this.onPaginationDataHonorarios(response2.data)
        } else {
          console.error('En VerHonorarios No se encontró ninguna cuenta para el expediente:', idExpediente)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener los honorarios:', error)
      }
    },
    onSearchMedicamentos (search, loading) {
      if (search.length) {
        this.searchingMedicamentos(search, loading)
      }
    },
    searchingMedicamentos (search, loading) {
      axios.get(apiUrl + '/medicamentos/list2')
        .then((response) => {
          this.medicamentos = response.data.map(medicamento => ({
            value: medicamento.id,
            text: medicamento.nombre,
            existencias_actuales: medicamento.existencia_actual,
            precio_venta: medicamento.precio_venta
          }))
        })
    },
    onSearchQuirugicos (search, loading) {
      if (search.length) {
        this.searchingQuirurgico(search, loading)
      }
    },
    searchingQuirurgico (search, loading) {
      axios.get(apiUrl + '/quirurgico/list'
      ).then((response) => {
        this.medicamentos = response.data.map(medicamento => ({
          value: medicamento.id,
          text: medicamento.nombre,
          existencias_actuales: medicamento.existencia_actual,
          precio_venta: medicamento.precio_venta
        }))
        console.dir(response)
      })
    },
    onSearchMaterialComun (search, loading) {
      if (search.length) {
        this.searchingComunes(search, loading)
      }
    },
    searchingComunes (search, loading) {
      axios.get(apiUrl + '/comun/list2'
      ).then((response) => {
        this.medicamentos = response.data.map(medicamento => ({
          value: medicamento.id,
          text: medicamento.nombre,
          existencias_actuales: medicamento.existencia_actual,
          precio_venta: medicamento.precio_venta
        }))
      })
    },
    onSelectChange () {
      if (this.form.selected_insumo === '0') {
        this.searchingMedicamentos()
      } else if (this.form.selected_insumo === '1') {
        this.searchingQuirurgico()
      } else {
        this.searchingComunes()
      }
      this.formMe.id_medicine = null
    },
    onChangeMedicamento () {
      let medicine_ = this.medicamentos.find(med => med.value === this.formMe.id_medicine)
      this.max_cant = medicine_.existencias_actuales
      this.existencias_selected_med = medicine_.existencias_actuales + ' unidades en existencia.'
      this.formMe.precio_venta = medicine_.precio_venta
      this.formMe.existencias_actuales = medicine_.existencias_actuales
    },
    async getConsumoMedicamentos (id) {
      try {
        const response = await axios.get(apiUrl + `/cuentas/getSearch?search=${id}`)
        if (response.data && response.data.id) {
          this.idCuentaSeleccionada = response.data.id
          this.apiBaseConsumoMedicamento = apiUrl + `/detalle_consumo_medicamentos/list/${response.data.id}`
          this.apiBaseConsumoQuirurgico = apiUrl + `/detalle_consumo_quirugicos/list/${response.data.id}`
          this.apiBaseConsumoComun = apiUrl + `/detalle_consumo_comun/list/${response.data.id}`
        // this.$refs['modal-ver-consumos'].show()
        } else {
          console.error('No se encontró ninguna cuenta para el expediente:', id)
          this.alertErrorText = 'No se encontró ninguna cuenta para este paciente'
          this.showAlertError()
        }
      } catch (error) {
        console.error('Error al obtener la cuenta:', error)
      }
    },
    makeQueryParamsConsumoInsumo (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    setData (data) {
      this.form.name = data.nombres + ' ' + data.apellidos
      this.form.state = data.estado
      this.form.id = data.id
    },
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/get', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
      })
    },
    onState () {
      let me = this
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption,
          estado_anterior: 1,
          motivo: this.motivoTrasladoHospi,
          user: me.currentUser.user
        })
        .then((response) => {
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha trasladado el paciente ' + me.form.nombres + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-traslado'].hide()
          axios.put(apiUrl + '/habitaciones/available',
            {
              ocupante: this.form.id
            }
          )
            .then((res) => {
              if (this.selectedTrasOption === 1 || this.selectedTrasOption === 4) {
                axios
                  .put(apiUrl + '/habitaciones/inUse', {
                    id: this.selectedHab.id,
                    ocupante: this.form.id
                  })
                  .then((res) => {
                    this.selectedHab = null
                    this.getHabitaciones(0)
                  })
              }
            })
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    onRelocation (action) {
      let me = this
      this.$v.$touch()
      if (this.selectedHab === null && (this.selectedTrasOption === 1 || this.selectedTrasOption === 4)) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        this.onState()
        me.$refs.vuetable.refresh()
        this.$bvModal.hide('modal-traslado')
      }
    },

    /* GENERAR CUENTA PARCIAL PARA EL PACIENTE */
    generarReporteCuentaParcial (id, nombres, apellidos) {
      axios.get(apiUrl + `/consumos/sumario/${id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.nombrePaciente = nombres + ' ' + apellidos
          this.fechaIngreso = this.dataPDFsumario.fechaFormateada
          this.mostrarReporte(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    mostrarReporte (data) {
      let totalDeuda = 0

      const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
      const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
      const ExamenesTotal = data.examenes.reduce((acc, item) => acc + item.total, 0)
      const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
      // const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
      // const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

      totalDeuda = parseFloat(ConsumoTotal) +
                  parseFloat(ConsumoComunTotal) +
                  parseFloat(ConsumoMedicamentosTotal) +
                  parseFloat(ConsumoQuirurgicosTotal) +
                  parseFloat(ExamenesTotal) +
                  parseFloat(ServicioSalaOperacionesTotal)

      this.reporte = {
        ConsumoTotal: this.formatearMonto(ConsumoTotal),
        ConsumoComunTotal: this.formatearMonto(ConsumoComunTotal),
        ConsumoMedicamentosTotal: this.formatearMonto(ConsumoMedicamentosTotal),
        ConsumoQuirurgicosTotal: this.formatearMonto(ConsumoQuirurgicosTotal),
        ExamenesTotal: this.formatearMonto(ExamenesTotal),
        ServicioSalaOperacionesTotal: this.formatearMonto(ServicioSalaOperacionesTotal),
        TotalDeuda: this.formatearMonto(totalDeuda)
      }

      this.$bvModal.show('reporteModal')
    },
    async generarPDF_CuentaParcial () {
      const data = this.dataPDFsumario
      const FechaIngreso = this.fechaIngreso
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES')
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }
      const horaFormateada = fechaActual.toLocaleTimeString('es-ES', opcionesHora)

      let mensajeDias

      if (!FechaIngreso) {
        mensajeDias = 'NO ASIGNADA'
      } else {
        const fechaIngreso = new Date(FechaIngreso)
        const diferenciaMs = fechaActual - fechaIngreso
        const diasDiferencia = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24))
        mensajeDias = diasDiferencia
      }

      let hospitalizacion

      if (mensajeDias >= 2) {
        hospitalizacion = data.costo2 * mensajeDias
      } else {
        hospitalizacion = data.costo1
      }

      try {
        const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
        const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ExamenesTotal = data.examenes.reduce((acc, item) => acc + item.total, 0)
        const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

        const TotalGeneral =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ExamenesTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalGeneral2 =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalApagar = TotalGeneral2 + TotalHonorarios + ExamenesTotal

        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('Resumen')

        // Título
        sheet.mergeCells('A1:F1')
        sheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
        sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }

        sheet.mergeCells('A2:F2')
        sheet.getCell('A2').value = 'CUENTA PARCIAL'
        sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

        // Información de paciente
        sheet.getCell('A3').value = 'NOMBRE DEL PACIENTE:'
        sheet.getCell('B3').value = `${this.nombrePaciente}`
        sheet.getCell('A4').value = 'CUARTO NO.:'
        sheet.getCell('B4').value = `${data.numerohabitacion}`
        sheet.getCell('A5').value = 'TIPO DE SERVICIO:'
        sheet.getCell('B5').value = ''
        sheet.getCell('A6').value = 'D/ESTANCIA:'
        sheet.getCell('B6').value = `${mensajeDias}`
        sheet.getCell('A7').value = 'MD TRATANTE:'
        sheet.getCell('B7').value = `${data.nombremedico}`

        // Tabla de consumos
        sheet.getCell('A9').value = 'CONSUMOS'
        sheet.getCell('A10').value = 'HOSPITALIZACION'
        sheet.getCell('B10').value = `${hospitalizacion.toFixed(2)}`
        sheet.getCell('A11').value = 'SALA DE OPERACIONES'
        sheet.getCell('B11').value = `Q${ServicioSalaOperacionesTotal.toFixed(2)}`
        sheet.getCell('A12').value = 'CONSUMO MEDICAMENTOS'
        sheet.getCell('B12').value = `Q${ConsumoMedicamentosTotal.toFixed(2)}`
        sheet.getCell('A13').value = 'MATERIAL MEDICO QUIRÚRGICO'
        sheet.getCell('B13').value = `Q${ConsumoQuirurgicosTotal.toFixed(2)}`
        sheet.getCell('A14').value = 'ANESTESICOS'
        sheet.getCell('B14').value = ''
        sheet.getCell('A15').value = 'MATERIAL COMÚN'
        sheet.getCell('B15').value = `Q${ConsumoComunTotal.toFixed(2)}`
        sheet.getCell('A16').value = 'SERVICIOS'
        sheet.getCell('B16').value = `Q${ConsumoTotal.toFixed(2)}`
        sheet.getCell('A17').value = 'RECUPERACION'
        sheet.getCell('B17').value = ''
        sheet.getCell('A18').value = 'INTENSIVO'
        sheet.getCell('B18').value = 'Q 0.00'
        sheet.getCell('A19').value = 'EMERGENCIAS Medico Interno'
        sheet.getCell('B19').value = ''
        sheet.getCell('A20').value = 'OTROS'
        sheet.getCell('B20').value = ''
        sheet.getCell('A21').value = 'TOTAL HOSPITALIZACION ='
        sheet.getCell('A21').alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell('B21').value = `Q${TotalGeneral2.toFixed(2)}`
        sheet.getCell('A22').value = 'TOTAL LAB. BIOMEDICO E.O. S.A. ='
        sheet.getCell('A22').alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell('B22').value = `Q${ExamenesTotal.toFixed(2)}`
        sheet.getCell('A23').value = 'TOTAL MENOS DESCUENTO ='
        sheet.getCell('A23').alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell('B23').value = `Q${TotalGeneral.toFixed(2)}`

        // Fecha y hora debajo de la tabla
        sheet.getCell('A25').value = `FECHA: ${fechaFormateada} ${horaFormateada}`

        // Honorarios médicos
        sheet.mergeCells('A27:D27')
        sheet.getCell('A27').value = 'HONORARIOS MEDICOS Y OTROS SERVICIOS'
        sheet.getCell('A27').alignment = { horizontal: 'center', vertical: 'middle' }
        sheet.getCell('A27').font = { bold: true }

        let row = 28
        sheet.getCell(`A${row}`).value = '#'
        sheet.getCell(`B${row}`).value = 'MEDICO'
        sheet.getCell(`C${row}`).value = 'DESCRIPCION'
        sheet.getCell(`D${row}`).value = 'VALOR'

        medicosOrdenados.forEach((medico, index) => {
          row++
          sheet.getCell(`A${row}`).value = index + 1
          sheet.getCell(`B${row}`).value = medico.medico.nombre
          sheet.getCell(`C${row}`).value = medico.descripcion
          sheet.getCell(`D${row}`).value = `Q${(Number(medico.total) || 0).toFixed(2)}`
        })

        // Liquidación
        row += 2
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = 'LIQUIDACION'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }
        sheet.getCell(`A${row}`).font = { bold: true }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL HOSPITALIZACION ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalGeneral2) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL LAB. BIOMEDICO E.O. S.A. ='
        sheet.getCell(`B${row}`).value = `Q${(Number(ExamenesTotal) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL HONORARIOS MEDICOS Y OTROS SERVICIOS ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalHonorarios) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL A PAGAR ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalApagar) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }
        sheet.getCell(`A${row}`).font = { bold: true }
        sheet.getCell(`B${row}`).font = { bold: true }

        // Firma
        row++
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = '_______________________________________'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }

        row++
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = 'Nombre y Firma del Cajero'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }

        // Guardar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'SUMARIO.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },

    formatearMonto (monto) {
      const montoNumerico = parseFloat(monto)
      if (isNaN(montoNumerico)) {
        return '0.00'
      }
      return montoNumerico.toFixed(2)
    },

    /* HISTORIAL DE LAS CUENTAS DEL EXPEDIENTE */
    generarHistorialCuentas (id) {
      axios.get(apiUrl + `/consumos/historial/${id}`)
        .then((response) => {
          const historial = response.data
          this.dataPDF_Historial = response.data
          this.mostrarHistorial(historial)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },

    mostrarHistorial (historial) {
      let totalDeuda = 0

      const ConsumoTotal = historial.Consumo.reduce((acc, item) => {
        return acc + (parseFloat(item.subtotal) || 0)
      }, 0)

      const ConsumoComunTotal = historial['Consumo Comun'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ConsumoMedicamentosTotal = historial['Consumo Medicamentos'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ConsumoQuirurgicosTotal = historial['Consumo Quirurgicos'].reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ExamenesTotal = historial.Examenes.reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      const ServicioSalaOperacionesTotal = historial.ServicioSalaOperaciones.reduce((acc, item) => {
        return acc + (parseFloat(item.total) || 0)
      }, 0)

      totalDeuda = parseFloat(ConsumoTotal) + parseFloat(ConsumoComunTotal) + parseFloat(ConsumoMedicamentosTotal) + parseFloat(ConsumoQuirurgicosTotal) + parseFloat(ExamenesTotal) + parseFloat(ServicioSalaOperacionesTotal)
      this.reporteHisotiral = {
        ConsumoTotal: this.formatearMonto(ConsumoTotal),
        ConsumoComunTotal: this.formatearMonto(ConsumoComunTotal),
        ConsumoMedicamentosTotal: this.formatearMonto(ConsumoMedicamentosTotal),
        ConsumoQuirurgicosTotal: this.formatearMonto(ConsumoQuirurgicosTotal),
        ExamenesTotal: this.formatearMonto(ExamenesTotal),
        ServicioSalaOperacionesTotal: this.formatearMonto(ServicioSalaOperacionesTotal),
        TotalDeuda: this.formatearMonto(totalDeuda)
      }

      this.$bvModal.show('HistorialCuenta')
    },

    generarPDF_Historial () {
      const doc = new JsPDF()
      let y = 20
      doc.setFontSize(18)
      doc.text('Reporte de Historial de Cuenta', 14, y)
      y += 10

      const agregarTabla = (title, data) => {
        doc.setFontSize(14)
        doc.text(title, 14, y)
        y += 10

        const headers = ['Descripción', 'Cantidad', 'Precio Unitario', 'Subtotal']
        doc.autoTable({
          startY: y,
          head: [headers],
          body: data.map(item => [
            item.descripcion,
            item.cantidad.toString(),
            item.precio_unitario.toString(),
            item.subtotal.toString()
          ]),
          theme: 'striped',
          margin: { top: 10 },
          styles: { halign: 'center', fontSize: 10 },
          headStyles: {
            fillColor: [229, 31, 45], // Color de fondo para el encabezado (Azul en este caso)
            textColor: [255, 255, 255] // Color de texto para el encabezado (Blanco en este caso)
          }
        })
        y = doc.lastAutoTable.finalY + 10
      }

      // Agregar tabla para cada categoría
      if (this.dataPDF_Historial.Consumo && this.dataPDF_Historial.Consumo.length > 0) {
        const consumosData = this.dataPDF_Historial.Consumo.map(consumo => ({
          descripcion: consumo.servicio.descripcion || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.servicio.precio || 0,
          subtotal: consumo.subtotal || 0
        }))
        agregarTabla('Consumo de Servicios', consumosData)
      }

      if (this.dataPDF_Historial['Consumo Comun'] && this.dataPDF_Historial['Consumo Comun'].length > 0) {
        const consumosComunesData = this.dataPDF_Historial['Consumo Comun'].map(consumo => ({
          descripcion: consumo.comune.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Materiales Comunes', consumosComunesData)
      }

      if (this.dataPDF_Historial['Consumo Medicamentos'] && this.dataPDF_Historial['Consumo Medicamentos'].length > 0) {
        const consumosMedicamentosData = this.dataPDF_Historial['Consumo Medicamentos'].map(consumo => ({
          descripcion: consumo.medicamento.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Medicamentos', consumosMedicamentosData)
      }

      if (this.dataPDF_Historial['Consumo Quirurgicos'] && this.dataPDF_Historial['Consumo Quirurgicos'].length > 0) {
        const consumosQuirurgicosData = this.dataPDF_Historial['Consumo Quirurgicos'].map(consumo => ({
          descripcion: consumo.quirurgico.nombre || '',
          cantidad: consumo.cantidad || 0,
          precio_unitario: consumo.precio_venta || 0,
          subtotal: consumo.total || 0
        }))
        agregarTabla('Consumo de Material Quirúrgico', consumosQuirurgicosData)
      }

      if (this.dataPDF_Historial.Examenes && this.dataPDF_Historial.Examenes.length > 0) {
        const examenesData = this.dataPDF_Historial.Examenes.map(examen => ({
          descripcion: examen.examenes_almacenado.nombre || '',
          cantidad: 1,
          precio_unitario: examen.total || 0,
          subtotal: examen.total || 0
        }))
        agregarTabla('Exámenes Realizados', examenesData)
      }

      if (this.dataPDF_Historial.ServicioSalaOperaciones && this.dataPDF_Historial.ServicioSalaOperaciones.length > 0) {
        const serviciosData = this.dataPDF_Historial.ServicioSalaOperaciones.map(servicio => ({
          descripcion: servicio.descripcion || '',
          cantidad: 1,
          precio_unitario: servicio.total || 0,
          subtotal: servicio.total || 0
        }))
        agregarTabla('Servicios en Sala de Operaciones', serviciosData)
      }

      // Mostrar el total de deuda
      // const totalDeuda = this.reporte.TotalDeuda || 0
      // doc.setFontSize(16)
      // doc.text(`Total Deuda: Q${totalDeuda}`, 14, y)
      y += 10

      // Guardar el PDF
      doc.save('reporte_historial.pdf')
    }
  }
}
</script>
<style>
.custom-editor {
  height: 350px; /* Adjust the height as needed */
}
.custom-editor .ql-editor {
  color: #333; /* Adjust the color value to make the text darker */
}
.button-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between; /* Esto distribuye los botones de manera uniforme */
}
.button-spacing {
  flex: 1 1 calc(25% - 10px); /* Ajusta el tamaño de los botones para que 4 quepan en una fila */
  margin: 5px; /* Ajusta el margen según tus necesidades */
}
.mt-negativo {
  margin-top: -4%;
}
.mt-negativo-r1{
  margin-top: -2%;
}
</style>

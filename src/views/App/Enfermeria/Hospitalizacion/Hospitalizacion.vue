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
    <b-modal id="modal-1-movimiento" ref="modal-1-movimiento" title="Agregar Consumo de Insumos">
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
              :filterable="false"
              :reduce="med => med.value"
              :state="!$v.formMe.id_medicine.$error"
              placeholder="Seleccione el insumo"
              label='text'
              @input="onChangeMedicamento"
            >
            </v-select>
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
    <b-modal id="modal-ver-consumos" size="lg" ref="modal-ver-consumos" title="Ver consumos">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-tabs content-class="mt-3">
        <b-tab title="Medicamento" active>
          <vuetable
            ref="vuetableConsumoInsumos"
            class="table-divided table-responsive order-with-arrow"
            :api-url="apiBaseConsumoMedicamento"
            :query-params="makeQueryParamsConsumoInsumo"
            :per-page="perPage"
            :reactive-api-url="true"
            :fields="fieldsConsumoInsumo"

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
            :fields="fieldsConsumoInsumo"
            pagination-path
            @vuetable:pagination-data="onPaginationDataConsumoInsumo"
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
            @vuetable-pagination:change-page="onChangePageConsumo"
          />
        </b-tab>
      </b-tabs>
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
                    @click="showModal('modal-ver-honorarios'); getDataHonorarios(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver honorarios</b-button>

                  <b-button
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
                   >Ver consumo</b-button>
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
          name: 'nacimiento',
          sortField: 'nacimiento',
          title: 'Fecha de nacimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'genero',
          sortField: 'genero',
          title: 'Género',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_encargado',
          sortField: 'nombre_encargado',
          title: 'Nombre de encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'contacto_encargado',
          sortField: 'contacto_encargado',
          title: 'Contacto de encargado',
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
          name: 'descripcion',
          sortField: 'descripcion',
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
      if (me.servicio !== null && me.form.cantidad !== null) {
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
          total: this.honorario.total
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
        loading(true)
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
        loading(false)
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
        loading(false)
      })
    },
    onSearchMedicos (search, loading) {
      if (search.length) {
        loading(true)
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
        loading(true)
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
          loading(false)
        })
    },
    onSearchQuirugicos (search, loading) {
      if (search.length) {
        loading(true)
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
        loading(true)
        this.searchingComunes(search, loading)
      }
      loading(false)
    },
    searchingComunes (search, loading) {
      axios.get(apiUrl + '/comun/list'
      ).then((response) => {
        this.medicamentos = response.data.map(medicamento => ({
          value: medicamento.id,
          text: medicamento.nombre,
          existencias_actuales: medicamento.existencia_actual,
          precio_venta: medicamento.precio_venta
        }))
        loading(false)
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
      console.log(medicine_)
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
          this.$refs['modal-ver-consumos'].show()
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
        /* eslint-disable */console.log(...oo_oo(`1319611087_605_8_605_34_4`,response.data))
      })
    },
    onState () {
      let me = this
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption,
          estado_anterior: 1,
          motivo: this.motivoTrasladoHospi
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

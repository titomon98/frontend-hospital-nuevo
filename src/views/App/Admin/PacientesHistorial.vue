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

    <!-- Ver receta / evolución / órdenes / notas de enfermería (modal reutilizado, solo lectura) -->
    <b-modal size="lg" id="modal-ver-receta" ref="modal-ver-receta" :title="tituloVer">
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
          :row-class="tituloVer === 'Ver notas de enfermería del paciente' ? getRowClass : () => ''"
        >
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationReceta"
          @vuetable-pagination:change-page="onChangePageReceta"
        />
      <template #modal-footer="{}">
        <b-button variant="secondary" @click="closeModal('ver-receta')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>

    <!-- Ver servicios consumidos (cliente sin rol 9/10) -->
    <b-modal id="modal-ver-servicio" size="lg" ref="modal-ver-servicio" title="Ver servicio">
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
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationConsumo"
          @vuetable-pagination:change-page="onChangePageConsumo"
        />
      <template #modal-footer="{}">
        <b-button variant="secondary" @click="closeModal('ver-servicio')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>

    <!-- Ver servicios consumidos (rol 9/10, sin columna subtotal) -->
    <b-modal id="modal-ver-servicio2" size="lg" ref="modal-ver-servicio2" title="Ver servicios">
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
          :fields="fieldsConsumo2"
          pagination-path
          @vuetable:pagination-data="onPaginationDataConsumo"
        >
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationConsumo"
          @vuetable-pagination:change-page="onChangePageConsumo"
        />
      <template #modal-footer="{}">
        <b-button variant="secondary" @click="closeModal('ver-servicio2')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>

    <!-- Ver honorarios (solo lectura, sin edición inline) -->
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

      <b-table striped hover :items="honorarios" :fields="fieldsHonorarios"></b-table>

      <h4>
        Total de honorarios: {{ honorarios.reduce((acc, item) => acc + parseFloat(item.total || 0), 0).toFixed(2) }}
      </h4>

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

    <!-- Ver resultados de examen de laboratorio -->
    <b-modal size="lg" id="modal-ver-resultados" ref="modal-ver-resultados" title="Ver Resultados">
      <template v-if="resultados">
        <b-table small striped hover :items="resultados" :fields="campos">
          <template #cell(fecha_hora)="data">
            {{ new Date(data.item.fecha_hora).toLocaleString() }}
          </template>
          <template #cell(valor_minimo)="data">
            {{ parseFloat(data.item.valor_minimo).toFixed(2) }}
          </template>
          <template #cell(valor_maximo)="data">
            {{ parseFloat(data.item.valor_maximo).toFixed(2) }}
          </template>
        </b-table>
      </template>
      <template v-else>
        <p class="text-center">No hay resultados para mostrar</p>
      </template>
    </b-modal>

    <!-- Ver exámenes realizados (sin formulario de agregar) -->
    <b-modal id="modal_ver_examenes" size="xl" ref="modal_ver_examenes" title="Exámenes realizados">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-row>
        <b-col sm="12">
          <table class="table">
            <thead>
              <tr>
                <th>Acciones</th>
                <th>Nombre</th>
                <th>CUI</th>
                <th>Examen Realizado</th>
                <th>Fecha y Hora</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in item_examenes" :key="row.id">
                <td>
                  <b-button @click="verResultado(row.id)" variant="success">Ver resultado</b-button>
                </td>
                <td>{{ row.nombre }}</td>
                <td>{{ row.cui }}</td>
                <td>{{ row.nombre_examen }}</td>
                <td>{{ row.fecha_hora }}</td>
              </tr>
            </tbody>
          </table>
        </b-col>
      </b-row>
      <template #modal-footer="{}">
        <b-button variant="secondary" @click="closeModal('modal_ver_examenes')"
          >Cerrar</b-button
        >
      </template>
    </b-modal>

    <!-- Ver consumos de insumos (medicamentos/anestésicos/quirúrgico/común), repetido por cada cuenta -->
    <b-modal id="modal-ver-consumos-insumos" size="xl" ref="modal-ver-consumos-insumos" title="Consumos">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>

      <div v-if="cuentasConsumo.length === 0" class="text-center my-3">
        No hay cuentas registradas para este paciente.
      </div>

      <div v-for="cuenta in cuentasConsumo" :key="cuenta.id" class="mb-4">
        <h5 class="mt-3">Cuenta #{{ cuenta.numero }}</h5>
        <b-tabs content-class="mt-3">
          <b-tab title="Medicamento" active>
            <vuetable
              :ref="'vuetableMed_' + cuenta.id"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiUrl + '/detalle_consumo_medicamentos/list/' + cuenta.id + '/'"
              :query-params="makeQueryParamsConsumoInsumo"
              data-path="data"
              pagination-path=""
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoMedicamento"
              :row-class="getRowClass"
            ></vuetable>
          </b-tab>
          <b-tab title="Anestésicos">
            <vuetable
              :ref="'vuetableAnes_' + cuenta.id"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiUrl + '/detalle_consumo_medicamentos/listAnestesicos/' + cuenta.id + '/'"
              :query-params="makeQueryParamsConsumoInsumo"
              data-path="data"
              pagination-path=""
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoMedicamento"
              :row-class="getRowClass"
            ></vuetable>
          </b-tab>
          <b-tab title="Quirúrgico">
            <vuetable
              :ref="'vuetableQui_' + cuenta.id"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiUrl + '/detalle_consumo_quirugicos/list/' + cuenta.id + '/'"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumoQuirurgico"
              :row-class="getRowClass"
            ></vuetable>
          </b-tab>
          <b-tab title="Común">
            <vuetable
              :ref="'vuetableCom_' + cuenta.id"
              class="table-divided table-responsive order-with-arrow"
              :api-url="apiUrl + '/detalle_consumo_comun/list/' + cuenta.id + '/'"
              :query-params="makeQueryParamsConsumoInsumo"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fieldsConsumoInsumo"
              :row-class="getRowClass"
            ></vuetable>
          </b-tab>
        </b-tabs>
      </div>

      <template #modal-footer>
        <b-button variant="secondary" @click="closeModal('ver-consumos-insumos')">Cerrar</b-button>
      </template>
    </b-modal>

    <!-- Historial de cuentas (resumen de montos), reutilizado tal cual -->
    <b-modal id="HistorialCuenta" title="Historial de las Cuentas" size="lg">
      <div class="modal-body">
        <p><strong>Total consumo de servicios:</strong> Q{{ reporteHisotiral.ConsumoTotal }}</p>
        <p><strong>Total consumo de materiales comunes:</strong> Q{{ reporteHisotiral.ConsumoComunTotal }}</p>
        <p><strong>Total consumo de medicamentos:</strong> Q{{ reporteHisotiral.ConsumoMedicamentosTotal }}</p>
        <p><strong>Total consumo de materiales quirúrgicos:</strong> Q{{ reporteHisotiral.ConsumoQuirurgicosTotal }}</p>
        <p><strong>Total de exámenes realizados:</strong> Q{{ reporteHisotiral.ExamenesTotal }}</p>
        <p><strong>Total de servicios en sala de operaciones:</strong> Q{{ reporteHisotiral.ServicioSalaOperacionesTotal }}</p>
        <hr />
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
            <h4 class="card-title mt-3">Historial de Pacientes</h4>
            <div class="iq-search-bar mt-2">
              <b-form action="#" class="searchbox">
                <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                <a class="search-link" href="#"><i class="ri-search-line"></i></a>
              </b-form>
            </div>
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
              <template slot="actions" slot-scope="props">
                <div class="button-container">
                  <b-button
                    @click="verReceta(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm" variant="dark"
                  >Ver recetas</b-button>

                  <b-button @click="mostrarVerServicio(props.rowData.id)" class="mb-2 button-spacing" size="sm" variant="dark">Ver
                    servicios</b-button>

                  <b-button @click="verHonorarios(props.rowData.id)"
                    class="mb-2 button-spacing" size="sm" variant="dark">Ver honorarios</b-button>

                  <b-button
                    @click="verExamenes(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Ver Examen</b-button>

                  <b-button
                    v-b-tooltip.top="'Ver consumos'"
                    @click="mostrarModalConsumos(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Consumos</b-button>

                  <b-button
                    @click="generarHistorialCuentas(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                   >Historial Cuenta</b-button>

                  <b-button
                    @click="verEvolucion(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver evolución</b-button>

                  <b-button
                    @click="verOrden(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver órdenes médicas</b-button>

                  <b-button
                    @click="verNotasEnfermeria(props.rowData.id)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Ver notas de enfermería</b-button>
                </div>
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
import DatatableHeading from '../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap.vue'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import moment from 'moment'
import { mapGetters } from 'vuex'
import JsPDF from 'jspdf'
import 'jspdf-autotable'

export default {
  name: 'PacientesHistorial',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
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
      apiUrl: apiUrl,
      from: 0,
      to: 0,
      total: 0,
      perPage: 25,
      search: '',
      tituloVer: '',
      resultados: null,
      campos: [
        { key: 'campo', label: 'Campo' },
        { key: 'tipo_examen', label: 'Tipo de Examen' },
        { key: 'unidades', label: 'Unidades' },
        { key: 'resultado', label: 'Resultado' },
        { key: 'valor_minimo', label: 'Valor Mínimo' },
        { key: 'valor_maximo', label: 'Valor Máximo' },
        { key: 'alarma', label: 'Alarma' },
        { key: 'fecha_hora', label: 'Fecha/Hora' }
      ],
      item_examenes: [],
      apiBase: apiUrl + '/expedientes/listPacientesHistorial',
      apiBaseReceta: '',
      apiBaseConsumo: '',
      idCuentaSeleccionada: null,
      cuentasConsumo: [],
      honorarios: [],
      currentExpedienteId: null,
      pagination: {
        currentPage: 1,
        perPage: 10,
        total: 0
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      dataPDF_Historial: null,
      reporteHisotiral: {
        ConsumoTotal: '0.00',
        ConsumoComunTotal: '0.00',
        ConsumoMedicamentosTotal: '0.00',
        ConsumoQuirurgicosTotal: '0.00',
        ExamenesTotal: '0.00',
        ServicioSalaOperacionesTotal: '0.00',
        TotalDeuda: '0.00'
      },
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
          name: 'created_by',
          sortField: 'created_by',
          title: 'Creado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Fecha y hora de creación',
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
      fieldsConsumo2: [
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
          name: 'comune.presentacione.nombre',
          sortField: 'comune.presentacione.nombre',
          title: 'Presentación',
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
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Administrado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Fecha y hora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de distribución',
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
          name: 'quirurgico.presentacione.nombre',
          sortField: 'quirurgico.presentacione.nombre',
          title: 'Presentación',
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
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Administrado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Fecha y hora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de distribución',
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
          name: 'medicamento.presentacione.nombre',
          sortField: 'medicamento.presentacione.nombre',
          title: 'Presentación',
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
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Administrado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'createdAt',
          sortField: 'createdAt',
          title: 'Fecha y hora',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Lugar de distribución',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsHonorarios: [
        { key: 'medico', label: 'Nombre del Médico' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'total', label: 'Total' },
        { key: 'createdAt', label: 'Fecha y Hora' },
        { key: 'updated_by', label: 'Creado por' }
      ]
    }
  },
  methods: {
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    closeModal (modal) {
      this.$bvModal.hide('modal-' + modal)
      this.$bvModal.hide(modal)
    },
    getRowClass (rowData) {
      if (!rowData.createdAt) return ''
      const partes = rowData.createdAt.split(' ')
      if (partes.length < 2) return ''
      const hora = parseInt(partes[1].split(':')[0])
      return (hora >= 7 && hora < 19) ? 'fila-dia' : 'fila-noche'
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
    formatearMonto (monto) {
      const montoNumerico = parseFloat(monto)
      if (isNaN(montoNumerico)) {
        return '0.00'
      }
      return montoNumerico.toFixed(2)
    },
    /* LISTADO PRINCIPAL */
    makeQueryParams (sortOrder, currentPage, perPage) {
      return {
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
    /* VER RECETA / EVOLUCION / ORDENES / NOTAS (filtran por id_expediente directo) */
    getDataRecetas (id) {
      this.apiBaseReceta = apiUrl + `/recetas/getId?id=${id}`
    },
    getDataEvoluciones (id) {
      this.apiBaseReceta = apiUrl + `/evoluciones/getId?id=${id}`
    },
    getDataOrdenes (id) {
      this.apiBaseReceta = apiUrl + `/ordenes/getId?id=${id}`
    },
    getDataNotas (id) {
      this.apiBaseReceta = apiUrl + `/notas/getId?id=${id}`
    },
    verReceta (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataRecetas(id)
      this.tituloVer = 'Ver receta'
    },
    verEvolucion (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataEvoluciones(id)
      this.tituloVer = 'Ver evolución del paciente'
    },
    verOrden (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataOrdenes(id)
      this.tituloVer = 'Ver órdenes del paciente'
    },
    verNotasEnfermeria (id) {
      this.$refs['modal-ver-receta'].show()
      this.getDataNotas(id)
      this.tituloVer = 'Ver notas de enfermería del paciente'
    },
    makeQueryParamsReceta (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
        order: sortOrder[0] ? sortOrder[0].direction : 'desc',
        page: currentPage,
        limit: this.perPage
      }
    },
    onPaginationDataReceta (paginationData) {
      this.$refs.paginationReceta.setPaginationData(paginationData)
    },
    onChangePageReceta (page) {
      this.$refs.vuetableRecetas.changePage(page)
    },
    /* VER SERVICIOS (consumos) - usa la cuenta activa/más reciente vía /consumos/getId */
    mostrarVerServicio (id) {
      if ([9, 10].includes(this.currentUser.user_type)) {
        this.$refs['modal-ver-servicio2'].show()
      } else {
        this.$refs['modal-ver-servicio'].show()
      }
      this.getDataConsumos(id)
    },
    getDataConsumos (id) {
      this.apiBaseConsumo = apiUrl + `/consumos/getId?id=${id}`
    },
    makeQueryParamsConsumo (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
        order: sortOrder[0] ? sortOrder[0].direction : 'desc',
        page: currentPage,
        limit: this.perPage
      }
    },
    onPaginationDataConsumo (paginationData) {
      this.$refs.paginationConsumo.setPaginationData(paginationData)
    },
    onChangePageConsumo (page) {
      this.$refs.vuetableConsumos.changePage(page)
    },
    /* VER HONORARIOS (todas las cuentas, sin edición) */
    async verHonorarios (id) {
      this.currentExpedienteId = id
      this.pagination.currentPage = 1
      this.$refs['modal-ver-honorarios'].show()
      await this.getDataHonorarios(id)
    },
    async getDataHonorarios (idExpediente) {
      try {
        const response = await axios.get(apiUrl + `/expedientes/getCuentasExpediente/${idExpediente}`)
        const idsCuentas = (response.data.cuentas || []).map(c => c.id)

        if (idsCuentas.length === 0) {
          this.honorarios = []
          this.pagination.total = 0
          return
        }

        const resultados = await Promise.all(
          idsCuentas.map(idCuenta =>
            axios.get(apiUrl + `/detalle_honorarios/getSearch?search=${idCuenta}&page=1&limit=100`)
          )
        )

        const todos = resultados.flatMap(r => r.data.data || [])
        this.honorarios = todos.map(item => ({
          id: item.id,
          medico: item.medico ? item.medico.nombre : '',
          descripcion: item.descripcion,
          total: parseFloat(item.total).toFixed(2),
          createdAt: moment(item.createdAt).format('DD/MM/YYYY h:mm A'),
          updated_by: item.updated_by
        }))
        this.pagination.total = this.honorarios.length
      } catch (error) {
        console.error('Error al obtener los honorarios:', error)
        this.alertErrorText = 'No se pudieron obtener los honorarios de este paciente'
        this.showAlertError()
      }
    },
    onChangePageHonorario (page) {
      this.pagination.currentPage = page
    },
    /* VER EXAMENES DE LABORATORIO (todas las cuentas de laboratorio del expediente) */
    async verExamenes (id) {
      try {
        const response = await axios.get(apiUrl + `/Examenes_realizados/listCui/${id}`)
        this.item_examenes = response.data
        this.$refs['modal_ver_examenes'].show()
      } catch (error) {
        console.error('Error al obtener los exámenes:', error)
        this.alertErrorText = 'No se pudieron obtener los exámenes de este paciente'
        this.showAlertError()
      }
    },
    async verResultado (id) {
      try {
        const response = await axios.get(apiUrl + `/detalleExamenRealizado/list?id=${id}`)
        if (response.data.data.length < 1) {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'El examen aun no posee resultados'
        } else {
          this.resultados = response.data.data
          this.$refs['modal-ver-resultados'].show()
        }
      } catch (error) {
        console.error('Error cargando resultados:', error)
      }
    },
    /* VER CONSUMOS DE INSUMOS, UNA SECCION POR CADA CUENTA */
    async mostrarModalConsumos (idExpediente) {
      try {
        const response = await axios.get(apiUrl + `/expedientes/getCuentasExpediente/${idExpediente}`)
        this.cuentasConsumo = response.data.cuentas || []
        this.$refs['modal-ver-consumos-insumos'].show()
      } catch (error) {
        console.error('Error al obtener las cuentas del paciente:', error)
        this.alertErrorText = 'No se pudieron obtener las cuentas de este paciente'
        this.showAlertError()
      }
    },
    makeQueryParamsConsumoInsumo (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
        order: sortOrder[0] ? sortOrder[0].direction : 'desc',
        page: currentPage,
        limit: this.perPage
      }
    },
    /* HISTORIAL DE CUENTAS (resumen de montos), reutilizado tal cual */
    generarHistorialCuentas (id) {
      axios.get(apiUrl + `/consumos/historial/${id}`)
        .then((response) => {
          const historial = response.data
          this.dataPDF_Historial = response.data
          this.mostrarHistorial(historial)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    mostrarHistorial (historial) {
      let totalDeuda = 0

      const ConsumoTotal = historial.Consumo.reduce((acc, item) => acc + (parseFloat(item.subtotal) || 0), 0)
      const ConsumoComunTotal = historial['Consumo Comun'].reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)
      const ConsumoMedicamentosTotal = historial['Consumo Medicamentos'].reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)
      const ConsumoQuirurgicosTotal = historial['Consumo Quirurgicos'].reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)
      const ExamenesTotal = historial.Examenes.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)
      const ServicioSalaOperacionesTotal = historial.ServicioSalaOperaciones.reduce((acc, item) => acc + (parseFloat(item.total) || 0), 0)

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
      doc.setFontSize(12)

      const datos = this.dataPDF_Historial
      if (!datos) {
        doc.text('No hay datos disponibles.', 14, y)
        doc.save('historial_cuenta.pdf')
        return
      }

      if (datos.Consumo && datos.Consumo.length > 0) {
        const consumosData = datos.Consumo.map(consumo => ([
          consumo.descripcion || '',
          consumo.subtotal || '0.00',
          consumo.createdAt ? moment(consumo.createdAt).format('DD/MM/YYYY HH:mm') : ''
        ]))
        doc.text('Consumo de Servicios', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Descripción', 'Subtotal', 'Fecha']], body: consumosData })
        y = doc.lastAutoTable.finalY + 10
      }

      if (datos['Consumo Comun'] && datos['Consumo Comun'].length > 0) {
        const data = datos['Consumo Comun'].map(c => ([c.descripcion || '', c.total || '0.00']))
        doc.text('Consumo de Material Común', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Descripción', 'Total']], body: data })
        y = doc.lastAutoTable.finalY + 10
      }

      if (datos['Consumo Medicamentos'] && datos['Consumo Medicamentos'].length > 0) {
        const data = datos['Consumo Medicamentos'].map(c => ([c.descripcion || '', c.total || '0.00']))
        doc.text('Consumo de Medicamentos', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Descripción', 'Total']], body: data })
        y = doc.lastAutoTable.finalY + 10
      }

      if (datos['Consumo Quirurgicos'] && datos['Consumo Quirurgicos'].length > 0) {
        const data = datos['Consumo Quirurgicos'].map(c => ([c.descripcion || '', c.total || '0.00']))
        doc.text('Consumo de Material Quirúrgico', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Descripción', 'Total']], body: data })
        y = doc.lastAutoTable.finalY + 10
      }

      if (datos.Examenes && datos.Examenes.length > 0) {
        const data = datos.Examenes.map(e => ([e.expediente || '', e.total || '0.00']))
        doc.text('Exámenes Realizados', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Examen', 'Total']], body: data })
        y = doc.lastAutoTable.finalY + 10
      }

      if (datos.ServicioSalaOperaciones && datos.ServicioSalaOperaciones.length > 0) {
        const data = datos.ServicioSalaOperaciones.map(s => ([s.descripcion || '', s.total || '0.00']))
        doc.text('Servicios en Sala de Operaciones', 14, y)
        y += 4
        doc.autoTable({ startY: y, head: [['Descripción', 'Total']], body: data })
        y = doc.lastAutoTable.finalY + 10
      }

      doc.text(`Total general: Q${this.reporteHisotiral.TotalDeuda}`, 14, y)
      doc.save('historial_cuenta.pdf')
    }
  }
}
</script>

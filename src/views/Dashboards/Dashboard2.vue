<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">LABORATORIO BIOMÉDICO E.O. S.A.</h3>
            </div>
          </template>
        </iq-card>
      </b-col>
      <b-col sm="12">
        <iq-card>
          <template v-slot:body>
            <h4 class="card-title">EXAMENES FINALIZADOS</h4>
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
import { xray } from '../../config/pluginInit'
import { apiUrl } from '../../config/constant'
import moment from 'moment'
import DatatableHeading from '../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
export default {
  name: 'Examenes',
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
  data: () => {
    return {
      apiBase3: apiUrl + '/Examenes_realizados/list3',
      from3: 0,
      to3: 0,
      total3: 0,
      perPage3: 5,
      search3: '',
      fechaDesde: null,
      fechaHasta: null,
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
  methods: {
    realizarBusqueda () {
      this.$refs.vuetable.refresh()
      this.fechaDesde = null
      this.fechaHasta = null
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

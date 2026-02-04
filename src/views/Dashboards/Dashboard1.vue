<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">HOSPITAL DE ESPECIALIDADES</h3>
            </div>
          </template>
          <template v-slot:body>
            <h4 class="card-title">EXPEDIENTES ACTIVOS</h4>
            <datatable-heading
              :changePageSize="changePageSizes"
              :searchChange="searchChange"
              :from="from"
              :to="to"
              :total="total"
              :perPage="perPage"
            >
            </datatable-heading>
            <div class="table-responsive">
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
                <!-- Tipo de paciente-->
                <div slot="tipo_paciente" slot-scope="props">
                  <button
                    v-if="props.rowData.cuentas && props.rowData.cuentas.length && props.rowData.cuentas[0].tipo === 1"
                    class="btn btn-success"
                    disabled
                  >
                    PACIENTE HOSPITALIZADO
                  </button>

                  <button
                    v-else-if="props.rowData.cuentas && props.rowData.cuentas.length && props.rowData.cuentas[0].tipo === 2"
                    class="btn btn-warning"
                    disabled
                  >
                    PACIENTE DE EMERGENCIA
                  </button>

                  <button
                    v-else-if="props.rowData.cuentas && props.rowData.cuentas.length && props.rowData.cuentas[0].tipo === 3"
                    class="btn btn-dark"
                    disabled
                  >
                    PACIENTE DE QUIRÓFANO
                  </button>

                  <button
                    v-else-if="props.rowData.cuentas && props.rowData.cuentas.length && props.rowData.cuentas[0].tipo === 4"
                    class="btn btn-light"
                    disabled
                  >
                    PACIENTE AMBULATORIO
                  </button>
                </div>
                <!-- Estado -->
                <div slot="estado" slot-scope="props">
                  <button v-if="props.rowData.estado === 1" type="button" class="btn btn-success" disabled>INGRESADO EN HOSPITAL</button>
                  <button v-if="props.rowData.estado === 2" type="button" class="btn btn-warning" disabled>EGRESADO</button>
                  <button v-if="props.rowData.estado === 3" type="button" class="btn btn-success" disabled>INGRESADO EN QUIRÓFANO</button>
                  <button v-if="props.rowData.estado === 4" type="button" class="btn btn-success" disabled>INGRESADO EN INTENSIVO</button>
                  <button v-if="props.rowData.estado === 5" type="button" class="btn btn-success" disabled>INGRESADO EN EMERGENCIA</button>
                  <button v-if="props.rowData.estado === 6" type="button" class="btn btn-dark" disabled>DESAHUCIADO</button>
                  <button v-if="props.rowData.estado === 7" type="button" class="btn btn-dark" disabled>ALTA MÉDICA</button>
                  <button v-if="props.rowData.estado === 8" type="button" class="btn btn-dark" disabled>EGRESO CONTRAINDICADO</button>
                  <button v-if="props.rowData.estado === 9" type="button" class="btn btn-dark" disabled>REFERIDO A OTRA UBICACIÓN</button>
                  <button v-if="props.rowData.estado === 10" type="button" class="btn btn-dark" disabled>EXPEDIENTE INCOMPLETO</button>
                  <button v-if="props.rowData.estado === 0" type="button" class="btn btn-dark" disabled>FALLECIDO</button>
                </div>
                <!-- Paginacion -->
              </vuetable>
            </div>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
      <b-col md="12" lg="12">
        <b-row>
          <b-col sm="12">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="">
              <template v-slot:body>
                <h4 class="card-title">ESTADO DE HABITACIONES</h4>
                <datatable-heading
                  :changePageSize="changePageSizesHabitaciones"
                  :searchChange="searchChangeHabitaciones"
                  :from="fromHabitaciones"
                  :to="toHabitaciones"
                  :total="totalHabitaciones"
                  :perPage="perPageHabitaciones"
                >
                </datatable-heading>
                <vuetable
                  ref="vuetable_habitaciones"
                  class="table-divided order-with-arrow"
                  :api-url="apiBaseHabitaciones"
                  :query-params="makeQueryParamsHabitaciones"
                  :per-page="perPage"
                  :reactive-api-url="true"
                  :fields="fieldsHabitaciones"
                  pagination-path
                  @vuetable:pagination-data="onPaginationDataHabitaciones"
                >
                  <!-- Estado -->
                  <div slot="estado" slot-scope="props">
                    <h5 v-if="props.rowData.estado == 1">
                      <b-badge variant="light"
                        ><h6 class="success"><strong>DISPONIBLE</strong></h6></b-badge
                      >
                    </h5>
                    <h5 v-else-if="props.rowData.estado == 2">
                      <b-badge variant="light"
                        ><h6 class="danger"><strong>OCUPADA</strong></h6></b-badge
                      >
                    </h5>
                    <h5 v-else-if="props.rowData.estado == 0">
                      <b-badge variant="light"
                        ><h6 class="danger"><strong>NO DISPONIBLE</strong></h6></b-badge
                      >
                    </h5>
                  </div>
                  <!-- Paginacion -->
                </vuetable>
            <vuetable-pagination-bootstrap
                ref="paginationHabitaciones"
                @vuetable-pagination:change-page="onChangePageHabitaciones"
              />
              </template>
            </iq-card>

          </b-col>

        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import IqCard from '../../components/xray/cards/iq-card'
import axios from 'axios'
import { apiUrl } from '../../config/constant'
import moment from 'moment'
import DatatableHeading from '../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../components/common/VuetablePaginationBootstrap'

export default {
  name: 'Dashboard1',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    IqCard
  },
  mounted () {
    xray.index()
    this.getResultados()
  },
  data: () => {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 10,
      search: '',
      resultsList: [],
      fromHabitaciones: 0,
      toHabitaciones: 0,
      totalHabitaciones: 0,
      perPageHabitaciones: 5,
      searchHabitaciones: '',
      resultsListHabitaciones: [],
      apiBase: apiUrl + '/expedientes/listPanel',
      apiBaseHabitaciones: apiUrl + '/habitaciones/list',
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
        }],
        nextArrow: '<a href="#" class="ri-arrow-left-s-line left"></a>',
        prevArrow: '<a href="#" class="ri-arrow-right-s-line right"></a>'
      },
      fields: [
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
          name: '__slot:tipo_paciente',
          title: 'Tipo de paciente'
        },
        {
          name: 'medico.nombre',
          title: 'Médico asignado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nacimiento',
          sortField: 'nacimiento',
          title: 'Fecha de nacimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'edad',
          title: 'Edad',
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
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      fieldsHabitaciones: [
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Numero',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo',
          sortField: 'tipo',
          title: 'Tipo de habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'costo_diario',
          sortField: 'costo_diario',
          title: 'Costo de habitación',
          dataClass: 'list-item-heading'
        },
        {
          name: 'costo_ambulatorio',
          sortField: 'costo_ambulatorio',
          title: 'Costo ambulatorio',
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
  methods: {
    getResultados () {
      let me = this
      var url = apiUrl + '/resultado/get/'
      axios.get(url).then(function (response) {
        me.resultsList = response.data
      })
    },
    getFecha (fecha) {
      let formato = moment(fecha).format('DD-MM-YYYY hh:mm')
      return formato
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'id',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'id',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
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
    makeQueryParamsHabitaciones (sortOrder, currentPage, perPage) {
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
    changePageSizesHabitaciones (perPage) {
      this.perPage = perPage
      this.$refs.vuetable_habitaciones.refresh()
    },
    searchChangeHabitaciones (val) {
      this.search = val.toLowerCase()
      this.$refs.vuetable_habitaciones.refresh()
    },
    onPaginationData (paginationData) {
      this.from = paginationData.from
      this.to = paginationData.to
      this.total = paginationData.total
      this.lastPage = paginationData.last_page
      this.items = paginationData.data.map(item => {
        item.nacimiento = moment(item.nacimiento).format('DD/MM/YYYY')
        item.edad = this.calcularEdad(item.nacimiento)
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
    onChangePageHabitaciones (page) {
      this.$refs.vuetable_habitaciones.changePage(page)
    },
    onPaginationDataHabitaciones (paginationData) {
      this.fromHabitaciones = paginationData.from
      this.toHabitaciones = paginationData.to
      this.totalHabitaciones = paginationData.total
      this.lastPageHabitaciones = paginationData.last_page
      this.itemsHabitaciones = paginationData.data
      this.$refs.paginationHabitaciones.setPaginationData(paginationData)
    },
    onSearchExpedientes (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingExpedientes(search, loading)
      }
    },
    searchingExpedientes (search, loading) {
      axios.get(apiUrl + '/expedientes/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.expedientes = response.data
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
</style>

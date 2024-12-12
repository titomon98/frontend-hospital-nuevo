<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">Laboratorio Biomedico S.A.</h3>
            </div>
          </template>
          <template v-slot:body>
            <h4 class="card-title">CUENTAS ACTIVAS</h4>
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
              <!-- Paginacion -->
            </vuetable>
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
      perPage: 5,
      search: '',
      resultsList: [],
      fromHabitaciones: 0,
      toHabitaciones: 0,
      totalHabitaciones: 0,
      perPageHabitaciones: 5,
      searchHabitaciones: '',
      resultsListHabitaciones: [],
      apiBase: apiUrl + '/Examenes_realizados/list',
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
      doctorList: [
        { name: 'Datos de prueba', img: require('../../assets/images/user/05.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/06.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/07.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/08.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/09.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/10.jpg'), position: 'Para limpieza', worksAt: 'Hospital de especialidades' }
      ],
      fields: [
        {
          name: 'numero_muestra',
          sortField: 'numero_muestra',
          title: 'Numero de orden examen',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_examen',
          sortField: 'nombre_examen',
          title: 'Tipo Examen',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre',
          sortField: 'nombre',
          title: 'Paciente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'comision',
          sortField: 'comision',
          title: 'Medico',
          dataClass: 'list-item-heading'
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
      }).catch(function (error) {
        console.log(error)
      })
    },
    getFecha (fecha) {
      let formato = moment(fecha).format('DD-MM-YYYY hh:mm')
      return formato
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'numero',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'numero',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
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
        item.fecha_ingreso = moment(item.fecha_ingreso).format('DD/MM/YYYY')
        return {
          fecha_ingreso: item.fecha_ingreso
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

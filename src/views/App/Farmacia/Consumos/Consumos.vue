<template>
    <b-container fluid>
      <b-row>
        <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <div class="center-text">
              <h3 class="card-title">HISTORIAL DE CONSUMO DE MEDICAMENTOS, MATERIAL COMUN Y QUIRURGICO</h3>
            </div>
          </template>
          <template v-slot:body>
            <h4 class="card-title">CONSUMO DE MEDICAMENTOS</h4>
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
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:body>
            <h4 class="card-title">CONSUMO DE MATERIAL COMUN</h4>
            <div class="row mb-3">
              <div class="col-md-4">
                <b-form-group label="Fecha Desde:">
                  <b-form-input type="date" v-model="fechaDesdeComun"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Fecha Hasta:">
                  <b-form-input type="date" v-model="fechaHastaComun"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-button variant="primary" @click="realizarBusquedaComun">Buscar</b-button>
              </div>
            </div>
            <datatable-heading
              :changePageSize="changePageSizesComun"
              :searchChange="searchChangeComun"
              :from="fromComun"
              :to="toComun"
              :total="totalComun"
              :perPage="perPageComun"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable_Comun"
              class="table-divided order-with-arrow"
              :api-url="apiBaseComun"
              :query-params="makeQueryParamsComun"
              :per-page="perPageComun"
              :reactive-api-url="true"
              :fields="fieldsComun"
              pagination-path
              @vuetable:pagination-data="onPaginationDataComun"
            >
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="paginationComun"
                @vuetable-pagination:change-page="onChangePageComun"
              />
          </template>
        </iq-card>
      </b-col>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:body>
            <h4 class="card-title">CONSUMO DE MATERIAL QUIRURGICO</h4>
            <div class="row mb-3">
              <div class="col-md-4">
                <b-form-group label="Fecha Desde:">
                  <b-form-input type="date" v-model="fechaDesdeQuirurgico"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-form-group label="Fecha Hasta:">
                  <b-form-input type="date" v-model="fechaHastaQuirurgico"></b-form-input>
                </b-form-group>
              </div>
              <div class="col-md-4">
                <b-button variant="primary" @click="realizarBusquedaQuirurgico">Buscar</b-button>
              </div>
            </div>
            <datatable-heading
              :changePageSize="changePageSizesQuirurgico"
              :searchChange="searchChangeQuirurgico"
              :from="fromQuirurgico"
              :to="toQuirurgico"
              :total="totalQuirurgico"
              :perPage="perPageQuirurgico"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable_Quirurgico"
              class="table-divided order-with-arrow"
              :api-url="apiBaseQuirurgico"
              :query-params="makeQueryParamsQuirurgico"
              :per-page="perPageQuirurgico"
              :reactive-api-url="true"
              :fields="fieldsQuirurgico"
              pagination-path
              @vuetable:pagination-data="onPaginationDataQuirurgico"
            >
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="paginationQuirurgico"
                @vuetable-pagination:change-page="onChangePageQuirurgico"
              />
          </template>
        </iq-card>
      </b-col>
      </b-row>
    </b-container>
  </template>

<script>
import { xray } from '../../../../config/pluginInit'
import IqCard from '../../../../components/xray/cards/iq-card'
// import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import moment from 'moment'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'

export default {
  name: 'Consumos',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    IqCard
  },
  mounted () {
    xray.index()
  },
  data: () => {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      fechaDesde: null,
      fechaHasta: null,
      apiBase: apiUrl + '/detalle_consumo_medicamentos/list',
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
          name: 'numero_cuenta',
          sortField: 'numero_cuenta',
          title: 'Número de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_medicamento',
          sortField: 'nombre_medicamento',
          title: 'Medicamento Consumido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad Consumida',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_consumo',
          sortField: 'fecha_consumo',
          title: 'Fecha de Consumo',
          dataClass: 'list-item-heading'
        }
      ],
      fromComun: 0,
      toComun: 0,
      totalComun: 0,
      perPageComun: 5,
      searchComun: '',
      fechaDesdeComun: null,
      fechaHastaComun: null,
      apiBaseComun: apiUrl + '/detalle_consumo_comun/list',
      fieldsComun: [
        {
          name: 'numero_cuenta',
          sortField: 'numero_cuenta',
          title: 'Número de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_material',
          sortField: 'nombre_material',
          title: 'Material Consumido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad Consumida',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_consumo',
          sortField: 'fecha_consumo',
          title: 'Fecha de Consumo',
          dataClass: 'list-item-heading'
        }
      ],
      fromQuirurgico: 0,
      toQuirurgico: 0,
      totalQuirurgico: 0,
      perPageQuirurgico: 5,
      searchQuirurgico: '',
      fechaDesdeQuirurgico: null,
      fechaHastaQuirurgico: null,
      apiBaseQuirurgico: apiUrl + '/detalle_consumo_medicamentos/list',
      fieldsQuirurgico: [
        {
          name: 'numero_cuenta',
          sortField: 'numero_cuenta',
          title: 'Número de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_material',
          sortField: 'nombre_material',
          title: 'Material Consumido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad Consumida',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_consumo',
          sortField: 'fecha_consumo',
          title: 'Fecha de Consumo',
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
        item.fecha_consumo = moment(item.fecha_consumo).format('DD/MM/YYYY HH:mm')
        item.cantidad = parseInt(item.cantidad)
        return {
          numero_cuenta: item.numero_cuenta,
          nombre_medicamento: item.nombre_medicamento,
          cantidad: item.cantidad,
          fecha_consumo: item.fecha_consumo
        }
      })
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },

    realizarBusquedaComun () {
      this.$refs.vuetable_Comun.refresh()
      this.fechaDesdeComun = null
      this.fechaHastaComun = null
    },
    makeQueryParamsComun (sortOrderComun, currentPageComun, perPage) {
      return {
        criterio: sortOrderComun[0] ? sortOrderComun[0].sortField : 'createdAt',
        order: sortOrderComun[0] ? sortOrderComun[0].direction : 'desc',
        page: currentPageComun,
        limit: this.perPageComun,
        search: this.searchComun,
        fechaDesde: this.fechaDesdeComun ? moment(this.fechaDesdeComun).format('YYYY-MM-DD') : null,
        fechaHasta: this.fechaHastaComun ? moment(this.fechaHastaComun).format('YYYY-MM-DD') : null
      }
    },
    changePageSizesComun (perPage) {
      this.perPageComun = perPage
      this.$refs.vuetable_Comun.refresh()
    },
    searchChangeComun (val) {
      this.searchComun = val.toLowerCase()
      this.$refs.vuetable_Comun.refresh()
    },
    onPaginationDataComun (paginationData) {
      this.fromComun = paginationData.from
      this.toComun = paginationData.to
      this.totalComun = paginationData.total
      this.lastPageComun = paginationData.last_page
      this.itemsComun = paginationData.data.map(item => {
        item.fecha_consumo = moment(item.fecha_consumo).format('DD/MM/YYYY HH:mm')
        item.cantidad = parseInt(item.cantidad)
        return {
          numero_cuenta: item.numero_cuenta,
          nombre_material: item.nombre_material,
          cantidad: item.cantidad,
          fecha_consumo: item.fecha_consumo
        }
      })
      this.$refs.paginationComun.setPaginationData(paginationData)
    },
    onChangePageComun (page) {
      this.$refs.vuetable_Comun.changePage(page)
    },

    realizarBusquedaQuirurgico () {
      this.$refs.vuetable_Quirurgico.refresh()
      this.fechaDesdeQuirurgico = null
      this.fechaHastaQuirurgico = null
    },
    makeQueryParamsQuirurgico (sortOrderQuirurgico, currentPageQuirurgico, perPage) {
      return {
        criterio: sortOrderQuirurgico[0] ? sortOrderQuirurgico[0].sortField : 'createdAt',
        order: sortOrderQuirurgico[0] ? sortOrderQuirurgico[0].direction : 'desc',
        page: currentPageQuirurgico,
        limit: this.perPageQuirurgico,
        search: this.searchQuirurgico,
        fechaDesde: this.fechaDesdeQuirurgico ? moment(this.fechaDesdeQuirurgico).format('YYYY-MM-DD') : null,
        fechaHasta: this.fechaHastaQuirurgico ? moment(this.fechaHastaQuirurgico).format('YYYY-MM-DD') : null
      }
    },
    changePageSizesQuirurgico (perPage) {
      this.perPageQuirurgico = perPage
      this.$refs.vuetable_Quirurgico.refresh()
    },
    searchChangeQuirurgico (val) {
      this.search = val.toLowerCase()
      this.$refs.vuetable_Quirurgico.refresh()
    },
    onPaginationDataQuirurgico (paginationData) {
      this.fromQuirurgico = paginationData.from
      this.toQuirurgico = paginationData.to
      this.totalQuirurgico = paginationData.total
      this.lastPageQuirurgico = paginationData.last_page
      this.itemsQuirurgico = paginationData.data.map(item => {
        item.fecha_consumo = moment(item.fecha_consumo).format('DD/MM/YYYY HH:mm')
        item.cantidad = parseInt(item.cantidad)
        return {
          numero_cuenta: item.numero_cuenta,
          nombre_material: item.nombre_material,
          cantidad: item.cantidad,
          fecha_consumo: item.fecha_consumo
        }
      })
      this.$refs.paginationQuirurgico.setPaginationData(paginationData)
    },
    onChangePageQuirurgico (page) {
      this.$refs.vuetable_Quirurgico.changePage(page)
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
</style>

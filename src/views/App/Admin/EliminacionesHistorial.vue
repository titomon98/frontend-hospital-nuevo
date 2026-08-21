<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Historial de eliminaciones</h4>
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
              <template slot="createdAt" slot-scope="props">
                {{ formatearFecha(props.rowData.createdAt) }}
              </template>
              <template slot="tenia_consumos" slot-scope="props">
                <b-badge :variant="props.rowData.tenia_consumos ? 'warning' : 'secondary'">
                  {{ props.rowData.tenia_consumos ? 'Sí' : 'No' }}
                </b-badge>
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
import { apiUrl } from '../../../config/constant'
import moment from 'moment'

export default {
  name: 'EliminacionesHistorial',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      apiBase: apiUrl + '/expedientes/listEliminaciones',
      from: 0,
      to: 0,
      total: 0,
      perPage: 25,
      search: '',
      fields: [
        { name: 'nombre_paciente', sortField: 'nombre_paciente', title: 'Paciente', dataClass: 'list-item-heading' },
        { name: 'numero_expediente', sortField: 'numero_expediente', title: 'Expediente', dataClass: 'list-item-heading' },
        { name: 'area', sortField: 'area', title: 'Área', dataClass: 'list-item-heading' },
        { name: 'motivo', sortField: 'motivo', title: 'Motivo', dataClass: 'list-item-heading' },
        { name: 'total_cuenta', sortField: 'total_cuenta', title: 'Total cuenta', dataClass: 'list-item-heading' },
        { name: '__slot:tenia_consumos', sortField: 'tenia_consumos', title: '¿Tenía consumos?', dataClass: 'list-item-heading' },
        { name: 'created_by', sortField: 'created_by', title: 'Eliminado por', dataClass: 'list-item-heading' },
        { name: '__slot:createdAt', sortField: 'createdAt', title: 'Fecha y hora', dataClass: 'list-item-heading' }
      ]
    }
  },
  methods: {
    formatearFecha (fecha) {
      if (!fecha) return ''
      return moment(fecha).format('DD/MM/YYYY hh:mm A')
    },
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
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    }
  }
}
</script>

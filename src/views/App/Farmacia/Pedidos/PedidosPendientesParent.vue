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
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Productos pendientes de surtir</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar producto..." @input="(val) => searchChange(val)" />
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
              <!-- Destino -->
              <div slot="destino" slot-scope="props">
                <b-badge :variant="props.rowData.destino === 2 ? 'info' : 'primary'">
                  {{ props.rowData.destino === 2 ? 'Quirófano' : 'Enfermería' }}
                </b-badge>
              </div>
              <!-- Accion: surtir esta linea -->
              <template slot="acciones" slot-scope="props">
                <b-button
                  v-anti-doble
                  size="sm"
                  variant="primary"
                  @click="surtirLinea(props.rowData)"
                  >Surtir</b-button
                >
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
import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'

export default {
  name: 'Pedidos',
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
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/detalle_pedidos/getPendientes',
      fields: [
        {
          name: 'pedido.codigoPedido',
          sortField: 'id_pedido',
          title: 'Código de Pedido',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Producto',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'text-muted'
        },
        {
          name: '__slot:destino',
          title: 'Destino',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: '__slot:acciones',
          title: 'Acción',
          titleClass: '',
          dataClass: 'text-muted'
        }
      ]
    }
  },
  methods: {
    /* Surtir una linea individual del pedido */
    surtirLinea (item) {
      const me = this
      axios
        .post(apiUrl + '/detallePedidos/surtir', {
          id: item.id
        })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha surtido "' + item.descripcion + '" exitosamente'
          // La linea surtida deja de estar pendiente, se refresca el listado
          // para que desaparezca de la vista.
          me.$refs.vuetable.refresh()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText =
            (error.response && error.response.data && error.response.data.msg) ||
            'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return {
        criterio: sortOrder[0] ? sortOrder[0].sortField : 'id',
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
    }
  }
}
</script>

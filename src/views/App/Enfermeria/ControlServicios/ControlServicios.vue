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
    <b-modal id="modal-desactivar-servicio" ref="modal-desactivar-servicio" title="Eliminar servicio">
      <h6 class="my-4">
        ¿Desea eliminar el servicio "{{ servicioToDelete.nombre_servicio }}" del paciente {{ servicioToDelete.nombre_completo }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onDelete()"
          >Eliminar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-desactivar-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col sm="12">
      <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
        <template v-slot:headerTitle>
          <div class="center-text">
            <h3 class="card-title">HISTORIAL DE SERVICIOS</h3>
          </div>
        </template>
        <template v-slot:body>
          <h4 class="card-title">SERVICIOS CARGADOS A PACIENTES</h4>
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
            :row-class="getRowClass"
          >
            <template slot="actions" slot-scope="props">
              <div class="button-container">
                <b-button
                  v-if="props.rowData.estado === 1"
                  @click="setData(props.rowData)"
                  v-b-modal.modal-desactivar-servicio
                  class="mb-2 button-spacing"
                  size="sm"
                  variant="danger"
                  :disabled="hasPermission([1, 3])"
                >Eliminar registro</b-button>
                <b-button
                  v-else
                  :disabled="true"
                  class="mb-2 button-spacing"
                  size="sm"
                  variant="dark"
                >El registro fue eliminado</b-button>
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
import { xray } from '../../../../config/pluginInit'
import IqCard from '../../../../components/xray/cards/iq-card'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import moment from 'moment'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import { mapGetters } from 'vuex'
import { claseFilaDiaNoche } from '../../../../config/fechas'

export default {
  name: 'ControlServicios',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    IqCard
  },
  mounted () {
    xray.index()
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  data: () => {
    return {
      alertText: '',
      alertCountDown: 0,
      alertSecs: 5,
      alertVariant: '',
      servicioToDelete: {
        id: 0,
        nombre_servicio: '',
        nombre_completo: '',
        numero_cuenta: '',
        responsable: ''
      },
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      fechaDesde: null,
      fechaHasta: null,
      apiBase: apiUrl + '/consumos/listControl',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'numero_cuenta',
          title: 'Número de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_completo',
          title: 'Nombre completo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_servicio',
          title: 'Servicio',
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
          name: 'fecha_consumo',
          sortField: 'createdAt',
          title: 'Fecha',
          dataClass: 'list-item-heading'
        },
        {
          name: 'created_by',
          sortField: 'created_by',
          title: 'Creado por',
          dataClass: 'list-item-heading'
        },
        {
          name: 'updated_by',
          sortField: 'updated_by',
          title: 'Eliminado por',
          dataClass: 'list-item-heading'
        }
      ]
    }
  },
  methods: {
    getRowClass (rowData) {
      return claseFilaDiaNoche(rowData.fecha_consumo)
    },
    realizarBusqueda () {
      this.$refs.vuetable.refresh()
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
      paginationData.data.forEach(item => {
        item.fecha_consumo = moment(item.fecha_consumo).format('DD/MM/YYYY HH:mm')
      })
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    setData (data) {
      this.servicioToDelete = { ...data }
      this.servicioToDelete.responsable = this.currentUser.user
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    onDelete () {
      const me = this
      axios
        .put(apiUrl + '/consumos/deactivateControl', {
          delete: this.servicioToDelete
        })
        .then((response) => {
          me.alertVariant = 'danger'
          me.showAlert()
          me.alertText = response.data
          me.$refs.vuetable.refresh()
          me.$refs['modal-desactivar-servicio'].hide()
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlert()
          me.alertText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!', error)
        })
    },
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
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
  height: 100%;
  text-align: center;
}
.fila-dia {
  background-color: #cfe2ff !important;
}
.fila-noche {
  background-color: #f8d7da !important;
}
</style>

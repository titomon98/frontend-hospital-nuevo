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
    <b-modal id="modal-desactivar" ref="modal-desactivar" title="Eliminar honorario">
      <h6 class="my-4">
        ¿Desea eliminar el honorario de {{ honorarioToDelete.nombre_medico }} al paciente {{ honorarioToDelete.nombre_completo }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()"
          >Eliminar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-desactivar')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col sm="12">
      <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
        <template v-slot:headerTitle>
          <div class="center-text">
            <h3 class="card-title">HISTORIAL DE HONORARIOS MÉDICOS</h3>
          </div>
        </template>
        <template v-slot:body>
          <h4 class="card-title">HONORARIOS MÉDICOS</h4>
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
                  @click="
                    setData(props.rowData, 1)
                  "
                  v-b-modal.modal-desactivar
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

export default {
  name: 'Honorarios',
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
      honorarioToDelete: {
        total: 0,
        fecha_honorario: '',
        nombre_completo: '',
        nombre_medico: '',
        numero_cuenta: '',
        area: 0,
        responsable: ''
      },
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      fechaDesde: null,
      fechaHasta: null,
      apiBase: apiUrl + '/detalle_honorarios/list',
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
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'numero_cuenta',
          sortField: 'numero_cuenta',
          title: 'Número de Cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_completo',
          sortField: 'nombre_completo',
          title: 'Nombre completo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_medico',
          sortField: 'nombre_medico',
          title: 'Médico',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total Honorario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_honorario',
          sortField: 'fecha_honorario',
          title: 'Fecha de Honorarios',
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
      if (!rowData.fecha_honorario) return ''

      const partes = rowData.fecha_honorario.split(' ')
      if (partes.length < 2) return ''

      const hora = parseInt(partes[1].split(':')[0])

      return (hora >= 7 && hora < 19)
        ? 'fila-dia'
        : 'fila-noche'
    },
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
        item.fecha_honorario = moment(item.fecha_honorario).format('DD/MM/YYYY HH:mm')
        item.total = parseInt(item.total)
        return {
          numero_cuenta: item.numero_cuenta,
          nombre_medico: item.nombre_medico,
          total: item.total,
          fecha_honorario: item.fecha_honorario
        }
      })
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    setData (data, area) {
      this.honorarioToDelete = data
      this.honorarioToDelete.area = area
      this.honorarioToDelete.responsable = this.currentUser.user
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    onState () {
      let me = this
      if (this.honorarioToDelete.area === 1) { // Eliminando medicamento
        axios
          .put(apiUrl + '/detalle_honorarios/deactivate', {
            delete: this.honorarioToDelete
          })
          .then((response) => {
            me.alertVariant = 'danger'
            me.showAlert()
            me.alertText = response.data
            me.$refs.vuetable.refresh()
            me.$refs['modal-desactivar'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
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

.fila-dia {
  background-color: #cfe2ff !important;  /* azul claro */
}

.fila-noche {
  background-color: #f8d7da !important;  /* rojo claro */
}
</style>

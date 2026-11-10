<template>
  <b-container fluid>
    <b-alert :variant="alertVariant" :show="alertCountDown" dismissible fade @dismissed="alertCountDown = 0" class="bg-white">
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-modal id="modal-2-account" ref="modal-2-account" :title="pacienteActual ? `${factura ? 'Factura' : 'Guardar Factura'} - ${pacienteActual}` : 'Guardar Factura'" size="xl" @hidden="limpiar">
      <b-alert :show="!!error" dismissible @dismissed="error = ''" class="text-white bg-danger">
        <div class="iq-alert-text">{{ error }}</div>
      </b-alert>
      <div v-if="cargando" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>
      <template v-else>
        <h6>{{ factura ? 'Verificar factura' : 'Generar factura' }}</h6>
        <b-table small hover :items="cuenta ? [cuenta] : []" :fields="fieldsAccounts"></b-table>
        <b-row>
          <b-col md="6">
            <b-form-group label="Nombre de factura">
              <b-input v-model="form.nombre" :disabled="bloqueado('nombre')" @input="form.nombre = $event.toUpperCase()" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="NIT">
              <b-input v-model="form.nit" :disabled="bloqueado('nit')" @input="form.nit = $event.toUpperCase()" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Número">
              <b-input v-model="form.numero" :disabled="bloqueado('numero')" />
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Referencia">
              <b-input v-model="form.referencia" :disabled="bloqueado('referencia_factura')" />
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group v-if="!imagenGuardada" label="Archivo de la factura (imagen o PDF, máximo 5MB)">
          <b-form-file v-model="archivo" accept="image/*,application/pdf" placeholder="Subir un archivo..." drop-placeholder="Suelta el archivo aquí..."></b-form-file>
        </b-form-group>
        <div v-if="imagenVista" class="text-center">
          <iframe :src="imagenVista" width="100%" height="600px"></iframe>
          <b-button variant="primary" @click="descargar">Descargar factura</b-button>
        </div>
      </template>
      <template #modal-footer>
        <b-button v-if="!factura" variant="primary" :disabled="guardando || cargando" @click="guardar">Guardar factura</b-button>
        <b-button v-if="factura && hayEditable" variant="primary" :disabled="guardando" @click="guardar">Guardar cambios</b-button>
        <b-button v-if="factura" variant="warning" :disabled="guardando" @click="cancelarFactura">Cancelar factura</b-button>
        <b-button variant="danger" @click="$bvModal.hide('modal-2-account')">Cerrar</b-button>
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Mostrar facturas</h4>
            <div class="iq-search-bar mt-2">
              <b-form action="#" class="searchbox" @submit.prevent>
                <b-input id="search" placeholder="Buscar por nombre o número de cuenta..." debounce="400" @update="searchChange" />
                <a class="search-link" href="#"><i class="ri-search-line"></i></a>
              </b-form>
            </div>
          </template>
          <template v-slot:body>
            <datatable-heading :changePageSize="changePageSizes" :searchChange="searchChange" :from="from" :to="to" :total="total" :perPage="perPage"></datatable-heading>
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
                <b-button class="mb-2" size="sm" variant="dark" @click="abrir(props.rowData)">Mostrar factura</b-button>
              </template>
              <template slot="factura" slot-scope="props">
                <b-badge v-if="facturaDe(props.rowData.id)" variant="success">No. {{ facturaDe(props.rowData.id).numero }}</b-badge>
                <b-badge v-else variant="light">Sin factura</b-badge>
              </template>
            </vuetable>
            <vuetable-pagination-bootstrap ref="pagination" @vuetable-pagination:change-page="onChangePage" />
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
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import { mapGetters } from 'vuex'

const MAX_ARCHIVO = 5 * 1024 * 1024
const formVacio = () => ({ nombre: '', nit: '', numero: '', referencia: '' })

// Facturas de cuentas cerradas. laboratorio: cuentas del laboratorio (lab_cuentas) en vez de las del hospital.
export default {
  name: 'Facturacion',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  props: { laboratorio: { type: Boolean, default: false } },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      alertSecs: 5,
      alertCountDown: 0,
      alertText: '',
      alertVariant: '',
      error: '',
      cargando: false,
      guardando: false,
      factsList: [],
      cuenta: null,
      factura: null,
      pacienteActual: '',
      form: formVacio(),
      archivo: null,
      imagenNueva: '',
      apiBase: apiUrl + (this.laboratorio ? '/lab_cuentas/payList' : '/cuentas/payList'),
      fields: [
        { name: '__slot:actions', title: 'Acciones', dataClass: 'text-muted' },
        { name: 'expediente.nombres', sortField: 'expediente.nombres', title: 'Nombres', dataClass: 'list-item-heading' },
        { name: 'expediente.apellidos', sortField: 'expediente.apellidos', title: 'Apellidos', dataClass: 'list-item-heading' },
        { name: 'numero', sortField: 'numero', title: 'Número de cuenta', dataClass: 'list-item-heading' },
        // Las cuentas del laboratorio no llevan motivo.
        ...(this.laboratorio ? [] : [{ name: 'motivo', sortField: 'motivo', title: 'Motivo', dataClass: 'list-item-heading' }]),
        { name: 'total', sortField: 'total', title: 'Total', dataClass: 'list-item-heading' },
        { name: '__slot:factura', title: 'Factura', dataClass: 'list-item-heading' }
      ],
      fieldsAccounts: [
        { key: 'numero', label: 'Número' },
        ...(this.laboratorio ? [] : [{ key: 'motivo', label: 'Motivo' }]),
        { key: 'total_pagado', label: 'Total pagado' },
        { key: 'total', label: 'Total' }
      ]
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    campoCuenta () {
      return this.laboratorio ? 'id_cuenta_laboratorio' : 'id_cuenta_hospital'
    },
    imagenGuardada () {
      const img = this.factura && this.factura.imagen
      return img && img.trim() ? img : ''
    },
    imagenVista () {
      return this.imagenGuardada || this.imagenNueva
    },
    // En una factura ya guardada solo se completa lo que quedó vacío.
    hayEditable () {
      return ['nombre', 'nit', 'numero', 'referencia_factura'].some(c => !this.bloqueado(c)) || !this.imagenGuardada
    }
  },
  watch: {
    archivo (file) {
      this.imagenNueva = ''
      if (!file) return
      if (file.size > MAX_ARCHIVO) {
        this.error = 'El tamaño máximo del archivo es de 5MB'
        this.archivo = null
        return
      }
      const reader = new FileReader()
      reader.onload = (e) => { this.imagenNueva = e.target.result }
      reader.readAsDataURL(file)
    }
  },
  mounted () {
    xray.index()
    this.getFacts()
  },
  methods: {
    facturaDe (idCuenta) {
      return this.factsList.find(f => f[this.campoCuenta] === idCuenta && f.estado === 1)
    },
    bloqueado (campo) {
      return !!(this.factura && this.factura[campo] && String(this.factura[campo]).trim())
    },
    limpiar () {
      this.cuenta = null
      this.factura = null
      this.form = formVacio()
      this.archivo = null
      this.imagenNueva = ''
      this.error = ''
    },
    mensajeError (e) {
      return (e.response && e.response.data && e.response.data.msg) || 'Ha ocurrido un error, por favor intente más tarde'
    },
    async abrir (row) {
      this.limpiar()
      const exp = row.expediente || {}
      this.pacienteActual = `${exp.nombres || ''} ${exp.apellidos || ''}`.trim()
      this.cuenta = row
      this.cargando = true
      this.$bvModal.show('modal-2-account')
      try {
        const { data } = await axios.get(apiUrl + '/facturas/get', { params: { [this.campoCuenta]: row.id } })
        this.factura = data || null
        const f = this.factura
        // Factura nueva: nombre y NIT de factura del ingreso (expediente).
        this.form = f
          ? { nombre: f.nombre || '', nit: f.nit || '', numero: f.numero || '', referencia: f.referencia_factura || '' }
          : { ...formVacio(), nombre: (exp.nombre_factura || '').toUpperCase(), nit: (exp.nit_factura || '').toUpperCase() }
      } catch (e) {
        this.error = this.mensajeError(e)
      } finally {
        this.cargando = false
      }
    },
    cuerpo () {
      return {
        id_cuenta_hospital: this.laboratorio ? 0 : this.cuenta.id,
        id_cuenta_laboratoio: this.laboratorio ? this.cuenta.id : 0,
        nombre: this.form.nombre,
        nit: this.form.nit,
        numero: this.form.numero,
        referencia_factura: this.form.referencia,
        imagen: this.imagenNueva || null
      }
    },
    async guardar () {
      const faltan = [['nombre', 'nombre'], ['nit', 'NIT'], ['numero', 'número']].filter(([c]) => !String(this.form[c] || '').trim()).map(([, t]) => t)
      if (faltan.length) {
        this.error = `Ingrese ${faltan.join(', ')} de la factura`
        return
      }
      this.guardando = true
      try {
        if (this.factura) {
          await axios.post(apiUrl + '/facturas/update', this.cuerpo())
        } else {
          await axios.post(apiUrl + '/facturas/create', { ...this.cuerpo(), total: this.cuenta.total_pagado, id_usuario: this.cuenta.id_expediente })
        }
        this.terminar(this.factura ? 'Se han guardado los cambios de la factura' : 'Se ha guardado la factura exitosamente')
      } catch (e) {
        this.error = this.mensajeError(e)
      } finally {
        this.guardando = false
      }
    },
    async cancelarFactura () {
      const ok = await this.$bvModal.msgBoxConfirm(`¿Cancelar la factura No. ${this.factura.numero} de ${this.pacienteActual}? Esta acción no se puede deshacer.`, {
        title: 'Cancelar factura', okTitle: 'Sí, cancelar', cancelTitle: 'No', okVariant: 'danger', centered: true
      })
      if (!ok) return
      this.guardando = true
      try {
        await axios.post(apiUrl + '/facturas/deactivate', this.cuerpo())
        this.terminar('Se ha cancelado la factura exitosamente')
      } catch (e) {
        this.error = this.mensajeError(e)
      } finally {
        this.guardando = false
      }
    },
    terminar (texto) {
      this.alertVariant = 'info'
      this.alertText = texto
      this.alertCountDown = this.alertSecs
      this.$bvModal.hide('modal-2-account')
      this.getFacts()
      this.$refs.vuetable.refresh()
    },
    async getFacts () {
      try {
        const { data } = await axios.get(apiUrl + '/facturas/getList')
        this.factsList = data
      } catch (e) {
        console.error(e)
      }
    },
    descargar () {
      const a = document.createElement('a')
      a.href = this.imagenVista
      a.download = `factura-${this.form.numero || 'sin-numero'}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    makeQueryParams (sortOrder, currentPage) {
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
      this.search = String(val || '').toLowerCase()
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

<template>
  <div>
    <b-alert :show="!!error" variant="danger" class="text-white bg-danger" dismissible @dismissed="error = ''">{{ error }}</b-alert>
    <b-row class="mb-2">
      <b-col md="6"><b-form-input v-model="search" debounce="400" placeholder="Buscar por comprador o número de venta" @update="cargar(1)"></b-form-input></b-col>
      <b-col v-if="!caja" md="6">
        <b-form-radio-group v-model="estado" :options="estados" buttons button-variant="outline-primary" @change="cargar(1)"></b-form-radio-group>
      </b-col>
    </b-row>
    <b-table small striped responsive :items="ventas" :fields="campos" :busy="cargando" show-empty empty-text="No hay ventas libres">
      <template #cell(createdAt)="row">{{ fecha(row.item.createdAt) }}</template>
      <template #cell(comprador)="row">{{ row.item.comprador }}<br><small class="text-muted">{{ row.item.tipo_comprador }}</small></template>
      <template #cell(total)="row">Q{{ Number(row.item.total).toFixed(2) }}</template>
      <template #cell(estado)="row">
        <b-badge :variant="{ 0: 'secondary', 1: 'warning', 2: 'success' }[row.item.estado]">{{ { 0: 'ANULADA', 1: 'POR COBRAR', 2: 'COBRADA' }[row.item.estado] }}</b-badge>
        <div v-if="row.item.estado === 2"><small class="text-muted">{{ fecha(row.item.fecha_cobro) }} - {{ row.item.cobrado_by }}</small></div>
      </template>
      <template #cell(acciones)="row">
        <b-button size="sm" variant="info" class="mr-1 mb-1" @click="abrir(row.item, 'detalle')">Detalle</b-button>
        <template v-if="row.item.estado === 1">
          <b-button v-if="caja" size="sm" variant="success" class="mr-1 mb-1" @click="abrir(row.item, 'cobro')">Cobrar</b-button>
          <template v-else>
            <b-button size="sm" variant="primary" class="mr-1 mb-1" @click="abrir(row.item, 'editar')">Editar</b-button>
            <b-button size="sm" variant="danger" class="mb-1" @click="anular(row.item)">Anular</b-button>
          </template>
        </template>
      </template>
    </b-table>
    <b-pagination v-if="total > limit" v-model="page" :total-rows="total" :per-page="limit" @change="cargar($event)"></b-pagination>

    <b-modal :id="idModal" :title="tituloModal" size="xl" scrollable no-close-on-backdrop hide-footer @hidden="venta = null">
      <b-alert :show="!!error" variant="danger" class="text-white bg-danger" dismissible @dismissed="error = ''">{{ error }}</b-alert>
      <div v-if="!venta" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>
      <venta-libre-form v-else-if="modo === 'editar'" :venta="venta" @guardado="cerrarYRecargar" />
      <div v-else>
        <p><strong>{{ venta.tipo_comprador }}:</strong> {{ venta.comprador }} &nbsp; <strong>Creada:</strong> {{ fecha(venta.createdAt) }} por {{ venta.created_by }}</p>
        <b-table small striped :items="venta.detalles" :fields="camposDetalle">
          <template #cell(cantidad)="row">{{ Number(row.item.cantidad) }}</template>
          <template #cell(precio)="row">Q{{ Number(row.item.precio).toFixed(2) }}</template>
          <template #cell(total)="row">Q{{ Number(row.item.total).toFixed(2) }}</template>
        </b-table>
        <h4>Total: Q{{ Number(venta.total).toFixed(2) }}</h4>
        <div v-if="venta.estado === 2">
          <strong>Pago:</strong>
          <span v-for="m in metodosPagados" :key="m" class="mr-3">{{ m.charAt(0).toUpperCase() + m.slice(1) }}: Q{{ Number(venta[m]).toFixed(2) }}</span>
        </div>
        <div v-if="modo === 'cobro'" class="mt-3">
          <h5>Cobrar</h5>
          <b-row>
            <b-col v-for="m in metodos" :key="m" md="4">
              <b-form-group :label="m.charAt(0).toUpperCase() + m.slice(1)">
                <b-form-input type="number" min="0" step="0.01" v-model.number="pago[m]"></b-form-input>
              </b-form-group>
            </b-col>
          </b-row>
          <p>Suma: <strong :class="sumaPago === Number(venta.total) ? 'text-success' : 'text-danger'">Q{{ sumaPago.toFixed(2) }}</strong> de Q{{ Number(venta.total).toFixed(2) }}</p>
          <b-button variant="success" :disabled="guardando" @click="cobrar">Cobrar venta libre</b-button>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import moment from 'moment'
import { mapGetters } from 'vuex'
import { apiUrl } from '../config/constant'
import VentaLibreForm from './VentaLibreForm'
import { etiquetaTipo } from '../Utils/ventaLibre'

const METODOS = ['efectivo', 'tarjeta', 'deposito', 'cheque', 'transferencia']

// Ventas libres. caja: solo las por cobrar, con "Cobrar". Sin caja (Gerencia): todas, con editar y anular.
export default {
  name: 'VentaLibreLista',
  components: { VentaLibreForm },
  props: { caja: { type: Boolean, default: false } },
  data () {
    return {
      ventas: [],
      total: 0,
      page: 1,
      limit: 15,
      search: '',
      estado: this.caja ? 1 : '',
      estados: [
        { value: '', text: 'TODAS' },
        { value: 1, text: 'POR COBRAR' },
        { value: 2, text: 'COBRADAS' },
        { value: 0, text: 'ANULADAS' }
      ],
      campos: [
        { key: 'id', label: 'No.' },
        { key: 'createdAt', label: 'Fecha' },
        { key: 'comprador', label: 'Comprador' },
        { key: 'total', label: 'Total' },
        { key: 'created_by', label: 'Registró' },
        { key: 'estado', label: 'Estado' },
        { key: 'acciones', label: 'Acciones' }
      ],
      camposDetalle: [
        { key: 'tipo', label: 'Tipo', formatter: etiquetaTipo },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'precio', label: 'Precio' },
        { key: 'total', label: 'Subtotal' }
      ],
      metodos: METODOS,
      idModal: `venta-libre-${this._uid}`,
      modo: 'detalle',
      venta: null,
      pago: {},
      cargando: false,
      guardando: false,
      error: ''
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    tituloModal () {
      return { detalle: 'Detalle de venta libre', editar: 'Editar venta libre', cobro: 'Cobrar venta libre' }[this.modo]
    },
    sumaPago () {
      return Math.round(METODOS.reduce((a, m) => a + (Number(this.pago[m]) || 0), 0) * 100) / 100
    },
    metodosPagados () {
      return METODOS.filter(m => Number(this.venta[m]) > 0)
    }
  },
  created () {
    this.cargar()
  },
  methods: {
    fecha (f) {
      return f ? moment(f).format('DD/MM/YYYY HH:mm') : ''
    },
    async cargar (page) {
      if (page) this.page = page
      this.cargando = true
      try {
        const { data } = await axios.get(apiUrl + '/venta_libre/list', { params: { estado: this.estado, search: this.search, page: this.page, limit: this.limit } })
        this.ventas = data.data
        this.total = data.total
      } catch (e) {
        this.error = 'No se pudieron cargar las ventas libres'
      } finally {
        this.cargando = false
      }
    },
    async abrir (fila, modo) {
      this.modo = modo
      this.venta = null
      this.pago = { efectivo: Number(fila.total) }
      this.$bvModal.show(this.idModal)
      try {
        const { data } = await axios.get(apiUrl + `/venta_libre/${fila.id}`)
        this.venta = data
      } catch (e) {
        this.$bvModal.hide(this.idModal)
        this.error = 'No se pudo cargar la venta libre'
      }
    },
    cerrarYRecargar () {
      this.$bvModal.hide(this.idModal)
      this.cargar()
    },
    mensajeError (e, defecto) {
      return (e.response && e.response.data && e.response.data.msg) || defecto
    },
    async anular (fila) {
      const ok = await this.$bvModal.msgBoxConfirm(
        `¿Anular la venta libre No. ${fila.id} de ${fila.comprador} por Q${Number(fila.total).toFixed(2)}? Lo inventariado regresa a su inventario.`,
        { title: 'Anular venta libre', okTitle: 'Sí, anular', cancelTitle: 'No', okVariant: 'danger', centered: true }
      )
      if (!ok) return
      try {
        await axios.put(apiUrl + `/venta_libre/${fila.id}/anular`, { user: this.currentUser.user })
        this.cargar()
      } catch (e) {
        this.error = this.mensajeError(e, 'No se pudo anular la venta libre')
      }
    },
    async cobrar () {
      if (this.sumaPago !== Number(this.venta.total)) {
        this.error = 'La suma del pago debe ser igual al total'
        return
      }
      this.guardando = true
      try {
        await axios.put(apiUrl + `/venta_libre/${this.venta.id}/cobrar`, { ...this.pago, user: this.currentUser.user })
        this.cerrarYRecargar()
      } catch (e) {
        this.error = this.mensajeError(e, 'No se pudo cobrar la venta libre')
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>

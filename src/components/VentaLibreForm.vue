<template>
  <div>
    <b-alert :show="!!error" variant="danger" class="text-white bg-danger" dismissible @dismissed="error = ''">{{ error }}</b-alert>

    <h5>Comprador</h5>
    <b-form-radio-group v-model="tipoComprador" :options="tiposComprador" buttons button-variant="outline-primary" class="mb-2" @change="limpiarComprador"></b-form-radio-group>
    <b-row>
      <b-col md="8">
        <v-select
          v-model="comprador"
          :options="personas"
          :filterable="false"
          label="nombre"
          :placeholder="tipoComprador === 'cliente' ? 'Buscar cliente o escribir uno nuevo' : 'Buscar...'"
          @search="buscarPersonas"
          @open="buscarPersonas('')"
        >
          <template #no-options>Sin resultados</template>
        </v-select>
      </b-col>
      <b-col v-if="tipoComprador === 'cliente'" md="4">
        <b-form-input v-model="clienteNuevo" placeholder="...o nombre de cliente nuevo" :disabled="!!comprador" @input="clienteNuevo = $event.toUpperCase()"></b-form-input>
      </b-col>
    </b-row>

    <h5 class="mt-4">Agregar</h5>
    <b-form-radio-group v-model="tipoItem" :options="tiposItem" class="mb-2" @change="cargarCatalogo"></b-form-radio-group>
    <v-select
      v-model="itemSeleccionado"
      :options="catalogo"
      label="text"
      :placeholder="tipoItem === 'servicio' ? 'Seleccione el oxígeno' : 'Seleccione el insumo'"
      @input="onItem"
    ></v-select>
    <b-row v-if="tipoItem === 'servicio' && itemSeleccionado" class="mt-2 align-items-end">
      <b-col v-if="oxigenoHora" md="3"><b-form-group label="Horas"><b-form-input type="number" min="0" v-model.number="oxigeno.horas"></b-form-input></b-form-group></b-col>
      <b-col v-if="oxigenoHora" md="3"><b-form-group label="Minutos"><b-form-input type="number" min="0" max="59" v-model.number="oxigeno.minutos"></b-form-input></b-form-group></b-col>
      <b-col v-else-if="oxigenoCilindro" md="4">
        <b-form-group label="Cantidad de cilindro">
          <b-form-select v-model.number="oxigeno.fraccion" :options="fracciones"></b-form-select>
        </b-form-group>
      </b-col>
      <b-col v-else md="3"><b-form-group label="Cantidad"><b-form-input type="number" min="0" v-model.number="oxigeno.cantidad"></b-form-input></b-form-group></b-col>
      <b-col md="3"><b-button variant="primary" class="mb-3" @click="agregarOxigeno">Agregar oxígeno</b-button></b-col>
    </b-row>

    <h5 class="mt-4">Detalle de la venta</h5>
    <b-table small striped :items="lineas" :fields="camposLineas" show-empty empty-text="Sin productos agregados">
      <template #cell(tipo)="row">{{ etiquetaTipo(row.item.tipo) }}</template>
      <template #cell(cantidad)="row">
        <b-form-input type="number" size="sm" style="max-width: 110px" :min="row.item.tipo === 'servicio' ? 0 : 1"
          :step="row.item.tipo === 'servicio' ? 0.01 : 1" v-model.number="row.item.cantidad"></b-form-input>
      </template>
      <template #cell(existencias)="row">{{ row.item.inventariado ? row.item.existencias : '—' }}</template>
      <template #cell(precio)="row">Q{{ Number(row.item.precio).toFixed(2) }}</template>
      <template #cell(total)="row">Q{{ subtotal(row.item).toFixed(2) }}</template>
      <template #cell(acciones)="row">
        <b-button size="sm" variant="danger" @click="lineas.splice(row.index, 1)"><i class="ri-delete-bin-line"></i></b-button>
      </template>
    </b-table>
    <div class="d-flex justify-content-between align-items-center">
      <h4 class="mb-0">Total: Q{{ total.toFixed(2) }}</h4>
      <b-button variant="primary" :disabled="guardando" @click="confirmar">{{ venta ? 'Guardar cambios' : 'Confirmar venta libre' }}</b-button>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import { mapGetters } from 'vuex'
import { apiUrl } from '../config/constant'

const TIPOS_ITEM = [
  { value: 'medicamento', text: 'Medicamento', url: '/medicamentos/list2' },
  { value: 'anestesico', text: 'Anestésico', url: '/medicamentos/anestesicos' },
  { value: 'quirurgico', text: 'Quirúrgico', url: '/quirurgico/list2' },
  { value: 'comun', text: 'Uso común', url: '/comun/list2' },
  { value: 'servicio', text: 'Oxígeno' }
]
const sinAcentos = (s) => (s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase()

// Venta libre: comprador (uno solo) + consumos y oxígeno. Sin `venta` crea; con `venta` (de GET /venta_libre/:id) edita.
export default {
  name: 'VentaLibreForm',
  props: { venta: { type: Object, default: null } },
  data () {
    return {
      tiposComprador: [
        { value: 'paciente', text: 'Paciente (expediente)' },
        { value: 'medico_interno', text: 'Médico interno' },
        { value: 'medico', text: 'Médico' },
        { value: 'cliente', text: 'Cliente externo' }
      ],
      tiposItem: TIPOS_ITEM,
      fracciones: [
        { value: 0.25, text: '1/4 de cilindro' },
        { value: 0.5, text: '1/2 cilindro' },
        { value: 0.75, text: '3/4 de cilindro' },
        { value: 1, text: '1 cilindro' }
      ],
      camposLineas: [
        { key: 'tipo', label: 'Tipo' },
        { key: 'descripcion', label: 'Descripción' },
        { key: 'cantidad', label: 'Cantidad' },
        { key: 'existencias', label: 'Existencias' },
        { key: 'precio', label: 'Precio' },
        { key: 'total', label: 'Subtotal' },
        { key: 'acciones', label: '' }
      ],
      tipoComprador: 'paciente',
      comprador: null,
      clienteNuevo: '',
      personas: [],
      tipoItem: 'medicamento',
      catalogo: [],
      itemSeleccionado: null,
      oxigeno: { horas: 0, minutos: 0, fraccion: 1, cantidad: 1 },
      lineas: [],
      error: '',
      guardando: false
    }
  },
  computed: {
    ...mapGetters({ currentUser: 'currentUser' }),
    total () {
      return this.lineas.reduce((a, l) => a + this.subtotal(l), 0)
    },
    oxigenoHora () {
      const d = sinAcentos(this.itemSeleccionado && this.itemSeleccionado.text)
      return d.includes('hora')
    },
    oxigenoCilindro () {
      const d = sinAcentos(this.itemSeleccionado && this.itemSeleccionado.text)
      return d.includes('cilindro')
    }
  },
  created () {
    this.cargarCatalogo()
    if (this.venta) this.cargarVenta(this.venta)
  },
  methods: {
    etiquetaTipo (tipo) {
      return (TIPOS_ITEM.find(t => t.value === tipo) || {}).text || tipo
    },
    subtotal (l) {
      return Math.round((Number(l.cantidad) || 0) * (Number(l.precio) || 0) * 100) / 100
    },
    cargarVenta (v) {
      this.tipoComprador = v.id_expediente ? 'paciente' : v.id_usuario ? 'medico_interno' : v.id_medico ? 'medico' : 'cliente'
      this.comprador = { id: v.id_expediente || v.id_usuario || v.id_medico || v.id_cliente, nombre: v.comprador }
      this.lineas = (v.detalles || []).map(d => ({
        tipo: d.tipo,
        id_item: d.id_item,
        descripcion: d.descripcion,
        cantidad: Number(d.cantidad),
        precio: Number(d.precio),
        inventariado: d.inventariado,
        existencias: '—'
      }))
    },
    limpiarComprador () {
      this.comprador = null
      this.clienteNuevo = ''
      this.personas = []
    },
    async buscarPersonas (search) {
      try {
        const { data } = await axios.get(apiUrl + '/venta_libre/personas', { params: { tipo: this.tipoComprador, search } })
        this.personas = data
      } catch (e) {
        this.error = 'No se pudo buscar el comprador'
      }
    },
    async cargarCatalogo () {
      this.itemSeleccionado = null
      this.catalogo = []
      try {
        if (this.tipoItem === 'servicio') {
          const { data } = await axios.get(apiUrl + '/servicios/getSearch', { params: { search: 'ox' } })
          this.catalogo = data.filter(s => sinAcentos(s.descripcion).includes('oxig'))
            .map(s => ({ value: s.id, text: s.descripcion, precio: Number(s.precio) || 0, inventariado: false }))
        } else {
          const { data } = await axios.get(apiUrl + TIPOS_ITEM.find(t => t.value === this.tipoItem).url)
          this.catalogo = data.map(i => ({
            value: i.id,
            text: i.nombre + ' --- ' + ((i.presentacione && i.presentacione.nombre) || 'Sin presentación'),
            precio: Number(i.precio_venta) || 0,
            inventariado: i.inventariado !== 'NO INVENTARIADO',
            existencias: i.existencia_actual_farmacia || 0
          }))
        }
      } catch (e) {
        this.error = 'No se pudo cargar el catálogo'
      }
    },
    onItem (item) {
      if (!item || this.tipoItem === 'servicio') return
      if (this.lineas.some(l => l.tipo === this.tipoItem && l.id_item === item.value)) {
        this.error = 'Este insumo ya fue agregado.'
      } else if (item.inventariado && item.existencias <= 0) {
        this.error = 'El insumo no posee existencias'
      } else {
        this.lineas.push({ tipo: this.tipoItem, id_item: item.value, descripcion: item.text, cantidad: 1, precio: item.precio, inventariado: item.inventariado, existencias: item.existencias })
      }
      this.$nextTick(() => { this.itemSeleccionado = null })
    },
    agregarOxigeno () {
      const o = this.oxigeno
      const cantidad = this.oxigenoHora ? (Number(o.horas) || 0) + (Number(o.minutos) || 0) / 60
        : this.oxigenoCilindro ? o.fraccion : Number(o.cantidad) || 0
      if (!(cantidad > 0)) {
        this.error = 'Ingrese la cantidad de oxígeno'
        return
      }
      const item = this.itemSeleccionado
      this.lineas.push({ tipo: 'servicio', id_item: item.value, descripcion: item.text, cantidad: Math.round(cantidad * 100) / 100, precio: item.precio, inventariado: false })
      this.itemSeleccionado = null
      this.oxigeno = { horas: 0, minutos: 0, fraccion: 1, cantidad: 1 }
    },
    validar () {
      if (!this.comprador && !(this.tipoComprador === 'cliente' && this.clienteNuevo.trim())) return 'Seleccione el comprador'
      if (!this.lineas.length) return 'Agregue al menos un producto u oxígeno'
      const mala = this.lineas.find(l => !(Number(l.cantidad) > 0) || (l.tipo !== 'servicio' && !Number.isInteger(Number(l.cantidad))))
      if (mala) return `Cantidad inválida para "${mala.descripcion}"`
      const sinExistencia = this.lineas.find(l => l.inventariado && typeof l.existencias === 'number' && l.cantidad > l.existencias)
      if (sinExistencia) return `No hay suficiente existencia de "${sinExistencia.descripcion}" (disponible: ${sinExistencia.existencias})`
      return ''
    },
    async confirmar () {
      this.error = this.validar()
      if (this.error) return
      const campo = { paciente: 'id_expediente', medico_interno: 'id_usuario', medico: 'id_medico', cliente: 'id_cliente' }[this.tipoComprador]
      const nombre = this.comprador ? this.comprador.nombre : this.clienteNuevo.trim()
      const ok = await this.$bvModal.msgBoxConfirm(
        `¿${this.venta ? 'Guardar los cambios de la' : 'Confirmar la'} venta libre a ${nombre} por Q${this.total.toFixed(2)}? Se descuenta del inventario y queda en Caja para cobrar.`,
        { title: 'Venta libre', okTitle: 'Sí', cancelTitle: 'No', centered: true }
      )
      if (!ok) return
      this.guardando = true
      try {
        const body = {
          user: this.currentUser.user,
          [campo]: this.comprador ? this.comprador.id : null,
          cliente_nuevo: !this.comprador && this.tipoComprador === 'cliente' ? this.clienteNuevo : null,
          lineas: this.lineas.map(l => ({ tipo: l.tipo, id_item: l.id_item, cantidad: l.cantidad }))
        }
        const { data } = this.venta
          ? await axios.put(apiUrl + `/venta_libre/${this.venta.id}`, body)
          : await axios.post(apiUrl + '/venta_libre/create', body)
        if (!this.venta) {
          this.lineas = []
          this.limpiarComprador()
          this.cargarCatalogo()
        }
        this.$emit('guardado', data)
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.msg) || 'No se pudo guardar la venta libre'
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>

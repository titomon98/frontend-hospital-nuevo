<template>
  <b-modal id="DetalleManejo" :title="titulo" size="xl" scrollable>
    <b-alert :show="!!error" variant="danger" class="text-white bg-danger">{{ error }}</b-alert>
    <div v-if="cargando" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>
    <div v-else-if="data">
      <b-form-group label="Cuenta:" label-cols="2" class="mb-3">
        <b-form-select v-model="idCuenta" :options="opcionesCuentas" @change="cargar"></b-form-select>
      </b-form-group>
      <b-tabs content-class="mt-3" small>
        <b-tab v-for="t in tabsTablas" :key="t.key" :title="`${t.titulo} (${t.filas.length})`" lazy>
          <tabla-manejo :filas="t.filas" :campo-total="t.campoTotal" />
        </b-tab>
        <b-tab :title="`Servicios (${totalServicios})`" lazy>
          <div v-for="g in gruposServicios" :key="g.key" class="mb-4">
            <h5>{{ g.titulo }}</h5>
            <p class="mb-1">
              <strong>Cantidad consumida:</strong> {{ suma(g.filas, 'cantidad') }} &nbsp;
              <strong>Total:</strong> Q{{ suma(g.filas, 'subtotal').toFixed(2) }}
            </p>
            <tabla-manejo :filas="g.filas" campo-total="subtotal" />
          </div>
        </b-tab>
        <b-tab title="Notas de ingreso y egreso" lazy>
          <b-row>
            <b-col md="6">
              <h5>Ingreso</h5>
              <b-table small bordered stacked :items="[data.notas.ingreso]" :fields="camposDe([data.notas.ingreso])"></b-table>
            </b-col>
            <b-col md="6">
              <h5>Egreso</h5>
              <b-table small bordered stacked :items="[data.notas.egreso]" :fields="camposDe([data.notas.egreso])"></b-table>
            </b-col>
          </b-row>
          <h5 class="mt-3">Notas de enfermería</h5>
          <tabla-manejo :filas="data.notas.enfermeria" />
          <h5 class="mt-3">Traslados</h5>
          <tabla-manejo :filas="data.notas.traslados" />
          <h5 class="mt-3">Todos los datos de la cuenta</h5>
          <b-table small bordered stacked :items="[data.notas.cuenta]" :fields="camposDe([data.notas.cuenta])"></b-table>
        </b-tab>
      </b-tabs>
    </div>
    <template #modal-footer>
      <b-button variant="secondary" @click="$bvModal.hide('DetalleManejo')">Cerrar</b-button>
    </template>
  </b-modal>
</template>

<script>
import axios from 'axios'
import { apiUrl } from '../config/constant'
import { camposDe, suma } from '../Utils/manejo'
import TablaManejo from './TablaManejo'

// Todo lo registrado en una cuenta, sin resumir (Gerencia: los 3 de manejo).
export default {
  name: 'DetalleManejoModal',
  components: { TablaManejo },
  data () {
    return { idExpediente: null, idCuenta: null, data: null, cargando: false, error: '' }
  },
  computed: {
    titulo () {
      return this.data ? `Detalle completo - ${this.data.paciente}` : 'Detalle completo'
    },
    opcionesCuentas () {
      return (this.data ? this.data.cuentas : []).map(c => ({
        value: c.id,
        text: `Cuenta ${c.numero || c.id} - ingreso ${c.ingreso}${c.egreso ? ' / egreso ' + c.egreso : ''} (${c.estado})`
      }))
    },
    tabsTablas () {
      const d = this.data
      return [
        { key: 'med', titulo: 'Medicamentos', filas: d.medicamentos, campoTotal: 'total' },
        { key: 'quir', titulo: 'Material quirúrgico', filas: d.quirurgicos, campoTotal: 'total' },
        { key: 'anest', titulo: 'Anestésicos', filas: d.anestesicos, campoTotal: 'total' },
        { key: 'com', titulo: 'Material común', filas: d.comunes, campoTotal: 'total' },
        { key: 'lab', titulo: 'Laboratorios', filas: d.laboratorio, campoTotal: 'total' },
        { key: 'hon', titulo: 'Detalle de honorarios', filas: d.honorarios, campoTotal: 'total' },
        { key: 'sala', titulo: 'Sala de operaciones', filas: d.sala, campoTotal: 'total' },
        { key: 'hab', titulo: 'Habitaciones', filas: d.habitaciones, campoTotal: 'costo_habitacion' }
      ]
    },
    gruposServicios () {
      const s = this.data.servicios
      return [
        { key: 'calentador', titulo: 'Calentador', filas: s.calentador },
        { key: 'oxigeno', titulo: 'Oxígeno', filas: s.oxigeno },
        { key: 'ventilador', titulo: 'Ventilador', filas: s.ventilador },
        { key: 'otros', titulo: 'Otros servicios', filas: s.otros }
      ]
    },
    totalServicios () {
      return this.gruposServicios.reduce((a, g) => a + g.filas.length, 0)
    }
  },
  methods: {
    camposDe,
    suma,
    abrir (idExpediente) {
      this.idExpediente = idExpediente
      this.idCuenta = null
      this.data = null
      this.$bvModal.show('DetalleManejo')
      this.cargar()
    },
    async cargar () {
      this.cargando = true
      this.error = ''
      try {
        const { data } = await axios.get(apiUrl + `/consumos/manejo/${this.idExpediente}`, { params: this.idCuenta ? { id_cuenta: this.idCuenta } : {} })
        this.data = data
        this.idCuenta = data.id_cuenta
      } catch (e) {
        this.error = (e.response && e.response.data && e.response.data.msg) || 'No se pudo cargar el detalle'
      } finally {
        this.cargando = false
      }
    }
  }
}
</script>

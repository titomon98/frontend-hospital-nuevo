<template>
  <div>
  <b-modal id="DetalleManejo" :title="titulo" size="xl" scrollable no-close-on-backdrop no-close-on-esc>
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
      <b-button variant="info" :disabled="!paciente" @click="generarSumario(paciente, true)">Ver expediente</b-button>
      <b-button variant="success" :disabled="!paciente" @click="setDatos(paciente)">Generar contrato</b-button>
      <b-button variant="dark" :disabled="!paciente" @click="generarSumario(paciente)">Generar sumario</b-button>
      <b-button variant="primary" :disabled="!paciente" @click="abrirCuenta">Cuenta</b-button>
      <b-button v-if="paciente && !internado" variant="primary" @click="$emit('cuenta-detallada', paciente.id)">Cuenta detallada</b-button>
      <b-button variant="secondary" @click="$bvModal.hide('DetalleManejo')">Cerrar</b-button>
    </template>
  </b-modal>

  <!-- Se abren encima del detalle sin cerrarlo -->
  <b-modal id="manejo-sumario" ref="modal-sumario" title="Expediente (sumario)" size="xl">
    <iframe :src="previewSumarioURL" width="100%" height="700px"></iframe>
    <template #modal-footer>
      <b-button variant="secondary" @click="$bvModal.hide('manejo-sumario')">Cerrar</b-button>
    </template>
  </b-modal>
  <b-modal id="manejo-contrato" ref="modal-contrato" title="Generar contrato" size="xl">
    <iframe :src="previewURL" width="100%" height="700px"></iframe>
    <template #modal-footer>
      <b-button variant="primary" @click="descargarpdf()">Guardar</b-button>
      <b-button variant="secondary" @click="$bvModal.hide('manejo-contrato')">Cerrar</b-button>
    </template>
  </b-modal>
  <b-modal id="manejo-cuenta" title="Cuenta parcial" size="lg">
    <div v-if="cuenta.cargando" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>
    <div v-else>
      <p><strong><u>Total deuda preliminar:</u> Q{{ cuenta.total.toFixed(2) }}</strong></p>
      <small class="text-muted">Incluye habitación, consumos, servicios, sala de operaciones y honorarios. El laboratorio se paga en su caja.</small>
    </div>
    <template #modal-footer>
      <b-button variant="success" :disabled="!cuenta.detalle" @click="excelCuenta">Detalle en Excel</b-button>
      <b-button variant="primary" @click="generarReporteCuentaParcial(paciente.id, paciente.nombres, paciente.apellidos)">Generar PDF</b-button>
      <b-button v-if="internado" variant="danger" @click="enviarCuentaParcial(paciente)">Pagar cuenta parcial</b-button>
      <b-button variant="secondary" @click="$bvModal.hide('manejo-cuenta')">Cerrar</b-button>
    </template>
  </b-modal>
  </div>
</template>

<script>
import axios from 'axios'
import { apiUrl } from '../config/constant'
import { camposDe, suma } from '../Utils/manejo'
import TablaManejo from './TablaManejo'
import cuentaParcialPdfMixin from '../mixins/cuentaParcialPdfMixin'
import expedienteDocsMixin from '../mixins/expedienteDocsMixin'
import { cargarDetalle, excelDetalle } from '../Utils/detalleCuenta'

const ESTADOS_INTERNADO = [1, 3, 4, 5, 91, 93, 94, 95]

// Todo lo registrado en una cuenta, sin resumir (Gerencia: los 3 de manejo).
export default {
  name: 'DetalleManejoModal',
  components: { TablaManejo },
  mixins: [cuentaParcialPdfMixin, expedienteDocsMixin],
  data () {
    return {
      idExpediente: null,
      idCuenta: null,
      data: null,
      cargando: false,
      error: '',
      // Para los mixins (alertas de error al generar PDFs).
      alertErrorText: '',
      alertText: '',
      alertVariant: '',
      cuenta: { cargando: false, total: 0, detalle: null }
    }
  },
  computed: {
    internado () {
      return !!this.paciente && ESTADOS_INTERNADO.includes(Number(this.paciente.estado))
    },
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
    showAlertError () { this.error = this.alertErrorText },
    showAlert () { if (this.alertVariant === 'danger') this.error = this.alertText },
    // row: fila del expediente (contrato y sumario usan sus datos).
    abrir (row) {
      this.paciente = row
      this.idExpediente = row.id
      this.idCuenta = null
      this.data = null
      this.$bvModal.show('DetalleManejo')
      this.cargar()
    },
    async abrirCuenta () {
      this.cuenta = { cargando: true, total: 0, detalle: null }
      this.$bvModal.show('manejo-cuenta')
      try {
        const d = await cargarDetalle(this.idExpediente, false)
        this.cuenta = { cargando: false, total: Number(d.totalGeneral) || 0, detalle: d }
      } catch (e) {
        this.cuenta = { cargando: false, total: 0, detalle: null }
        this.error = 'No se pudo cargar la cuenta'
      }
    },
    excelCuenta () {
      excelDetalle(this.cuenta.detalle, 'CUENTA DE HOSPITALIZACIÓN DETALLADA', 'cuenta_parcial')
    },
    // Igual que "Pagar cuenta parcial" de las areas, con confirmacion. El total lo calcula
    // el backend (cuenta total sin laboratorio).
    async enviarCuentaParcial (row) {
      const nombre = `${row.nombres || ''} ${row.apellidos || ''}`.trim()
      const ok = await this.$bvModal.msgBoxConfirm(
        `¿Enviar la cuenta parcial de ${nombre} a Caja → Cuentas parciales por cobrar? Se congela lo consumido hasta ahora y el paciente continúa en su área con una cuenta nueva.`,
        { title: 'Confirmar cuenta parcial', okTitle: 'Sí, enviar', cancelTitle: 'No', okVariant: 'danger', centered: true }
      )
      if (!ok) return false
      try {
        const { data } = await axios.patch(apiUrl + `/cuentas/${row.id}/ingresoParcialPago`, {})
        this.$bvModal.hide('manejo-cuenta')
        this.$bvModal.msgBoxOk(data && data.msg === 'La cuenta ya está en cuenta parcial'
          ? 'Esta cuenta parcial ya se había generado. Se cobra en Caja → Cuentas parciales por cobrar.'
          : 'Se generó la cuenta parcial; se cobra en Caja → Cuentas parciales por cobrar.', { title: 'Cuenta parcial', centered: true })
        if (this.idExpediente === row.id) this.cargar()
        return true
      } catch (error) {
        console.error(error)
        this.$bvModal.msgBoxOk((error.response && error.response.data && error.response.data.msg) || 'No se pudo enviar la cuenta parcial. Intente de nuevo.', { title: 'Cuenta parcial', centered: true })
        return false
      }
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

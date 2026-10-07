<template>
  <b-modal id="HistorialCuenta" :title="titulo" size="lg">
    <b-alert :show="!!error" variant="danger" class="text-white bg-danger">{{ error }}</b-alert>
    <div v-if="cargando" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>
    <div v-else-if="data">
      <p class="mb-1">
        <strong>Situación:</strong>
        <b-badge :variant="data.paciente.situacion === 'DENTRO DEL HOSPITAL' ? 'success' : 'secondary'">{{ data.paciente.situacion }}</b-badge>
        <span v-if="data.paciente.egreso"> - egreso {{ data.paciente.egreso }}</span>
      </p>
      <p class="mb-2"><strong>Cuentas:</strong> {{ data.cuentas.length }}</p>
      <b-table small bordered :items="resumen" :fields="[{ key: 'categoria', label: 'Rubro' }, { key: 'total', label: 'Total' }]">
        <template #cell(total)="row">Q{{ row.item.total.toFixed(2) }}</template>
      </b-table>
      <p class="mb-1"><strong><u>Total consumido:</u> Q{{ data.totalGeneral.toFixed(2) }}</strong></p>
      <p v-if="data.totalPagado" class="mb-1"><strong>Total pagado:</strong> Q{{ data.totalPagado.toFixed(2) }}</p>
      <small class="text-muted">El detalle de cada cargo, con fecha y hora, está en el Excel y en el PDF.</small>
    </div>
    <template #modal-footer>
      <b-button variant="success" :disabled="!data" @click="excel">Descargar Excel</b-button>
      <b-button variant="primary" :disabled="!data" @click="pdf">Generar PDF</b-button>
      <b-button variant="secondary" @click="$bvModal.hide('HistorialCuenta')">Cerrar</b-button>
    </template>
  </b-modal>
</template>

<script>
import { cargarDetalle, excelDetalle, pdfDetalle, resumenPorCategoria } from '../Utils/detalleCuenta'

export default {
  name: 'HistorialCuentaModal',
  data () {
    return { data: null, cargando: false, error: '' }
  },
  computed: {
    titulo () {
      return this.data ? `Historial de la cuenta - ${this.data.paciente.nombre}` : 'Historial de la cuenta'
    },
    resumen () {
      return this.data ? resumenPorCategoria(this.data) : []
    }
  },
  methods: {
    abrir (idExpediente) {
      this.data = null
      this.error = ''
      this.cargando = true
      this.$bvModal.show('HistorialCuenta')
      cargarDetalle(idExpediente, true)
        .then(d => { this.data = d })
        .catch(() => { this.error = 'No se pudo cargar el historial de la cuenta. Intente de nuevo.' })
        .finally(() => { this.cargando = false })
    },
    excel () {
      excelDetalle(this.data, 'HISTORIAL DE CUENTA (TODO LO CONSUMIDO)', 'historial_cuenta')
    },
    pdf () {
      pdfDetalle(this.data, 'HISTORIAL DE CUENTA (TODO LO CONSUMIDO)', 'historial_cuenta')
    }
  }
}
</script>

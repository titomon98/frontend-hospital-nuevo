<template>
  <div>
    <p v-if="!filas.length" class="text-muted">Sin registros.</p>
    <template v-else>
      <p v-if="campoTotal" class="mb-1"><strong>Total (registros activos):</strong> Q{{ suma(filas, campoTotal).toFixed(2) }}</p>
      <b-table small striped bordered responsive sticky-header="400px" :items="filas" :fields="campos"></b-table>
    </template>
  </div>
</template>

<script>
import { camposDe, suma } from '../Utils/manejo'

// Tabla con todas las columnas que trae cada registro (DetalleManejoModal).
export default {
  name: 'TablaManejo',
  props: {
    filas: { type: Array, default: () => [] },
    campoTotal: { type: String, default: '' }
  },
  computed: {
    campos () { return camposDe(this.filas) }
  },
  methods: { suma }
}
</script>

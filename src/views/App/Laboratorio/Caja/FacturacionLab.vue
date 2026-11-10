<template>
  <facturacion laboratorio />
</template>
<script>
import Facturacion from '../../Caja/Facturacion.vue'

// Misma pantalla que Caja → Facturación, con las cuentas del laboratorio.
export default {
  name: 'FacturacionLab',
  components: { Facturacion }
}
</script>

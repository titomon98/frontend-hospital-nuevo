<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Venta libre</h4>
          </template>
          <template v-slot:body>
            <b-alert :show="!!aviso" variant="success" dismissible @dismissed="aviso = ''">{{ aviso }}</b-alert>
            <venta-libre-form @guardado="aviso = `Venta libre No. ${$event.id} registrada por Q${Number($event.total).toFixed(2)}. Se cobra en Caja → Cuentas por cobrar → Venta libre.`" />
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import VentaLibreForm from '../../../../components/VentaLibreForm.vue'

export default {
  name: 'VentaLibre',
  components: { VentaLibreForm },
  data () {
    return { aviso: '' }
  },
  mounted () {
    xray.index()
  }
}
</script>

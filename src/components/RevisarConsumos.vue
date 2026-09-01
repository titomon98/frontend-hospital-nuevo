<template>
  <span v-if="puedeRevisar">
    <b-button variant="primary" size="sm" @click="abrir">Revisar consumos</b-button>

    <b-modal :id="modalId" :ref="modalId" title="Revisar consumos — confirmar cantidades" size="lg" hide-footer>
      <b-alert :show="!!alertText" variant="danger" dismissible @dismissed="alertText = ''">{{ alertText }}</b-alert>
      <p class="text-muted mb-2">
        Confirmá la cantidad realmente utilizada de cada consumo, uno por uno.
        Si difiere de lo registrado, se corrige el inventario y el cobro.
        <span v-if="!puedeModificar">(Tu rol solo puede confirmar la cantidad tal cual está registrada.)</span>
      </p>

      <div v-if="cargando" class="text-center my-3"><b-spinner small></b-spinner> Cargando...</div>

      <b-table v-else :items="consumos" :fields="fields" small responsive class="mb-2">
        <template #cell(cantidad_real)="row">
          <b-form-input
            v-if="!row.item.reviewed_by"
            type="number"
            min="0"
            size="sm"
            style="max-width: 90px"
            :disabled="!puedeModificar"
            v-model="row.item._real"
          ></b-form-input>
          <span v-else>{{ row.item.cantidad }}</span>
        </template>
        <template #cell(estado)="row">
          <b-badge v-if="row.item.reviewed_by" :variant="row.item.inconsistente ? 'danger' : 'success'">
            {{ row.item.inconsistente ? 'Inconsistencia' : 'Confirmado' }}
          </b-badge>
          <span v-else class="text-muted">Pendiente</span>
        </template>
        <template #cell(accion)="row">
          <b-button
            v-if="!row.item.reviewed_by"
            size="sm"
            variant="success"
            :disabled="guardando"
            @click="confirmar(row.item)"
          >Confirmar</b-button>
        </template>
      </b-table>

      <div class="d-flex justify-content-between align-items-center">
        <span>
          <strong>{{ confirmados }}/{{ consumos.length }}</strong> confirmados
          <span v-if="todosConfirmados" class="text-success ml-2">— revisión completada</span>
        </span>
        <b-button variant="secondary" size="sm" @click="cerrar">Cerrar</b-button>
      </div>
    </b-modal>
  </span>
</template>

<script>
import axios from 'axios'
import { apiUrl } from '../config/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'RevisarConsumos',
  props: {
    idCuenta: { type: [Number, String], default: null },
    movimiento: { type: String, required: true } // SALIDAQ / SALIDAH / SALIDAI / SALIDAE
  },
  data () {
    return {
      consumos: [],
      cargando: false,
      guardando: false,
      alertText: '',
      fields: [
        { key: 'rubro_label', label: 'Rubro' },
        { key: 'nombre', label: 'Consumo' },
        { key: 'administrado_en', label: 'Administrado en' },
        { key: 'cantidad', label: 'Cant. registrada' },
        { key: 'cantidad_real', label: 'Cant. real usada' },
        { key: 'estado', label: 'Estado' },
        { key: 'accion', label: '' }
      ],
      // movimiento (SALIDAX) -> nombre del area con el que se guarda en descripcion
      areasPorMovimiento: {
        SALIDAH: 'Hospitalizacion',
        SALIDAQ: 'Quirofano',
        SALIDAI: 'Intensivo',
        SALIDAE: 'Emergencia'
      },
      rubroLabels: {
        medicamento: 'Medicamentos',
        anestesico: 'Anestésicos',
        quirurgico: 'Material quirúrgico',
        comun: 'Material común'
      }
    }
  },
  computed: {
    ...mapGetters(['currentUser']),
    modalId () { return 'modal-revisar-consumos-' + this.movimiento },
    areaActual () { return this.areasPorMovimiento[this.movimiento] || '' },
    puedeRevisar () { return [1, 3, 9, 11].includes(this.currentUser && this.currentUser.user_type) },
    puedeModificar () { return [1, 3].includes(this.currentUser && this.currentUser.user_type) },
    confirmados () { return this.consumos.filter(c => c.reviewed_by).length },
    todosConfirmados () { return this.consumos.length > 0 && this.confirmados >= this.consumos.length }
  },
  methods: {
    async abrir () {
      if (!this.idCuenta) {
        this.alertText = 'No hay una cuenta seleccionada.'
      }
      this.alertText = ''
      this.$bvModal.show(this.modalId)
      await this.cargar()
    },
    cerrar () { this.$bvModal.hide(this.modalId) },
    async cargar () {
      if (!this.idCuenta) return
      this.cargando = true
      try {
        const { data } = await axios.get(apiUrl + '/revisionConsumos/consumos/' + this.idCuenta, {
          params: { area: this.areaActual }
        })
        this.consumos = (data || []).map(c => ({
          ...c,
          _real: c.cantidad,
          rubro_label: this.rubroLabels[c.rubro] || c.rubro
        }))
      } catch (error) {
        console.error(error)
        this.alertText = 'No se pudieron cargar los consumos.'
      } finally {
        this.cargando = false
      }
    },
    async confirmar (item) {
      const real = parseFloat(item._real)
      if (isNaN(real) || real < 0) {
        this.alertText = 'Ingresá una cantidad real válida para ' + item.nombre + '.'
        return
      }
      if (real !== parseFloat(item.cantidad) && !this.puedeModificar) {
        this.alertText = 'Solo gerencia/administración puede modificar la cantidad.'
        return
      }
      this.guardando = true
      try {
        const { data } = await axios.post(apiUrl + '/revisionConsumos/confirmarConsumo', {
          id_consumo: item.id,
          tipo: item.tipo,
          cantidad_real: real,
          id_cuenta: this.idCuenta,
          movimiento: this.movimiento,
          user: this.currentUser.user,
          user_type: this.currentUser.user_type
        })
        item.reviewed_by = this.currentUser.user
        item.inconsistente = real !== parseFloat(item.cantidad) ? 1 : 0
        item.cantidad = real.toFixed(2)
        if (data && data.finalizado) {
          this.$emit('finalizado', data.estado)
        }
      } catch (error) {
        this.alertText = (error.response && error.response.data && error.response.data.msg) ||
          'Ocurrió un error al confirmar el consumo.'
        console.error(error)
      } finally {
        this.guardando = false
      }
    }
  }
}
</script>

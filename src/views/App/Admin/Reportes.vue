<template>
  <b-container fluid>
    <b-modal id="modal-asueto" ref="modal-asueto" title="Agregar Asueto">
      <form @submit.prevent="agregarAsueto">
        <div class="col-md-12 mb-3">
          <label for="fechaAsueto">Fecha del Asueto</label>
          <b-form-datepicker
            id="fechaAsueto"
            v-model="fechaAsueto"
            class="mb-2"
            :state="fechaAsuetoState"
          ></b-form-datepicker>
          <b-form-invalid-feedback :state="fechaAsuetoState">
            Por favor, seleccione una fecha válida.
          </b-form-invalid-feedback>
        </div>
      </form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="agregarAsueto()">Guardar</b-button>
        <b-button variant="danger" @click="closeModal()">Cancelar</b-button>
      </template>
    </b-modal>

    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Reportes</h4>
          </template>

          <template v-slot:body>
            <div>
            <h4>Caja</h4>
            </div>
            <div>
            <h4>Enfermería</h4>
            </div>
            <div>
            <h4>Farmacia</h4>
            </div>
            <div>
            <h4>Médicos</h4>
            </div>
            <div>
            <h4>Pacientes</h4>
            </div>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import moment from 'moment'

export default {
  data () {
    return {
      fechaAsueto: '',
      asuetos: [],
      fieldsAsuetos: [
        { key: 'fecha', label: 'Fecha', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },

  computed: {
    fechaAsuetoState () {
      return this.fechaAsueto !== ''
    }
  },

  mounted () { this.cargarAsuetos() },

  methods: {
    closeModal () {
      this.fechaAsueto = ''
      this.$refs['modal-asueto'].hide()
    },

    async cargarAsuetos () {
      try {
        const response = await axios.get(this.apiBase + '/asuetos')
        this.asuetos = response.data
      } catch (error) {
        console.error('Error al cargar asuetos:', error)
        // Mostrar alerta de error al usuario
      }
    },

    async agregarAsueto () {
      if (!this.fechaAsuetoState) return

      const fechaFormateada = moment(this.fechaAsueto).format('YYYY-MM-DD')
      try {
        await axios.post(this.apiBase + '/asuetos/create', { fecha: fechaFormateada })
        this.closeModal()
        this.cargarAsuetos()
      } catch (error) {
        console.error('Error al agregar asueto:', error)
        // Mostrar alerta de error al usuario
      }
    },

    async eliminarAsueto (id) {
      try {
        await axios.delete(this.apiBase + '/asuetos/' + id)
        this.cargarAsuetos()
      } catch (error) {
        console.error('Error al eliminar asueto:', error)
        // Mostrar alerta de error al usuario
      }
    }
  }
}

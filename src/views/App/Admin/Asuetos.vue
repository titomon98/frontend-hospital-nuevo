<template>
  <b-container fluid>
    <b-modal id="modal-asueto" ref="modal-asueto" title="Agregar Asueto">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <form @submit.prevent>
        <div class="col-md-12 mb-3">
          <label for="nombreAsueto">Nombre del Asueto</label>
          <b-form-input
            id="nombreAsueto"
            v-model="nombreAsueto"
            placeholder="Ejemplo: Día de la Independencia"
            :state="nombreAsuetoState"
          ></b-form-input>
          <b-form-invalid-feedback :state="nombreAsuetoState">
            Por favor, ingrese un nombre válido.
          </b-form-invalid-feedback>
        </div>
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
      <template #modal-footer>
        <b-button variant="primary" @click="agregarAsueto">Guardar</b-button>
        <b-button variant="danger" @click="closeModal">Cancelar</b-button>
      </template>
    </b-modal>

    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Asuetos</h4>
          </template>
          <template v-slot:headerAction>
            <b-button variant="primary" v-b-modal.modal-asueto>AGREGAR NUEVO</b-button>
          </template>
          <template v-slot:body>
            <b-table striped hover :items="asuetos" :fields="fieldsAsuetos">
              <template v-slot:cell(fecha)="data">
                {{ data.item.fecha.split('-').reverse().join('/') }}
              </template>
              <template v-slot:cell(acciones)="data">
                <b-button size="sm" variant="outline-danger" @click="eliminarAsueto(data.item.id)">
                  <i class="fas fa-trash-alt"></i>
                </b-button>
              </template>
            </b-table>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import axios from 'axios'
import { apiUrl } from '../../../config/constant'

export default {
  name: 'Asuetos',
  data () {
    return {
      alertCountDownError: 0,
      alertErrorText: '',
      nombreAsueto: '',
      fechaAsueto: '',
      asuetos: [],
      fieldsAsuetos: [
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'fecha', label: 'Fecha', sortable: true },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  computed: {
    nombreAsuetoState () {
      return this.nombreAsueto.trim() !== ''
    },
    fechaAsuetoState () {
      return this.fechaAsueto !== ''
    }
  },
  mounted () {
    this.cargarAsuetos()
  },
  methods: {
    closeModal () {
      this.nombreAsueto = ''
      this.fechaAsueto = ''
      this.$refs['modal-asueto'].hide()
    },

    async cargarAsuetos () {
      try {
        const response = await axios.get(apiUrl + '/asuetos/list')
        this.asuetos = response.data
      } catch (error) {
        this.alertErrorText = 'Error al cargar los asuetos.'
        this.alertCountDownError = 5
      }
    },

    async agregarAsueto () {
      if (!this.nombreAsuetoState || !this.fechaAsuetoState) return
      try {
        await axios.post(apiUrl + '/asuetos/create', {
          nombre: this.nombreAsueto,
          fecha: this.fechaAsueto
        })
        this.closeModal()
        this.cargarAsuetos()
      } catch (error) {
        this.alertErrorText = 'Error al agregar el asueto.'
        this.alertCountDownError = 5
      }
    },
    async eliminarAsueto (id) {
      try {
        await axios.put(apiUrl + `/asuetos/${id}`)
        this.cargarAsuetos()
      } catch (error) {
        this.alertErrorText = 'Error al eliminar el asueto.'
        this.alertCountDownError = 5
      }
    }
  }
}
</script>

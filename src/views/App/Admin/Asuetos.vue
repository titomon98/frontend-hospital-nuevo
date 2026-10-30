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
          <b-form-checkbox v-model="perpetuoAsueto">Se repite cada año (mismo día y mes)</b-form-checkbox>
        </div>
        <div v-if="perpetuoAsueto" class="col-md-12 mb-3">
          <label>Día y mes del Asueto</label>
          <b-row>
            <b-col cols="5"><b-form-select v-model="diaAsueto" :options="dias" :state="fechaAsuetoState"></b-form-select></b-col>
            <b-col cols="7"><b-form-select v-model="mesAsueto" :options="meses" :state="fechaAsuetoState"></b-form-select></b-col>
          </b-row>
          <b-form-invalid-feedback :state="fechaAsuetoState">
            Por favor, seleccione un día válido para ese mes.
          </b-form-invalid-feedback>
        </div>
        <div v-else class="col-md-12 mb-3">
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
                {{ data.item.perpetuo ? data.item.fecha.split('-').slice(1).reverse().join('/') : data.item.fecha.split('-').reverse().join('/') }}
              </template>
              <template v-slot:cell(perpetuo)="data">
                {{ data.item.perpetuo ? 'Cada año' : 'Solo ese año' }}
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
      perpetuoAsueto: false,
      diaAsueto: null,
      mesAsueto: null,
      dias: [{ value: null, text: 'Día' }].concat(Array.from({ length: 31 }, (_, i) => i + 1)),
      meses: [{ value: null, text: 'Mes' }].concat(['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'].map((text, i) => ({ value: i + 1, text }))),
      asuetos: [],
      fieldsAsuetos: [
        { key: 'nombre', label: 'Nombre', sortable: true },
        { key: 'fecha', label: 'Fecha', sortable: true },
        { key: 'perpetuo', label: 'Repetición' },
        { key: 'acciones', label: 'Acciones' }
      ]
    }
  },
  computed: {
    nombreAsuetoState () {
      return this.nombreAsueto.trim() !== ''
    },
    fechaAsuetoState () {
      if (!this.perpetuoAsueto) return this.fechaAsueto !== ''
      // 2000 es bisiesto: permite el 29 de febrero y rechaza 31 de abril, etc.
      return !!this.diaAsueto && !!this.mesAsueto && new Date(2000, this.mesAsueto - 1, this.diaAsueto).getMonth() === this.mesAsueto - 1
    },
    // Perpetuo: el año se ignora al buscar; se guarda 2000 solo para tener una fecha valida.
    fechaGuardar () {
      const pad = n => String(n).padStart(2, '0')
      return this.perpetuoAsueto ? `2000-${pad(this.mesAsueto)}-${pad(this.diaAsueto)}` : this.fechaAsueto
    }
  },
  mounted () {
    this.cargarAsuetos()
  },
  methods: {
    closeModal () {
      this.nombreAsueto = ''
      this.fechaAsueto = ''
      this.perpetuoAsueto = false
      this.diaAsueto = null
      this.mesAsueto = null
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
          fecha: this.fechaGuardar,
          perpetuo: this.perpetuoAsueto
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

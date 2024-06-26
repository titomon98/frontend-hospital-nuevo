<template>
  <b-container fluid>
    <b-alert
      :variant="alertVariant"
      :show="alertCountDown"
      dismissible
      fade
      @dismissed="alertCountDown=0"
      class="bg-white"
    >
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ingreso de paciente</h4>
          </template>

          <template v-slot:body>
            <!-- fila -->
            <h4 class="card-title mt-3">Datos de ingreso</h4>
            <b-row class="ml-2">
              <b-col md="2">
                <b-form-group label="Fecha:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.fecha.$model"
                    :class="{'is-invalid': $v.form.fecha.$error}"
                    placeholder="Ingresar fecha de ingreso"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Hora:">
                  <b-form-input
                    type="time"
                    v-model.trim="$v.form.hora.$model"
                    :class="{'is-invalid': $v.form.hora.$error}"
                    placeholder="Ingresar hora de ingreso"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row  class="ml-2">
              <b-col md="2">
                <b-form-group label="Área a la que ingresa:">
                  <b-form-radio
                    v-model="form.selectedOption"
                    value="hospi"
                    name="customRadio1"
                  >Hospitalización</b-form-radio>
                  <b-form-radio
                    v-model="form.selectedOption"
                    value="emergencia"
                    name="customRadio1"
                  >Emergencia</b-form-radio>
                  <b-form-radio
                    v-model="form.selectedOption"
                    value="quirofano"
                    name="customRadio1"
                  >Quirófano</b-form-radio>
                  <b-form-radio
                    v-model="form.selectedOption"
                    value="intensivo"
                    name="customRadio1"
                  >Intensivo</b-form-radio>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Paciente:">
                  <b-form-radio
                    v-model="form.tipo_paciente"
                    value="0"
                    name="customRadio"
                    @change="getHabitaciones(form.tipo_paciente)"
                  >Normal</b-form-radio>
                  <b-form-radio
                    v-model="form.tipo_paciente"
                    value="1"
                    name="customRadio"
                    @change="getHabitaciones(form.tipo_paciente)"
                  >Ambulatorio</b-form-radio>
                </b-form-group>
              </b-col>
              <b-col md="5">
                <b-form-group label="Habitaciones disponibles:">
                  <v-select
                    name="habitacion"
                    v-model="$v.form.habitacion.$model"
                    :state="!$v.form.habitacion.$error"
                    :options="habitaciones"
                    :filterable="false"
                    placeholder="Seleccione una habitación disponible"
                  >
                    <template v-slot:option="option">
                      {{ option.numero + ' - Tipo: ' + option.tipo + ' - Precio: Q' + (form.tipo_paciente === '1' ?  parseFloat(option.costo_ambulatorio).toFixed(2) : parseFloat(option.costo_diario).toFixed(2))}}
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      {{ option.numero + ' - Tipo: ' + option.tipo + ' - Precio: Q' + (form.tipo_paciente === '1' ?  parseFloat(option.costo_ambulatorio).toFixed(2) : parseFloat(option.costo_diario).toFixed(2))}}
                    </template>
                  </v-select>
                  <div v-if="$v.form.habitacion.$error" class="invalid-feedback-vselect">
                    Debe ingresar habitación para el paciente
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-button block variant="primary" @click="onValidate">Registrar paciente</b-button>
  </b-container>
</template>
<style scoped>
.required-asterisk {
  color: red;
  font-size: 12px;
  margin-right: 1px;
}
</style>
<script>
import { xray } from '../../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Patients',
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.getHabitaciones(0)
    this.form.id_usuario = this.currentUser.uid
  },
  mounted () {
    xray.index()
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  data () {
    return {
      hours: Array.from({ length: 24 }, (_, index) => index),
      editorOption: {
        placeholder: '',
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [
              { list: 'ordered' },
              { list: 'bullet' },
              { indent: '-1' },
              { indent: '+1' }
            ],
            ['clean']
          ]
        }
      },
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      form: {
        id: 0,
        fecha: null,
        hora: null,
        selectedOption: 'hospi',
        tipo_paciente: '0',
        motivo: ' ',
        habitacion: null
      },
      nacionalidades: ['Guatemala', 'El Salvador', 'México', 'Honduras', 'Belice', 'Otro'],
      generos: ['Masculino', 'Femenino'],
      parentescos: ['Padre/Madre', 'Hermano/a', 'Hijo/a', 'Cónyuge', 'Otro'],
      estados_civiles: ['Soltero/a', 'Casado/a', 'Viudo/a', 'Separado/a', 'Divorciado/a', 'Otro'],
      habitaciones: [],
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/paciente/list'
    }
  },
  validations () {
    return {
      form: {
        fecha: {
          required
        },
        hora: {
          required
        },
        habitacion: {
          required
        }
      }
    }
  },
  methods: {
    onValidate () {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        this.onSave()
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/expedientes/createEnfermeria', {
        form: me.form })
        .then(() => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el expediente exitosamente'
          me.$router.push({ name: 'caja.expedientes' })
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/get', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
      })
    }
  }
}
</script>

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
            <h4 class="card-title mt-3">Ingreso de paciente a emergencia</h4>
          </template>

          <template v-slot:body>
            <!-- fila -->
            <h4 class="card-title mt-3">Datos de ingreso</h4>
              <b-row class="ml-2">
                <b-col md="3">
                  <b-form-group label="Nombre:">
                    <span class="required-asterisk" style="position: absolute; top: 50%; transform: translateY(-50%); right: 5px; color: red;"></span>
                    <b-form-input
                      v-model.trim="$v.form.nombre.$model"
                      :class="{'is-invalid': $v.form.nombre.$error}"
                      placeholder="Ingresar nombre"
                      required
                    ></b-form-input>
                      <div v-if="$v.form.nombre.required.$invalid" class="invalid-feedback">Debe ingresar nombre</div>
                      <div v-if="!$v.form.nombre.ValidateName.$error" class="invalid-feedback">El nombre solo debe contener letras mayúsculas y con tildes</div>
                  </b-form-group>
                </b-col>
                <!-- columna -->
                <b-col md="3">
                  <b-form-group label="Apellidos:">
                    <b-form-input
                      v-model.trim="$v.form.apellidos.$model"
                      :class="{'is-invalid': $v.form.apellidos.$error}"
                      placeholder="Ingresar apellidos"
                    ></b-form-input>
                    <div v-if="$v.form.apellidos.required.$invalid" class="invalid-feedback">
                      Ingresar los apellidos
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha de nacimiento:">
                    <b-form-input
                      type="date"
                      v-model.trim="$v.form.nacimiento.$model"
                      :class="{'is-invalid': $v.form.nacimiento.$error}"
                      placeholder="Ingresar fecha de nacimiento"
                      @input="validarAnoNacimiento"
                    ></b-form-input>
                    <div v-if="$v.form.nacimiento.$error" class="invalid-feedback">
                      <div v-if="!$v.form.nacimiento.required">Debe ingresar la fecha de nacimiento</div>
                      <div v-if="!$v.form.nacimiento.isValidYear">El año no puede tener más de 4 dígitos</div>
                      <div v-if="!$v.form.nacimiento.isPastYear">El año de nacimiento no puede ser mayor al actual</div>
                    </div>
                  </b-form-group>
                </b-col>

                <b-col md="2">
                  <b-form-group label="Edad:">
                    <b-form-input
                      :value="calcularEdad"
                      disabled
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Telefono:">
                    <b-form-input
                      v-model.trim="$v.form.telefono.$model"
                      :class="{'is-invalid': $v.form.telefono.$error}"
                      placeholder="Ingresar telefono"
                    ></b-form-input>
                    <div v-if="$v.form.telefono.required.$invalid" class="invalid-feedback">
                      Debe ingresar el telefono
                    </div>
                    <div v-if="$v.form.telefono.numeric.$invalid" class="invalid-feedback">
                      Debe ingresar unicamente numeros
                    </div>
                  </b-form-group>
                </b-col>

            </b-row>
            <b-row  class="ml-2">
              <b-col md="4">
                <b-form-group label="Nombre del encargado:">
                  <b-form-input
                    v-model.trim="$v.form.nombre_encargado.$model"
                    :class="{'is-invalid': $v.form.nombre_encargado.$error}"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.nombre_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre del encargado
                  </div>
                  <div v-if="!$v.form.nombre_encargado.ValidateName.$error" class="invalid-feedback">
                    El nombre solo debe contener letras mayúsculas y con tildes
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Dirección:">
                  <b-form-input
                    v-model.trim="$v.form.direccion.$model"
                    :class="{'is-invalid': $v.form.direccion.$error}"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Asignar médico tratante:">
                  <v-select
                    name="type"
                    v-model = "selectedDoctor"
                    :options="doctors"
                    :reduce="doc => doc.value"
                    placeholder="Seleccione un médico"
                    label='text'
                    @search="onSearchMedicos"/>
                </b-form-group>

              </b-col>
            </b-row>
            <b-row class="ml-2">
              <b-col md="2">
                <!-- columna -->
                <b-form-group label="Fecha de ingreso:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.fecha.$model"
                    :class="{'is-invalid': $v.form.fecha.$error}"
                    placeholder="Ingresar fecha de ingreso"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Hora de ingreso:">
                  <b-form-input
                    type="time"
                    v-model.trim="$v.form.hora.$model"
                    :class="{'is-invalid': $v.form.hora.$error}"
                    placeholder="Ingresar hora de ingreso"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Área a la que ingresa:">
                  <b-form-radio
                    v-model="form.selectedOption"
                    value="emergencia"
                    name="customRadio1"
                  >Emergencia</b-form-radio>
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
import { required, helpers, numeric } from '@vuelidate/validators'
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
    this.getDoctors()
    this.form.id_usuario = this.currentUser.uid
  },
  mounted () {
    xray.index()
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    this.form.fecha = `${yyyy}-${mm}-${dd}`
    this.form.hora = today.toTimeString().split(' ')[0]
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ]),
    calcularEdad () {
      if (!this.form.nacimiento) return ''

      const hoy = new Date()
      const nacimiento = new Date(this.form.nacimiento)
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mesCumpleanos = nacimiento.getMonth()
      const diaCumpleanos = nacimiento.getDate()

      if (hoy.getMonth() < mesCumpleanos || (hoy.getMonth() === mesCumpleanos && hoy.getDate() < diaCumpleanos)) {
        edad--
      }
      return edad
    }
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
        nombre: '',
        apellidos: '',
        nombre_encargado: '',
        direccion: '',
        telefono: '',
        nacimiento: null,
        fecha: null,
        hora: null,
        selectedOption: 'emergencia',
        tipo_paciente: '0',
        motivo: ' ',
        tipo_cuenta: 1,
        cui: '',
        cui_encargado: '',
        contacto_encargado: '',
        assignedDoctor: 0
      },
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
      apiBase: apiUrl + '/paciente/list',
      selectedDoctor: [],
      doctors: []
    }
  },
  validations () {
    return {
      form: {
        nombre: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        apellidos: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        nacimiento: {
          required,
          isValidYear: (value) => {
            if (!value) return true
            const ano = new Date(value).getFullYear()
            return ano.toString().length <= 4
          },
          isPastYear: (value) => {
            if (!value) return true
            const anoNacimiento = new Date(value).getFullYear()
            const anoActual = new Date().getFullYear()
            return anoNacimiento <= anoActual
          }
        },
        telefono: {
          required, numeric
        },
        nombre_encargado: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        direccion: {
          required
        },
        fecha: {
          required
        },
        hora: {
          required
        }
      }
    }
  },
  methods: {
    validarAnoNacimiento () {
      this.$v.form.nacimiento.$touch()
    },
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
      switch (this.form.selectedOption) {
        case 'emergencia':
          this.form.selectedOption = 'emergencia'
          this.form.cui = 'PENDIENTE DE INGRESO'
          this.form.cui_encargado = 'PENDIENTE DE INGRESO'
          this.form.contacto_encargado = this.form.telefono
          this.form.assignedDoctor = this.selectedDoctor
          break
      }
      axios.post(apiUrl + '/expedientes/create', {
        form: me.form, user: me.currentUser.user })
        .then(() => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el paciente ' + me.form.nombre + ' ' + me.form.apellidos + ' exitosamente'
          me.$router.push({ name: 'enfermeria.emergencias' })
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
    },
    getDoctors (search) {
      axios.get(apiUrl + '/medicos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.doctors = response.data.map(medico => ({
          value: medico.id,
          text: medico.nombre
        }))
      })
    },
    onSearchMedicos (search) {
      if (search.length) {
        this.getDoctors(search)
      }
    }
  }
}
</script>

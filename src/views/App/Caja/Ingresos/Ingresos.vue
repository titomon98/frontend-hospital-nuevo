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
            <h4 class="card-title mt-3">Primer ingreso de paciente</h4>
          </template>

          <template v-slot:body>
            <!-- fila -->
            <h4 class="card-title mt-3">Datos de paciente</h4>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.nombre.$model"
                    :state="!$v.form.nombre.$error"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.nombre.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Apellidos:">
                  <b-form-input
                    v-model.trim="$v.form.apellidos.$model"
                    :state="!$v.form.apellidos.$error"
                    placeholder="Ingresar apellidos"
                  ></b-form-input>
                  <div v-if="$v.form.apellidos.required.$invalid" class="invalid-feedback">
                    Debe ingresar los apellidos
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Apellido de casada:">
                  <b-form-input
                    v-model.trim="form.casada"
                    placeholder="Ingresar apellido de casada"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Fecha de nacimiento:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.nacimiento.$model"
                    :state="!$v.form.nacimiento.$error"
                    placeholder="Ingresar fecha de nacimiento"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.telefono.$model"
                    :state="!$v.form.telefono.$error"
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
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Sexo:">
                  <v-select
                    name="type"
                    v-model="form.generos"
                    :options="generos"
                    placeholder="Seleccione el sexo"
                  />
                </b-form-group>
              </b-col>

            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="CUI:">
                  <b-form-input
                    v-model.trim="$v.form.cui.$model"
                    :state="!$v.form.cui.$error"
                    placeholder="Ingresar el CUI"
                  ></b-form-input>
                  <div v-if="$v.form.cui.$error" class="invalid-feedback">
                    El valor del CUI debe ser numerico.
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Nacionalidad:">
                  <v-select
                    name="type"
                    v-model="form.nacionalidad"
                    :options="nacionalidades"
                    placeholder="Seleccione nacionalidad"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Dirección:">
                  <b-form-input
                    v-model.trim="$v.form.direccion.$model"
                    :state="!$v.form.direccion.$error"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Lugar de nacimiento:">
                  <b-form-input
                    v-model.trim="form.lugar_nacimiento"
                    placeholder="Ingresar lugar de nacimiento"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Profesión u oficio:">
                  <b-form-input
                    v-model.trim="form.profesion"
                    placeholder="Ingresar profesión"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Estado civil:">
                  <v-select
                    name="type"
                    v-model="form.estado_civil"
                    :options="estados_civiles"
                    placeholder="Seleccione estado civil"
                  />
                </b-form-group>
              </b-col>
            </b-row>
            <b-row  class="ml-2">
              <b-col md="2">
                <b-form-group label="Nombre del padre:">
                  <b-form-input
                    v-model.trim="form.nombre_padre"
                    placeholder="Ingresar nombre del padre"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Nombre de la madre:">
                  <b-form-input
                    v-model.trim="form.nombre_madre"
                    placeholder="Ingresar nombre de la madre"
                  ></b-form-input>
                </b-form-group>
              </b-col>
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
              <b-col md="2">
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
                      {{ option.numero + ' - Tipo: ' + option.tipo }}
                    </template>
                    <template slot="selected-option" slot-scope="option">
                      {{ option.numero + ' - Tipo: ' + option.tipo }}
                    </template>
                  </v-select>
                  <div v-if="$v.form.habitacion.$error" class="invalid-feedback-vselect">
                    Debe ingresar habitación para el paciente
                  </div>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Datos de encargado -->
            <h4 class="card-title mt-3">Ingreso de encargado</h4>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.nombre_encargado.$model"
                    :state="!$v.form.nombre_encargado.$error"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.nombre_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre del encargado
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.contacto_encargado.$model"
                    :state="!$v.form.contacto_encargado.$error"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.contacto_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.contacto_encargado.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="CUI:">
                  <b-form-input
                    v-model.trim="$v.form.cui_encargado.$model"
                    :state="!$v.form.cui_encargado.$error"
                    placeholder="Ingresar el CUI"
                  ></b-form-input>
                  <div v-if="$v.form.cui_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el CUI del encargado
                  </div>
                  <div v-if="$v.form.cui_encargado.$error" class="invalid-feedback">
                    El valor del CUI debe ser numerico.
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Estado civil:">
                  <v-select
                    name="type"
                    v-model="form.estado_civil_encargado"
                    :options="estados_civiles"
                    placeholder="Seleccione estado civil de encargado"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Parentesco:">
                  <v-select
                    name="type"
                    v-model="form.parentesco_encargado"
                    :options="parentescos"
                    placeholder="Seleccione parentesco"
                  />
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Dirección de encargado:">
                  <b-form-input
                    v-model.trim="form.direccion_encargado"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Profesión u oficio de encargado:">
                  <b-form-input
                    v-model.trim="form.profesion_encargado"
                    placeholder="Ingresar profesión u oficio"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <!-- Datos de conyuge -->
            <h4 class="card-title mt-3">Ingreso de conyuge</h4>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="form.nombre_conyuge"
                    placeholder="Ingresar nombre de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="form.telefono_conyuge"
                    placeholder="Ingresar telefono de conyuge"
                  ></b-form-input>
                  <div v-if="$v.form.telefono_conyuge.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Dirección de conyuge:">
                  <b-form-input
                    v-model.trim="form.direccion_conyuge"
                    placeholder="Ingresar dirección de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <b-button block variant="primary" @click="onValidate">Registrar paciente</b-button>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import { required, numeric } from '@vuelidate/validators'
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
        nombre: '',
        apellidos: '',
        casada: '',
        nacimiento: null,
        cui: null,
        nacionalidad: null,
        telefono: '',
        direccion: '',
        generos: '',
        nombre_encargado: '',
        contacto_encargado: '',
        parentesco_encargado: '',
        state: 1,
        id_usuario: null,
        estado_civil: null,
        profesion: '',
        nombre_madre: '',
        nombre_padre: '',
        lugar_nacimiento: '',
        estado_civil_encargado: null,
        profesion_encargado: '',
        direccion_encargado: '',
        cui_encargado: '',
        nombre_conyuge: '',
        direccion_conyuge: '',
        telefono_conyuge: '',
        selectedOption: 'hospi',
        tipo_paciente: '0',
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
        nombre: {
          required
        },
        apellidos: {
          required
        },
        telefono: {
          required, numeric
        },
        nacimiento: {
          required
        },
        cui: {
          numeric, required
        },
        direccion: {
          required
        },
        nombre_encargado: {
          required
        },
        contacto_encargado: {
          required,
          numeric
        },
        cui_encargado: {
          required, numeric
        },
        telefono_conyuge: {
          numeric
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
      axios.post(apiUrl + '/expedientes/create', {
        form: me.form })
        .then(() => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el paciente ' + me.form.nombre + ' ' + me.form.apellidos + ' exitosamente'
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

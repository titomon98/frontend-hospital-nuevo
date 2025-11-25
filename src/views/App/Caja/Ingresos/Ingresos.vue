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
              <b-col md="2">
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
                <b-form-group label="Apellido de casada: ">
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
                  <div v-if="calcularEdad >= 18">
                    <b-form-input
                      type= "number"
                      v-model.trim="form.cui"
                      placeholder="Ingresar el CUI"
                    ></b-form-input>
                  </div>
                  <div v-else>
                    <b-form-input
                      v-model.trim="form.cui"
                      :value="'NO DISPONIBLE'"
                      placeholder="Ingresar el CUI"
                      disabled
                    ></b-form-input>
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
                    :class="{'is-invalid': $v.form.direccion.$error}"
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
            </b-row>
            <!-- Datos de encargado -->
            <h4 class="card-title mt-3">Ingreso de encargado</h4>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Nombre:">
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
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    type= "number"
                    v-model.trim="$v.form.contacto_encargado.$model"
                    :class="{'is-invalid': $v.form.contacto_encargado.$error}"
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
                    type= "number"
                    v-model.trim="$v.form.cui_encargado.$model"
                    :class="{'is-invalid': $v.form.cui_encargado.$error}"
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
              <b-col md="2">
                <b-form-group label="Edad de encargado:">
                  <b-form-input
                    v-model.trim="form.edad_encargado"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ingresar edad "
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
import { required, numeric, helpers } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Patients',
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.form.id_usuario = this.currentUser.uid
  },
  mounted () {
    xray.index()
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
        casada: '',
        nacimiento: null,
        cui: 'NO DISPONIBLE',
        nacionalidad: null,
        telefono: '',
        direccion: '',
        generos: '',
        nombre_encargado: '',
        contacto_encargado: '',
        parentesco_encargado: '',
        edad_encargado: '',
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
        motivo: ' ',
        fecha: null,
        hora: null,
        tipo_cuenta: 1
      },
      nacionalidades: ['Guatemala', 'El Salvador', 'México', 'Honduras', 'Belice', 'Otro'],
      generos: ['Masculino', 'Femenino'],
      parentescos: ['Padre/Madre', 'Hermano/a', 'Hijo/a', 'Cónyuge', 'Otro'],
      estados_civiles: ['Soltero/a', 'Casado/a', 'Viudo/a', 'Separado/a', 'Divorciado/a', 'Otro'],
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
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        apellidos: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        telefono: {
          required, numeric
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
        direccion: {
          required
        },
        nombre_encargado: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
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
      axios.post(apiUrl + '/expedientes/create', {
        form: me.form, user: me.currentUser.user })
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
    }
  }
}
</script>

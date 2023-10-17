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
          <template v-slot:headerAction>
            <b-button variant="primary" @click="backToPatients"  >REGRESAR A LISTADO</b-button>
          </template>
          <template v-slot:body>
            <!-- fila -->
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.name.$model"
                    :state="!$v.form.name.$error"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Apellido:">
                  <b-form-input
                    v-model.trim="$v.form.secondName.$model"
                    :state="!$v.form.secondName.$error"
                    placeholder="Ingresar apellido"
                  ></b-form-input>
                  <div v-if="$v.form.secondName.required.$invalid" class="invalid-feedback">
                    Debe ingresar el apellido
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Apellido de casada:">
                  <b-form-input
                    v-model.trim="form.marriedName"
                    placeholder="Ingresar apellido de casada"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Fecha de nacimiento:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.birth.$model"
                    :state="!$v.form.birth.$error"
                    placeholder="Ingresar fecha de nacimiento"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Dirección:">
                  <b-form-input
                    v-model.trim="$v.form.address.$model"
                    :state="!$v.form.address.$error"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.phoneNumber.$model"
                    :state="!$v.form.phoneNumber.$error"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.phoneNumber.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.phoneNumber.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Correo:">
                  <b-form-input
                    v-model.trim="form.email"
                    :state="!$v.form.email.$error"
                    placeholder="Ingresar correo"
                  ></b-form-input>
                  <div v-if="$v.form.email.$invalid" class="invalid-feedback">
                    Debe ingresar una direccion de correo válida
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Sexo:">
                  <v-select
                    name="type"
                    v-model="$v.form.sex.$model"
                    :state="!$v.form.sex.$error"
                    :options="genders"
                    placeholder="Seleccione el sexo"
                  />
                  <div v-if="$v.form.sex.$error" class="invalid-feedback-vselect">
                    Debe ingresar el Sexo
                  </div>
                </b-form-group>
              </b-col>
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

            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <!-- Empieza datos del encargado -->
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ingreso de encargado</h4>
          </template>
          <template v-slot:body>
            <!-- fila -->
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.name.$model"
                    :state="!$v.form.name.$error"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Apellido:">
                  <b-form-input
                    v-model.trim="$v.form.secondName.$model"
                    :state="!$v.form.secondName.$error"
                    placeholder="Ingresar apellido"
                  ></b-form-input>
                  <div v-if="$v.form.secondName.required.$invalid" class="invalid-feedback">
                    Debe ingresar el apellido
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Apellido de casada:">
                  <b-form-input
                    v-model.trim="form.marriedName"
                    placeholder="Ingresar apellido de casada"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Fecha de nacimiento:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.birth.$model"
                    :state="!$v.form.birth.$error"
                    placeholder="Ingresar fecha de nacimiento"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Dirección:">
                  <b-form-input
                    v-model.trim="$v.form.address.$model"
                    :state="!$v.form.address.$error"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.phoneNumber.$model"
                    :state="!$v.form.phoneNumber.$error"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.phoneNumber.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.phoneNumber.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Correo:">
                  <b-form-input
                    v-model.trim="form.email"
                    :state="!$v.form.email.$error"
                    placeholder="Ingresar correo"
                  ></b-form-input>
                  <div v-if="$v.form.email.$invalid" class="invalid-feedback">
                    Debe ingresar una direccion de correo válida
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Sexo:">
                  <v-select
                    name="type"
                    v-model="$v.form.sex.$model"
                    :state="!$v.form.sex.$error"
                    :options="genders"
                    placeholder="Seleccione el sexo"
                  />
                  <div v-if="$v.form.sex.$error" class="invalid-feedback-vselect">
                    Debe ingresar el Sexo
                  </div>
                </b-form-group>
              </b-col>
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
            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
            </b-row>
          </template>
        </iq-card>
      </b-col>
    </b-row>
    <!-- Empieza datos del conyuge -->
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Ingreso de encargado</h4>
          </template>
          <template v-slot:body>
            <!-- fila -->
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.name.$model"
                    :state="!$v.form.name.$error"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Apellido:">
                  <b-form-input
                    v-model.trim="$v.form.secondName.$model"
                    :state="!$v.form.secondName.$error"
                    placeholder="Ingresar apellido"
                  ></b-form-input>
                  <div v-if="$v.form.secondName.required.$invalid" class="invalid-feedback">
                    Debe ingresar el apellido
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Apellido de casada:">
                  <b-form-input
                    v-model.trim="form.marriedName"
                    placeholder="Ingresar apellido de casada"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Fecha de nacimiento:">
                  <b-form-input
                    type="date"
                    v-model.trim="$v.form.birth.$model"
                    :state="!$v.form.birth.$error"
                    placeholder="Ingresar fecha de nacimiento"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Dirección:">
                  <b-form-input
                    v-model.trim="$v.form.address.$model"
                    :state="!$v.form.address.$error"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.phoneNumber.$model"
                    :state="!$v.form.phoneNumber.$error"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.phoneNumber.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.phoneNumber.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Correo:">
                  <b-form-input
                    v-model.trim="form.email"
                    :state="!$v.form.email.$error"
                    placeholder="Ingresar correo"
                  ></b-form-input>
                  <div v-if="$v.form.email.$invalid" class="invalid-feedback">
                    Debe ingresar una direccion de correo válida
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Sexo:">
                  <v-select
                    name="type"
                    v-model="$v.form.sex.$model"
                    :state="!$v.form.sex.$error"
                    :options="genders"
                    placeholder="Seleccione el sexo"
                  />
                  <div v-if="$v.form.sex.$error" class="invalid-feedback-vselect">
                    Debe ingresar el Sexo
                  </div>
                </b-form-group>
              </b-col>
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
            </b-row>
            <b-row class="ml-2">
              <!-- columna -->
            </b-row>
            <b-button block variant="primary" @click="onValidate">Registrar paciente</b-button>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import { required, email, numeric } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import { mapGetters } from 'vuex'

export default {
  name: 'Patients',
  components: {
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.getLaguages()
    this.getNationalities()
    this.getBloods()
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
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      form: {
        id: 0,
        name: '',
        secondName: '',
        marriedName: '',
        address: '',
        fileNumber: '',
        birth: '',
        phoneNumber: '',
        email: '',
        sex: '',
        cui: '',
        parentName: '',
        parentCUI: '',
        afiliado: '',
        origin: '',
        maritalStatus: '',
        age: '',
        tutor: '',
        language: [],
        blood: [],
        nationality: [],
        state: 1,
        id_usuario: null
      },
      languages: [],
      bloods: [],
      nationalities: [],
      genders: ['M', 'F'],
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
        name: {
          required
        },
        secondName: {
          required
        },
        phoneNumber: {
          required, numeric
        },
        birth: {
        },
        email: {
          email
        },
        sex: {
          required
        },
        cui: {
          numeric
        },
        maritalStatus: {},
        language: {},
        nationality: {},
        blood: {},
        address: {
        },
        parentName: {
        },
        parentCUI: {
          numeric
        },
        afiliado: {
        },
        origin: {
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
      axios.post(apiUrl + '/paciente/create', {
        form: me.form })
        .then(() => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el paciente ' + me.form.name + ' exitosamente'
          me.$router.push({ name: 'patient.patients' })
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* Guardar */
    getLaguages () {
      axios.get(apiUrl + '/idioma/get').then((response) => {
        this.languages = response.data
      })
    },
    getBloods () {
      axios.get(apiUrl + '/sangre/get').then((response) => {
        this.bloods = response.data
      })
    },
    getNationalities () {
      axios.get(apiUrl + '/nacionalidad/get').then((response) => {
        this.nationalities = response.data
      })
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    backToPatients () {
      this.$router.push({ name: 'patient.patients' })
    },
    nationalityModal () {
      this.$refs.nationalityModal.openModal()
    },
    savedNationality (nationality) {
      // console.log('holaaaaaaaaa')
      this.alertVariant = 'success'
      this.showAlert()
      this.alertText = 'Se la nacionalidad: ' + nationality.nombre + ' exitosamente'
      this.getNationalities()
      this.form.nationality = nationality
    }
  }
}
</script>

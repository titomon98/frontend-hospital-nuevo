<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Citas</h4>
            <div class="iq-search-bar mt-2">
              <div class="row">
                <div class="col-sm">
                  <b-form action="#" class="searchbox">
                  </b-form>
                </div>
                <div class="col-sm">
                </div>
              </div>
            </div>
          </template>
          <!-- <template v-slot:headerAction>
            <b-button variant="primary" @click="backToPatients"  >REGRESAR A PACIENTES</b-button>
          </template> -->
          <template v-slot:body>
            <b-tabs>
              <b-tab title="Pacientes hoy" ><Today/></b-tab>
              <b-tab title="Lista de espera" ><WaitList/></b-tab>
              <!-- <b-tab title="Demograficos" ><Demographic :patient="patient"/></b-tab>
              <b-tab title="Citas" ><Appointments :patientId="patientId"/></b-tab>
              <b-tab title="Caja" ><Charges :patientId="patientId"/></b-tab>
              <b-tab title="Seguros" ><Insurances :patientId="patientId"/></b-tab> -->
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
// import axios from 'axios'
// import { apiUrl } from '../../../config/constant'
import Today from '../Patients/PatientsToday'
import WaitList from '../Patients/WaitList'
// import Documents from '../Patients/features/DocumentsParent'
// import Visits from '../Patients/features/Visits'
// import Charges from '../Patients/features/ChargesParent'
// import Insurances from '../Patients/ReceptionFeatures/Insurances'
// import Demographic from '../Patients/ReceptionFeatures/Demographic'
// import Appointments from '../Patients/ReceptionFeatures/Appointments'

export default {
  name: 'Reception',
  components: {
    Today,
    WaitList
    // Documents,
    // Visits,
    // Charges,
    // Insurances,
    // Demographic,
    // Appointments
  },
  data () {
    return {
      // patient: {},
      // patientId: 0
    }
  },
  mounted () {
    xray.index()
  },
  beforeMount () {
    // this.patientId = this.$route.params.id
    // this.getPatient(this.patientId)
  },
  methods: {
    // getPatient (id) {
    //   let me = this
    //   axios.get(apiUrl + `/paciente/get?id=${id}`)
    //     .then(response => {
    //       me.patient = response.data
    //     })
    //     .catch(error => {
    //       console.log(error)
    //     })
    // },
    // backToPatients () {
    //   this.$router.push({ name: 'patient.patients' })
    // }
  }
}
</script>

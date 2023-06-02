<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Laboratorio</h4>
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
          <template v-slot:body>
            <b-tabs>
              <b-tab title="Pacientes hoy" lazy><Today/></b-tab>
              <b-tab title="Lista de espera" lazy><WaitList/></b-tab>
              <b-tab title="Examenes" lazy><Exam/></b-tab>
              <b-tab title="Tipo de examen" lazy><ExamType/></b-tab>
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
import Today from '../Laboratory/PatientsToday.vue'
import WaitList from '../Laboratory/WaitList'
import ExamType from '../Laboratory/ExamType'
import Exam from '../Laboratory/Examinations'
// import Documents from '../Patients/features/DocumentsParent'
// import Visits from '../Patients/features/Visits'
// import Charges from '../Patients/features/ChargesParent'
// import Insurances from '../Patients/ReceptionFeatures/Insurances'
// import Demographic from '../Patients/ReceptionFeatures/Demographic'
// import Appointments from '../Patients/ReceptionFeatures/Appointments'

export default {
  name: 'Laboratory',
  components: {
    Today,
    WaitList,
    ExamType,
    Exam
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

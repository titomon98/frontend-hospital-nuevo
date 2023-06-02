<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Médicos</h4>
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
              <b-tab title="Medicos" ><Medicos /></b-tab>
              <b-tab title="Tipos" ><Type/></b-tab>
              <b-tab title="Especialidades" ><Specialties/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import Medicos from '../Doctors/Medicos'
import Type from '../Doctors/Type'
import Specialties from '../Doctors/Specialties'
export default {
  name: 'Reception',
  components: {
    Medicos,
    Type,
    Specialties
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

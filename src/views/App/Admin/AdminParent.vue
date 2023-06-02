<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Administración</h4>
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
              <b-tab title="Usuarios" active><Users/></b-tab>
              <b-tab title="Gastos operativos" lazy><Gastos/></b-tab>
              <b-tab title="Ingresos" lazy><Ingresos/></b-tab>
              <b-tab title="Planilla de salarios" lazy><PlanillaSalario/></b-tab>
              <b-tab title="Vauchers" lazy><Vauchers/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import Gastos from './GastosOperativos.vue'
import Ingresos from './Ingresos.vue'
import PlanillaSalario from './PlanillaSalario.vue'
import Vauchers from './Vauchers.vue'
import Users from './Users.vue'

export default {
  name: 'AdminParent',
  components: {
    Gastos,
    Ingresos,
    PlanillaSalario,
    Vauchers,
    Users
  },
  data () {
    return {
      patient: {},
      patientId: 0
    }
  },
  mounted () {
    xray.index()
  },
  beforeMount () {
    this.patientId = this.$route.params.id
    this.getPatient(this.patientId)
  },
  methods: {
    getPatient (id) {
      let me = this
      axios.get(apiUrl + `/paciente/get?id=${id}`)
        .then(response => {
          me.patient = response.data
        })
        .catch(error => {
          console.log(error)
        })
    },
    backToPatients () {
      this.$router.push({ name: 'patient.patients' })
    }
  }
}
</script>

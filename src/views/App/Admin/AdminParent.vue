<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Gerencia</h4>
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
              <b-tab title="Asuetos" lazy><Asuetos/></b-tab>
              <!-- <b-tab title="Efectivo" lazy><Efectivo/></b-tab> -->
              <b-tab title="Validar descuentos" lazy><ValidarDescuentos/></b-tab>
              <b-tab title="Reportes" lazy><Reportes/></b-tab>
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
import Users from './Users.vue'
import Asuetos from './Asuetos.vue'
import Reportes from './Reportes.vue'
/* import Efectivo from './Efectivo.vue' */
import ValidarDescuentos from './Descuentos/ValidarDescuentos.vue'

export default {
  name: 'AdminParent',
  components: {
    Users,
    Asuetos,
    Reportes,
    /* Efectivo, */
    ValidarDescuentos
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

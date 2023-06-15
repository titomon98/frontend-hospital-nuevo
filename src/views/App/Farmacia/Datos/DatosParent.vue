<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Datos</h4>
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
              <b-tab title="Casa médica" active><CasaMedica/></b-tab>
              <b-tab title="Marca" lazy><Marca/></b-tab>
              <b-tab title="Presentacion" lazy><Presentacion/></b-tab>
              <b-tab title="Proveedor" lazy><Proveedor/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import CasaMedica from './CasaMedica.vue'
import Marca from './Marca.vue'
import Presentacion from './Presentacion.vue'
import Proveedor from './Proveedor.vue'

export default {
  name: 'DatosParent',
  components: {
    CasaMedica,
    Marca,
    Presentacion,
    Proveedor
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

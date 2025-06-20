<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Caja chica</h4>
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
          <template v-slot:headerAction>
            <b-button variant="primary" :disabled="true">VER CAJA DEL DÍA</b-button>
          </template>
          <template v-slot:body>
            <b-tabs>
              <b-tab title="Registro de caja chica" active><CajaChica/></b-tab>
              <b-tab v-if="hasPermission([5, 7])" title="Rubros" lazy><Rubros/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import CajaChica from './CajaChica.vue'
import Rubros from './Rubros.vue'
import { mapGetters } from 'vuex'

export default {
  name: 'CajaChicaParent',
  components: {
    CajaChica,
    Rubros
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
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  beforeMount () {
    this.patientId = this.$route.params.id
  },
  methods: {
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },
    backToPatients () {
      this.$router.push({ name: 'patient.patients' })
    }
  }
}
</script>

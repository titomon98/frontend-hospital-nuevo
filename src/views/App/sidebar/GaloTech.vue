<template>
  <b-container fluid>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Galo Tech</h4>
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
              <b-tab title="Equipo" active><Equipment/></b-tab>
              <b-tab title="Inventario" lazy><Inventory/></b-tab>
              <b-tab title="Tipo" lazy><EquipmentType/></b-tab>
              <b-tab title="Ventas" lazy><Sales/></b-tab>
              <b-tab title="Listado de ventas" lazy><SalesList/></b-tab>
              <b-tab title="Compras" lazy><Purchases/></b-tab>
              <b-tab title="Listado de compras" lazy><PurchasesList/></b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import Equipment from '../GaloTech/Equipment'
import EquipmentType from '../GaloTech/EquipmentType'
import Inventory from '../GaloTech/Inventory'
import Sales from '../GaloTech/Sales.vue'
import SalesList from '../GaloTech/SalesList.vue'
import Purchases from '../GaloTech/Purchases.vue'
import PurchasesList from '../GaloTech/PurchasesList.vue'
export default {
  name: 'Reception',
  components: {
    Equipment,
    EquipmentType,
    Inventory,
    Sales,
    SalesList,
    Purchases,
    PurchasesList
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

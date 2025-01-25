<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card>
          <template v-slot:body>
            <h4 class="card-title">LISTADO DE COMISIONES A MEDICOS</h4>
            <div class="row mb-3">
              <div class="col-md-6">
                <b-form-group label="Buscar por Nombre de Médico:">
                  <b-form-input
                    type="text"
                    v-model="searchMedico"
                    placeholder="Ingrese el nombre del médico..."
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <b-table
              :items="filteredExamenes"
              :fields="fields"
              responsive
              striped
              hover
              class="table"
              >
              <template #cell(nombre_medico)="data">
                <strong>{{ data.value }}</strong>
              </template>
              <template #cell(total)="data">
                Q {{ data.value.toFixed(2) }}
              </template>
            </b-table>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import { apiUrl } from '../../../../config/constant'
export default {
  name: 'Incentivos',
  data () {
    return {
      searchMedico: '',
      examenes: [],
      fields: [
        { key: 'nombre_medico', label: 'Nombre del Médico' },
        { key: 'nombre_examen', label: 'Examen Realizado' },
        { key: 'nombre_paciente', label: 'Nombre del Paciente' },
        { key: 'total', label: 'Total' },
        { key: 'fecha', label: 'Fecha' }
      ]
    }
  },
  computed: {
    filteredExamenes () {
      if (this.searchMedico) {
        return this.examenes.filter((examen) =>
          examen.nombre_medico
            .toLowerCase()
            .includes(this.searchMedico.toLowerCase())
        )
      }
      return this.examenes
    }
  },
  methods: {
    async fetchExamenes () {
      try {
        const response = await fetch(apiUrl + '/reporte/laboratio/comisiones')
        const data = await response.json()
        this.examenes = Array.isArray(data) ? data : data.items || []
      } catch (error) {
        console.error('Error al obtener los exámenes:', error)
      }
    }
  },
  mounted () {
    this.fetchExamenes()
  }
}
</script>

<style>
.center-text {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    text-align: center
}
.table th,
.table td {
    text-align: center;
    padding: 8px
}
.table tr:nth-child(even) {
    background-color: #f9f9f9
}
</style>

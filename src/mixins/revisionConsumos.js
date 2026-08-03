import axios from 'axios'
import { apiUrl } from '../config/constant'

// Mixin para la revisión de consumos de una cuenta (medicamentos, anestésicos,
// quirúrgico y común) en las áreas de Intensivo, Emergencia, Quirófano y
// Hospitalización. Solo los roles 1, 3, 9 y 11 pueden revisar.
// Uso en el componente:
//  - mixins: [revisionConsumosMixin]
//  - al cargar los consumos de una cuenta: this.cargarRevisionConsumos(idCuenta)
//  - en el template (al final de la tabla de consumos): la botonera + el estado.
export default {
  data () {
    return {
      revisionConsumos: { idCuenta: null, estado: 0, reviewedBy: '' }
    }
  },
  computed: {
    // Roles autorizados a revisar consumos.
    puedeRevisarConsumos () {
      return [1, 3, 9, 11].includes(this.currentUser && this.currentUser.user_type)
    },
    textoRevisionConsumos () {
      if (this.revisionConsumos.estado === 1) return 'Consumos comprobados'
      if (this.revisionConsumos.estado === 2) return 'Inconsistencia reportada'
      return 'Sin revisar'
    },
    varianteRevisionConsumos () {
      if (this.revisionConsumos.estado === 1) return 'success'
      if (this.revisionConsumos.estado === 2) return 'danger'
      return 'secondary'
    }
  },
  methods: {
    async cargarRevisionConsumos (idCuenta) {
      this.revisionConsumos = { idCuenta: idCuenta, estado: 0, reviewedBy: '' }
      if (!idCuenta) return
      try {
        const r = await axios.get(apiUrl + '/revisionConsumos/get/' + idCuenta)
        this.revisionConsumos = {
          idCuenta: idCuenta,
          estado: r.data.estado || 0,
          reviewedBy: r.data.reviewed_by || ''
        }
      } catch (error) {
        console.error('Error cargando revisión de consumos:', error)
      }
    },
    // estado: 1 = comprobado, 2 = inconsistencia.
    async revisarConsumos (estado) {
      const idCuenta = this.revisionConsumos.idCuenta
      if (!idCuenta) return
      try {
        const r = await axios.post(apiUrl + '/revisionConsumos/set', {
          id_cuenta: idCuenta,
          estado: estado,
          user: this.currentUser.user
        })
        this.revisionConsumos = {
          idCuenta: idCuenta,
          estado: r.data.estado,
          reviewedBy: r.data.reviewed_by || ''
        }
      } catch (error) {
        console.error('Error al revisar consumos:', error)
      }
    }
  }
}

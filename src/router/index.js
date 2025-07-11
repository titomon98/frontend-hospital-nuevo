import Vue from 'vue'
import VueRouter from 'vue-router'
/* Layouts */
import Layout1 from '../layouts/Layout1'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'
/* Dashboards View */
import Dashboard2 from '../views/Dashboards/Dashboard2.vue'
import Dashboard1 from '../views/Dashboards/Dashboard1.vue'

/* Authentic View */
import SignIn1 from '../views/AuthPages/Default/SignIn1'
import SignUp1 from '../views/AuthPages/Default/SignUp1'
/* Extra Pages */
import Pricing from '../views/Pages/Pricing'
import Pricing1 from '../views/Pages/Pricing1'
/* Icon Views */
import IconDripicons from '../views/Icons/IconDripicons'
import IconFontawesome5 from '../views/Icons/IconFontawesome5'
import IconLineAwesome from '../views/Icons/IconLineAwesome'
import IconRemixicon from '../views/Icons/IconRemixicon'
import IconUnicons from '../views/Icons/IconUnicons'
/* Form View */
import FormLayout from '../views/Forms/FormLayout'
import FormValidates from '../views/Forms/FormValidates'
import FormSwitches from '../views/Forms/FormSwitches'
import FormRadios from '../views/Forms/FormRadios'
import FormCheckboxes from '../views/Forms/FormCheckboxes'

/* Todo */
import Callback from '../views/AuthPages/Default/Callback'

// App views
// gerencia
import AdminParent from '../views/App/Admin/AdminParent'
import Asuetos from '../views/App/Admin/Asuetos.vue'
import Reportes from '../views/App/Admin/Reportes.vue'
import Cuartos from '../views/App/Admin/Cuartos.vue'
import Users from '../views/App/Admin/Users'

// caja
import Seguros from '../views/App/Caja/Seguros/Seguros.vue'
import Contratos from '../views/App/Caja/Contratos/Contratos'
// import CortesParent from '../views/App/Caja/Cortes/CortesParent'
import CuentasParent from '../views/App/Caja/Cuentas/CuentasParent'
import EgresosParent from '../views/App/Caja/Egresos/EgresosParent'
import Expedientes from '../views/App/Caja/Expedientes/Expedientes'
import CuentasList from '../views/App/Caja/Cuentas/CuentasList'
import Ingresos from '../views/App/Caja/Ingresos/Ingresos'
import Reingresos from '../views/App/Caja/Reingresos/Reingreso'
import CajaChica from '../views/App/Caja/CajaChica/CajaChicaParent'

// enfermeria
import PedidosFarmaciaParent from '../views/App/Enfermeria/Pedidos/PedidosFarmaciaParent'
import EmergenciasParent from '../views/App/Enfermeria/Emergencias/Emergencias'
import HospitalizacionParent from '../views/App/Enfermeria/Hospitalizacion/Hospitalizacion'
import IntensivoParent from '../views/App/Enfermeria/Intensivo/Intensivo'
import QuirofanoParent from '../views/App/Enfermeria/Quirofano/Quirofano'
import Habitaciones from '../views/App/Enfermeria/Habitaciones/Habitaciones'
import Servicios from '../views/App/Enfermeria/Servicios/Servicios.vue'
import IngresosEnfermeria from '../views/App/Enfermeria/Ingresos/IngresosEnfermeria.vue'
import CategoriaSalaOperaciones from '../views/App/Enfermeria/CategoriaSalaOperaciones/CategoriaSalaOperaciones.vue'
import AsignarHabitacion from '../views/App/Enfermeria/AsignarHabitaciones/AsignarHabitaciones.vue'

// farmacia
import PedidosPendientesParent from '../views/App/Farmacia/Pedidos/PedidosPendientesParent'
import ComunParent from '../views/App/Farmacia/Comun/ComunParent'
import EquiposParent from '../views/App/Farmacia/Equipos/EquiposParent'
import AlimentosParent from '../views/App/Farmacia/Alimentacion/AlimentosParent'
import MedicamentosParent from '../views/App/Farmacia/Medicamentos/MedicamentosParent'
import MuestrasParent from '../views/App/Farmacia/Muestras/MuestrasParent'
import QuirurgicoParent from '../views/App/Farmacia/Quirurgico/QuirurgicoParent'
import DatosParent from '../views/App/Farmacia/Datos/DatosParent'
import AlertasParent from '../views/App/Farmacia/Alertas/AlertasParent'
import PaquetesParent from '../views/App/Farmacia/Paquetes/PaquetesParent'
import FacturasParent from '../views/App/Farmacia/Facturas/FacturasParent'
import Consumos from '../views/App/Farmacia/Consumos/Consumos.vue'

// medicos
import MedicosParent from '../views/App/Medicos/MedicosParent'
import Medicos from '../views/App/Medicos/Medicos'
import Especialidad from '../views/App/Medicos/Especialidad'
import Socios from '../views/App/Medicos/Socios'

// liquidacion
import LiquidacionParent from '../views/App/Liquidaciones/LiquidacionesParent'

// pacientes
import PacientesParent from '../views/App/Pacientes/PacientesParent'

// Laboratorio
// Caja
import Cortes from '../views/App/Laboratorio/Caja/Cortes.vue'
import ValDescuentos from '../views/App/Laboratorio/Caja/ValidarDescuentos.vue'
import CuentasParentLaboratorio from '../views/App/Laboratorio/Caja/CuentasParent.vue'
import TiposExamenes from '../views/App/Laboratorio/TiposExamenes.vue'
// import Descuentos from '../views/App/Laboratorio/Caja/ValidarDescuentos.vue'

// Examenes
import Examenes from '../views/App/Laboratorio/Examenes.vue'
import ExamenesAlmacenados from '../views/App/Laboratorio/ExamenesAlmacenados.vue'

// Estadistica
import ExamenesInternos from '../views/App/Laboratorio/Estadisticas/ExamenesInternos.vue'
import Incentivos from '../views/App/Laboratorio/Estadisticas/Incentivos.vue'

// Inventario
import Equipo from '../views/App/Laboratorio/Inventario/Equipo.vue'

// Encargados
import Encargados from '../views/App/Laboratorio/Encargados.vue'
import Facturacion from '../views/App/Caja/Facturacion.vue'
import FacturacionLab from '../views/App/Laboratorio/Caja/FacturacionLab.vue'
import HospitalizacionEnfermeras from '../views/App/Enfermeria/HospitalizacionEnfermeras/HospitalizacionEnfermeras.vue'
import CortesCaja from '../views/App/Caja/Cortes/Cortes.vue'

Vue.use(VueRouter)

const LaboratorioRoutes = (prop, mode) => [
  {
    path: 'cortes',
    name: prop + '.cortes',
    meta: { dark: mode, auth: true, name: 'cortes', roles: [2, 4, 6, 8] },
    component: Cortes
  },
  {
    path: 'cuentas',
    name: prop + '.cuentas',
    meta: { dark: mode, auth: true, name: 'cuentas', roles: [2, 4, 6, 8] },
    component: CuentasParentLaboratorio
  },
  {
    path: 'descuentos',
    name: prop + '.descuentos',
    meta: { dark: mode, auth: true, name: 'descuentos', roles: [2, 4] },
    component: ValDescuentos
  },
  {
    path: 'facturacion',
    name: prop + '.facturacion',
    meta: { dark: mode, auth: true, name: 'facturacion', roles: [2, 4, 6, 8] },
    component: FacturacionLab
  },
  {
    path: 'examenes',
    name: prop + '.examenes',
    meta: { dark: mode, auth: true, name: 'examenes', roles: [2, 4, 6, 8, 12, 13] },
    component: Examenes
  },
  {
    path: 'examenesalmacenados',
    name: prop + '.examenesalmacenados',
    meta: { dark: mode, auth: true, name: 'examenesalmacenados', roles: [2, 4, 6, 12] },
    component: ExamenesAlmacenados
  },
  {
    path: 'examenesinternos',
    name: prop + '.examenesinternos',
    meta: { dark: mode, auth: true, name: 'examenesinternos', roles: [2, 4, 6] },
    component: ExamenesInternos
  },
  {
    path: 'incentivos',
    name: prop + '.incentivos',
    meta: { dark: mode, auth: true, name: 'incentivos', roles: [2, 4, 6] },
    component: Incentivos
  },
  {
    path: 'equipo',
    name: prop + '.equipo',
    meta: { dark: mode, auth: true, name: 'equipo', roles: [2, 4, 6, 13] },
    component: Equipo
  },
  {
    path: 'encargados',
    name: prop + '.encargados',
    meta: { dark: mode, auth: true, name: 'encargados', roles: [2, 4] },
    component: Encargados
  },
  {
    path: 'tiposexamenes',
    name: prop + '.tiposexamenes',
    meta: { dark: mode, auth: true, name: 'tiposexamenes', roles: [2, 4] },
    component: TiposExamenes
  }
]

const AdminRoutes = (prop, mode) => [
  {
    path: 'users',
    name: prop + '.users',
    meta: { dark: mode, auth: true, name: 'Usuarios', roles: [1] },
    component: Users
  },
  {
    path: 'cuartos',
    name: prop + '.cuartos',
    meta: { dark: mode, auth: true, name: 'Cuartos', roles: [1] },
    component: Cuartos
  },
  {
    path: 'asuetos',
    name: prop + '.asuetos',
    meta: { dark: mode, auth: true, name: 'Asuetos', roles: [1] },
    component: Asuetos
  },
  {
    path: 'reportes',
    name: prop + '.reportes',
    meta: { dark: mode, auth: true, name: 'Reportes', roles: [1] },
    component: Reportes
  },
  {
    path: 'adminparent',
    name: prop + '.adminparent',
    meta: { dark: mode, auth: true, name: 'adminparent', roles: [1] },
    component: AdminParent
  }
]

const LiquidacionRoutes = (prop, mode) => [
  {
    path: 'liquidacionparent',
    name: prop + '.liquidacionparent',
    meta: { dark: mode, auth: true, name: 'liquidacionparent' },
    component: LiquidacionParent
  }
]

const PacientesRoutes = (prop, mode) => [
  {
    path: 'pacientesparent',
    name: prop + '.pacientesparent',
    meta: { dark: mode, auth: true, name: 'pacientesparent' },
    component: PacientesParent
  }
]

const CajaRoutes = (prop, mode) => [
  {
    path: 'cortes',
    name: prop + '.cortes',
    meta: { dark: mode, auth: true, name: 'cortes', roles: [1, 3, 5, 7] },
    component: CortesCaja
  },
  {
    path: 'contratos',
    name: prop + '.contratos',
    meta: { dark: mode, auth: true, name: 'contratos', roles: [1, 3, 5, 7] },
    component: Contratos
  },
  {
    path: 'cuentas',
    name: prop + '.cuentas',
    meta: { dark: mode, auth: true, name: 'cuentas', roles: [1, 3, 5, 7] },
    component: CuentasParent
  },
  {
    path: 'facturacion',
    name: prop + '.facturacion',
    meta: { dark: mode, auth: true, name: 'facturacion', roles: [1, 3, 5, 7] },
    component: Facturacion
  },
  {
    path: 'seguros',
    name: prop + '.seguros',
    meta: { dark: mode, auth: true, name: 'seguros', roles: [1, 3, 5, 7] },
    component: Seguros
  },
  {
    path: 'expedientes',
    name: prop + '.expedientes',
    meta: { dark: mode, auth: true, name: 'expedientes', roles: [1, 3, 5, 7] },
    component: Expedientes
  },
  {
    path: 'cuentaslist',
    name: prop + '.cuentaslist',
    meta: { dark: mode, auth: true, name: 'cuentaslist', roles: [1, 3, 5, 7] },
    component: CuentasList
  },
  {
    path: 'ingresos',
    name: prop + '.ingresos',
    meta: { dark: mode, auth: true, name: 'ingresos', roles: [1, 3, 5, 7] },
    component: Ingresos
  },
  {
    path: 'reingresos',
    name: prop + '.reingresos',
    meta: { dark: mode, auth: true, name: 'reingresos', roles: [1, 3, 5, 7] },
    component: Reingresos
  },
  {
    path: 'cajachica',
    name: prop + '.cajachica',
    meta: { dark: mode, auth: true, name: 'cajachica', roles: [1, 3, 5, 7] },
    component: CajaChica
  }
]

const EnfermeriaRoutes = (prop, mode) => [
  {
    path: 'pedidos',
    name: prop + '.pedidos',
    meta: { dark: mode, auth: true, name: 'pedidos', roles: [1, 3, 5, 9, 10, 11] },
    component: PedidosFarmaciaParent
  },
  {
    path: 'emergencias',
    name: prop + '.emergencias',
    meta: { dark: mode, auth: true, name: 'emergencias', roles: [1, 3, 5, 9, 11] },
    component: EmergenciasParent
  },
  {
    path: 'hospitalizacion',
    name: prop + '.hospitalizacion',
    meta: { dark: mode, auth: true, name: 'hospitalizacion', roles: [1, 3, 5, 9, 10, 11] },
    component: HospitalizacionParent
  },
  {
    path: 'hospitalizacionEnfermeras',
    name: prop + '.hospitalizacionEnfermeras',
    meta: { dark: mode, auth: true, name: 'hospitalizacionEnfermeras', roles: [1, 3, 5, 9, 10] },
    component: HospitalizacionEnfermeras
  },
  {
    path: 'intensivo',
    name: prop + '.intensivo',
    meta: { dark: mode, auth: true, name: 'intensivo', roles: [1, 3, 5, 9, 10, 11] },
    component: IntensivoParent
  },
  {
    path: 'quirofano',
    name: prop + '.quirofano',
    meta: { dark: mode, auth: true, name: 'quirofano', roles: [1, 3, 5, 9, 10] },
    component: QuirofanoParent
  },
  {
    path: 'habitaciones',
    name: prop + '.habitaciones',
    meta: { dark: mode, auth: true, name: 'habitaciones', roles: [1, 3, 5, 9] },
    component: Habitaciones
  },
  {
    path: 'servicios',
    name: prop + '.servicios',
    meta: { dark: mode, auth: true, name: 'servicios', roles: [1, 3, 5, 9] },
    component: Servicios
  },
  {
    path: 'CategoriaSalaOperaciones',
    name: prop + '.CategoriaSalaOperaciones',
    meta: { dark: mode, auth: true, name: 'CategoriaSalaOperaciones', roles: [1, 5, 3, 9] },
    component: CategoriaSalaOperaciones
  },
  {
    path: 'ingresos',
    name: prop + '.ingresos',
    meta: { dark: mode, auth: true, name: 'ingresos', roles: [1, 3, 9, 10, 11] },
    component: IngresosEnfermeria
  },
  {
    path: 'reingresos',
    name: prop + '.reingresos',
    meta: { dark: mode, auth: true, name: 'reingresos', roles: [1] },
    component: Reingresos
  },
  {
    path: 'egresos',
    name: prop + '.egresos',
    meta: { dark: mode, auth: true, name: 'egresos', roles: [1, 3, 9, 10, 11] },
    component: EgresosParent
  },
  {
    path: 'AsignarHabitacion',
    name: prop + '.AsignarHabitacion',
    meta: { dark: mode, auth: true, name: 'AsignarHabitacion', roles: [1, 3, 9, 10, 11] },
    component: AsignarHabitacion
  }
]

const FarmaciaRoutes = (prop, mode) => [
  {
    path: 'pendientes',
    name: prop + '.pendientes',
    meta: { dark: mode, auth: true, name: 'pendientes', roles: [1, 5, 11] },
    component: PedidosPendientesParent
  },
  {
    path: 'comun',
    name: prop + '.comun',
    meta: { dark: mode, auth: true, name: 'comun', roles: [1, 5, 11] },
    component: ComunParent
  },
  {
    path: 'alimentos',
    name: prop + '.alimentos',
    meta: { dark: mode, auth: true, name: 'alimentos', roles: [1, 3, 5, 7] },
    component: AlimentosParent
  },
  {
    path: 'equipos',
    name: prop + '.equipos',
    meta: { dark: mode, auth: true, name: 'equipos', roles: [1, 3, 5, 7] },
    component: EquiposParent
  },
  {
    path: 'medicamentos',
    name: prop + '.medicamentos',
    meta: { dark: mode, auth: true, name: 'medicamentos', roles: [1, 5, 11] },
    component: MedicamentosParent
  },
  {
    path: 'muestras',
    name: prop + '.muestras',
    meta: { dark: mode, auth: true, name: 'muestras', roles: [1, 5, 11] },
    component: MuestrasParent
  },
  {
    path: 'quirurgico',
    name: prop + '.quirurgico',
    meta: { dark: mode, auth: true, name: 'quirurgico', roles: [1, 5, 11] },
    component: QuirurgicoParent
  },
  {
    path: 'consumos',
    name: prop + '.consumos',
    meta: { dark: mode, auth: true, name: 'consumos', roles: [1, 5, 11] },
    component: Consumos
  },
  {
    path: 'datos',
    name: prop + '.datos',
    meta: { dark: mode, auth: true, name: 'datos', roles: [1, 5] },
    component: DatosParent
  },
  {
    path: 'alertas',
    name: prop + '.alertas',
    meta: { dark: mode, auth: true, name: 'alertas', roles: [1, 5] },
    component: AlertasParent
  },
  {
    path: 'paquetes',
    name: prop + '.paquetes',
    meta: { dark: mode, auth: true, name: 'paquetes', roles: [1, 5] },
    component: PaquetesParent
  },
  {
    path: 'facturas',
    name: prop + '.facturas',
    meta: { dark: mode, auth: true, name: 'facturas', roles: [1, 5] },
    component: FacturasParent
  }
]

const MedicosRoutes = (prop, mode) => [
  {
    path: 'medicos',
    name: prop + '.medicos',
    meta: { dark: mode, auth: true, name: 'medicos', roles: [1, 3, 5, 7] },
    component: Medicos
  },
  {
    path: 'especialidad',
    name: prop + '.especialidad',
    meta: { dark: mode, auth: true, name: 'especialidad', roles: [1, 3, 5, 7] },
    component: Especialidad
  },
  {
    path: 'socios',
    name: prop + '.socios',
    meta: { dark: mode, auth: true, name: 'socios', roles: [1, 3, 5, 7] },
    component: Socios
  },
  {
    path: 'medicosparent',
    name: prop + '.medicosparent',
    meta: { dark: mode, auth: true, name: 'medicosparent', roles: [1, 3, 5, 7] },
    component: MedicosParent
  }
]

const childRoutes = (prop, mode) => [
  {
    path: 'home-1',
    name: prop + '.home-1',
    meta: { dark: mode, auth: true, name: 'Home 1' },
    component: Dashboard1
  },
  {
    path: '`home-2`',
    name: prop + '.home-2',
    meta: { dark: mode, auth: true, name: 'Home 2' },
    component: Dashboard2
  }
]

const formChildRoute = (prop, mode = false) => [
  {
    path: 'form-layout',
    name: prop + '.layout',
    meta: { dark: mode, auth: true, name: 'Layout' },
    component: FormLayout
  },
  {
    path: 'form-validate',
    name: prop + '.validate',
    meta: { dark: mode, auth: true, name: 'Validate' },
    component: FormValidates
  },
  {
    path: 'form-switches',
    name: prop + '.switch',
    meta: { dark: mode, auth: true, name: 'Switch' },
    component: FormSwitches
  },
  {
    path: 'form-radios',
    name: prop + '.radio',
    meta: { dark: mode, auth: true, name: 'Radio' },
    component: FormRadios
  },
  {
    path: 'form-checkboxes',
    name: prop + '.checkbox',
    meta: { dark: mode, auth: true, name: 'Checkbox' },
    component: FormCheckboxes
  }
]

const iconChildRoute = (prop, mode = false) => [
  {
    path: 'dripicons',
    name: prop + '.dripicons',
    meta: { dark: mode, auth: true, name: 'Dripicons' },
    component: IconDripicons
  },
  {
    path: 'fontawesome-5',
    name: prop + '.fontawesome-5',
    meta: { dark: mode, auth: true, name: 'Font Awsome' },
    component: IconFontawesome5
  },
  {
    path: 'lineawesome',
    name: prop + '.lineawesome',
    meta: { dark: mode, auth: true, name: 'Line Awsome' },
    component: IconLineAwesome
  },
  {
    path: 'remixicon',
    name: prop + '.remixicon',
    meta: { dark: mode, auth: true, name: 'Remixicon' },
    component: IconRemixicon
  },
  {
    path: 'unicons',
    name: prop + '.unicons',
    meta: { dark: mode, auth: true, name: 'Unicon' },
    component: IconUnicons
  }
]

const authChildRoutes = (prop, mode = false) => [
  {
    path: 'sign-in1',
    name: prop + '.sign-in1',
    meta: { dark: mode, auth: true },
    component: SignIn1
  },
  {
    path: 'sign-up1',
    name: prop + '.sign-up1',
    meta: { dark: mode, auth: true },
    component: SignUp1
  }
]
const authChildRoutes2 = (prop, mode = false) => [
  {
    path: '/',
    name: prop + '.login',
    meta: { dark: mode, auth: true },
    component: SignIn1
  }
]

const defaultlayout = (prop, mode = false) => [
  {
    path: 'pricing',
    name: prop + '.pricing',
    meta: { dark: mode, auth: true, name: 'Pricing' },
    component: Pricing
  },
  {
    path: 'pricing-1',
    name: prop + '.pricing1',
    meta: { dark: mode, auth: true, name: 'Pricing 1' },
    component: Pricing1
  }
]

const routes = [
  {
    path: '/laboratorio',
    name: 'laboratorio',
    component: Layout1,
    meta: { auth: true },
    children: LaboratorioRoutes('laboratorio')
  },
  {
    path: '/gerencia',
    name: 'gerencia',
    component: Layout1,
    meta: { auth: true },
    children: AdminRoutes('gerencia')
  },
  {
    path: '/caja',
    name: 'caja',
    component: Layout1,
    meta: { auth: true },
    children: CajaRoutes('caja')
  },
  {
    path: '/liquidacion',
    name: 'liquidacion',
    component: Layout1,
    meta: { auth: true },
    children: LiquidacionRoutes('liquidacion')
  },
  {
    path: '/pacientes',
    name: 'pacientes',
    component: Layout1,
    meta: { auth: true },
    children: PacientesRoutes('pacientes')
  },
  {
    path: '/enfermeria',
    name: 'enfermeria',
    component: Layout1,
    meta: { auth: true },
    children: EnfermeriaRoutes('enfermeria')
  },
  {
    path: '/farmacia',
    name: 'farmacia',
    component: Layout1,
    meta: { auth: true },
    children: FarmaciaRoutes('farmacia')
  },
  {
    path: '/medicos',
    name: 'medicos',
    component: Layout1,
    meta: { auth: true },
    children: MedicosRoutes('medicos')
  },
  {
    path: '/',
    name: 'login',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes2('login')
  },
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: childRoutes('dashboard')
  },
  {
    path: '/icon',
    name: 'icon',
    component: Layout1,
    meta: { auth: true },
    children: iconChildRoute('icon')
  },
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    meta: { auth: true },
    children: authChildRoutes('auth1')
  },
  {
    path: '/extra-pages',
    name: 'extra-pages',
    component: Layout1,
    meta: { auth: true },
    children: defaultlayout('extra-pages')
  },
  {
    path: '/form',
    name: 'form',
    component: Layout1,
    meta: { auth: true },
    children: formChildRoute('form')
  },
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const requiresAuth = to.matched.some(record => record.meta.auth)
  const routeRoles = to.meta?.roles || []

  // 1. Si requiere auth y no hay usuario → login
  if (requiresAuth && !user) {
    if (to.name !== 'auth1.sign-in1') {
      return next({ name: 'auth1.sign-in1' })
    } else {
      return next()
    }
  }

  // 2. Si requiere roles y el usuario no tiene permiso → login
  if (requiresAuth && routeRoles.length > 0 && user) {
    const userRole = user.user_type
    if (!routeRoles.includes(userRole)) {
      if (to.name !== 'auth1.sign-in1') {
        return next({ name: 'auth1.sign-in1' })
      } else {
        return next()
      }
    }
  }

  // 3. Si el usuario intenta ir al login pero ya está logueado → redirigir al dashboard
  if (to.name === 'auth1.sign-in1' && user) {
    return next({ name: 'dashboard.home-2' })
  }

  return next()
})

export default router

import Vue from 'vue'
import VueRouter from 'vue-router'

// Layouts (static — siempre necesarios)
import Layout1 from '../layouts/Layout1'
import AuthLayout1 from '../layouts/AuthLayouts/AuthLayout1'

Vue.use(VueRouter)

// ─── Lazy-loaded views ────────────────────────────────────────────────────────

// Auth & Callback
const SignIn1 = () => import('../views/AuthPages/Default/SignIn1')
const SignUp1 = () => import('../views/AuthPages/Default/SignUp1')
const Callback = () => import('../views/AuthPages/Default/Callback')

// Dashboards
const Dashboard1 = () => import('../views/Dashboards/Dashboard1.vue')
const Dashboard2 = () => import('../views/Dashboards/Dashboard2.vue')

// Admin / Gerencia
const AdminParent = () => import('../views/App/Admin/AdminParent')
const Users = () => import('../views/App/Admin/Users')
const Cuartos = () => import('../views/App/Admin/Cuartos.vue')
const Asuetos = () => import('../views/App/Admin/Asuetos.vue')
const Reportes = () => import('../views/App/Admin/Reportes.vue')

// Caja
const CortesCaja = () => import('../views/App/Caja/Cortes/Cortes.vue')
const Contratos = () => import('../views/App/Caja/Contratos/Contratos')
const CuentasParent = () => import('../views/App/Caja/Cuentas/CuentasParent')
const CuentasList = () => import('../views/App/Caja/Cuentas/CuentasList')
const Facturacion = () => import('../views/App/Caja/Facturacion.vue')
const Seguros = () => import('../views/App/Caja/Seguros/Seguros.vue')
const Expedientes = () => import('../views/App/Caja/Expedientes/Expedientes')
const Ingresos = () => import('../views/App/Caja/Ingresos/Ingresos')
const Reingresos = () => import('../views/App/Caja/Reingresos/Reingreso')
const CajaChica = () => import('../views/App/Caja/CajaChica/CajaChicaParent')
const EgresosParent = () => import('../views/App/Caja/Egresos/EgresosParent')

// Enfermería
const PedidosFarmaciaParent = () => import('../views/App/Enfermeria/Pedidos/PedidosFarmaciaParent')
const EmergenciasParent = () => import('../views/App/Enfermeria/Emergencias/Emergencias')
const HospitalizacionParent = () => import('../views/App/Enfermeria/Hospitalizacion/Hospitalizacion')
const HospitalizacionEnfermeras = () => import('../views/App/Enfermeria/HospitalizacionEnfermeras/HospitalizacionEnfermeras.vue')
const Honorarios = () => import('../views/App/Enfermeria/Honorarios/Honorarios.vue')
const IntensivoParent = () => import('../views/App/Enfermeria/Intensivo/Intensivo')
const QuirofanoParent = () => import('../views/App/Enfermeria/Quirofano/Quirofano')
const CobrosHabitacion = () => import('../views/App/Enfermeria/Habitaciones/CobrosHabitacion.vue')
const Habitaciones = () => import('../views/App/Enfermeria/Habitaciones/Habitaciones')
const Servicios = () => import('../views/App/Enfermeria/Servicios/Servicios.vue')
const CategoriaSalaOperaciones = () => import('../views/App/Enfermeria/CategoriaSalaOperaciones/CategoriaSalaOperaciones.vue')
const IngresosEnfermeria = () => import('../views/App/Enfermeria/Ingresos/IngresosEnfermeria.vue')
const IngresosEmergencia = () => import('../views/App/Enfermeria/Ingresos/IngresosEmergencia.vue')
const AsignarHabitacion = () => import('../views/App/Enfermeria/AsignarHabitaciones/AsignarHabitaciones.vue')

// Farmacia
const PedidosPendientesParent = () => import('../views/App/Farmacia/Pedidos/PedidosPendientesParent')
const ComunParent = () => import('../views/App/Farmacia/Comun/ComunParent')
const AlimentosParent = () => import('../views/App/Farmacia/Alimentacion/AlimentosParent')
const EquiposParent = () => import('../views/App/Farmacia/Equipos/EquiposParent')
const MedicamentosParent = () => import('../views/App/Farmacia/Medicamentos/MedicamentosParent')
const MuestrasParent = () => import('../views/App/Farmacia/Muestras/MuestrasParent')
const QuirurgicoParent = () => import('../views/App/Farmacia/Quirurgico/QuirurgicoParent')
const Consumos = () => import('../views/App/Farmacia/Consumos/Consumos.vue')
const DatosParent = () => import('../views/App/Farmacia/Datos/DatosParent')
const AlertasParent = () => import('../views/App/Farmacia/Alertas/AlertasParent')
const PaquetesParent = () => import('../views/App/Farmacia/Paquetes/PaquetesParent')
const FacturasParent = () => import('../views/App/Farmacia/Facturas/FacturasParent')

// Médicos
const MedicosParent = () => import('../views/App/Medicos/MedicosParent')
const Medicos = () => import('../views/App/Medicos/Medicos')
const Especialidad = () => import('../views/App/Medicos/Especialidad')
const Socios = () => import('../views/App/Medicos/Socios')
const PersonalSala = () => import('../views/App/Medicos/PersonalSala')

// Liquidaciones
const LiquidacionParent = () => import('../views/App/Liquidaciones/LiquidacionesParent')

// Pacientes
const PacientesParent = () => import('../views/App/Pacientes/PacientesParent')

// Laboratorio
const Cortes = () => import('../views/App/Laboratorio/Caja/Cortes.vue')
const ValDescuentos = () => import('../views/App/Laboratorio/Caja/ValidarDescuentos.vue')
const CuentasParentLaboratorio = () => import('../views/App/Laboratorio/Caja/CuentasParent.vue')
const FacturacionLab = () => import('../views/App/Laboratorio/Caja/FacturacionLab.vue')
const TiposExamenes = () => import('../views/App/Laboratorio/TiposExamenes.vue')
const Examenes = () => import('../views/App/Laboratorio/Examenes.vue')
const ExamenesAlmacenados = () => import('../views/App/Laboratorio/ExamenesAlmacenados.vue')
const ExamenesInternos = () => import('../views/App/Laboratorio/Estadisticas/ExamenesInternos.vue')
const Incentivos = () => import('../views/App/Laboratorio/Estadisticas/Incentivos.vue')
const Equipo = () => import('../views/App/Laboratorio/Inventario/Equipo.vue')
const Encargados = () => import('../views/App/Laboratorio/Encargados.vue')

// Template / Demo (iconos, forms, páginas extra)
const Pricing = () => import('../views/Pages/Pricing')
const Pricing1 = () => import('../views/Pages/Pricing1')
const IconDripicons = () => import('../views/Icons/IconDripicons')
const IconFontawesome5 = () => import('../views/Icons/IconFontawesome5')
const IconLineAwesome = () => import('../views/Icons/IconLineAwesome')
const IconRemixicon = () => import('../views/Icons/IconRemixicon')
const IconUnicons = () => import('../views/Icons/IconUnicons')
const FormLayout = () => import('../views/Forms/FormLayout')
const FormValidates = () => import('../views/Forms/FormValidates')
const FormSwitches = () => import('../views/Forms/FormSwitches')
const FormRadios = () => import('../views/Forms/FormRadios')
const FormCheckboxes = () => import('../views/Forms/FormCheckboxes')

// ─── Route factories ──────────────────────────────────────────────────────────

const LaboratorioRoutes = (prop) => [
  { path: 'cortes', name: `${prop}.cortes`, meta: { auth: true, name: 'cortes', roles: [2, 4, 6, 8] }, component: Cortes },
  { path: 'cuentas', name: `${prop}.cuentas`, meta: { auth: true, name: 'cuentas', roles: [2, 4, 6, 8] }, component: CuentasParentLaboratorio },
  { path: 'descuentos', name: `${prop}.descuentos`, meta: { auth: true, name: 'descuentos', roles: [2, 4] }, component: ValDescuentos },
  { path: 'facturacion', name: `${prop}.facturacion`, meta: { auth: true, name: 'facturacion', roles: [2, 4, 6, 8] }, component: FacturacionLab },
  { path: 'examenes', name: `${prop}.examenes`, meta: { auth: true, name: 'examenes', roles: [2, 4, 6, 8, 12, 13] }, component: Examenes },
  { path: 'examenesalmacenados', name: `${prop}.examenesalmacenados`, meta: { auth: true, name: 'examenesalmacenados', roles: [2, 4, 6, 12] }, component: ExamenesAlmacenados },
  { path: 'examenesinternos', name: `${prop}.examenesinternos`, meta: { auth: true, name: 'examenesinternos', roles: [2, 4, 6] }, component: ExamenesInternos },
  { path: 'incentivos', name: `${prop}.incentivos`, meta: { auth: true, name: 'incentivos', roles: [2, 4, 6] }, component: Incentivos },
  { path: 'equipo', name: `${prop}.equipo`, meta: { auth: true, name: 'equipo', roles: [2, 4, 6, 13] }, component: Equipo },
  { path: 'encargados', name: `${prop}.encargados`, meta: { auth: true, name: 'encargados', roles: [2, 4] }, component: Encargados },
  { path: 'tiposexamenes', name: `${prop}.tiposexamenes`, meta: { auth: true, name: 'tiposexamenes', roles: [2, 4] }, component: TiposExamenes }
]

const AdminRoutes = (prop) => [
  { path: 'users', name: `${prop}.users`, meta: { auth: true, name: 'Usuarios', roles: [1] }, component: Users },
  { path: 'cuartos', name: `${prop}.cuartos`, meta: { auth: true, name: 'Cuartos', roles: [1] }, component: Cuartos },
  { path: 'asuetos', name: `${prop}.asuetos`, meta: { auth: true, name: 'Asuetos', roles: [1] }, component: Asuetos },
  { path: 'reportes', name: `${prop}.reportes`, meta: { auth: true, name: 'Reportes', roles: [1] }, component: Reportes },
  { path: 'adminparent', name: `${prop}.adminparent`, meta: { auth: true, name: 'adminparent', roles: [1] }, component: AdminParent }
]

const CajaRoutes = (prop) => [
  { path: 'cortes', name: `${prop}.cortes`, meta: { auth: true, name: 'cortes', roles: [1, 3, 5, 7] }, component: CortesCaja },
  { path: 'contratos', name: `${prop}.contratos`, meta: { auth: true, name: 'contratos', roles: [1, 3, 5, 7] }, component: Contratos },
  { path: 'cuentas', name: `${prop}.cuentas`, meta: { auth: true, name: 'cuentas', roles: [1, 3, 5, 7] }, component: CuentasParent },
  { path: 'facturacion', name: `${prop}.facturacion`, meta: { auth: true, name: 'facturacion', roles: [1, 3, 5, 7] }, component: Facturacion },
  { path: 'seguros', name: `${prop}.seguros`, meta: { auth: true, name: 'seguros', roles: [1, 3, 5, 7] }, component: Seguros },
  { path: 'expedientes', name: `${prop}.expedientes`, meta: { auth: true, name: 'expedientes', roles: [1, 3, 5, 7] }, component: Expedientes },
  { path: 'cuentaslist', name: `${prop}.cuentaslist`, meta: { auth: true, name: 'cuentaslist', roles: [1, 3, 5, 7] }, component: CuentasList },
  { path: 'ingresos', name: `${prop}.ingresos`, meta: { auth: true, name: 'ingresos', roles: [1, 3, 5, 7] }, component: Ingresos },
  { path: 'reingresos', name: `${prop}.reingresos`, meta: { auth: true, name: 'reingresos', roles: [1, 3, 5, 7] }, component: Reingresos },
  { path: 'cajachica', name: `${prop}.cajachica`, meta: { auth: true, name: 'cajachica', roles: [1, 3, 5, 7] }, component: CajaChica }
]

const EnfermeriaRoutes = (prop) => [
  { path: 'pedidos', name: `${prop}.pedidos`, meta: { auth: true, name: 'pedidos', roles: [1, 3, 5, 9, 10, 11] }, component: PedidosFarmaciaParent },
  { path: 'emergencias', name: `${prop}.emergencias`, meta: { auth: true, name: 'emergencias', roles: [1, 3, 5, 9, 11] }, component: EmergenciasParent },
  { path: 'hospitalizacion', name: `${prop}.hospitalizacion`, meta: { auth: true, name: 'hospitalizacion', roles: [1, 3, 5, 9, 10, 11] }, component: HospitalizacionParent },
  { path: 'hospitalizacionEnfermeras', name: `${prop}.hospitalizacionEnfermeras`, meta: { auth: true, name: 'hospitalizacionEnfermeras', roles: [1, 3, 5, 9, 10] }, component: HospitalizacionEnfermeras },
  { path: 'honorarios', name: `${prop}.honorarios`, meta: { auth: true, name: 'honorarios', roles: [1, 3] }, component: Honorarios },
  { path: 'intensivo', name: `${prop}.intensivo`, meta: { auth: true, name: 'intensivo', roles: [1, 3, 5, 9, 10, 11] }, component: IntensivoParent },
  { path: 'quirofano', name: `${prop}.quirofano`, meta: { auth: true, name: 'quirofano', roles: [1, 3, 5, 9, 10] }, component: QuirofanoParent },
  { path: 'cobro_habitacion', name: `${prop}.cobro_habitacion`, meta: { auth: true, name: 'cobro_habitacion', roles: [1, 3] }, component: CobrosHabitacion },
  { path: 'habitaciones', name: `${prop}.habitaciones`, meta: { auth: true, name: 'habitaciones', roles: [1, 3, 5, 9] }, component: Habitaciones },
  { path: 'servicios', name: `${prop}.servicios`, meta: { auth: true, name: 'servicios', roles: [1, 3, 5, 9] }, component: Servicios },
  { path: 'CategoriaSalaOperaciones', name: `${prop}.CategoriaSalaOperaciones`, meta: { auth: true, name: 'CategoriaSalaOperaciones', roles: [1, 3, 5, 9] }, component: CategoriaSalaOperaciones },
  { path: 'ingresos', name: `${prop}.ingresos`, meta: { auth: true, name: 'ingresos', roles: [1, 3, 9, 10, 11] }, component: IngresosEnfermeria },
  { path: 'ingresosemergencia', name: `${prop}.ingresosemergencia`, meta: { auth: true, name: 'ingresosemergencia', roles: [1, 3, 9, 10, 11] }, component: IngresosEmergencia },
  { path: 'reingresos', name: `${prop}.reingresos`, meta: { auth: true, name: 'reingresos', roles: [1] }, component: Reingresos },
  { path: 'egresos', name: `${prop}.egresos`, meta: { auth: true, name: 'egresos', roles: [1, 3, 9, 10, 11] }, component: EgresosParent },
  { path: 'AsignarHabitacion', name: `${prop}.AsignarHabitacion`, meta: { auth: true, name: 'AsignarHabitacion', roles: [1, 3, 9, 10, 11] }, component: AsignarHabitacion }
]

const FarmaciaRoutes = (prop) => [
  { path: 'pendientes', name: `${prop}.pendientes`, meta: { auth: true, name: 'pendientes', roles: [1, 3, 5, 11] }, component: PedidosPendientesParent },
  { path: 'comun', name: `${prop}.comun`, meta: { auth: true, name: 'comun', roles: [1, 3, 5, 11] }, component: ComunParent },
  { path: 'alimentos', name: `${prop}.alimentos`, meta: { auth: true, name: 'alimentos', roles: [1, 3, 5, 7] }, component: AlimentosParent },
  { path: 'equipos', name: `${prop}.equipos`, meta: { auth: true, name: 'equipos', roles: [1, 3, 5, 7] }, component: EquiposParent },
  { path: 'medicamentos', name: `${prop}.medicamentos`, meta: { auth: true, name: 'medicamentos', roles: [1, 3, 5, 11] }, component: MedicamentosParent },
  { path: 'muestras', name: `${prop}.muestras`, meta: { auth: true, name: 'muestras', roles: [1, 3, 5, 11] }, component: MuestrasParent },
  { path: 'quirurgico', name: `${prop}.quirurgico`, meta: { auth: true, name: 'quirurgico', roles: [1, 3, 5, 11] }, component: QuirurgicoParent },
  { path: 'consumos', name: `${prop}.consumos`, meta: { auth: true, name: 'consumos', roles: [1, 3, 5, 11] }, component: Consumos },
  { path: 'datos', name: `${prop}.datos`, meta: { auth: true, name: 'datos', roles: [1, 3, 5] }, component: DatosParent },
  { path: 'alertas', name: `${prop}.alertas`, meta: { auth: true, name: 'alertas', roles: [1, 3, 5] }, component: AlertasParent },
  { path: 'paquetes', name: `${prop}.paquetes`, meta: { auth: true, name: 'paquetes', roles: [1, 3, 5] }, component: PaquetesParent },
  { path: 'facturas', name: `${prop}.facturas`, meta: { auth: true, name: 'facturas', roles: [1, 3, 5] }, component: FacturasParent }
]

const MedicosRoutes = (prop) => [
  { path: 'medicos', name: `${prop}.medicos`, meta: { auth: true, name: 'medicos', roles: [1, 3, 5, 7] }, component: Medicos },
  { path: 'especialidad', name: `${prop}.especialidad`, meta: { auth: true, name: 'especialidad', roles: [1, 3, 5, 7] }, component: Especialidad },
  { path: 'socios', name: `${prop}.socios`, meta: { auth: true, name: 'socios', roles: [1, 3, 5, 7] }, component: Socios },
  { path: 'medicosparent', name: `${prop}.medicosparent`, meta: { auth: true, name: 'medicosparent', roles: [1, 3, 5, 7] }, component: MedicosParent },
  { path: 'PersonalSala', name: `${prop}.PersonalSala`, meta: { auth: true, name: 'PersonalSala', roles: [1, 3, 5, 7] }, component: PersonalSala }
]

const LiquidacionRoutes = (prop) => [
  { path: 'liquidacionparent', name: `${prop}.liquidacionparent`, meta: { auth: true, name: 'liquidacionparent' }, component: LiquidacionParent }
]

const PacientesRoutes = (prop) => [
  { path: 'pacientesparent', name: `${prop}.pacientesparent`, meta: { auth: true, name: 'pacientesparent' }, component: PacientesParent }
]

// Template / Demo routes (no son parte del sistema hospitalario)
const dashboardRoutes = (prop) => [
  { path: 'home-1', name: `${prop}.home-1`, meta: { auth: true, name: 'Home 1' }, component: Dashboard1 },
  { path: 'home-2', name: `${prop}.home-2`, meta: { auth: true, name: 'Home 2' }, component: Dashboard2 }
]

const formRoutes = (prop) => [
  { path: 'form-layout', name: `${prop}.layout`, meta: { auth: true, name: 'Layout' }, component: FormLayout },
  { path: 'form-validate', name: `${prop}.validate`, meta: { auth: true, name: 'Validate' }, component: FormValidates },
  { path: 'form-switches', name: `${prop}.switch`, meta: { auth: true, name: 'Switch' }, component: FormSwitches },
  { path: 'form-radios', name: `${prop}.radio`, meta: { auth: true, name: 'Radio' }, component: FormRadios },
  { path: 'form-checkboxes', name: `${prop}.checkbox`, meta: { auth: true, name: 'Checkbox' }, component: FormCheckboxes }
]

const iconRoutes = (prop) => [
  { path: 'dripicons', name: `${prop}.dripicons`, meta: { auth: true, name: 'Dripicons' }, component: IconDripicons },
  { path: 'fontawesome-5', name: `${prop}.fontawesome-5`, meta: { auth: true, name: 'Font Awesome' }, component: IconFontawesome5 },
  { path: 'lineawesome', name: `${prop}.lineawesome`, meta: { auth: true, name: 'Line Awesome' }, component: IconLineAwesome },
  { path: 'remixicon', name: `${prop}.remixicon`, meta: { auth: true, name: 'Remixicon' }, component: IconRemixicon },
  { path: 'unicons', name: `${prop}.unicons`, meta: { auth: true, name: 'Unicons' }, component: IconUnicons }
]

const extraPagesRoutes = (prop) => [
  { path: 'pricing', name: `${prop}.pricing`, meta: { auth: true, name: 'Pricing' }, component: Pricing },
  { path: 'pricing-1', name: `${prop}.pricing1`, meta: { auth: true, name: 'Pricing 1' }, component: Pricing1 }
]

// ─── Route definitions ────────────────────────────────────────────────────────

const routes = [
  // Login
  {
    path: '/',
    name: 'login',
    component: AuthLayout1,
    meta: { auth: true },
    children: [
      { path: '/', name: 'login.index', meta: { auth: true }, component: SignIn1 }
    ]
  },
  // Auth pages
  {
    path: '/auth',
    name: 'auth1',
    component: AuthLayout1,
    meta: { auth: true },
    children: [
      { path: 'sign-in1', name: 'auth1.sign-in1', meta: { auth: true }, component: SignIn1 },
      { path: 'sign-up1', name: 'auth1.sign-up1', meta: { auth: true }, component: SignUp1 }
    ]
  },
  // OAuth callback
  {
    path: '/callback',
    name: 'callback',
    meta: { auth: false },
    component: Callback
  },
  // ── Módulos hospitalarios ──────────────────────────────────────────────────
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
    path: '/laboratorio',
    name: 'laboratorio',
    component: Layout1,
    meta: { auth: true },
    children: LaboratorioRoutes('laboratorio')
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
  // ── Template / Demo ────────────────────────────────────────────────────────
  {
    path: '/',
    name: 'dashboard',
    component: Layout1,
    meta: { auth: true },
    children: dashboardRoutes('dashboard')
  },
  {
    path: '/icon',
    name: 'icon',
    component: Layout1,
    meta: { auth: true },
    children: iconRoutes('icon')
  },
  {
    path: '/extra-pages',
    name: 'extra-pages',
    component: Layout1,
    meta: { auth: true },
    children: extraPagesRoutes('extra-pages')
  },
  {
    path: '/form',
    name: 'form',
    component: Layout1,
    meta: { auth: true },
    children: formRoutes('form')
  }
]

// ─── Router instance ──────────────────────────────────────────────────────────

const router = new VueRouter({
  mode: 'history',
  base: process.env.VUE_APP_BASE_URL,
  routes
})

// ─── Navigation guard ─────────────────────────────────────────────────────────

router.beforeEach((to, from, next) => {
  const user = JSON.parse(localStorage.getItem('user'))
  const requiresAuth = to.matched.some(record => record.meta.auth)
  const routeRoles = to.meta?.roles || []

  // Sin sesión → login
  if (requiresAuth && !user) {
    return to.name !== 'auth1.sign-in1' ? next({ name: 'auth1.sign-in1' }) : next()
  }

  // Sin permiso de rol → login
  if (requiresAuth && routeRoles.length > 0 && user) {
    if (!routeRoles.includes(user.user_type)) {
      return to.name !== 'auth1.sign-in1' ? next({ name: 'auth1.sign-in1' }) : next()
    }
  }

  // Ya logueado intentando ir al login → dashboard
  if (to.name === 'auth1.sign-in1' && user) {
    return next({ name: 'dashboard.home-2' })
  }

  return next()
})

export default router

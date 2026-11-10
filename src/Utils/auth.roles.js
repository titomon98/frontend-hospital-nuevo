export const UserRole = {
  Gerencia: 1,
  Administrador: 2,
  CajaA: 3,
  CajaB: 4,
  Farmacia: 5,
  Contabilidad: 6,
  EnfermeraA: 7,
  EnfermeraB: 8,
  Interno: 9
}

// Tipos de usuario de laboratorio (tipo_usuarios): gerencia, administración, contabilidad, caja, químico, técnico.
export const esUsuarioLaboratorio = (user) => [2, 4, 6, 8, 12, 13].includes(Number(user && user.user_type))

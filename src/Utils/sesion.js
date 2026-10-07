// Aviso unico de sesion expirada: modal que solo se cierra con "Iniciar sesión",
// borra la sesion local y manda al login.
let mostrado = false

export const sesionExpirada = () => {
  if (mostrado || !window.vm) return
  mostrado = true
  window.vm.$bvModal.msgBoxOk('Su sesión ha expirado. Por favor vuelva a iniciar sesión.', {
    title: 'Sesión expirada',
    okTitle: 'Iniciar sesión',
    centered: true,
    noCloseOnBackdrop: true,
    noCloseOnEsc: true,
    hideHeaderClose: true
  }).then(() => {
    localStorage.removeItem('user')
    localStorage.removeItem('access_token')
    mostrado = false
    window.vm.$router.push({ name: 'auth1.sign-in1' }).catch(() => {})
  })
}

// true si el JWT guardado ya paso su fecha de expiracion (campo exp, en segundos).
export const tokenVencido = (token) => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
    return !!payload.exp && payload.exp * 1000 <= Date.now()
  } catch (e) {
    return false
  }
}

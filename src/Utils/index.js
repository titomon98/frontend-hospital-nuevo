// La sesion vive en sessionStorage (una por pestaña): asi dos pestañas con
// usuarios distintos no se pisan. localStorage solo guarda el ultimo login
// para que una pestaña nueva arranque con sesion en lugar de pedir login.
export const getCurrentUser = () => {
  try {
    let raw = sessionStorage.getItem('user')
    if (raw == null) {
      raw = localStorage.getItem('user')
      if (raw != null) sessionStorage.setItem('user', raw)
    }
    return raw != null ? JSON.parse(raw) : null
  } catch (error) {
    console.log('>>>> src/utils/index.js : getCurrentUser -> error', error)
    return null
  }
}

export const setCurrentUser = (user) => {
  try {
    if (user) {
      sessionStorage.setItem('user', JSON.stringify(user))
      localStorage.setItem('user', JSON.stringify(user))
    } else {
      // Solo se borra la semilla si es de esta misma sesion; si otra pestaña
      // inicio con otro usuario despues, esa se queda.
      if (localStorage.getItem('user') === sessionStorage.getItem('user')) {
        localStorage.removeItem('user')
      }
      sessionStorage.removeItem('user')
    }
  } catch (error) {
    console.log('>>>> src/utils/index.js : setCurrentUser -> error', error)
  }
}

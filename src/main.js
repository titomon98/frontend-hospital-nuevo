import Vue from 'vue'
import axios from 'axios'
// vuetable-2 trae su propia copia anidada de axios (0.15.3) y las tablas
// piden sus datos por ahi, no por el singleton de la raiz.
import vuetableAxios from 'vuetable-2/node_modules/axios'
import '@babel/polyfill'
import 'mutationobserver-shim'
import './Utils/fliter'
import App from './App.vue'
import router from './router'
import store from './store'
import Raphael from 'raphael/raphael'
import './plugins'
import './registerServiceWorker'
import i18n from './i18n'

global.Raphael = Raphael
Vue.config.productionTip = false

// El nombre del header debe coincidir con el que lee
// backend/middleware/auth.js: x-access-token, no Authorization.
const agregarToken = config => {
  try {
    const user = JSON.parse(localStorage.getItem('user'))
    if (user && user.token) {
      config.headers['x-access-token'] = user.token
    }
  } catch (error) {
    console.log('>>>> main.js : interceptor axios -> error', error)
  }
  return config
}

// Hay dos copias de axios en el bundle y las dos hablan con la API:
// la de la raiz (los componentes) y la anidada de vuetable-2 (las tablas).
axios.interceptors.request.use(agregarToken, error => Promise.reject(error))
vuetableAxios.interceptors.request.use(agregarToken, error => Promise.reject(error))

// Anti doble envio: descarta POST/PUT/PATCH identicos que ya estan en vuelo.
// Solo sobre el axios de la raiz; vuetable-2 unicamente hace GET.
const enVuelo = new Map()

const claveDe = config => [
  config.method,
  config.url,
  typeof config.data === 'string' ? config.data : JSON.stringify(config.data ?? '')
].join('|')

axios.interceptors.request.use(
  config => {
    const metodo = (config.method || '').toLowerCase()
    if (['post', 'put', 'patch'].indexOf(metodo) === -1) {
      return config
    }

    const clave = claveDe(config)
    if (enVuelo.has(clave)) {
      // Duplicado: se cancela. El componente no se entera, ver el
      // interceptor de respuesta de abajo.
      const fuente = axios.CancelToken.source()
      config.cancelToken = fuente.token
      fuente.cancel('peticion duplicada descartada')
      return config
    }

    // Solo la peticion que registra la clave puede borrarla despues, para
    // que un duplicado cancelado no libere la de la peticion original.
    enVuelo.set(clave, true)
    config.__claveEnVuelo = clave
    return config
  },
  error => Promise.reject(error)
)

const liberarClave = config => {
  if (config && config.__claveEnVuelo) {
    enVuelo.delete(config.__claveEnVuelo)
  }
}

axios.interceptors.response.use(
  response => {
    liberarClave(response.config)
    return response
  },
  error => {
    liberarClave(error.config)
    // Al duplicado se le devuelve una promesa que nunca se resuelve: asi no
    // entra ni al .then ni al .catch del componente, que ni se entera.
    if (axios.isCancel(error)) {
      return new Promise(() => {})
    }
    return Promise.reject(error)
  }
)

// v-anti-doble: deshabilita el elemento 1.5s al hacer click.
Vue.directive('anti-doble', {
  bind (el) {
    el.__antiDoble = () => {
      if (el.disabled) return
      el.disabled = true
      el.__antiDobleTimer = setTimeout(() => {
        el.disabled = false
      }, 1500)
    }
    el.addEventListener('click', el.__antiDoble)
  },
  unbind (el) {
    clearTimeout(el.__antiDobleTimer)
    el.removeEventListener('click', el.__antiDoble)
  }
})

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm

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

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm

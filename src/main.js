import Vue from 'vue'
import axios from 'axios'
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

// Los componentes importan el singleton de axios, asi que este interceptor
// alcanza a todos sin tocarlos. El nombre del header debe coincidir con el
// que lee backend/middleware/auth.js: x-access-token, no Authorization.
axios.interceptors.request.use(
  config => {
    try {
      const user = JSON.parse(localStorage.getItem('user'))
      if (user && user.token) {
        config.headers['x-access-token'] = user.token
      }
    } catch (error) {
      console.log('>>>> main.js : interceptor axios -> error', error)
    }
    return config
  },
  error => Promise.reject(error)
)

let vm = new Vue({
  router,
  store,
  i18n,
  render: h => h(App)
}).$mount('#app')

window.vm = vm

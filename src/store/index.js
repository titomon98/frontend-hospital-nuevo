import Vue from 'vue'
import Vuex from 'vuex'
import Setting from './Setting/index'
import Chat from './Chat/index'
import User from './user'
Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    Setting,
    Chat,
    User
  },
  state: {
  },
  mutations: {
    saveEmployeeType (state, rol) {
      localStorage.setItem('employee_type', rol)
      state.rol = rol
    }
  },
  actions: {
  },
  getters: {
  },
  strict: debug
})

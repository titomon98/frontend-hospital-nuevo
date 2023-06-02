import { currentUser, isAuthGuardActive } from '../config/constant'
import { setCurrentUser, getCurrentUser } from '../Utils/index'
import auth from '../services/auth'

export default {
  state: {
    currentUser: isAuthGuardActive ? getCurrentUser() : currentUser,
    loginError: null,
    processing: false
    /* forgotMailSuccess: null,
    resetPasswordSuccess: null */
  },
  getters: {
    currentUser: state => state.currentUser,
    processing: state => state.processing,
    loginError: state => state.loginError
    /* forgotMailSuccess: state => state.forgotMailSuccess,
    resetPasswordSuccess: state => state.resetPasswordSuccess, */
  },
  mutations: {
    setUser (state, payload) {
      state.currentUser = payload
      state.processing = false
      state.loginError = null
    },
    setLogout (state) {
      state.currentUser = null
      state.processing = false
      state.loginError = null
    },
    setProcessing (state, payload) {
      state.processing = payload
      state.loginError = null
    },
    setError (state, payload) {
      state.loginError = payload
      state.currentUser = null
      state.processing = false
    },
    setForgotMailSuccess (state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.forgotMailSuccess = true
    },
    setResetPasswordSuccess (state) {
      state.loginError = null
      state.currentUser = null
      state.processing = false
      state.resetPasswordSuccess = true
    },
    clearError (state) {
      state.loginError = null
    }
  },
  actions: {
    login ({ commit }, payload) {
      commit('clearError')
      commit('setProcessing', true)
      auth.login(payload)
        .then(
          user => {
            const item = { auth: true, authType: 'mysql', uid: user.data.id, user: user.data.usuario, user_type: user.data.tipo_usuario, token: user.data.token, ...currentUser }
            setCurrentUser(item)
            commit('setUser', item)
            // console.log('desde user.js', user)
            // const item = {}
          }
        ).catch(
          err => {
            setCurrentUser(null)
            commit('setError', err.response.data.message)
            setTimeout(() => {
              commit('clearError')
            }, 3000)
          }
        )
      // cambiar cuando ya regrese los datos necesarios
      // const item = { uid: payload.ress.uid, role: 0, img: "/assets/img/profiles/user.png", id: payload.ress.uid, date: "Last seen today 15:24" }
      // setCurrentUser(item)
      // commit('setUser', item)
    },

    signOut ({ commit }) {
      setCurrentUser(null)
      commit('setLogout')
    }
  }
}
//

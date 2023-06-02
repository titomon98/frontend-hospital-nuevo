<template>
  <ValidationObserver ref="form" v-slot="{ handleSubmit }">
    <b-alert
      :variant="alertVariant"
      :show="alertCountDownError"
      dismissible
      fade
      @dismissed="alertCountDownError=0"
      class="bg-white"
    >
      <div class="iq-alert-text">{{ alertErrorText }}</div>
    </b-alert>
    <form class="mt-4" novalidate @submit.prevent="handleSubmit(onSubmit)">
      <ValidationProvider vid="user" name="User" rules="required" v-slot="{ errors }">
        <div class="form-group ">
          <label for="userInput">Usuario</label>
          <input type="user" :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="userInput"
                 v-model="user.user" placeholder="Ingrese usuario" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <ValidationProvider vid="password" name="Password" rules="required" v-slot="{ errors }">
        <div class="form-group">
          <label for="passwordInput">Contraseña</label>
          <input type="password"  :class="'form-control mb-0' +(errors.length > 0 ? ' is-invalid' : '')"
                 id="passwordInput"
                 v-model="user.password" placeholder="Ingrese contraseña" required>
          <div class="invalid-feedback">
            <span>{{ errors[0] }}</span>
          </div>
        </div>
      </ValidationProvider>
      <div class="d-inline-block w-100">

        <button type="submit" class="btn btn-primary float-right">Iniciar sesión</button>
      </div>

    </form>
  </ValidationObserver>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'SignIn1Form',
  data: () => ({
    user: {
      user: '',
      password: ''
    },
    alertSecs: 5,
    alertCountDown: 0,
    alertCountDownError: 0,
    alertText: '',
    alertErrorText: '',
    alertVariant: ''
  }),
  mounted () {
  },
  computed: {
    ...mapGetters(['currentUser', 'processing', 'loginError'])
  },
  methods: {
    ...mapActions(['login']),
    async onSubmit () {
      try {
        await this.login(this.user)
      } catch (error) {
        console.log(error)
      }
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    }
  },
  watch: {
    currentUser (val) {
      if (val && val.uid) {
        setTimeout(() => {
          this.$router.push({ name: 'dashboard.home-1' })
        }, 200)
      }
    },
    loginError (val) {
      if (val != null) {
        this.alertVariant = 'danger'
        this.showAlertError()
        this.alertErrorText = val
      }
    }
  }
}
</script>

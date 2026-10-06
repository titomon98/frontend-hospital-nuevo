<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <!-- Sidebar -->
      <SideBarStyle1 :items="filteredVerticalMenu" :horizontal="horizontal" :logo="logo" @toggle="sidebarMini" />
      <div id="content-page" class="content-page" :class="horizontal ? 'ml-0' : ''">
        <!-- TOP Nav Bar -->
        <NavBarStyle1 title="Dashboard" :homeURL="{ name: 'dashboard1.home' }" @toggle="sidebarMini" :logo="logo" :horizontal="horizontal" :items="horizontalMenu">

          <template slot="right">
            <ul class="navbar-list">
              <li>
                <a href="#" class="search-toggle iq-waves-effect d-flex align-items-center">
                  <img :src="userProfile" class="img-fluid rounded mr-3" alt="user">
                  <div class="caption">
                    <h6 class="mb-0 line-height">{{ currentUser.user }}</h6>
                  </div>
                </a>
                <div class="iq-sub-dropdown iq-dropdown">
                  <div class="iq-card shadow-none m-0">
                    <div class="iq-card-body p-0 ">
                      <div class="bg-primary p-3">
                        <h5 class="mb-0 text-white line-height">{{ currentUser.user }}</h5>
                      </div>
                      <div class="d-inline-block w-100 text-center p-3">
                        <a class="iq-bg-primary iq-sign-btn mb-2 d-block" href="javascript:void(0)" @click="abrirCambiarPassword" role="button">Cambiar contraseña<i class="ri-lock-password-line ml-2"></i></a>
                        <a class="iq-bg-danger iq-sign-btn" href="javascript:void(0)" @click="logout" role="button">{{ $t('nav.user.signout') }}<i class="ri-login-box-line ml-2"></i></a>
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            </ul>
          </template>
        </NavBarStyle1>
        <!-- TOP Nav Bar END -->
        <b-modal id="modal-cambiar-password" ref="modal-cambiar-password" title="Cambiar contraseña" no-close-on-backdrop @hidden="limpiarCambioPassword">
          <b-alert :show="!!passwordError" variant="danger" class="text-white bg-danger">{{ passwordError }}</b-alert>
          <b-alert :show="!!passwordOk" variant="success">{{ passwordOk }}</b-alert>
          <b-form @submit.prevent="cambiarPassword">
            <b-form-group label="Contraseña actual:">
              <b-form-input v-model="passwordForm.actual" type="password" autocomplete="current-password"></b-form-input>
            </b-form-group>
            <b-form-group label="Nueva contraseña:" description="Mínimo 6 caracteres.">
              <b-form-input v-model="passwordForm.nueva" type="password" autocomplete="new-password"></b-form-input>
            </b-form-group>
            <b-form-group label="Confirmar nueva contraseña:">
              <b-form-input v-model="passwordForm.confirmar" type="password" autocomplete="new-password"></b-form-input>
            </b-form-group>
          </b-form>
          <template #modal-footer="{}">
            <b-button variant="primary" :disabled="guardandoPassword" @click="cambiarPassword">Guardar</b-button>
            <b-button variant="danger" @click="$bvModal.hide('modal-cambiar-password')">Cancelar</b-button>
          </template>
        </b-modal>
        <transition name="router-anim" :enter-active-class="`animated ${animated.enter}`" mode="out-in"
                    :leave-active-class="`animated ${animated.exit}`">
          <router-view/>
        </transition>
        <FooterStyle1>
          <template v-slot:left>
            <li class="list-inline-item"><a href="#"></a></li>
          </template>
          <template v-slot:right>
            {{ year }} <a href="#">Hospital de especialidades</a>
          </template>
        </FooterStyle1>
      </div>
    </div>
  </div>
</template>

<script>
import Loader from '../components/xray/loader/Loader'
import SideBarStyle1 from '../components/xray/sidebars/SideBarStyle1'
import NavBarStyle1 from '../components/xray/navbars/NavBarStyle1'
import SideBarItems from '../FackApi/json/SideBar'
import SideBarLaboratorio from '../FackApi/json/SideBarLaboratorio'
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profile from '../assets/images/user/1.jpg'
import loader from '../assets/images/logo.png'
import { xray } from '../config/pluginInit'
import { mapGetters, mapActions } from 'vuex'
import axios from 'axios'
import { apiUrl } from '../config/constant'

export default {
  name: 'Layout1',
  components: {
    Loader,
    SideBarStyle1,
    NavBarStyle1
  },
  mounted () {
    this.updateRadio()
  },
  beforeMount () {
    var today = new Date()
    this.year = today.getFullYear()
    this.verticalMenu = SideBarItems
    this.filteredVerticalMenu = this.filterMenuByRole(this.verticalMenu, this.currentUser.user_type)
  },
  computed: {
    ...mapGetters({
      selectedLang: 'Setting/langState',
      langsOptions: 'Setting/langOptionState',
      colors: 'Setting/colorState',
      currentUser: 'currentUser'
    })
  },
  data () {
    return {
      year: null,
      horizontal: false,
      mini: false,
      darkMode: false,
      animated: { enter: 'zoomIn', exit: 'zoomOut' },
      horizontalMenu: HorizontalItems,
      verticalMenu: [],
      filteredVerticalMenu: [],
      userProfile: profile,
      logo: loader,
      rtl: false,
      passwordForm: { actual: '', nueva: '', confirmar: '' },
      passwordError: '',
      passwordOk: '',
      guardandoPassword: false
    }
  },
  methods: {
    updateRadio () {
      this.horizontal = this.$store.getters['Setting/horizontalMenuState']
      this.mini = this.$store.getters['Setting/miniSidebarState']
    },
    sidebarHorizontal () {
      this.$store.dispatch('Setting/horizontalMenuAction')
      this.updateRadio()
    },
    sidebarMini () {
      xray.triggerSet()
      this.$store.dispatch('Setting/miniSidebarAction')
      this.updateRadio()
    },
    rtlChange () {
      if (this.rtl) {
        this.rtlRemove()
      } else {
        this.rtlAdd()
      }
    },
    changeColor (code) {
      document.documentElement.style.setProperty('--iq-primary', code.primary)
      document.documentElement.style.setProperty('--iq-primary-light', code.primaryLight)
      if (this.darkMode) {
        document.documentElement.style.setProperty('--iq-bg-dark-color', code.bodyBgDark)
      } else {
        document.documentElement.style.setProperty('--iq-bg-light-color', code.bodyBgLight)
      }
    },
    reset () {
      this.changeColor({ primary: '#827af3', primaryLight: '#b47af3', bodyBgLight: '#efeefd', bodyBgDark: '#1d203f' })
      this.animated = { enter: 'zoomIn', exit: 'zoomOut' }
      this.light()
    },
    abrirCambiarPassword () {
      this.limpiarCambioPassword()
      this.$bvModal.show('modal-cambiar-password')
    },
    limpiarCambioPassword () {
      this.passwordForm = { actual: '', nueva: '', confirmar: '' }
      this.passwordError = ''
      this.passwordOk = ''
      this.guardandoPassword = false
    },
    cambiarPassword () {
      const f = this.passwordForm
      this.passwordError = ''
      this.passwordOk = ''
      if (!f.actual || !f.nueva || !f.confirmar) {
        this.passwordError = 'Complete todos los campos'
        return
      }
      if (f.nueva.length < 6) {
        this.passwordError = 'La nueva contraseña debe tener al menos 6 caracteres'
        return
      }
      if (f.nueva !== f.confirmar) {
        this.passwordError = 'La confirmación no coincide con la nueva contraseña'
        return
      }
      this.guardandoPassword = true
      axios.post(apiUrl + '/cambiarPassword', { actual: f.actual, nueva: f.nueva })
        .then((response) => {
          this.passwordForm = { actual: '', nueva: '', confirmar: '' }
          this.passwordOk = response.data.msg || 'Contraseña actualizada correctamente'
          setTimeout(() => this.$bvModal.hide('modal-cambiar-password'), 1500)
        })
        .catch((error) => {
          this.passwordError = (error.response && error.response.data && error.response.data.msg) ||
            'No se pudo cambiar la contraseña, intente de nuevo'
        })
        .finally(() => { this.guardandoPassword = false })
    },
    logout () {
      localStorage.removeItem('user')
      localStorage.removeItem('access_token')
      this.$router.push({ name: 'auth1.sign-in1' })
    },
    langChange (lang) {
      this.langChangeState(lang)
      this.$i18n.locale = lang.value
      document.getElementsByClassName('iq-show')[0].classList.remove('iq-show')
      if (lang.value === 'ar') {
        this.rtlAdd(lang)
      } else {
        this.rtlRemove(lang)
      }
    },
    ...mapActions({
      langChangeState: 'Setting/setLangAction',
      rtlAdd: 'Setting/setRtlAction',
      rtlRemove: 'Setting/removeRtlAction'
    }),

    // Método para filtrar los elementos del menú según los roles del usuario
    filterMenuByRole (menu, userRole) {
      const filteredMenu = menu
        .map(item => {
          if (item.children && Array.isArray(item.children)) {
            const filteredChildren = item.children.filter(child => {
              return !child.rol || child.rol.includes(userRole)
            })
            if ((item.rol && item.rol.includes(userRole)) || filteredChildren.length > 0) {
              return {
                ...item,
                children: filteredChildren
              }
            }
            return null
          }
          if (!item.rol || item.rol.includes(userRole)) {
            return item
          }
          return null
        })
        .filter(item => item !== null)

      if (filteredMenu.length === 0) {
        return this.filterMenuByRole(SideBarLaboratorio, userRole)
      }

      return filteredMenu
    }
  }
}
</script>

<style>
  @import url("../assets/css/custom.css");
</style>

<template>
  <div>
    <div id="show-overlay"></div>
    <Loader />
    <div class="wrapper">
      <!-- Sidebar  -->
      <SideBarStyle1 :items="verticalMenu" :horizontal="horizontal" :logo="logo" @toggle="sidebarMini" />
      <div id="content-page" class="content-page" :class="horizontal ? 'ml-0' : ''">
        <!-- TOP Nav Bar -->
        <NavBarStyle1 title="Dashboard" :homeURL="{ name: 'dashboard1.home' }" @toggle="sidebarMini" :logo="logo" :horizontal="horizontal" :items="horizontalMenu">

          <template slot="right">
            <ul class="navbar-list">
              <li class="nav-item iq-full-screen">
                <a href="#" class="iq-waves-effect" id="btnFullscreen"><i class="ri-fullscreen-line"></i></a>
              </li>
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
        <transition name="router-anim" :enter-active-class="`animated ${animated.enter}`" mode="out-in"
                    :leave-active-class="`animated ${animated.exit}`">
          <router-view/>
        </transition>
        <FooterStyle1>
          <template v-slot:left>
            <li class="list-inline-item"><a href="#"></a></li>
          </template>
          <template v-slot:right>
            {{ year }} <a href="#">Centro Galo</a>
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
import HorizontalItems from '../FackApi/json/HorizontalMenu'
import profile from '../assets/images/user/1.jpg'
import loader from '../assets/images/logo.png'
import { xray } from '../config/pluginInit'
import { Users } from '../FackApi/api/chat'
import { mapGetters, mapActions } from 'vuex'
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
    // this.verticalMenu = PatientSideBar
    var today = new Date()
    this.year = today.getFullYear()
    this.verticalMenu = SideBarItems
  },
  computed: {
    ...mapGetters({
      selectedLang: 'Setting/langState',
      langsOptions: 'Setting/langOptionState',
      colors: 'Setting/colorState',
      currentUser: 'currentUser'
    })
  },
  watch: {
  },
  // sidebarTicket
  data () {
    return {
      year: null,
      horizontal: false,
      mini: false,
      darkMode: false,
      animated: { enter: 'zoomIn', exit: 'zoomOut' },
      animateClass: [
        { value: { enter: 'zoomIn', exit: 'zoomOut' }, text: 'Zoom' },
        { value: { enter: 'fadeInUp', exit: 'fadeOutDown' }, text: 'Fade' },
        { value: { enter: 'slideInLeft', exit: 'slideOutRight' }, text: 'Slide' },
        { value: { enter: 'rotateInDownLeft', exit: 'rotateOutDownLeft' }, text: 'Roll' }
      ],
      horizontalMenu: HorizontalItems,
      verticalMenu: [],
      userProfile: profile,
      logo: loader,
      usersList: Users,
      rtl: false,
      message: [
        { image: require('../assets/images/user/01.jpg'), name: 'Nik Emma Watson', date: '13 jan' },
        { image: require('../assets/images/user/02.jpg'), name: 'Greta Life', date: '14 Jun' },
        { image: require('../assets/images/user/03.jpg'), name: 'Barb Ackue', date: '16 Aug' },
        { image: require('../assets/images/user/04.jpg'), name: 'Anna Sthesia', date: '21 Sept' },
        { image: require('../assets/images/user/05.jpg'), name: 'Bob Frapples', date: '29 Sept' }
      ],
      notification: [
        { image: require('../assets/images/user/01.jpg'), name: 'Nik Emma Watson', date: '23 hour ago', description: 'Enjoy smart access to videos, games' },
        { image: require('../assets/images/user/02.jpg'), name: 'Greta Life', date: '14 hour ago', description: 'Google Chromecast: Enjoy a world of entertainment' },
        { image: require('../assets/images/user/03.jpg'), name: 'Barb Ackue', date: '16 hour ago', description: 'Dell Inspiron Laptop: Get speed and performance from' },
        { image: require('../assets/images/user/04.jpg'), name: 'Anna Sthesia', date: '21 hour ago', description: 'Deliver your favorite playlist anywhere in your home ' },
        { image: require('../assets/images/user/05.jpg'), name: 'Bob Frapples', date: '11 hour ago', description: 'MacBook Air features up to 8GB of memory, a fifth-generation' }
      ]
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
    })
  }
}
</script>
<style>
  @import url("../assets/css/custom.css");
</style>

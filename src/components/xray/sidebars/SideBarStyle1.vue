<template>
  <div class="iq-sidebar">
    <div class="iq-sidebar-logo d-flex justify-content-between">
      <router-link :to="homeURL">
        <img v-if="user === 2 || user === 4 || user === 6 || user === 8 || user === 12 || user === 13" :src="logo2" class="img-fluid" alt="logo">
        <img v-else :src="logo" class="img-fluid" alt="logo">
      </router-link>
      <div class="iq-menu-bt-sidebar" v-if="toggleButton">
        <div class="iq-menu-bt align-self-center">
          <div class="wrapper-menu" @click="miniSidebar">
            <div class="main-circle"><i class="ri-more-fill"></i></div>
            <div class="hover-circle"><i class="ri-more-2-fill"></i></div>
          </div>
        </div>
      </div>
    </div>
    <div id="sidebar-scrollbar">
      <nav class="iq-sidebar-menu" :class="horizontal ? 'd-xl-none' : ''">
        <List :items="items" :open="true" :horizontal="horizontal"/>
      </nav>
      <div class="p-3"></div>
    </div>
  </div>
  <!-- TOP Nav Bar -->
</template>

<script>
import List from '../menus/ListStyle1'
import { mapGetters } from 'vuex'
export default {
  name: 'SideBarStyle1',
  props: {
    homeURL: { type: Object, default: () => ({ name: 'layout1.dashboard' }) },
    items: { type: Array },
    logo: { type: String, default: require('../../../assets/images/logo.png') },
    logo2: { type: String, default: require('../../../assets/images/logoLab.jpg') },
    horizontal: { type: Boolean },
    toggleButton: { type: Boolean, default: true },
    user: null
  },
  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },
  components: {
    List
  },
  mounted () {
    this.user = this.currentUser.user_type
    const element = document.querySelectorAll('.iq-sidebar-menu li a')
    Array.from(element, (elem) => {
      elem.addEventListener('click', (e) => {
        const prevMenu = window.$('.iq-sidebar-menu li').has('.iq-submenu').find('ul.show').attr('id')
        const prevMenuElem = document.getElementById(prevMenu)
        if (prevMenuElem !== null) {
          Array.from(prevMenuElem.closest('li').getElementsByClassName('not-collapsed'), (el) => {
            if (elem.closest('ul').getAttribute('id') !== prevMenu) {
              this.$root.$emit('bv::toggle::collapse', prevMenu)
              prevMenuElem.closest('li').classList.remove('active')
            }
            if (elem.getAttribute('aria-controls') === prevMenu) {
              this.$root.$emit('bv::toggle::collapse', prevMenu)
            }
          })
        }
        window.$(elem).closest('li').has('.iq-submenu').addClass('active')
      })
    })
  },
  methods: {
    miniSidebar () {
      this.$emit('toggle')
    }
  },
  data () {
    return {
    }
  }
}
</script>

<template>
  <!-- TOP Nav Bar -->
  <div class="iq-top-navbar">
    <div class="iq-navbar-custom" :class="horizontal ? 'd-flex align-items-center justify-content-between' : ''">
      <div class="iq-sidebar-logo">
        <div class="top-logo">
          <router-link :to="homeURL">
            <img :src="logo" class="img-fluid" alt="logo">
            <img :src="logo2" class="img-fluid" alt="logo">
            <span>HEO/LAB</span>
          </router-link>
        </div>
      </div>
      <div class="iq-menu-horizontal" v-if="horizontal">
        <div class="iq-sidebar-menu">
          <List :items="items" class="d-flex"></List>
        </div>
      </div>
      <nav class="navbar navbar-expand-lg navbar-light p-0">
        <div class="iq-menu-bt align-self-end">
          <div class="wrapper-menu" @click="miniSidebar">
            <div class="main-circle"><i class="ri-more-fill"></i></div>
            <div class="hover-circle"><i class="ri-more-2-fill"></i></div>
          </div>
        </div>
        <b-collapse id="nav-collapse" is-nav>
          <slot name="responsiveRight" />
        </b-collapse>
        <slot name="right" />
      </nav>
    </div>
  </div>
  <!-- TOP Nav Bar END -->
</template>
<script>
import List from '../menus/ListStyle1'
import SideBarItems from '../../../FackApi/json/SideBar'
export default {
  name: 'NavBarStyle1',
  props: {
    homeURL: { type: Object, default: () => ({ name: 'layout1.dashboard' }) },
    title: { type: String, default: 'Dashboard' },
    logo: { type: String, default: require('../../../assets/images/logo.png') },
    logo2: { type: String, default: require('../../../assets/images/logoLab.jpg') },
    horizontal: { type: Boolean, default: false },
    items: { type: Array }
  },
  mounted () {
    document.addEventListener('click', this.closeSearch, true)
  },
  components: {
    List
  },
  computed: {
  },
  data () {
    return {
      sidebar: SideBarItems,
      globalSearch: '',
      showSearch: false,
      showMenu: false
    }
  },
  methods: {
    miniSidebar () {
      this.$emit('toggle')
    }
  }
}
</script>

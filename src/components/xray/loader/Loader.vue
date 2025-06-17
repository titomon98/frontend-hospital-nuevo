<template>
  <!-- loader Start -->
  <div id="loading" :style="style">
    <div id="loading-center">
    </div>
  </div>
  <!-- loader END -->
</template>
<script>
import lightLogo from '../../../assets/images/loader.gif'
export default {
  name: 'Loader',
  props: {
    dark: { type: Boolean, default: false }
  },
  mounted () {
    this.style = `background: #fff url(${this.logo}) no-repeat scroll center center;`
  },
  data () {
    return {
      logo: lightLogo,
      style: `background: #fff url(${lightLogo}) no-repeat scroll center center;`
    }
  }
}
</script>

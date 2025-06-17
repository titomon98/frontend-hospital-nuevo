<template>
  <div>
    <Loader />
    <section class="sign-in-page">
      <b-container class="sign-in-page-bg mt-5 p-0">
        <div class="row no-gutters">
          <div class="col-md-6 text-center position-relative">
            <div class="sign-in-detail text-white">

              <Slick :option="slickOptions">
                <div class="item">
                  <img :src="require('../../assets/images/login/1.png')" class="img-fluid mb-4" alt="logo">
                  <img :src="require('../../assets/images/login/logoLab.jpg')" class="img-fluid mb-4" alt="logo">
                </div>
              </Slick>
            </div>
          </div>
          <div class="col-md-6 position-relative">
            <div class="sign-in-from">
              <router-view></router-view>
            </div>
          </div>
        </div>
      </b-container>
    </section>
  </div>
</template>
<script>
import Loader from '../../components/xray/loader/Loader'
import { xray } from '../../config/pluginInit'
export default {
  name: 'AuthLayout1',
  components: {
    Loader
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      slickOptions: {
        slidesToShow: 1,
        arrows: false,
        dots: true
      }
    }
  }
}
</script>

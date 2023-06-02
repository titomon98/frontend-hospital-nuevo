<template>
  <b-container fluid>
    <b-row>
      <b-col sm="12">
        <iq-card class-name="iq-card-block iq-card-stretch iq-card-height">
          <template v-slot:headerTitle>
            <h4 class="card-title">Este es el sistema de hospital</h4>
          </template>
          <template v-slot:body>
              <Slick :option="slickOptions" id="doster-list-slide">
                  <div class="docter-list-item-inner rounded text-center" v-for="doctors in doctorList" :key="doctors.id">
                    <div class="donter-profile">
                      <img :src="doctors.img" class="img-fluid rounded-circle" alt="user-img">
                    </div>
                    <div class="doctor-detail mt-3">
                      <h5>{{doctors.name}}</h5>
                      <h6>{{doctors.position}}</h6>
                    </div>
                    <hr>
                    <div class="doctor-description">
                      <p class="mb-0 text-center pl-2 pr-2">{{doctors.worksAt}}</p>
                    </div>
                  </div>
              </Slick>
          </template>
        </iq-card>
      </b-col>
      <b-col md="12" lg="12">
        <b-row>
          <b-col sm="12">
            <iq-card class-name="iq-card-block iq-card-stretch iq-card-height" body-class="">
              <template v-slot:headerTitle>
                <h4 class="card-title">Últimos ingresos de producto</h4>
              </template>

              <template v-slot:body>
                <div class="table-responsive">
                  <table class="table mb-0 table-borderless">
                    <thead>
                    <tr>
                      <th scope="col">Nombre del paciente </th>
                      <th scope="col">Apellidos del paciente </th>
                      <th scope="col">Doctor que solicitó</th>
                      <th scope="col">Fecha de examen</th>
                      <th scope="col">PDF</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="results in resultsList" :key="results.id">
                      <td v-text="results.ordene.paciente.nombre"></td>
                      <td v-text="results.ordene.paciente.apellidos"></td>
                      <td v-text="results.ordene.medico_tratante"></td>
                      <td> {{ getFecha(results.createdAt) }}</td>
                      <td><i class="ri-file-pdf-line font-size-16 text-danger"></i></td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </template>
            </iq-card>

          </b-col>

        </b-row>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../config/pluginInit'
import IqCard from '../../components/xray/cards/iq-card'
import axios from 'axios'
import { apiUrl } from '../../config/constant'
import moment from 'moment'

export default {
  name: 'Dashboard1',
  components: { IqCard },
  mounted () {
    xray.index()
    this.getResultados()
  },
  data: () => {
    return {
      resultsList: [],
      slickOptions: {
        centerMode: false,
        centerPadding: '60px',
        slidesToShow: 5,
        slidesToScroll: 1,
        focusOnSelect: true,
        responsive: [{
          breakpoint: 992,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '30',
            slidesToShow: 3
          }
        }, {
          breakpoint: 480,
          settings: {
            arrows: false,
            centerMode: true,
            centerPadding: '15',
            slidesToShow: 1
          }
        }],
        nextArrow: '<a href="#" class="ri-arrow-left-s-line left"></a>',
        prevArrow: '<a href="#" class="ri-arrow-right-s-line right"></a>'
      },
      doctorList: [
        { name: 'Datos de prueba', img: require('../../assets/images/user/05.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/06.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/07.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/08.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/09.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' },
        { name: 'Datos de prueba', img: require('../../assets/images/user/10.jpg'), position: 'Para limpieza', worksAt: 'Zapatería el Centro' }
      ]
    }
  },
  methods: {
    getResultados () {
      let me = this
      var url = apiUrl + '/resultado/get/'
      axios.get(url).then(function (response) {
        me.resultsList = response.data
      }).catch(function (error) {
        console.log(error)
      })
    },
    getFecha (fecha) {
      let formato = moment(fecha).format('DD-MM-YYYY hh:mm')
      return formato
    }
  }
}
</script>

<style>
.iq-card-body{
  flex: unset;
}
</style>

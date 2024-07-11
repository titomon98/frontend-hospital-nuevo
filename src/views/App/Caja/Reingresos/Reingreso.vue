<template>
  <b-container fluid>
    <b-alert
      :variant="alertVariant"
      :show="alertCountDown"
      dismissible
      fade
      @dismissed="alertCountDown=0"
      class="bg-white"
    >
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-modal id="modal-1-servicios" ref="modal-1-servicios" title="Agregar servicio">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-form-group label="Descripción:">
          <b-form-input
            v-model.trim="$v.form.descripcion.$model"
            :state="!$v.form.descripcion.$error"
            placeholder="Ingresar la descripción del servicio"
          ></b-form-input>
          <div v-if="$v.form.descripcion.required.$invalid" class="invalid-feedback">
            Debe ingresar la descripción
          </div>
        </b-form-group>
        <b-form-group label="Unidad de medida:">
          <b-form-input
            v-model.trim="$v.form.unidadDeMedida.$model"
            :state="!$v.form.unidadDeMedida.$error"
            placeholder="Ingresar la unidad de medida del servicio"
          ></b-form-input>
          <div v-if="$v.form.unidadDeMedida.required.$invalid" class="invalid-feedback">
            Debe ingresar la unidad de medida
          </div>
        </b-form-group>
        <b-form-group label="Precio:">
          <b-form-input
            type="number"
            v-model.trim="$v.form.precio.$model"
            :state="!$v.form.precio.$error"
            placeholder="Ingresar precio del servicio"
          ></b-form-input>
          <div v-if="$v.form.precio.required.$invalid" class="invalid-feedback">
            Debe ingresar el precio
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-servicios" ref="modal-2-servicios" title="Editar servicio">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form @submit="$event.preventDefault()">
        <b-form-group label="Descripción:">
          <b-form-input
            v-model.trim="$v.form.descripcion.$model"
            :state="!$v.form.descripcion.$error"
            placeholder="Ingresar descripcion del servicio"
          ></b-form-input>
          <div v-if="$v.form.descripcion.required.$invalid" class="invalid-feedback">
            Debe ingresar la descripción
          </div>
        </b-form-group>
        <b-form-group label="Unidad de medida:">
          <b-form-input
            v-model.trim="$v.form.unidadDeMedida.$model"
            :state="!$v.form.unidadDeMedida.$error"
            placeholder="Ingresar la unidad de medida del servicio"
          ></b-form-input>
          <div v-if="$v.form.unidadDeMedida.required.$invalid" class="invalid-feedback">
            Debe ingresar la unidad de medida
          </div>
        </b-form-group>
        <b-form-group label="Precio:">
          <b-form-input
            type="number"
            v-model.trim="$v.form.precio.$model"
            :state="!$v.form.precio.$error"
            placeholder="Ingresar precio del servicio"
          ></b-form-input>
          <div v-if="$v.form.precio.required.$invalid" class="invalid-feedback">
            Debe ingresar el precio
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('update')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('update')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-servicios" ref="modal-3-servicios" title="Desactivar servicio">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea desactivar el servicio: {{ form.nombre }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-servicios')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-servicios')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-servicios" ref="modal-4-servicios" title="Ingresar paciente" @show="this.selectedHab = null">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <h6 class="my-4">
        ¿Desea ingresar el paciente: {{ form.nombres }} ?
      </h6>
      <b-form @submit="$event.preventDefault()">
        <b-col >
          <b-form-group label="Área a la que desea trasladar:">
            <b-form-radio-group
                      id="radio-group-2"
                      v-model="selectedTrasOption"
                      :options="optionsTraslado"
                      name="radio-options"
                    ></b-form-radio-group>
            <div v-if="selectedTrasOption==1||selectedTrasOption==4">
              Habitación
              <v-select
              ref="selectHab"
              v-model="selectedHab"
              :options="habitaciones"
              label="numero"
              value="id"></v-select>
            </div>
            <div>
              Motivo
              <b-form-input
                v-model.trim="varMotivo">
              </b-form-input>
            </div>
            <div>
              <strong>
                ENCARGADO
              </strong>
              Nombre
              <b-form-input
                v-model.trim="varNombreEncargado"
                :state="!varNombreEncargadoError"
                placeholder="Ingresar nombre del encargado">
              </b-form-input>
              Contacto
              <b-form-input
                v-model.trim="varContactoEncargado"
                :state="!varContactoEncargadoError"
                placeholder="Ingresar teléfono del encargado">
              </b-form-input>
              Parentesco
              <b-form-input
                v-model.trim="varParentescoEncargado"
                :state="!varParentescoEncargadoError"
                placeholder="Ingresar parentesco del encargado">
              </b-form-input>
              CUI
              <b-form-input
                v-model.trim="varCuiEncargado"
                :state="!varCuiEncargadoError"
                placeholder="Ingresar cui del encargado">
              </b-form-input>
            </div>
          </b-form-group>
        </b-col>
      </b-form>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="
            onValidate()
            this.selectedHab = null
          "
          >Ingresar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-servicios')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Reingreso</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input v-model="search" placeholder="Buscar..." @input="handleSearchInput" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                    <b-form-radio-group
                      id="radio-group-1"
                      v-model="selectedCriteria"
                      :options="options"
                      @change="handleSearchInput"
                      name="radio-options"
                    ></b-form-radio-group>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
          </template>
          <template v-slot:body>
            <datatable-heading
              :changePageSize="changePageSizes"
              :searchChange="searchChange"
              :from="from"
              :to="to"
              :total="total"
              :perPage="perPage"
            >
            </datatable-heading>
            <vuetable
              ref="vuetable"
              class="table-divided order-with-arrow"
              :api-url="apiBase"
              :query-params="makeQueryParams"
              :per-page="perPage"
              :reactive-api-url="true"
              :fields="fields"
              pagination-path
              @vuetable:pagination-data="onPaginationData"
            >
              <!-- Estado -->
              <div slot="estado" slot-scope="props">
                <h5 v-if="props.rowData.estado == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>ACTIVO</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="light"
                    ><h6 class="danger"><strong>FUERA DE HOSPITAL</strong></h6></b-badge
                  >
                </h5>
              </div>
              <div slot="solvencia" slot-scope="props">
                <h5 v-if="props.rowData.solvencia == 1">
                  <b-badge variant="light"
                    ><h6 class="success"><strong>SOLVENTE</strong></h6></b-badge
                  >
                </h5>
                <h5 v-else>
                  <b-badge variant="warning"
                    ><h6 class="danger"><strong>CON CUENTAS POR PAGAR</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <div v-if="props.rowData.solvencia == 1">
                    <b-button
                      v-b-tooltip.top="'Ingresar'"
                      @click="
                        setData(props.rowData)
                        props.rowData.estado == 1
                          ? $bvModal.show('modal-3-servicios')
                          : $bvModal.show('modal-4-servicios')
                      "
                      class="mb-2"
                      size="sm"
                      :variant="
                        props.rowData.estado == 1 ? 'outline-danger' : 'outline-info'">
                      <i
                        :class="
                          props.rowData.estado == 1
                            ? 'fas fa-trash-alt'
                            : 'fas fa-check'"
                    /></b-button>
                  </div>
                  <div v-if="props.rowData.solvencia == 0">
                    DEBE DE ESTAR SOLVENTE PARA INGRESAR AL PACIENTE
                  </div>
                </b-button-group>
              </template>
              <!-- Paginacion -->
            </vuetable>
            <vuetable-pagination-bootstrap
                ref="pagination"
                @vuetable-pagination:change-page="onChangePage"
              />
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../../config/pluginInit'
import DatatableHeading from '../../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'

export default {
  name: 'Reingreso',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.getHabitaciones(0)
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: this.search,
      selectedCriteria: 'nombres',
      selectedTrasOption: 1,
      varMotivo: '',
      varMotivoError: 0,
      form: {
        id: 0,
        nombres: '',
        apellidos: '',
        expediente: '',
        cui: '',
        state: 1,
        habitacion: null
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      selectedHab: null,
      apiBase: apiUrl + '/expedientes/listReingreso',
      habitaciones: [],
      options: [
        { text: 'Nombres', value: 'nombres' },
        { text: 'Apellidos', value: 'apellidos' },
        { text: 'Expediente', value: 'expediente' },
        { text: 'CUI', value: 'cui' }
      ],
      optionsTraslado: [
        { text: 'Hospitalización', value: 1 },
        { text: 'Quirófano', value: 3 },
        { text: 'Emergencia', value: 5 },
        { text: 'Intensivos', value: 4 }
      ],
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombres',
          sortField: 'nombres',
          title: 'Nombres',
          dataClass: 'list-item-heading'
        },
        {
          name: 'apellidos',
          sortField: 'apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente',
          sortField: 'expediente',
          title: 'Expediente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cui',
          sortField: 'cui',
          title: 'CUI',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        },
        {
          name: '__slot:solvencia',
          title: 'Solvencia',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ]
    }
  },
  validations () {
    return {
      form: {
        descripcion: { required },
        unidadDeMedida: { required },
        precio: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.descripcion = ''
          this.form.unidadDeMedida = ''
          this.form.precio = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-servicios'].hide()
          this.form.id = 0
          this.form.descripcion = ''
          this.form.unidadDeMedida = ''
          this.form.precio = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-servicios'].hide()
          this.form.id = 0
          this.form.descripcion = ''
          this.form.unidadDeMedida = ''
          this.form.precio = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.selectedHab === null && (this.selectedTrasOption === 1 || this.selectedTrasOption === 4)) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        this.onState()
        this.$bvModal.hide('modal-4-servicios')
      }
    },
    setData (data) {
      this.form.nombres = data.nombres
      this.form.apellidos = data.apellidos
      this.varNombreEncargado = data.nombre_encargado
      this.varContactoEncargado = data.contacto_encargado
      this.varCuiEncargado = data.cui_encargado
      this.varParentescoEncargado = data.parentesco_encargado
      this.form.state = data.estado
      this.form.id = data.id
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/servicios/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el servicio ' + me.form.descripcion + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('save')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* Actualizar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide()
      axios.put(apiUrl + '/servicios/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el servicio ' + me.form.descripcion + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('update')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    onState () {
      const today = new Date()
      let me = this
      let habitacion = null
      if (this.selectedHab == null) {
        habitacion = 0
      } else {
        habitacion = this.selectedHab.id
      }
      axios
        .put(apiUrl + '/expedientes/changeState', {
          id: this.form.id,
          estado: this.selectedTrasOption,
          nombre_encargado: this.varNombreEncargado,
          contacto_encargado: this.varContactoEncargado,
          cui_encargado: this.varCuiEncargado,
          parentesco_encargado: this.varParentescoEncargado,
          estado_anterior: 2,
          habitaciones: habitacion
        })
        .then((response) => {
          me.alertVariant = 'info'
          me.showAlert()
          me.alertText = 'Se ha ingresado el paciente ' + me.form.nombres + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.$refs['modal-4-servicios'].hide()
          if (this.selectedTrasOption === 1 || this.selectedTrasOption === 4) {
            axios
              .put(apiUrl + '/habitaciones/inUse', {
                id: this.selectedHab.id,
                ocupante: this.form.id
              })
              .then((res) => {
                this.selectedHab = null
                console.log(this.selectedHab)
                this.getHabitaciones(0).then(me.$refs.selectHab.refresh())
              })
          }
          axios
            .post(apiUrl + ('/cuentas/create'), {
              numero: 1,
              fecha_ingreso: today,
              motivo: this.varMotivo,
              descripcion: ' ',
              otros: ' ',
              total: 0,
              estado: 1,
              id_expediente: this.form.id
            }).then((resp) => console.log(resp))
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('There was an error!!', error)
        })
    },
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : this.selectedCriteria,
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : this.selectedCriteria,
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
    },
    changePageSizes (perPage) {
      this.perPage = perPage
      this.$refs.vuetable.refresh()
    },
    searchChange (val) {
      this.search = val.toLowerCase()
      this.$refs.vuetable.refresh()
    },
    onPaginationData (paginationData) {
      this.from = paginationData.from
      this.to = paginationData.to
      this.total = paginationData.total
      this.lastPage = paginationData.last_page
      this.items = paginationData.data
      this.$refs.pagination.setPaginationData(paginationData)
    },
    onChangePage (page) {
      this.$refs.vuetable.changePage(page)
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertCountDownError = this.alertSecs
    },
    handleSearchInput () {
      this.currentPage = 1 // Reiniciar la página actual a 1 cada vez que se cambia la búsqueda
      this.$refs.vuetable.refresh()
    },
    /* handleChangeHab () {
      this.currentPage = 1 // Reiniciar la página actual a 1 cada vez que se cambia la búsqueda
      selectedTrasOption==1 ? (this.getHabitaciones(1)) : (this.getHabitaciones(2))
      this.$refs.vuetable.refresh()
    }, */
    handleFilter () {
      this.currentPage = 1 // Reiniciar la página actual a 1 cada vez que se cambia la búsqueda
      this.$refs.vuetable.refresh()
    },
    handleCancel () {
      this.$refs.vuetable.refresh()
    },
    getHabitaciones (num) {
      axios.get(apiUrl + '/habitaciones/get', {
        params: {
          tipo: num
        }
      }).then((response) => {
        this.habitaciones = response.data
        console.log(response.data)
      })
    }
  }
}
</script>

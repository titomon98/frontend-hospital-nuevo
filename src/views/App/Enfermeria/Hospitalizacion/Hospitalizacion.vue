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
    <b-modal id="modal-traslado" ref="modal-traslado" title="Trasladar paciente">
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
        <b-col >
          <b-form-group label="Área a la que desea trasladar:">
            <b-form-radio
              v-model="form.selectedOption"
              value="quirofano"
              name="customRadio1"
            >Quirófano</b-form-radio>
            <b-form-radio
              v-model="form.selectedOption"
              value="emergencia"
              name="customRadio1"
            >Emergencia</b-form-radio>
            <b-form-radio
              v-model="form.selectedOption"
              value="intensivo"
              name="customRadio1"
            >Intensivo</b-form-radio>
          </b-form-group>
        </b-col>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveTraslado('traslado')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('traslado')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal size="lg" id="modal-add-receta" ref="modal-add-receta" title="Contenido de receta">
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
        <b-form-group label="Contenido:">
          <quill-editor v-model="form.receta" :options="editorOptions" class="custom-editor"></quill-editor>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="saveReceta()"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-ver-receta" ref="modal-ver-receta" title="Ver recetas">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <vuetable
          ref="vuetableRecetas"
          class="table-divided table-responsive order-with-arrow"
          :api-url="apiBaseReceta"
          :query-params="makeQueryParamsReceta"
          :per-page="perPage"
          :reactive-api-url="true"
          :fields="fieldsReceta"
          pagination-path
          @vuetable:pagination-data="onPaginationDataReceta"
        >
          <template slot="actions" slot-scope="props">
            <b-button-group>
              <b-button
                v-b-tooltip.top="'Generar voucher de pago'"
                @click="voucherData(props.rowData)"
                class="mb-2"
                size="sm"
                variant="outline-info"
                ><i :class="'fas fa-money-bill'"
              /></b-button>
            </b-button-group>
          </template>
        </vuetable>
        <vuetable-pagination-bootstrap
          ref="paginationReceta"
          @vuetable-pagination:change-page="onChangePageReceta"
        />
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-receta')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-receta')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-add-servicio" ref="modal-add-servicio" title="Añadir servicio">
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
        <b-form-group label="Nombre:">
          <b-form-input
            v-model.trim="$v.form.name.$model"
            :state="!$v.form.name.$error"
            placeholder="Ingresar nombre de banco"
          ></b-form-input>
          <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('add-servicio')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('add-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-ver-servicio" ref="modal-ver-servicio" title="Ver servicios">
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
        <b-form-group label="Nombre:">
          <b-form-input
            v-model.trim="$v.form.name.$model"
            :state="!$v.form.name.$error"
            placeholder="Ingresar nombre de banco"
          ></b-form-input>
          <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="onValidate('ver-servicio')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('ver-servicio')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Hospitalización</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
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
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Trasladar'"
                    @click="traslado(props.rowData.id)"
                    class="mb-2"
                    size="sm"
                    variant="outline-primary"
                    ><i :class="'fas fa-heart'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Agregar receta'"
                    @click="addReceta(props.rowData.id)"
                    class="mb-2"
                    size="sm"
                    variant="outline-dark"
                    ><i :class="'fas fa-list-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Ver recetas'"
                    @click="verReceta(props.rowData.id)"
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-eye'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Agregar servicios'"
                    @click="addServicio(props.rowData.id)"
                    class="mb-2"
                    size="sm"
                    variant="outline-success"
                    ><i :class="'fas fa-list-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Ver servicios'"
                    @click="verServicio(props.rowData.id)"
                    class="mb-2"
                    size="sm"
                    variant="outline-secondary"
                    ><i :class="'fas fa-eye'"
                  /></b-button>
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
import { quillEditor } from 'vue-quill-editor'

export default {
  name: 'Bank',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading,
    quillEditor
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  data () {
    return {
      from: 0,
      to: 0,
      total: 0,
      editorOptions: {
        modules: {
          toolbar: [
            [{ 'header': '1' }, { 'header': '2' }, { 'font': [] }],
            [{ size: [] }],
            ['bold', 'italic', 'underline', 'strike', 'blockquote'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }],
            ['clean']
          ]
        },
        placeholder: 'Escribir contenido de la receta',
        theme: 'snow'
      },
      perPage: 5,
      search: '',
      form: {
        id: 0,
        name: '',
        state: 1,
        selectedOption: 'hospi',
        receta: null
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/expedientes/listHospitalizacion',
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
          title: 'Nombre',
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
          name: 'nacimiento',
          sortField: 'nacimiento',
          title: 'Fecha de nacimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'genero',
          sortField: 'genero',
          title: 'Género',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nombre_encargado',
          sortField: 'nombre_encargado',
          title: 'Nombre de encargado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'contacto_encargado',
          sortField: 'contacto_encargado',
          title: 'Contacto de encargado',
          dataClass: 'list-item-heading'
        }
      ],
      fieldsReceta: [
        {
          name: 'contenido',
          sortField: 'contenido',
          title: 'Indicaciones',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo',
          sortField: 'tipo',
          title: 'Tipo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'tipo_movimiento.nombre',
          sortField: 'tipo_movimiento.nombre',
          title: 'Tipo de movimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad',
          sortField: 'cantidad',
          title: 'Cantidad',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cantidad_previa',
          sortField: 'cantidad_previa',
          title: 'Cantidad previa',
          dataClass: 'list-item-heading'
        },
        {
          name: '__slot:estado',
          title: 'Estado',
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
        name: { required }
      }
    }
  },
  methods: {
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'traslado': {
          this.$v.$reset()
          this.$refs['modal-traslado'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'add-receta': {
          this.$v.$reset()
          this.$refs['modal-add-receta'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'ver-receta': {
          this.$v.$reset()
          this.$refs['modal-ver-receta'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'add-servicio': {
          this.$v.$reset()
          this.$refs['modal-add-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'ver-servicio': {
          this.$v.$reset()
          this.$refs['modal-ver-servicio'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
      }
    },
    onValidate (action) {
      this.$v.$touch()
      if (this.$v.$error !== true) {
        if (action === 'save') {
          this.onSave()
        } else if (action === 'update') {
          this.onUpdate()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    traslado (id) {
      this.$refs['modal-traslado'].show()
      this.form.id = id
    },
    saveTraslado () {
      const me = this
      axios.put(apiUrl + '/expedientes/changeStatus', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha trasladado el expediente ' + me.form.nombre + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('traslado')
          me.form.id = 0
          me.form.selectedOption = 'hospi'
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },
    addReceta (id) {
      this.$refs['modal-add-receta'].show()
      this.form.id = id
    },
    saveReceta () {
      const me = this
      if (me.form.receta !== null) {
        axios.post(apiUrl + '/recetas/create', {
          form: me.form })
          .then((response) => {
            me.alertVariant = 'primary'
            me.showAlert()
            me.alertText = 'Se ha creado la receta exitosamente'
            me.$refs.vuetable.refresh()
            me.closeModal('add-receta')
            me.form.id = 0
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('Error!', error)
          })
      }
    },
    verReceta (id) {
      this.$refs['modal-ver-receta'].show()
    },
    addServicio (id) {
      this.$refs['modal-add-servicio'].show()
    },
    verServicio (id) {
      this.$refs['modal-ver-servicio'].show()
    },
    /* Guardar */
    onUpdate () {
      const me = this
      axios.put(apiUrl + '/expedientes/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el expediente ' + me.form.nombre + ' exitosamente'
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
    makeQueryParams (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage,
          search: this.search
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
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
    makeQueryParamsReceta (sortOrder, currentPage, perPage) {
      return sortOrder[0]
        ? {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
        : {
          criterio: sortOrder[0] ? sortOrder[0].sortField : 'createdAt',
          order: sortOrder[0] ? sortOrder[0].direction : 'desc',
          page: currentPage,
          limit: this.perPage
        }
    },
    onPaginationDataReceta (paginationData) {
      this.fromP = paginationData.from
      this.toP = paginationData.to
      this.totalP = paginationData.total
      this.lastPageP = paginationData.last_page
      this.items = paginationData.data
      this.$refs.paginationReceta.setPaginationData(paginationData)
    },
    onChangePageReceta (page) {
      this.$refs.vuetableRecetas.changePage(page)
    },
    getDataRecetas (data) {
      this.form.name = data.nombre
      this.form.number = data.numero_cuenta_bancaria
      this.form.quantity = data.cantidad
      this.form.bank_id = data.banco.nombre
      this.form.state = data.estado
      this.form.id = data.id
      let id = data.id
      this.apiBaseReceta = apiUrl + `/recetas/getId?id=${id}`
    }
  }
}
</script>
<style>
.custom-editor {
  height: 500px; /* Adjust the height as needed */
}
.custom-editor .ql-editor {
  color: #333; /* Adjust the color value to make the text darker */
}
</style>

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
    <b-modal id="modal-1-planillas" ref="modal-1-planillas" title="Agregar planilla">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form-group label="Nombre:">
          <b-form-input
            v-model.trim="$v.form.name.$model"
            :state="!$v.form.name.$error"
            placeholder="Ingresar nombre del colaborador"
          ></b-form-input>
          <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
        <b-form-group label="Cuenta:">
          <b-form-input
            v-model.trim="$v.form.num_cuenta.$model"
            :state="!$v.form.num_cuenta.$error"
            placeholder="Ingresar cuenta del colaborador"
          ></b-form-input>
          <div v-if="$v.form.num_cuenta.required.$invalid" class="invalid-feedback">
            Debe ingresar el número de cuenta
          </div>
        </b-form-group>
        <b-form-group label="NIT:">
          <b-form-input
            v-model.trim="$v.form.nit.$model"
            :state="!$v.form.nit.$error"
            placeholder="Ingresar nit del colaborador"
          ></b-form-input>
          <div v-if="$v.form.nit.required.$invalid" class="invalid-feedback">
            Debe ingresar el nit
          </div>
        </b-form-group>
        <b-form-group label="Cargo:">
          <b-form-input
            v-model.trim="$v.form.cargo.$model"
            :state="!$v.form.cargo.$error"
            placeholder="Ingresar cargo del colaborador"
          ></b-form-input>
          <div v-if="$v.form.cargo.required.$invalid" class="invalid-feedback">
            Debe ingresar el cargo
          </div>
        </b-form-group>
        <b-form-group label="Salario:">
          <b-form-input
            v-model.trim="$v.form.salario.$model"
            :state="!$v.form.salario.$error"
            placeholder="Ingresar salario"
          ></b-form-input>
          <div v-if="$v.form.salario.required.$invalid" class="invalid-feedback">
            Debe ingresar el salario
          </div>
        </b-form-group>
        <b-form-group label="Bono:">
          <b-form-input
            v-model.trim="$v.form.bono.$model"
            :state="!$v.form.bono.$error"
            placeholder="Ingresar cantidad del bono"
          ></b-form-input>
          <div v-if="$v.form.bono.required.$invalid" class="invalid-feedback">
            Debe ingresar el bono
          </div>
        </b-form-group>
        <b-form-group label="IGSS:">
          <b-form-input
            v-model.trim="$v.form.igss.$model"
            :state="!$v.form.igss.$error"
            placeholder="Ingresar cantidad de IGSS"
          ></b-form-input>
          <div v-if="$v.form.igss.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de IGSS
          </div>
        </b-form-group>
        <b-form-group label="ISR:">
          <b-form-input
            v-model.trim="$v.form.isr.$model"
            :state="!$v.form.isr.$error"
            placeholder="Ingresar cantidad de ISR"
          ></b-form-input>
          <div v-if="$v.form.isr.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de ISR
          </div>
        </b-form-group>
        <b-form-group label="Préstamo:">
          <b-form-input
            v-model.trim="$v.form.prestamo.$model"
            :state="!$v.form.prestamo.$error"
            placeholder="Ingresar cantidad de préstamo"
          ></b-form-input>
          <div v-if="$v.form.prestamo.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad de préstamo
          </div>
        </b-form-group>
        <b-form-group label="Líquido:">
          <b-form-input
            v-model.trim="$v.form.liquido.$model"
            :state="!$v.form.liquido.$error"
            placeholder="Ingresar cantidad líquida"
          ></b-form-input>
          <div v-if="$v.form.liquido.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad líquida
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button type="submit" variant="primary" @click="onValidate('save')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('save')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-10-planillas" ref="modal-10-planillas" title="Ingresar salario">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-row class="ml-2">
          <b-col md="6">
            <b-form-group label="Nombre:">
              <h6>{{ form.name }}</h6>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cuenta:">
              <h6>{{ form.num_cuenta }}</h6>
            </b-form-group>
          </b-col>
        </b-row>
        <b-row class="ml-2">
          <b-col md="6">
            <b-form-group label="NIT:">
              <h6>{{ form.nit }}</h6>
            </b-form-group>
          </b-col>
          <b-col md="6">
            <b-form-group label="Cargo:">
              <h6>{{ form.cargo }}</h6>
            </b-form-group>
          </b-col>
        </b-row>
        <b-form-group label="Descripcion:">
          <b-form-textarea
            rows="2"
            v-model.trim="form.descripcion"
            placeholder="Ingresar descripción de pago"
          ></b-form-textarea>
        </b-form-group>
        <b-form-group label="Cuenta a debitar">
          <b-form-select v-model="form_cuenta.id">
            <option v-for="cuenta in cuentas" :key="cuenta.id" :value="cuenta.id" v-text="cuenta.nombre + ' - ' + cuenta.numero_cuenta_bancaria + ' - Saldo: ' + cuenta.cantidad"></option>
          </b-form-select>
        </b-form-group>
        <b-form-group label="Salario:">
          <b-form-input
            v-model.trim="$v.form.salario.$model"
            :state="!$v.form.salario.$error"
            placeholder="Ingresar salario"
          ></b-form-input>
          <div v-if="$v.form.salario.required.$invalid" class="invalid-feedback">
            Debe ingresar el salario
          </div>
        </b-form-group>
        <b-form-group label="Bono:">
          <b-form-input
            v-model.trim="$v.form.bono.$model"
            :state="!$v.form.bono.$error"
            placeholder="Ingresar cantidad del bono"
          ></b-form-input>
          <div v-if="$v.form.bono.required.$invalid" class="invalid-feedback">
            Debe ingresar el bono
          </div>
        </b-form-group>
        <b-form-group label="IGSS:">
          <b-form-input
            v-model.trim="$v.form.igss.$model"
            :state="!$v.form.igss.$error"
            placeholder="Ingresar cantidad de IGSS"
          ></b-form-input>
          <div v-if="$v.form.igss.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de IGSS
          </div>
        </b-form-group>
        <b-form-group label="ISR:">
          <b-form-input
            v-model.trim="$v.form.isr.$model"
            :state="!$v.form.isr.$error"
            placeholder="Ingresar cantidad de ISR"
          ></b-form-input>
          <div v-if="$v.form.isr.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de ISR
          </div>
        </b-form-group>
        <b-form-group label="Préstamo:">
          <b-form-input
            v-model.trim="$v.form.prestamo.$model"
            :state="!$v.form.prestamo.$error"
            placeholder="Ingresar cantidad de préstamo"
          ></b-form-input>
          <div v-if="$v.form.prestamo.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad de préstamo
          </div>
        </b-form-group>
        <b-form-group label="Líquido:">
          <b-form-input
            v-model.trim="$v.form.liquido.$model"
            :state="!$v.form.liquido.$error"
            placeholder="Ingresar cantidad líquida"
          ></b-form-input>
          <div v-if="$v.form.liquido.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad líquida
          </div>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button type="submit" variant="primary" @click="onValidate('salario')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('salario')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-11-planillas" ref="modal-11-planillas" title="Registro de salarios">
      <table>
        <thead>
          <tr>
            <th>Descripcion</th>
            <th> </th>
            <th> </th>
            <th> </th>
            <th>Liquido</th>
            <th> </th>
            <th>Colaborador</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="salario in salarios" :key="salario.id">
            <td>{{ salario.descripcion }}</td>
            <td> </td>
            <td> </td>
            <td> </td>
            <td>{{ salario.liquido }}</td>
            <td> </td>
            <td>{{ salario.planilla.nombre }}</td>
          </tr>
        </tbody>
      </table>
      <template #modal-footer="{}">
        <b-button variant="danger" @click="closeModal('registro')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-planillas" ref="modal-2-planillas" title="Editar planilla">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <b-form>
        <b-form>
        <b-form-group label="Nombre:">
          <b-form-input
            v-model.trim="$v.form.name.$model"
            :state="!$v.form.name.$error"
            placeholder="Ingresar nombre del colaborador"
          ></b-form-input>
          <div v-if="$v.form.name.required.$invalid" class="invalid-feedback">
            Debe ingresar el nombre
          </div>
        </b-form-group>
        <b-form-group label="Cuenta:">
          <b-form-input
            v-model.trim="$v.form.num_cuenta.$model"
            :state="!$v.form.num_cuenta.$error"
            placeholder="Ingresar cuenta del colaborador"
          ></b-form-input>
          <div v-if="$v.form.num_cuenta.required.$invalid" class="invalid-feedback">
            Debe ingresar el número de cuenta
          </div>
        </b-form-group>
        <b-form-group label="NIT:">
          <b-form-input
            v-model.trim="$v.form.nit.$model"
            :state="!$v.form.nit.$error"
            placeholder="Ingresar nit del colaborador"
          ></b-form-input>
          <div v-if="$v.form.nit.required.$invalid" class="invalid-feedback">
            Debe ingresar el nit
          </div>
        </b-form-group>
        <b-form-group label="Cargo:">
          <b-form-input
            v-model.trim="$v.form.cargo.$model"
            :state="!$v.form.cargo.$error"
            placeholder="Ingresar cargo del colaborador"
          ></b-form-input>
          <div v-if="$v.form.cargo.required.$invalid" class="invalid-feedback">
            Debe ingresar el cargo
          </div>
        </b-form-group>
        <b-form-group label="Salario:">
          <b-form-input
            v-model.trim="$v.form.salario.$model"
            :state="!$v.form.salario.$error"
            placeholder="Ingresar salario"
          ></b-form-input>
          <div v-if="$v.form.salario.required.$invalid" class="invalid-feedback">
            Debe ingresar el salario
          </div>
        </b-form-group>
        <b-form-group label="Bono:">
          <b-form-input
            v-model.trim="$v.form.bono.$model"
            :state="!$v.form.bono.$error"
            placeholder="Ingresar cantidad del bono"
          ></b-form-input>
          <div v-if="$v.form.bono.required.$invalid" class="invalid-feedback">
            Debe ingresar el bono
          </div>
        </b-form-group>
        <b-form-group label="IGSS:">
          <b-form-input
            v-model.trim="$v.form.igss.$model"
            :state="!$v.form.igss.$error"
            placeholder="Ingresar cantidad de IGSS"
          ></b-form-input>
          <div v-if="$v.form.igss.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de IGSS
          </div>
        </b-form-group>
        <b-form-group label="ISR:">
          <b-form-input
            v-model.trim="$v.form.isr.$model"
            :state="!$v.form.isr.$error"
            placeholder="Ingresar cantidad de ISR"
          ></b-form-input>
          <div v-if="$v.form.isr.required.$invalid" class="invalid-feedback">
            Debe ingresar la cantidad de ISR
          </div>
        </b-form-group>
        <b-form-group label="Préstamo:">
          <b-form-input
            v-model.trim="$v.form.prestamo.$model"
            :state="!$v.form.prestamo.$error"
            placeholder="Ingresar cantidad de préstamo"
          ></b-form-input>
          <div v-if="$v.form.prestamo.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad de préstamo
          </div>
        </b-form-group>
        <b-form-group label="Líquido:">
          <b-form-input
            v-model.trim="$v.form.liquido.$model"
            :state="!$v.form.liquido.$error"
            placeholder="Ingresar cantidad líquida"
          ></b-form-input>
          <div v-if="$v.form.liquido.required.$invalid" class="invalid-feedback">
            Debe ingresar cantidad líquida
          </div>
        </b-form-group>
      </b-form>
      </b-form>
      <template #modal-footer="{}">
        <b-button type="submit" variant="primary" @click="onValidate('update')"
          >Guardar</b-button
        >
        <b-button variant="danger" @click="closeModal('update')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-3-planillas" ref="modal-3-planillas" title="Desactivar planilla">
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
        ¿Desea desactivar la planilla: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-3-planillas')"
          >Desactivar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-planillas')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-4-planillas" ref="modal-4-planillas" title="Activar planilla">
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
        ¿Desea activar la planilla: {{ form.name }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-planillas')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-planillas')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Planilla de salarios</h4>
               <div class="iq-search-bar mt-2">
                <b-form action="#" class="searchbox">
                    <b-input id="search" placeholder="Buscar..." @input="(val) => searchChange(val)" />
                    <a class="search-link" href="#"><i class="ri-search-line"></i></a>
                </b-form>
              </div>
            </template>
            <template v-slot:headerAction>
            <b-button variant="primary"  v-b-modal.modal-1-planillas>AGREGAR NUEVO</b-button>
            <b-button variant="dark"  v-b-modal.modal-1-planillas>REPORTE MENSUAL</b-button>
            <b-button variant="dark"  v-b-modal.modal-1-planillas>REPORTE ANUAL</b-button>
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
              class="table-divided table-responsive order-with-arrow"
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
                    ><h6 class="danger"><strong>INACTIVO</strong></h6></b-badge
                  >
                </h5>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <b-button-group>
                  <b-button
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-planillas
                    class="mb-2"
                    size="sm"
                    variant="outline-warning"
                    ><i :class="'fas fa-pencil-alt'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Pagar salario'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-10-planillas
                    class="mb-2"
                    size="sm"
                    variant="outline-success"
                    ><i :class="'fas fa-money-bill'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="'Ver salarios pagados'"
                    @click="getDetalles(props.rowData)"
                    v-b-modal.modal-11-planillas
                    class="mb-2"
                    size="sm"
                    variant="outline-dark"
                    ><i :class="'fas fa-list'"
                  /></b-button>
                  <b-button
                    v-b-tooltip.top="
                      props.rowData.estado == 1 ? 'Desactivar' : 'Activar'"
                    @click="
                      setData(props.rowData);
                      props.rowData.estado == 1
                        ? $bvModal.show('modal-3-planillas')
                        : $bvModal.show('modal-4-planillas');
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
import { xray } from '../../../config/pluginInit'
import DatatableHeading from '../../Tables/DatatableHeading'
import Vuetable from 'vuetable-2/src/components/Vuetable'
import VuetablePaginationBootstrap from '../../../components/common/VuetablePaginationBootstrap'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'

export default {
  name: 'Planilla',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  beforeMount () {
    this.getCuentas()
    this.form_cuenta.id = 1
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
      search: '',
      salarios: null,
      form: {
        id: 0,
        descripcion: null,
        name: '',
        num_cuenta: '',
        nit: '',
        cargo: '',
        salario: '',
        bono: '',
        igss: '',
        isr: '',
        prestamo: '',
        liquido: '',
        state: 1
      },
      form_cuenta: {
        id: 1,
        numero_movimiento: 'PENDIENTE',
        tipo: 'DEBITO'
      },
      cuentas: null,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/planillas/list',
      fields: [
        {
          name: '__slot:actions',
          title: 'Acciones',
          titleClass: '',
          dataClass: 'text-muted'
        },
        {
          name: 'nombre',
          sortField: 'nombre',
          title: 'Nombre de colaborador',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nit',
          sortField: 'nit',
          title: 'NIT',
          dataClass: 'list-item-heading'
        },
        {
          name: 'cargo',
          sortField: 'cargo',
          title: 'Cargo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'num_cuenta',
          sortField: 'num_cuenta',
          title: 'Número de cuenta',
          dataClass: 'list-item-heading'
        },
        {
          name: 'salario',
          sortField: 'salario',
          title: 'Salario ordinario',
          dataClass: 'list-item-heading'
        },
        {
          name: 'bono',
          sortField: 'bono',
          title: 'Bonificación incentivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'igss',
          sortField: 'igss',
          title: 'Cuota laboral IGSS',
          dataClass: 'list-item-heading'
        },
        {
          name: 'isr',
          sortField: 'isr',
          title: 'Descuento de ISR',
          dataClass: 'list-item-heading'
        },
        {
          name: 'prestamo',
          sortField: 'prestamo',
          title: 'Descuento sobre préstamo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'liquido',
          sortField: 'liquido',
          title: 'Líquido',
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
        name: { required },
        num_cuenta: { required },
        nit: { required },
        cargo: { required },
        salario: { required },
        bono: { required },
        igss: { required },
        isr: { required },
        prestamo: { required },
        liquido: { required }
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
          this.form.num_cuenta = ''
          this.form.nit = ''
          this.form.cargo = ''
          this.form.salario = ''
          this.form.bono = ''
          this.form.igss = ''
          this.form.isr = ''
          this.form.prestamo = ''
          this.form.liquido = ''
          this.form.state = 1
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-planillas'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.num_cuenta = ''
          this.form.nit = ''
          this.form.cargo = ''
          this.form.salario = ''
          this.form.bono = ''
          this.form.igss = ''
          this.form.isr = ''
          this.form.prestamo = ''
          this.form.liquido = ''
          this.form.state = 1
          break
        }
        case 'salario': {
          this.$v.$reset()
          this.$refs['modal-10-planillas'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.num_cuenta = ''
          this.form.nit = ''
          this.form.cargo = ''
          this.form.salario = ''
          this.form.bono = ''
          this.form.igss = ''
          this.form.isr = ''
          this.form.prestamo = ''
          this.form.liquido = ''
          this.form.state = 1
          break
        }
        case 'registro': {
          this.$v.$reset()
          this.$refs['modal-11-planillas'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.num_cuenta = ''
          this.form.nit = ''
          this.form.cargo = ''
          this.form.salario = ''
          this.form.bono = ''
          this.form.igss = ''
          this.form.isr = ''
          this.form.prestamo = ''
          this.form.liquido = ''
          this.form.state = 1
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-planillas'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.num_cuenta = ''
          this.form.nit = ''
          this.form.cargo = ''
          this.form.salario = ''
          this.form.bono = ''
          this.form.igss = ''
          this.form.isr = ''
          this.form.prestamo = ''
          this.form.liquido = ''
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
        } else if (action === 'salario') {
          this.saveSalary()
        }
      } else {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      }
    },
    async getDetalles (data) {
      let id = data.id
      let me = this
      await axios.get(apiUrl + `/detalle_planilla/get?id=${id}`)
        .then(function (response) {
          me.salarios = response.data
          console.log(me.salarios)
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    setData (data) {
      this.form.name = data.nombre
      this.form.num_cuenta = data.num_cuenta
      this.form.nit = data.nit
      this.form.cargo = data.cargo
      this.form.salario = data.salario
      this.form.bono = data.bono
      this.form.igss = data.igss
      this.form.isr = data.isr
      this.form.prestamo = data.prestamo
      this.form.liquido = data.liquido
      this.form.state = data.estado
      this.form.id = data.id
      var fecha = new Date()
      var mes = fecha.getMonth() + 1
      var anio = fecha.getFullYear()
      var mesTexto = ''
      if (mes === 1) {
        mesTexto = 'Enero'
      } else if (mes === 2) {
        mesTexto = 'Febrero'
      } else if (mes === 3) {
        mesTexto = 'Marzo'
      } else if (mes === 4) {
        mesTexto = 'Abril'
      } else if (mes === 5) {
        mesTexto = 'Mayo'
      } else if (mes === 6) {
        mesTexto = 'Junio'
      } else if (mes === 7) {
        mesTexto = 'Julio'
      } else if (mes === 8) {
        mesTexto = 'Agosto'
      } else if (mes === 9) {
        mesTexto = 'Septiembre'
      } else if (mes === 10) {
        mesTexto = 'Octubre'
      } else if (mes === 11) {
        mesTexto = 'Noviembre'
      } else if (mes === 12) {
        mesTexto = 'Diciembre'
      }
      this.form.descripcion = 'Pago de salario al colaborador ' + data.nombre + ' correspondiente al mes de ' + mesTexto + ' del año ' + anio
    },
    /* Guardar */
    onSave () {
      const me = this
      axios.post(apiUrl + '/planillas/create', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha creado el salario del colaborador ' + me.form.name + ' exitosamente'
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
    saveSalary () {
      const me = this
      axios.post(apiUrl + '/detalle_planilla/create', {
        form: me.form,
        cuenta: me.form_cuenta })
        .then((response) => {
          me.alertVariant = 'success'
          me.showAlert()
          me.alertText = 'Se ha ingresado un pago de salario del colaborador ' + me.form.name + ' exitosamente'
          me.$refs.vuetable.refresh()
          me.closeModal('salario')
        })
        .catch((error) => {
          me.alertVariant = 'danger'
          me.showAlertError()
          me.alertErrorText = error.response.data.msg
          console.error('Error!', error)
        })
    },
    /* Guardar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide();
      axios.put(apiUrl + '/planillas/update', {
        form: me.form })
        .then((response) => {
          me.alertVariant = 'primary'
          me.showAlert()
          me.alertText = 'Se ha actualizado el salario del colaborador ' + me.form.name + ' exitosamente'
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
      let me = this
      if (this.form.state === 1) {
        axios
          .put(apiUrl + '/planillas/deactivate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'warning'
            me.showAlert()
            me.alertText = 'Se ha desactivado el salario del colaborador ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-3-planillas'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      } else {
        axios
          .put(apiUrl + '/planillas/activate', {
            id: this.form.id
          })
          .then((response) => {
            me.alertVariant = 'info'
            me.showAlert()
            me.alertText = 'Se ha activado el salario del colaborador ' + me.form.name + ' exitosamente'
            me.$refs.vuetable.refresh()
            me.$refs['modal-4-planillas'].hide()
          })
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
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
    async getCuentas () {
      let me = this
      await axios.get(apiUrl + `/cuenta_bancaria/get`)
        .then(function (response) {
          me.cuentas = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

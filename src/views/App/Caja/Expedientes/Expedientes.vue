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
    <b-modal id="modal-1-pago" ref="modal-1-pago" title="Pagar por adelantado" size="xl">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <template>
        <div>
          <h6>Cuentas activas para {{this.form.nombres}} {{this.form.apellidos}}</h6>
          <b-card>
            <b-card-body>
              <b-table
                hover
                :items="cuentas"
                :fields="fieldsAccounts"
                :select-mode="'single'"
                selectable
                @row-selected="onRowSelected"
              >
                <template #cell(seleccion)="{ rowSelected }">
                  <template v-if="rowSelected">
                    <span aria-hidden="true">&check;</span>
                    <span class="sr-only">Selected</span>
                  </template>
                  <template v-else>
                    <span aria-hidden="true">&nbsp;</span>
                    <span class="sr-only">Not selected</span>
                  </template>
                </template>
              </b-table>
              <div>Total por pagar: {{this.totalSUM}}</div>
              <b-form-group label="Seleccione métodos para pagar:" v-slot="{ ariaDescribedby }">
                <b-form-checkbox-group
                  id="checkbox-group-1"
                  v-model="selectedPayment"
                  :options="paymentOptions"
                  :aria-describedby="ariaDescribedby"
                  name="flavour-1"
                ></b-form-checkbox-group>
              </b-form-group>
              <div v-if="selectedPayment.indexOf(1) !== -1">
                Efectivo
                <b-input :type="'number'" id="CashTypeInput" ref="CashTypeInput" v-model="paymentType.Efectivo" />
              </div>
              <div v-if="selectedPayment.indexOf(2) !== -1">
                Tarjeta
                <b-input :type="'number'" id="CardTypeInput" ref="CardTypeInput" v-model="paymentType.Tarjeta" />
              </div>
              <div v-if="selectedPayment.indexOf(3) !== -1">
                Depósito
                <b-input :type="'number'" id="DepositTypeInput" ref="DepositTypeInput" v-model="paymentType.Deposito" />
              </div>
              <div v-if="selectedPayment.indexOf(4) !== -1">
                Cheque
                <b-input :type="'number'" id="CheckTypeInput" ref="CheckTypeInput" v-model="paymentType.Cheque" />
              </div>
              <div v-if="selectedPayment.indexOf(5) !== -1">
                Seguro
                <b-input :type="'number'" id="InsuranceTypeInput" ref="InsuranceTypeInput" v-model="paymentType.Seguro" />
              </div>
              <div>
                <strong> TOTAL INGRESADO: {{ parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro) }}</strong>
              </div>
              <div>
                <strong> TOTAL A PAGAR: {{ this.totalPayment }}</strong>
              </div>
            </b-card-body>
            <div>

            </div>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onPatientQuit()
        "
          >Aceptar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-1-pago')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-2-expediente" ref="modal-2-expediente" size="xl" title="Editar expediente">
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
        <div>
          <b-tabs content-class="mt-3">
            <b-tab title="Paciente" active>
              <b-row class="ml-2">
                <b-col md="2">
                  <b-form-group label="Nombre:">
                    <span class="required-asterisk" style="position: absolute; top: 50%; transform: translateY(-50%); right: 5px; color: red;"></span>
                    <b-form-input
                      v-model.trim="$v.form.nombre.$model"
                      :class="{'is-invalid': $v.form.nombre.$error}"
                      placeholder="Ingresar nombre"
                      required
                    ></b-form-input>
                    <div v-if="$v.form.nombre.$error" class="invalid-feedback">
                      <div v-if="!$v.form.nombre.required.$error">Debe ingresar nombre</div>
                      <div v-if="!$v.form.nombre.ValidateName.$error">El nombre solo debe contener letras mayúsculas y con tildes</div>
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Apellidos:">
                    <b-form-input
                      v-model.trim="$v.form.apellidos.$model"
                      :class="{'is-invalid': $v.form.apellidos.$error}"
                      placeholder="Ingresar apellidos"
                    ></b-form-input>
                    <div v-if="$v.form.apellidos.required.$invalid" class="invalid-feedback">
                      Ingresar los apellidos
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Apellido de casada: ">
                    <b-form-input
                      v-model.trim="form.casada"
                      placeholder="Ingresar apellido de casada"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Fecha de nacimiento:">
                    <b-form-input
                      type="date"
                      v-model.trim="$v.form.nacimiento.$model"
                      :class="{'is-invalid': $v.form.nacimiento.$error}"
                      placeholder="Ingresar fecha de nacimiento"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Telefono:">
                    <b-form-input
                      v-model.trim="$v.form.telefono.$model"
                      :class="{'is-invalid': $v.form.telefono.$error}"
                      placeholder="Ingresar telefono"
                    ></b-form-input>
                    <div v-if="$v.form.telefono.required.$invalid" class="invalid-feedback">
                      Debe ingresar el telefono
                    </div>
                    <div v-if="$v.form.telefono.numeric.$invalid" class="invalid-feedback">
                      Debe ingresar unicamente numeros
                    </div>
                  </b-form-group>
                </b-col>
                <!-- columna -->
                <b-col md="2">
                  <b-form-group label="Sexo:">
                    <v-select
                      name="type"
                      v-model="form.generos"
                      :options="generos"
                      placeholder="Seleccione el sexo"
                    />
                  </b-form-group>
                </b-col>

              </b-row>
              <b-row class="ml-2">
                <!-- columna -->
                <b-col md="2">
                  <b-form-group label="CUI:">
                    <b-form-input
                      v-model.trim="$v.form.cui.$model"
                      :class="{'is-invalid': $v.form.cui.$error}"
                      placeholder="Ingresar el CUI"
                    ></b-form-input>
                    <div v-if="$v.form.cui.$error" class="invalid-feedback">
                      El valor del CUI debe ser numerico.
                    </div>
                    <div v-if="$v.form.cui.numeric.$invalid" class="invalid-feedback">
                      Debe ingresar unicamente numeros
                    </div>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Nacionalidad:">
                    <v-select
                      name="type"
                      v-model="form.nacionalidad"
                      :options="nacionalidades"
                      placeholder="Seleccione nacionalidad"
                    />
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Dirección:">
                    <b-form-input
                      v-model.trim="$v.form.direccion.$model"
                      :class="{'is-invalid': $v.form.direccion.$error}"
                      placeholder="Ingresar dirección"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Lugar de nacimiento:">
                    <b-form-input
                      v-model.trim="form.lugar_nacimiento"
                      placeholder="Ingresar lugar de nacimiento"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Profesión u oficio:">
                    <b-form-input
                      v-model.trim="form.profesion"
                      placeholder="Ingresar profesión"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Estado civil:">
                    <v-select
                      name="type"
                      v-model="form.estado_civil"
                      :options="estados_civiles"
                      placeholder="Seleccione estado civil"
                    />
                  </b-form-group>
                </b-col>
              </b-row>
              <b-row  class="ml-2">
                <b-col md="2">
                  <b-form-group label="Nombre del padre:">
                    <b-form-input
                      v-model.trim="form.nombre_padre"
                      placeholder="Ingresar nombre del padre"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
                <b-col md="2">
                  <b-form-group label="Nombre de la madre:">
                    <b-form-input
                      v-model.trim="form.nombre_madre"
                      placeholder="Ingresar nombre de la madre"
                    ></b-form-input>
                  </b-form-group>
                </b-col>
              </b-row>
            </b-tab>
            <b-tab title="Encargado">
              <b-row class="ml-2">
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="$v.form.nombre_encargado.$model"
                    :class="{'is-invalid': $v.form.nombre_encargado.$error}"
                    placeholder="Ingresar nombre"
                  ></b-form-input>
                  <div v-if="$v.form.nombre_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el nombre del encargado
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="$v.form.contacto_encargado.$model"
                    :class="{'is-invalid': $v.form.contacto_encargado.$error}"
                    placeholder="Ingresar telefono"
                  ></b-form-input>
                  <div v-if="$v.form.contacto_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el telefono
                  </div>
                  <div v-if="$v.form.contacto_encargado.numeric.$invalid" class="invalid-feedback">
                    Debe ingresar unicamente numeros
                  </div>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="CUI:">
                  <b-form-input
                    v-model.trim="$v.form.cui_encargado.$model"
                    :class="{'is-invalid': $v.form.cui_encargado.$error}"
                    placeholder="Ingresar el CUI"
                  ></b-form-input>
                  <div v-if="$v.form.cui_encargado.required.$invalid" class="invalid-feedback">
                    Debe ingresar el CUI del encargado
                  </div>
                  <div v-if="$v.form.cui_encargado.$error" class="invalid-feedback">
                    El valor del CUI debe ser numerico.
                  </div>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Estado civil:">
                  <v-select
                    name="type"
                    v-model="form.estado_civil_encargado"
                    :options="estados_civiles"
                    placeholder="Seleccione estado civil de encargado"
                  />
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Parentesco:">
                  <v-select
                    name="type"
                    v-model="form.parentesco_encargado"
                    :options="parentescos"
                    placeholder="Seleccione parentesco"
                  />
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
            <b-row class="ml-2">
              <b-col md="4">
                <b-form-group label="Dirección de encargado:">
                  <b-form-input
                    v-model.trim="form.direccion_encargado"
                    placeholder="Ingresar dirección"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="4">
                <b-form-group label="Profesión u oficio de encargado:">
                  <b-form-input
                    v-model.trim="form.profesion_encargado"
                    placeholder="Ingresar profesión u oficio"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Edad de encargado:">
                  <b-form-input
                    v-model.trim="form.edad_encargado"
                    type="number"
                    min="0"
                    max="100"
                    placeholder="Ingresar edad"
                  ></b-form-input>
                </b-form-group>
              </b-col>
            </b-row>
            </b-tab>
            <b-tab title="Cónyugue">
              <b-row class="ml-2">
              <!-- columna -->
              <b-col md="2">
                <b-form-group label="Nombre:">
                  <b-form-input
                    v-model.trim="form.nombre_conyuge"
                    placeholder="Ingresar nombre de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <b-col md="2">
                <b-form-group label="Telefono:">
                  <b-form-input
                    v-model.trim="form.telefono_conyuge"
                    placeholder="Ingresar telefono de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- columna -->
              <b-col md="4">
                <b-form-group label="Dirección de conyuge:">
                  <b-form-input
                    v-model.trim="form.direccion_conyuge"
                    placeholder="Ingresar dirección de conyuge"
                  ></b-form-input>
                </b-form-group>
              </b-col>
              <!-- columna -->
            </b-row>
          </b-tab>
          </b-tabs>
        </div>
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
    <b-modal id="modal-3-medico" ref="modal-3-medico" title="Asignar médico" size="md">
      <b-alert
        :show="alertCountDownError"
        dismissible
        fade
        @dismissed="alertCountDownError=0"
        class="text-white bg-danger"
      >
        <div class="iq-alert-text">{{ alertErrorText }}</div>
      </b-alert>
      <template>
        <div>
          <b-card>
            <b-card-body>
              <v-select
                name="type"
                v-model = "selectedDoctor"
                :options="doctors"
                :reduce="doc => doc.value"
                placeholder="Seleccione un médico"
                label='text'
                @search="onSearchMedicos"/>
            </b-card-body>
          </b-card>
        </div>
      </template>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="
          onDoctorAssignment()
        "
          >Asignar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-3-medico')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-modal id="modal-contrato" ref="modal-contrato" title="Generar Contrato" size="xl">
      <div id="previewContainer">
        <iframe :src="previewURL" width="100%" height="700px"></iframe>
      </div>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="descargarpdf()">Guardar</b-button>
        <b-button variant="danger" @click="closeModal('contrato')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Expedientes</h4>
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
              <!-- Estado -->
              <div slot="estado" slot-scope="props">
                <button v-if="props.rowData.estado === 1" type="button" class="btn btn-success" disabled>INGRESADO EN HOSPITAL</button>
                <button v-if="props.rowData.estado === 2" type="button" class="btn btn-warning" disabled>EGRESADO</button>
                <button v-if="props.rowData.estado === 3" type="button" class="btn btn-success" disabled>INGRESADO EN QUIRÓFANO</button>
                <button v-if="props.rowData.estado === 4" type="button" class="btn btn-success" disabled>INGRESADO EN INTENSIVO</button>
                <button v-if="props.rowData.estado === 5" type="button" class="btn btn-success" disabled>INGRESADO EN EMERGENCIA</button>
                <button v-if="props.rowData.estado === 6" type="button" class="btn btn-dark" disabled>DESAHUCIADO</button>
                <button v-if="props.rowData.estado === 7" type="button" class="btn btn-dark" disabled>ALTA MÉDICA</button>
                <button v-if="props.rowData.estado === 8" type="button" class="btn btn-dark" disabled>EGRESO CONTRAINDICADO</button>
                <button v-if="props.rowData.estado === 9" type="button" class="btn btn-dark" disabled>REFERIDO A OTRA UBICACIÓN</button>
                <button v-if="props.rowData.estado === 10" type="button" class="btn btn-dark" disabled>PENDIENTE DE REGISTRO</button>
                <button v-if="props.rowData.estado === 0" type="button" class="btn btn-dark" disabled>FALLECIDO</button>
              </div>
              <!-- Botones -->
              <template slot="actions" slot-scope="props">
                <div class="button-container">
                  <b-button
                    v-b-tooltip.top="'Editar'"
                    @click="setData(props.rowData)"
                    v-b-modal.modal-2-expediente
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Editar</b-button>

                  <b-button
                    v-b-tooltip.top="'Pago adelantado'"
                    @click="setData(props.rowData); $bvModal.show('modal-1-pago')"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Pago por adelantado</b-button>

                  <b-button
                    v-b-tooltip.top="'Asignar médico'"
                    @click="setData(props.rowData); $bvModal.show('modal-3-medico'); getDoctors()"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                    :disabled="!hasPermission([5, 7])"
                  >Asignar un médico</b-button>

                  <b-button
                    v-b-tooltip.top="'Generar Contrato'"
                    @click="$bvModal.show('modal-responsable'); setDatos(props.rowData)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Generar contrato</b-button>

                  <b-button
                    v-b-tooltip.top="'Generar Sumario'"
                    @click="generarSumario(props.rowData)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="dark"
                  >Generar sumario de paciente</b-button>
                  <b-button
                    v-b-tooltip.top="'Generar Cuenta Total'"
                    @click="generarCuentaTotal(props.rowData.id, props.rowData.nombres, props.rowData.apellidos)"
                    class="mb-2 button-spacing"
                    size="sm"
                    variant="success"
                  >Generar Cuenta Total de paciente</b-button>
                </div>
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
import { helpers, numeric, required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../../config/constant'
import moment from 'moment'
import JsPDF from 'jspdf'
import logo from '../../../../assets/images/login/1.png'
import ExcelJS from 'exceljs'
import { mapGetters } from 'vuex'

export default {
  name: 'Bank',
  components: {
    vuetable: Vuetable,
    'vuetable-pagination-bootstrap': VuetablePaginationBootstrap,
    'datatable-heading': DatatableHeading
  },
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
  },
  computed: {
    ...mapGetters({
      currentUser: 'currentUser'
    })
  },
  data () {
    return {
      from: 0,
      totalSUM: 0,
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      form: {
        id: 0,
        name: '',
        nombre: '',
        apellidos: '',
        expediente: '',
        casada: '',
        nacimiento: null,
        cui: null,
        nacionalidad: null,
        telefono: '',
        direccion: '',
        generos: '',
        nombre_encargado: '',
        contacto_encargado: '',
        parentesco_encargado: '',
        edad_encargado: '',
        state: 1,
        id_usuario: null,
        estado_civil: null,
        profesion: '',
        nombre_madre: '',
        nombre_padre: '',
        lugar_nacimiento: '',
        estado_civil_encargado: null,
        profesion_encargado: '',
        direccion_encargado: '',
        cui_encargado: '',
        nombre_conyuge: '',
        direccion_conyuge: '',
        telefono_conyuge: '',
        selectedOption: 'hospi',
        assignedDoctor: 0,
        tipo_paciente: '0',
        motivo: ' ',
        fecha: null,
        hora: null
      },
      selectedDoctor: [],
      nacionalidades: ['Guatemala', 'El Salvador', 'México', 'Honduras', 'Belice', 'Otro'],
      generos: ['Masculino', 'Femenino'],
      parentescos: ['Padre/Madre', 'Hermano/a', 'Hijo/a', 'Cónyuge', 'Otro'],
      estados_civiles: ['Soltero/a', 'Casado/a', 'Viudo/a', 'Separado/a', 'Divorciado/a', 'Otro'],
      doctors: [],
      totPagado: 0,
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      selectedAccount: null,
      cuentas: [],
      selectedTrasOption: 4,
      selectedPayment: [],
      fieldsAccounts: [
        {
          key: 'numero',
          label: 'Numero',
          sortable: true
        },
        {
          key: 'motivo',
          label: 'Motivo',
          sortable: true
        },
        {
          key: 'pendiente_de_pago',
          label: 'Total a pagar',
          sortable: true
        },
        {
          key: 'seleccion',
          label: 'Selección',
          sortable: true
        }
      ],
      paymentOptions: [
        { text: 'Efectivo', value: 1 },
        { text: 'Tarjeta', value: 2 },
        { text: 'Depósito', value: 3 },
        { text: 'Cheque', value: 4 },
        { text: 'Seguro', value: 5 }
      ],
      paymentType: {
        Efectivo: 0,
        Tarjeta: 0,
        Deposito: 0,
        Cheque: 0,
        Seguro: 0
      },
      paymentSum: 0,
      totalPayment: 0,
      apiBase: apiUrl + '/expedientes/list',
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
          name: 'medico.nombre',
          title: 'Médico asignado',
          dataClass: 'list-item-heading'
        },
        {
          name: 'nacimiento',
          sortField: 'nacimiento',
          title: 'Fecha de nacimiento',
          dataClass: 'list-item-heading'
        },
        {
          name: 'edad',
          title: 'Edad',
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
        },
        {
          name: '__slot:estado',
          title: 'Estado',
          titleClass: '',
          dataClass: 'text-muted',
          width: '25%'
        }
      ],
      // CONTRATO
      paciente: null,
      previewURL: null,
      pdf: null,
      pdfName: 'Contrato_General.pdf',
      contrato: {
        nombre: '',
        edad: null,
        cui: null,
        estadoCivil: '',
        nacionalidad: '',
        profesion: '',
        domicilio: '',
        direccion: ''
      },
      // AREA DE SUMARIO
      dataPDFsumario: null,
      nombrePaciente: null
    }
  },
  validations () {
    return {
      form: {
        name: { required },
        nombre: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        apellidos: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        telefono: {
          required, numeric
        },
        nacimiento: {
          required
        },
        cui: {
          numeric, required
        },
        direccion: {
          required
        },
        nombre_encargado: {
          required, ValidateName: helpers.regex(/^[A-ZÁÉÍÓÚÜÑ\s]+$/)
        },
        contacto_encargado: {
          required,
          numeric
        },
        cui_encargado: {
          required, numeric
        },
        telefono_conyuge: {
          numeric
        }
      }
    }
  },
  methods: {
    hasPermission (blockedRoles = []) {
      return !blockedRoles.includes(this.currentUser.user_type)
    },

    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'update': {
          break
        }
      }
    },
    closeModal (action) {
      switch (action) {
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-expediente'].hide()
          this.form.id = 0
          this.form.name = ''
          this.form.state = 1
          break
        }
        case 'assignDoctor': {
          this.$refs['modal-3-medico'].hide()
          break
        }
        case 'contrato': {
          this.$refs['modal-contrato'].hide()
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
    calcularEdad (Fecha) {
      if (!Fecha) return ''
      const FECHA = moment(Fecha, 'DD-MM-YYYY').format('YYYY-MM-DD')
      const hoy = new Date()
      const nacimiento = new Date(FECHA)
      let edad = hoy.getFullYear() - nacimiento.getFullYear()
      const mesCumpleanos = nacimiento.getMonth()
      const diaCumpleanos = nacimiento.getDate()

      if (hoy.getMonth() < mesCumpleanos || (hoy.getMonth() === mesCumpleanos && hoy.getDate() < diaCumpleanos)) {
        edad--
      }
      return edad
    },
    setData (data) {
      this.form.id = data.id
      this.form.name = data.nombres + ' ' + data.apellidos
      this.form.nombre = data.nombres
      this.form.apellidos = data.apellidos
      this.form.casada = data.casada
      this.form.nacimiento = data.nacimiento
      this.form.cui = data.cui
      this.form.nacionalidad = data.nacionalidad
      this.form.telefono = data.telefono
      this.form.direccion = data.direccion
      this.form.generos = data.generos
      this.form.nombre_encargado = data.nombre_encargado
      this.form.contacto_encargado = data.contacto_encargado
      this.form.parentesco_encargado = data.parentesco_encargado
      this.form.edad_encargado = data.edad_encargado
      this.form.estado_civil = data.estado_civil
      this.form.profesion = data.profesion
      this.form.nombre_madre = data.nombre_madre
      this.form.nombre_padre = data.nombre_padre
      this.form.lugar_nacimiento = data.lugar_nacimiento
      this.form.estado_civil_encargado = data.estado_civil_encargado
      this.form.cui_encargado = data.cui_encargado
      this.form.profesion_encargado = data.profesion_encargado
      this.form.nombre_conyuge = data.nombre_conyuge
      this.form.direccion_conyuge = data.direccion_conyuge
      this.form.telefono_conyuge = data.telefono_conyuge
      this.form.expediente = data.expediente
      this.form.state = data.estado
      this.form.id = data.id
      this.getCuentas(data.id)
    },
    /* Guardar */
    onUpdate () {
      const me = this
      // this.$refs["modalSave"].hide();
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
      this.items = paginationData.data.map(item => {
        item.nacimiento = moment(item.nacimiento).format('DD/MM/YYYY')
        item.edad = this.calcularEdad(item.nacimiento)
        return {
          nacimiento: item.nacimiento,
          edad: item.edad
        }
      })
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
    getCuentas (num) {
      this.totalSUM = 0
      axios.get(apiUrl + '/cuentas/getByExp', {
        params: {
          id: num
        }
      }).then((response) => {
        this.totalSUM = response.data
          .map(item => item.pendiente_de_pago)
          .reduce((sum, value) => sum + value, 0)

        this.cuentas = response.data
      })
    },
    getDoctors (search, loading) {
      axios.get(apiUrl + '/medicos/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.doctors = response.data.map(medico => ({
          value: medico.id,
          text: medico.nombre
        }))
        loading(false)
      })
    },
    onSearchMedicos (search, loading) {
      if (search.length) {
        loading(true)
        this.getDoctors(search, loading)
      }
    },
    onPatientQuit () {
      this.paymentSum = parseFloat(this.paymentType.Efectivo) + parseFloat(this.paymentType.Tarjeta) + parseFloat(this.paymentType.Deposito) + parseFloat(this.paymentType.Cheque) + parseFloat(this.paymentType.Seguro)
      if (this.selectedAccount === null) {
        this.alertErrorText = 'Revisa que todos los campos requeridos esten llenos'
        this.showAlertError()
      } else {
        let me = this
        axios.put(apiUrl + '/cuentas/deactivate',
          {
            id: this.selectedAccount,
            total_pagado: parseFloat(this.totPagado) + parseFloat(this.paymentSum),
            pendiente_de_pago: parseFloat(parseFloat(this.totalPayment) - parseFloat(this.paymentSum)),
            efectivo: this.paymentType.Efectivo,
            tarjeta: this.paymentType.Tarjeta,
            deposito: this.paymentType.Deposito,
            cheque: this.paymentType.Cheque,
            seguro: this.paymentType.Seguro,
            total: this.paymentSum,
            tipo: 'adelanto'
          })
          .then(
            this.selectedAccount = null,
            this.paymentType.Efectivo = 0,
            this.paymentType.Tarjeta = 0,
            this.paymentType.Deposito = 0,
            this.paymentType.Cheque = 0,
            this.paymentType.Seguro = 0,
            this.paymentSum = 0,
            me.alertVariant = 'info',
            me.showAlert(),
            me.alertText = 'Se ha pagado por adelantado la cuenta del paciente ' + me.form.name + ' exitosamente',
            me.$refs.vuetable.refresh(),
            me.$refs['modal-1-pago'].hide()
          )
          .catch((error) => {
            me.alertVariant = 'danger'
            me.showAlertError()
            me.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
            console.error('There was an error!', error)
          })
      }
    },
    onRowSelected (items) {
      this.selectedAccount = items[0].id
      this.totalPayment = items[0].pendiente_de_pago
      this.totPagado = items[0].total_pagado
    },
    onDoctorAssignment () {
      this.form.assignedDoctor = this.selectedDoctor
      axios.put(apiUrl + '/expedientes/assignDoctor', {
        form: this.form })
        .then((response) => {
          this.alertVariant = 'primary'
          this.showAlert()
          this.alertText = 'Se ha actualizado el expediente ' + this.form.expediente + ' exitosamente'
          this.$refs.vuetable.refresh()
          this.closeModal('assignDoctor')
        })
        .catch((error) => {
          this.alertVariant = 'danger'
          this.showAlertError()
          this.alertErrorText = 'Ha ocurrido un error, por favor intente más tarde'
          console.error('Error!', error)
        })
    },

    // CONTRATO
    setDatos (data) {
      this.paciente = data
      this.generatePDF()
    },
    generatePDF () {
      // Crear PDF
      this.pdf = new JsPDF({
        unit: 'cm',
        format: 'legal'
      })

      const today = new Date()
      const diasTexto = [
        '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve', 'diez',
        'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete', 'dieciocho', 'diecinueve',
        'veinte', 'veintiuno', 'veintidós', 'veintitrés', 'veinticuatro', 'veinticinco', 'veintiséis',
        'veintisiete', 'veintiocho', 'veintinueve', 'treinta', 'treinta y uno'
      ]

      const aniosTexto = {
        2025: 'dos mil veinticinco',
        2026: 'dos mil veintiséis',
        2027: 'dos mil veintisiete',
        2028: 'dos mil veintiocho',
        2029: 'dos mil veintinueve',
        2030: 'dos mil treinta',
        2031: 'dos mil treinta y uno'
      }
      const day = today.getDate()
      const dayText = diasTexto[day]
      const month = today.toLocaleString('es-ES', { month: 'long' })
      const year = today.getFullYear()
      const yearText = aniosTexto[year] || 'Actualizar sistema'

      // Encabezado
      this.pdf.addImage(logo, 'JPEG', 1.5, 1, 3, 3)

      this.pdf.setFontSize(16).setFont(undefined, 'bold')
      this.pdf.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 12, 2, { align: 'center' })
      this.pdf.setFontSize(14)
      this.pdf.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 12, 3, { align: 'center' })
      this.pdf.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 12, 3.5, { align: 'center' })

      this.pdf.setFontSize(18).setFont(undefined, 'bold')
      const text = 'CONTRATO DE SERVICIOS DE HOSPITALIZACION'
      const x = 10.5
      const y = 4.5
      this.pdf.text(text, x, y, { align: 'center' })
      const textWidth = this.pdf.getTextWidth(text)
      this.pdf.setLineWidth(0.05)
      const lineY = y + 0.2
      this.pdf.line(x - textWidth / 2, lineY, x + textWidth / 2, lineY)

      // Declaraciones
      let altura = 6
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `YO: ${this.paciente.nombre_encargado}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '_____________________________________________________________________',
        2.8,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `DE:                  ${this.paciente.edad_encargado}                                     años`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '_____________________________',
        2.8,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `De estado civil: ${this.paciente.estado_civil_encargado}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '____________________________________________________________',
        5,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `De nacionalidad: ${this.paciente.nacionalidad}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '___________________________________________________________',
        5.2,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `Profesion u oficio: ${this.paciente.profesion_encargado}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '__________________________________________________________',
        5.4,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `Domiciliado en: ${this.paciente.direccion_encargado}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '____________________________________________________________',
        5,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 0.7
      this.pdf.setFontSize(12).setFont(undefined, 'normal')
      this.pdf.text(
        `Con residencia:  ${this.paciente.direccion_encargado}`,
        2,
        altura,
        { maxWidth: 17 }
      )
      this.pdf.text(
        '____________________________________________________________',
        5,
        altura + 0.1,
        { maxWidth: 17 }
      )

      altura += 1
      this.pdf.setFontSize(10).setFont(undefined, 'normal')
      this.pdf.text(
        `Lugar que  señalo  para recibir  notificaciones  por  el  presente documento  hago constar:  PRIMERO: que autorizo
expresamente al  HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A. para que le preste tratamiento  médico
necesario a: ${this.paciente.nombres} ${this.paciente.apellidos} utilizando los servicios médicos necesarios así
como  los  medicamentos  que  los  profesionales  de  mérito  estimen  conveniente,  aplicando los tratamientos que
estos  prescriban. SEGUNDO: que  me  comprometo expresamente  a  cancelar  el monto  de la liquidación que me
presente  el  HOSPITAL  DE  ESPECIALIDADES  DE  OCCIDENTE,  S.A.  Por los conceptos indicados en el punto
anterior,  ósea  HOSPITALIZACIÓN,  MEDICINAS,  Y  HONORARIOS  por servicios  médicos prestados;  y para tal
efecto  acepto  desde ya  como  líquidas,  exigibles,  ejecutivas y de  plazo  vencido,  las  cantidades  que  arroje  la
liquidación relacionada. TERCERO:  la falta de pago de la cantidad a que haciende la liquidación mencionada en el
punto anterior, dará derecho al  HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.  a cobrar ejecutivamente
la misma, para cuyo efecto servirá de título ejecutivo el presente documento y la liquidación que presente la entidad
indicada,  que formará  parte del mismo  renunciando para dicho efecto al fuero de mi domicilio y sujetándome a los
tribunales que fija el HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A. CUARTO: en fe de lo anterior, firmo
este documento como FIADOR SOLIDARIO DE. ${this.paciente.nombres} ${this.paciente.apellidos}
        `,
        2,
        altura,
        { maxWidth: 18 }
      )

      altura += 7
      this.pdf.text(
        `En la ciudad de Quetzaltenango, el dia ${dayText} del mes de ${month} de ${yearText}

                                            Quetzaltenango ${day} de ${month} de ${year}






______________________________________               ______________________________________

                   F) Paciente o responsable                                                        f) fiador



                       ${this.paciente.cui_encargado}                                                                          
______________________________________               ______________________________________

                             No. DPI                                                                                       No. DPI




 Direccion: ${this.paciente.direccion_encargado} - Tel: ${this.paciente.contacto_encargado} 
______________________________________               ______________________________________

                   Dirección y Teléfono                                                               Dirección y Teléfono
      `,
        2,
        altura,
        { maxWidth: 18 }
      )

      altura += 12
      this.pdf.text(
        `COMO NOTARIO DOY FE: que las firmas que anteceden son autenticas por haber sido puestas en mi presencia el
dia de hoy por ${this.paciente.nombre_encargado} con el Código Único de Identificación arriba indicadas y que los nombrados firman al pie de la presente, en la ciudad de Quetzaltenango, el dia ${dayText} del mes de ${month} de ${yearText}

ANTE MI


                                                                  F)_________________________                        `,
        2,
        altura,
        { maxWidth: 18 }
      )

      // Previsualización del PDF
      const pdfData = this.pdf.output('blob')
      const pdfURL = URL.createObjectURL(pdfData)
      this.previewURL = pdfURL
      this.$refs['modal-contrato'].show()
    },

    descargarpdf () {
      this.pdf.save(this.pdfName)
    },

    /* AREA SUMARIO */
    generarSumario (data) {
      axios.get(apiUrl + `/consumos/sumario/${data.id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.generarPdfSumario(data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPdfSumario (paciente) {
      const doc = new JsPDF('p', 'mm', 'letter')
      function dibujarRect (x, y, w, h) {
        doc.rect(x, y, w, h)
      }

      function dibujarLinea (x1, y1, x2, y2) {
        doc.line(x1, y1, x2, y2)
      }

      function escribirTexto (texto, x, y, size = 10, fontStyle = 'normal') {
        doc.setFontSize(size)
        doc.setFont('helvetica', fontStyle)
        doc.text(texto, x, y)
      }

      dibujarRect(10, 10, 200, 250)

      doc.addImage(logo, 'JPEG', 14, 10, 25, 20)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL Y CLINICA DE ESPECIALIDADES DE OCCIDENTE, S.A.', 120, 20, { align: 'center' })
      doc.text('QUETZALTENANGO', 120, 27, { align: 'center' })

      dibujarLinea(10, 30, 210, 30)

      let posY = 35

      escribirTexto('Apellidos:', 12, posY, 10, 'bold')
      escribirTexto(paciente.apellidos, 30, posY)
      escribirTexto('Nombres:', 80, posY, 10, 'bold')
      escribirTexto(paciente.nombres, 100, posY)
      escribirTexto('Exp:', 175, posY, 10, 'bold')
      escribirTexto(paciente.expediente, 185, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      escribirTexto('Dirección:', 12, posY, 10, 'bold')
      escribirTexto(paciente.direccion, 30, posY)
      escribirTexto('Tel:', 165, posY, 10, 'bold')
      escribirTexto(paciente.telefono, 175, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 5) Fecha Nac., Edad, Nacionalidad
      // -------------------------------------
      escribirTexto('Fecha Nacimiento:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nacimiento, 50, posY)
      escribirTexto('Edad:', 70, posY, 10, 'bold')
      escribirTexto(String(paciente.edad), 80, posY)
      escribirTexto('Lugar de Nacimiento:', 100, posY, 10, 'bold')
      escribirTexto(paciente.lugar_nacimiento, 140, posY)
      escribirTexto('Sexo:', 170, posY, 10, 'bold')
      escribirTexto(paciente.genero, 180, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // ----------------------------------------------
      // -----------------------------------------------
      escribirTexto('Estado Civil:', 12, posY, 10, 'bold')
      escribirTexto(paciente.estado_civil, 35, posY)
      escribirTexto('Ocupacion:', 60, posY, 10, 'bold')
      escribirTexto(paciente.profesion, 70, posY)
      escribirTexto('Nacionalidad', 110, posY, 10, 'bold')
      escribirTexto(paciente.nacionalidad, 135, posY)
      escribirTexto('CUI:', 170, posY, 10, 'bold')
      escribirTexto(paciente.cui, 180, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -----------------------------------------
      // -----------------------------------------

      escribirTexto('Nombre  de Conyugue:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nombre_conyuge, 40, posY)
      escribirTexto('Direccion:', 105, posY, 10, 'bold')
      escribirTexto(paciente.direccion_conyuge, 130, posY)
      escribirTexto('Tel:', 175, posY, 10, 'bold')
      escribirTexto(paciente.telefono_conyuge, 185, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Padre y Madre
      // -------------------------------------
      escribirTexto('Nombre del Padre:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nombre_padre, 50, posY)
      escribirTexto('Nombre de la Madre:', 120, posY, 10, 'bold')
      escribirTexto(paciente.nombre_madre, 160, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 10

      // ----------------------------------------------
      // -----------------------------------------------
      escribirTexto('En caso de emergencia notificar a:', 12, posY -= 6, 10, 'bold')
      escribirTexto(paciente.nombre_encargado, 12, posY += 8)
      escribirTexto('Parentesco:', 70, posY, 10, 'bold')
      escribirTexto(paciente.parentesco_encargado, 92, posY)
      escribirTexto('Direccion:', 118, posY, 10, 'bold')
      escribirTexto(paciente.direccion_encargado, 137, posY)
      escribirTexto('Tel:', 175, posY, 10, 'bold')
      escribirTexto(paciente.contacto_encargado, 185, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Teléfono
      // -------------------------------------
      escribirTexto('Otras Hospitalizaciones:', 12, posY, 10, 'bold')

      escribirTexto('Referido de:', 112, posY, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Data
      // -------------------------------------

      escribirTexto('Ingreso:', 12, posY, 10, 'bold')
      escribirTexto(paciente.fecha_ingreso_reciente, 30, posY)
      escribirTexto(String(paciente.hora_ingreso_reciente), 50, posY)
      escribirTexto('Engreso:', 80, posY, 10, 'bold')

      escribirTexto('Dias Estancia:', 160, posY, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 8) Diagnóstico
      // -------------------------------------
      escribirTexto('Diagnóstico de Impresión:', 12, posY, 10, 'bold')

      posY += 10
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 9) Diagnostico
      // -------------------------------------
      escribirTexto('Diagnóstico final: Enumero en orden de importacia', 12, posY, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 9) Diagnostico
      // -------------------------------------
      escribirTexto('Complicaciones:', 12, posY, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5
      // -------------------------------------
      // 9) Operaciones
      // -------------------------------------
      escribirTexto('Operaciones: Enumero en orden de importacia', 12, posY, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5
      // -------------------------------------
      // 10) Firma del Médico
      // -------------------------------------
      escribirTexto('Firma Médico Responsable:', 12, posY, 10, 'bold')
      posY += 15
      // Línea para firmar
      dibujarLinea(60, posY, 140, posY)

      // -------------------------------------
      // 11) Guardar el PDF
      // -------------------------------------
      doc.save(`Sumario_Paciente_${paciente.nombres}_${paciente.apellidos}.pdf`)
    },
    /* CUENTA TOTA */
    generarCuentaTotal (id, nombres, apellidos) {
      axios.get(apiUrl + `/consumos/sumario/${id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.nombrePaciente = nombres + ' ' + apellidos
          this.generarPDF_CuentaTotal(this.dataPDFsumario.fechaFormateada)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    async generarPDF_CuentaTotal (FechaIngreso) {
      const data = this.dataPDFsumario
      const fechaActual = new Date()
      const fechaFormateada = fechaActual.toLocaleDateString('es-ES')
      const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: true }
      const horaFormateada = fechaActual.toLocaleTimeString('es-ES', opcionesHora)

      let mensajeDias

      if (!FechaIngreso) {
        mensajeDias = 'NO ASIGNADA'
      } else {
        const fechaIngreso = new Date(FechaIngreso)
        const diferenciaMs = fechaActual - fechaIngreso
        const diasDiferencia = Math.floor(diferenciaMs / (1000 * 60 * 60 * 24))
        mensajeDias = diasDiferencia
      }

      let hospitalizacion

      if (mensajeDias >= 2) {
        hospitalizacion = data.costo2 * mensajeDias
      } else {
        hospitalizacion = data.costo1
      }

      try {
        const ConsumoTotal = data.consumos.reduce((acc, item) => acc + parseFloat(item.subtotal), 0)
        const ConsumoComunTotal = data.consumosComunes.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoMedicamentosTotal = data.consumosMedicamentos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ConsumoQuirurgicosTotal = data.consumosQuirurgicos.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const ExamenesTotal = data.examenes.reduce((acc, item) => acc + item.total, 0)
        const ServicioSalaOperacionesTotal = data.salaOperaciones.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const TotalHonorarios = data.honorarios.reduce((acc, item) => acc + parseFloat(item.total), 0)
        const medicosOrdenados = data.honorarios.sort((a, b) => b.total - a.total)

        const TotalGeneral =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ExamenesTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalGeneral2 =
          ConsumoTotal +
          ConsumoComunTotal +
          ConsumoMedicamentosTotal +
          ConsumoQuirurgicosTotal +
          ServicioSalaOperacionesTotal +
          hospitalizacion

        const TotalApagar = TotalGeneral2 + TotalHonorarios + ExamenesTotal

        const workbook = new ExcelJS.Workbook()
        const sheet = workbook.addWorksheet('Resumen')

        // Título
        sheet.mergeCells('A1:F1')
        sheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
        sheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' }

        sheet.mergeCells('A2:F2')
        sheet.getCell('A2').value = 'CUENTA PARCIAL'
        sheet.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' }

        // Información de paciente
        sheet.getCell('A3').value = 'NOMBRE DEL PACIENTE:'
        sheet.getCell('B3').value = `${this.nombrePaciente}`
        sheet.getCell('A4').value = 'CUARTO NO.:'
        sheet.getCell('B4').value = `${data.numerohabitacion}`
        sheet.getCell('A5').value = 'TIPO DE SERVICIO:'
        sheet.getCell('B5').value = ''
        sheet.getCell('A6').value = 'D/ESTANCIA:'
        sheet.getCell('B6').value = `${mensajeDias}`
        sheet.getCell('A7').value = 'MD TRATANTE:'
        sheet.getCell('B7').value = `${data.nombremedico}`

        // Tabla de consumos
        sheet.getCell('A9').value = 'CONSUMOS'
        sheet.getCell('A10').value = 'HOSPITALIZACION'
        sheet.getCell('B10').value = `${hospitalizacion.toFixed(2)}`
        sheet.getCell('A11').value = 'SALA DE OPERACIONES'
        sheet.getCell('B11').value = `Q${ServicioSalaOperacionesTotal.toFixed(2)}`
        sheet.getCell('A12').value = 'CONSUMO MEDICAMENTOS'
        let row2 = 12
        data.consumosMedicamentos.forEach((consumo) => {
          row2++
          sheet.getCell(`A${row2}`).value = `${consumo.medicamento.nombre}  Cantidad: ${parseFloat(consumo.cantidad).toFixed(0)}`
          sheet.getCell(`B${row2}`).value = parseFloat(consumo.total).toFixed(2)
        })
        row2++
        sheet.getCell(`A${row2}`).value = 'MATERIAL MEDICO QUIRÚRGICO'
        data.consumosQuirurgicos.forEach((consumo) => {
          row2++
          sheet.getCell(`A${row2}`).value = `${consumo.quirurgico.nombre}  Cantidad: ${parseFloat(consumo.cantidad).toFixed(0)}`
          sheet.getCell(`B${row2}`).value = parseFloat(consumo.total).toFixed(2)
        })
        row2++
        sheet.getCell(`A${row2}`).value = 'ANESTESICOS'
        sheet.getCell(`B${row2}`).value = ''
        row2++
        sheet.getCell(`A${row2}`).value = 'MATERIAL COMÚN'
        data.consumosComunes.forEach((consumo) => {
          row2++
          sheet.getCell(`A${row2}`).value = `${consumo.comune.nombre}  Cantidad: ${parseFloat(consumo.cantidad).toFixed(0)}`
          sheet.getCell(`B${row2}`).value = parseFloat(consumo.total).toFixed(2)
        })
        row2++
        sheet.getCell(`A${row2}`).value = 'SERVICIOS'
        data.consumos.forEach((consumo) => {
          row2++
          sheet.getCell(`A${row2}`).value = `${consumo.servicio.descripcion}  Cantidad: ${parseFloat(consumo.cantidad).toFixed(0)}`
          sheet.getCell(`B${row2}`).value = parseFloat(consumo.subtotal).toFixed(2)
        })
        row2++
        sheet.getCell(`A${row2}`).value = 'RECUPERACION'
        sheet.getCell(`B${row2}`).value = ''
        row2++
        sheet.getCell(`A${row2}`).value = 'INTENSIVO'
        sheet.getCell(`B${row2}`).value = 'Q 0.00'
        row2++
        sheet.getCell(`A${row2}`).value = 'EMERGENCIAS Medico Interno'
        sheet.getCell(`B${row2}`).value = ''
        row2++
        sheet.getCell(`A${row2}`).value = 'OTROS'
        sheet.getCell(`B${row2}`).value = ''
        row2++
        sheet.getCell(`A${row2}`).value = 'TOTAL HOSPITALIZACION ='
        sheet.getCell(`A${row2}`).alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell(`B${row2}`).value = `Q${TotalGeneral2.toFixed(2)}`
        row2++
        sheet.getCell(`A${row2}`).value = 'TOTAL LAB. BIOMEDICO E.O. S.A. ='
        sheet.getCell(`A${row2}`).alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell(`B${row2}`).value = `Q${ExamenesTotal.toFixed(2)}`
        row2++
        sheet.getCell(`A${row2}`).value = 'TOTAL MENOS DESCUENTO ='
        sheet.getCell(`A${row2}`).alignment = { horizontal: 'right', vertical: 'middle' }
        sheet.getCell(`B${row2}`).value = `Q${TotalGeneral.toFixed(2)}`

        // Fecha y hora debajo de la tabla
        row2++
        sheet.getCell(`A${row2}`).value = `FECHA: ${fechaFormateada} ${horaFormateada}`

        // Honorarios médicos
        row2++
        sheet.mergeCells(`A${row2}:D${row2}`)
        sheet.getCell(`A${row2}`).value = 'HONORARIOS MEDICOS Y OTROS SERVICIOS'
        sheet.getCell(`A${row2}`).alignment = { horizontal: 'center', vertical: 'middle' }
        sheet.getCell(`A${row2}`).font = { bold: true }

        let row = row2 + 1
        sheet.getCell(`A${row}`).value = '#'
        sheet.getCell(`B${row}`).value = 'MEDICO'
        sheet.getCell(`C${row}`).value = 'DESCRIPCION'
        sheet.getCell(`D${row}`).value = 'VALOR'

        medicosOrdenados.forEach((medico, index) => {
          row++
          sheet.getCell(`A${row}`).value = index + 1
          sheet.getCell(`B${row}`).value = medico.medico.nombre
          sheet.getCell(`C${row}`).value = medico.descripcion
          sheet.getCell(`D${row}`).value = `Q${(Number(medico.total) || 0).toFixed(2)}`
        })

        // Liquidación
        row += 2
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = 'LIQUIDACION'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }
        sheet.getCell(`A${row}`).font = { bold: true }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL HOSPITALIZACION ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalGeneral2) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL LAB. BIOMEDICO E.O. S.A. ='
        sheet.getCell(`B${row}`).value = `Q${(Number(ExamenesTotal) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL HONORARIOS MEDICOS Y OTROS SERVICIOS ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalHonorarios) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }

        row++
        sheet.getCell(`A${row}`).value = 'TOTAL A PAGAR ='
        sheet.getCell(`B${row}`).value = `Q${(Number(TotalApagar) || 0).toFixed(2)}`
        sheet.getCell(`A${row}`).alignment = { horizontal: 'right' }
        sheet.getCell(`B${row}`).alignment = { horizontal: 'left' }
        sheet.getCell(`A${row}`).font = { bold: true }
        sheet.getCell(`B${row}`).font = { bold: true }

        // Firma
        row++
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = '_______________________________________'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }

        row++
        sheet.mergeCells(`A${row}:D${row}`)
        sheet.getCell(`A${row}`).value = 'Nombre y Firma del Cajero'
        sheet.getCell(`A${row}`).alignment = { horizontal: 'center', vertical: 'middle' }

        // Guardar el archivo Excel
        const buffer = await workbook.xlsx.writeBuffer()
        const blob = new Blob([buffer], { type: 'application/octet-stream' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'CuentaTotal.xlsx'
        a.click()
        window.URL.revokeObjectURL(url)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    }
  }
}
</script>

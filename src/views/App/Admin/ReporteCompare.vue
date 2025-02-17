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
    <b-modal id="modal-pdf" ref="modal-pdf" title="Generar PDF" size="xl">
      <div id="previewContainer">
        <iframe :src="previewURL" width="100%" height="700px"></iframe>
      </div>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="descargarpdf()">Guardar</b-button>
        <b-button variant="danger" @click="closeModal('pdf')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-voucher" ref="modal-voucher" title="Crear Voucher">
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
        <b-form-group label="Seleccionar Medico">
          <v-select
            name="medico"
            v-model="selectedMedico"
            :options="medicos"
            :filterable="false"
            placeholder="Seleccione el médico"
            @search="onSearchDatosMedicos">

            <template v-slot:option="option">
              {{ option.nombre }}
            </template>
            <template slot="selected-option" slot-scope="option">
              {{ option.nombre }}
            </template>
          </v-select>
        </b-form-group>
        <b-form-group label="Cantidad:">
          <b-form-input
            disabled
            type="number"
            v-model="formVoucher.cantidad"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Cantidad en letras:">
          <b-form-input
            type="text"
            v-model="formVoucher.cantidadEscrita"
            placeholder="Ingresar la Cantidad escrita con Inicial Mayúscula"
          ></b-form-input>
        </b-form-group>
      </b-form>
      <template #modal-footer="{}">
        <b-button variant="primary" @click="crearVoucher()">Crear</b-button>
        <b-button variant="danger" @click="closeModal('save')">Cancelar</b-button>
      </template>
    </b-modal>
    <b-modal id="modal-1-account" ref="modal-1-account" title="Agregar cuenta">
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
        <b-form-group label="Fecha de ingreso:">
          <b-form-input
            type="date"
            v-model.trim="$v.form.fecha_ingreso.$model"
            :state="!$v.form.fecha_ingreso.$error"
            placeholder="Ingresar la fecha de ingreso"
          ></b-form-input>
          <div v-if="$v.form.fecha_ingreso.required.$invalid" class="invalid-feedback">
            Debe ingresar una fecha de ingreso
          </div>
        </b-form-group><b-form-group label="Motivo:">
          <b-form-input
            v-model.trim="$v.form.motivo.$model"
            :state="!$v.form.motivo.$error"
            placeholder="Ingresar motivo"
          ></b-form-input>
          <div v-if="$v.form.motivo.required.$invalid" class="invalid-feedback">
            Debe ingresar un motivo
          </div>
        </b-form-group>
        <b-form-group label="Descripción:">
          <b-form-input
            v-model.trim="$v.form.descripcion.$model"
            :state="!$v.form.descripcion.$error"
            placeholder="Ingresar descripción"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Otros:">
          <b-form-input
            v-model.trim="$v.form.otros.$model"
            :state="!$v.form.otros.$error"
            placeholder="Ingresar otros"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Expediente:">
          <v-select
            name="type"
            v-model="form.id_expediente"
            :state="!$v.form.id_expediente.$error"
            :options="expedientes"
            :filterable="false"
            placeholder="Seleccione el expediente"
            @search="onSearchExpedientes"
          />
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
    <b-modal id="modal-2-account" ref="modal-2-account" title="Editar cuenta">
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
        <b-form-group label="Nombre:"><b-form-group label="Fecha de ingreso:">
          <b-form-input
            type="date"
            v-model.trim="$v.form.fecha_ingreso.$model"
            :state="!$v.form.fecha_ingreso.$error"
            placeholder="Ingresar fecha de ingreso"
          ></b-form-input>
          <div v-if="$v.form.fecha_ingreso.required.$invalid" class="invalid-feedback">
            Debe ingresar una fecha válida
          </div>
        </b-form-group>
        <b-form-group label="Motivo:">
          <b-form-input
            v-model.trim="$v.form.motivo.$model"
            :state="!$v.form.motivo.$error"
            placeholder="Ingresar motivo"
          ></b-form-input>
          <div v-if="$v.form.motivo.required.$invalid" class="invalid-feedback">
            Debe ingresar un motivo
          </div>
        </b-form-group>
        <b-form-group label="Descripción:">
          <b-form-input
            v-model.trim="$v.form.descripcion.$model"
            :state="!$v.form.descripcion.$error"
            placeholder="Ingresar descripción"
          ></b-form-input>
        </b-form-group>
        <b-form-group label="Otros:">
          <b-form-input
            v-model.trim="$v.form.otros.$model"
            :state="!$v.form.otros.$error"
            placeholder="Ingresar otros"
          ></b-form-input>
        </b-form-group>
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
    <b-modal id="modal-3-enfermeria" ref="modal-3-enfermeria" title="Reportes en Enfermeria">
      <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Reportes</h4>
                <div>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 3" :options="reportOptionsEnfermeria" @change="onReportChange()"></b-form-select>
                </div>
                <div>
                <label for="example-datepicker">Fecha de inicio</label>
                <b-form-datepicker id="example-datepicker" v-model="startDateEnfermeria" class="mb-2"></b-form-datepicker>
              </div>
              <div>
                <label for="example-datepicker">Fecha fin</label>
                <b-form-datepicker id="example-datepicker" v-model="endDateEnfermeria" class="mb-2"></b-form-datepicker>
              </div>
              <div v-if="selectedReport != null">
                <b-button variant="primary">Descargar PDF</b-button>
                <b-button variant="primary">Descargar Excel</b-button>
              </div>
            </template>
    </b-modal>
    <b-modal id="modal-4-account" ref="modal-4-account" title="Activar cuenta">
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
        ¿Desea activar la cuenta: {{ form.numero }} ?
      </h6>
      <template #modal-footer="{}">
        <b-button
          type="submit"
          variant="primary"
          @click="onState()
                  $bvModal.hide('modal-4-account')"
          >Activar</b-button
        >
        <b-button variant="danger" @click="$bvModal.hide('modal-4-account')"
          >Cancelar</b-button
        >
      </template>
    </b-modal>
    <b-row>
      <b-col md="12">
        <iq-card>
            <template v-slot:headerTitle>
              <h4 class="card-title mt-3">Reportes</h4>
               <div>
                  <b-form-group label="Seleccione el área de la cual quiere generar su reporte" v-slot="{ ariaDescribedby }">
                    <b-form-radio-group
                      id="radio-group-2"
                      v-model="selectedArea"
                      :aria-describedby="ariaDescribedby"
                      name="radio-sub-component"
                      @change="selectedReport = null"
                    >
                      <b-form-radio value=1>Caja</b-form-radio>
                      <b-form-radio value=2>Farmacia</b-form-radio>
                      <b-form-radio value=3>Enfermería</b-form-radio>
                      <b-form-radio value=4>Médicos</b-form-radio>
                      <b-form-radio value=5>Pacientes</b-form-radio>
                    </b-form-radio-group>
                  </b-form-group>
               </div>
               <div>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 1" :options="reportOptionsCaja" @change="onReportChange()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 2" :options="reportOptionsFarmacia" @change="onReportChange()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 3" :options="reportOptionsEnfermeria" @change="onReportChange()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 4" :options="reportOptionsMedicos" @change="onReportChange()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 5" :options="reportOptionsPacientes" @change="onReportChange()"></b-form-select>
               </div>
               <div>
                <label for="start-date">Fecha de inicio</label>
                  <b-form-datepicker
                    id="start-date"
                    v-model="startDate"
                    placeholder="Seleccione la fecha de inicio"
                    @input="onStartDateChange"
                    class="mb-2"
                  ></b-form-datepicker>
                </div>
                <div>
                  <label for="end-date">Fecha de fin</label>
                  <b-form-datepicker
                    id="end-date"
                    v-model="endDate"
                    placeholder="Seleccione la fecha de fin"
                    @input="onEndDateChange"
                    class="mb-2"
                  ></b-form-datepicker>
                </div>
              <div v-if="selectedReport != null">
                <b-button variant="primary" @click="generarPDF">Generar PDF</b-button>
                <b-button variant="primary" @click="generarEXCEL">Descargar Excel</b-button>
              </div>
            </template>
          <template v-slot:headerAction>
          </template>
          <template v-slot:body>
            <b-table
                hover
                ref="reportTable"
                :items="reportItems"
                :fields="reportFields"
                :select-mode="'single'"
                selectable
              >
              </b-table>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import useVuelidate from '@vuelidate/core'
import { required } from '@vuelidate/validators'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import JsPDF from 'jspdf'
import 'jspdf-autotable'
import logo from '../../../assets/images/login/1.png'
import logoLab from '../../../assets/images/logo.png'
import moment from 'moment'
import ExcelJS from 'exceljs'

export default {
  name: 'CuentasPendientes',
  setup () {
    return { $v: useVuelidate() }
  },
  mounted () {
    xray.index()
    this.fetchExpedientes()
  },
  data () {
    return {
      pdf_select_caja: null,
      encabezado: {
        id: 0,
        fecha: null,
        nit: null,
        usuario: null,
        total: null
      },
      from: 0,
      pdf: new JsPDF(),
      pdfName: '',
      previewURL: '',
      reportItems: [],
      reportFields: [
        {
          key: 'total',
          label: 'Total',
          sortable: true
        }
      ],
      selectedReport: null,
      startDate: null,
      endDate: null,
      reportOptionsCaja: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte Caja 1' },
        { value: 2, text: 'Reporte Caja 2' },
        { value: 3, text: 'Reporte Caja 3' },
        { value: 4, text: 'Reporte Caja 4' }
      ],
      reportOptionsFarmacia: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte Productos Más Utilizados' },
        { value: 2, text: 'Reporte Proveedores Más Solicitados' },
        { value: 3, text: 'Reporte Inventario Detallado de Medicamentos' },
        { value: 4, text: 'Reporte Inventario General' },
        { value: 5, text: 'Reporte Suministro de Medicamentos a Pacientes' }
      ],
      reportOptionsEnfermeria: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte de pacientes que hubo en cada lugar' },
        { value: 2, text: 'Reporte de pacientes actuales en cada lugar' },
        { value: 3, text: 'Reporte de todos los pacientes por fechas' },
        { value: 4, text: 'Reporte de servicios más consumidos' },
        { value: 5, text: 'Reporte de medicamentos más consumidos' },
        { value: 6, text: 'Reporte de pacientes fallecidos' },
        { value: 7, text: 'Reporte de pacientes egresados' }
      ],
      reportOptionsMedicos: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte de honorarios médicos por fechas' },
        { value: 2, text: 'Reporte de médicos que más tienen honorarios por fechas y por día' },
        { value: 3, text: 'Generar voucher de honorarios de un médico en pdf' }
      ],
      reportOptionsPacientes: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte Pacientes 1' },
        { value: 2, text: 'Reporte Pacientes 2' },
        { value: 3, text: 'Reporte Pacientes 3' },
        { value: 4, text: 'Reporte Pacientes 4' }
      ],
      to: 0,
      total: 0,
      perPage: 5,
      search: '',
      selectedArea: 1,
      form: {
        id: 0,
        numero: 0,
        fecha_ingreso: '',
        motivo: '',
        descripcion: '',
        otros: '',
        total: 0,
        state: 1,
        id_expediente: 1
      },
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      apiBase: apiUrl + '/cuentas/list',
      fields: [
        {
          name: 'expediente.expediente',
          sortField: 'expediente.expediente',
          title: 'Expediente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.nombres',
          sortField: 'expediente.nombres',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Número',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      fieldsEnfermeria: [
        {
          name: 'expediente.nombres',
          sortField: 'expediente.nombres',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Número',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      fieldsCaja: [
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Número',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      fieldsMedicos: [
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Número',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      fieldsPacientes: [
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      fieldsFarmacia: [
        {
          name: 'expediente.expediente',
          sortField: 'expediente.expediente',
          title: 'Expediente',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.nombres',
          sortField: 'expediente.nombres',
          title: 'Nombre',
          dataClass: 'list-item-heading'
        },
        {
          name: 'expediente.apellidos',
          sortField: 'expediente.apellidos',
          title: 'Apellidos',
          dataClass: 'list-item-heading'
        },
        {
          name: 'numero',
          sortField: 'numero',
          title: 'Número',
          dataClass: 'list-item-heading'
        },
        {
          name: 'fecha_ingreso',
          sortField: 'fecha_ingreso',
          title: 'Fecha de ingreso',
          dataClass: 'list-item-heading'
        },
        {
          name: 'motivo',
          sortField: 'motivo',
          title: 'Motivo',
          dataClass: 'list-item-heading'
        },
        {
          name: 'descripcion',
          sortField: 'descripcion',
          title: 'Descripción',
          dataClass: 'list-item-heading'
        },
        {
          name: 'otros',
          sortField: 'otros',
          title: 'Otros...',
          dataClass: 'list-item-heading'
        },
        {
          name: 'total',
          sortField: 'total',
          title: 'Total',
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
      expedientes: [],
      // Farmcia
      pdf_select_farmacia: null,
      dataFarmacia: null,
      // Enfermeria
      pdf_select_enfermeria: null,
      dataEnfermeria1: null,
      startDateEnfermeria: null,
      endDateEnfermeria: null,
      // MEDICOS
      pdf_select_medicos: null,
      fechaActual: null,
      numero_voucher: null,
      dataMedicos: null,
      selectedMedico: null,
      medicos: [],
      pacientes: [],
      formVoucher: {
        id_paciente: null,
        medico: null,
        cantidad: null,
        cantidadEscrita: null
      }
    }
  },
  validations () {
    return {
      form: {
        fecha_ingreso: { required },
        descripcion: { required },
        motivo: { required },
        otros: { required },
        total: { required },
        id_expediente: { required },
        state: { required }
      }
    }
  },
  watch: {
    selectedMedico (newValue) {
      console.log(newValue)
      if (newValue) {
        this.agregarPacientes(newValue)
      } else {
        this.pacientes = []
        this.formVoucher.cantidad = 0
        console.log('Ningun medico seleccionado, pacientes limpiados')
      }
    }
  },
  computed: {
    fieldsToDisplay () {
      switch (this.selectedArea) {
        case 3:
          return this.fieldsEnfermeria
        case 4:
          return this.fieldsMedicos
        case 5:
          return this.fieldsPacientes
        case 1:
          return this.fieldsCaja
        case 2:
          return this.fieldsFarmacia
        default:
          return this.fields
      }
    }
  },
  methods: {
    onReportChange () {
      if (!this.startDate || !this.endDate) {
        alert('Por favor, seleccione las fechas antes de continuar.')
        this.selectedReport = null
        return
      }
      if (this.selectedArea === '1') {
        this.incomeByDate()
        this.pdf_select_caja = 1
        this.modPdf(1)
      }
      if (this.selectedArea === '2') {
        switch (this.selectedReport) {
          case 1:
            this.primerReporteFarmacia(this.startDate, this.endDate)
            this.pdf_select_farmacia = 1
            return
          case 2:
            this.segundoReporteFarmacia(this.startDate, this.endDate)
            this.pdf_select_farmacia = 2
            return
          case 3:
            this.tercerReporteFarmacia(this.startDate, this.endDate)
            this.pdf_select_farmacia = 3
            return
          case 4:
            this.cuartoReporteFarmacia(this.startDate, this.endDate)
            this.pdf_select_farmacia = 4
            return
          case 5:
            this.quintoReporteFarmacia(this.startDate, this.endDate)
            this.pdf_select_farmacia = 5
        }
      }
      if (this.selectedArea === '3') {
        switch (this.selectedReport) {
          case 1:
            this.primerReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 1
            return
          case 2:
            this.segundoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 2
            return
          case 3:
            this.tercerReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 3
            return
          case 4:
            this.cuartoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 4
            return
          case 5:
            this.quintoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 5
            return
          case 6:
            this.sextoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 6
            return
          case 7:
            this.septimoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select_enfermeria = 7
        }
      }
      if (this.selectedArea === '4') {
        switch (this.selectedReport) {
          case 1:
            this.primerReporteMedicos(this.startDate, this.endDate)
            this.pdf_select_medicos = 1
            return
          case 2:
            this.segundoReporteMedicos(this.startDate, this.endDate)
            this.pdf_select_medicos = 2
            return
          case 3:
            // this.tercerReporteMedicos(this.startDate, this.endDate)
            this.$refs['modal-voucher'].show()
            this.pdf_select_medicos = 3
            this.selectedReport = null
        }
      }
      this.$nextTick(() => {
        this.$refs.reportTable.refresh()
      })
    },
    openModal (modal, action) {
      switch (modal) {
        case 'save': {
          this.$v.$reset()
          this.form.id = 0
          this.form.fecha_ingreso = ''
          this.form.descripcion = ''
          this.form.motivo = ''
          this.form.otros = ''
          this.form.total = 0
          this.form.id_expediente = 1
          this.form.state = 1
          break
        }
      }
    },
    modPdf (type) {
      this.$refs['modal-pdf'].show()
      var altura = 1
      var ahora = new Date()
      this.encabezado.id = type === 1 ? 1 : null
      this.encabezado.fecha = new Date().toLocaleDateString('es-us', ahora)
      this.pdf = new JsPDF({
        unit: 'cm',
        format: [14, 21.5],
        orientation: 'landscape'
      })
      var ingreso = moment(ahora).format('DD/MM/YYYY')
      var imgData = logoLab
      this.pdf.addImage(imgData, 'PNG', 1.5, 0.2, 4.37, 4)
      this.pdf.setFontSize(10).setFont(undefined, 'bold')
      this.pdf.text('Laboratorio Biomédico S.A.', 1.5, 4)
      if (type === 1) {
        // this.pdf.text('Detalle de cuenta ' + data.numero + ' - Paciente: ' + data.expediente.nombres + ' ' + data.expediente.apellidos, 7, altura)
        this.pdfName = 'DetalleCuenta.pdf'
        altura = altura + 0.5
        // this.pdf.text('Total: ' + data.total, 7, altura)
        altura = altura + 0.5
        // this.pdf.text('Total pagado: ' + data.total_pagado, 7, altura)
        altura = altura + 0.5
        // this.pdf.text('Pendiente de pago: ' + data.pendiente_de_pago, 7, altura)
      } /*  else {
         this.pdf.text('Ingresos del día ' + this.selectedDate, 7, altura)
         this.pdfName = 'Ingresos' + this.selectedDate + '.pdf'
      } */
      // Encabezado
      altura = altura + 0.5
      this.pdf.text('Fecha de generación: ' + ingreso, 7, altura)
      altura = altura + 0.5
      this.pdf.text('Informe generado por: ', 7, altura)
      this.pdf.setFontSize(10).setFont(undefined, 'normal')
      // this.pdf.text(this.currentUser.user, 10.75, altura)
      altura = altura + 0.5
      // Tabla
      if (type === 1) {
        this.pdf.autoTable(this.pdf, {
          columns: [{ header: 'Cuenta', dataKey: 'numero_cuenta' }, { header: 'total', dataKey: 'total' }, { header: 'expediente', dataKey: 'expediente.expediente' }],
          body: this.reportItems,
          margin: { top: 5 },
          headStyles: {
            fillColor: [21, 21, 21],
            textColor: [225, 225, 225],
            fontStyle: 'bold'
          }
        })
      } else {
        this.pdf.autoTable(this.pdf, {
          columns: [{ header: 'Expediente', dataKey: 'expediente' }, { header: 'Nombre', dataKey: 'nombres' }, { header: 'Apellido', dataKey: 'apellidos' }, { header: 'Cuenta número', dataKey: 'numero' }, { header: 'Total', dataKey: 'total' }],
          body: this.reportItems,
          margin: { top: 5 },
          headStyles: {
            fillColor: [21, 21, 21],
            textColor: [225, 225, 225],
            fontStyle: 'bold'
          }
        })
      }
      var pdfData = this.pdf.output('blob')
      // Convert PDF to data URL
      var pdfURL = URL.createObjectURL(pdfData)
      this.previewURL = pdfURL
    },
    descargarpdf () {
      this.pdf.save(this.pdfName)
    },
    async incomeByDate () {
      let res = await axios.get(apiUrl + '/reporte/ingresosFechas', {
        params: {
          fecha_inicio: '12/12/2012',
          fecha_final: '12/12/2024'
        }
      })
      this.reportItems = res.data
      console.log(this.reportItems)
      this.$refs.reportTable.refresh()
    },
    closeModal (action) {
      switch (action) {
        case 'save': {
          this.$v.$reset()
          this.$refs['modal-1-account'].hide()
          this.form.id = 0
          this.form.fecha_ingreso = ''
          this.form.descripcion = ''
          this.form.motivo = ''
          this.form.otros = ''
          this.form.total = 0
          this.form.id_expediente = 1
          this.form.state = 1
          this.$refs['modal-voucher'].hide()
          this.formVoucher.medico = null
          this.formVoucher.cantidad = null
          this.selectedReport = null
          this.selectedReport = null
          this.medicos = []
          this.pacientes = []
          this.dataMedicos = null
          this.selectedMedico = null
          this.formVoucher.cantidadEscrita = null
          break
        }
        case 'update': {
          this.$v.$reset()
          this.$refs['modal-2-account'].hide()
          this.form.id = 0
          this.form.fecha_ingreso = ''
          this.form.descripcion = ''
          this.form.motivo = ''
          this.form.otros = ''
          this.form.total = 0
          this.form.id_expediente = 1
          this.form.state = 1
          break
        }
      }
    },
    async incomeByDay () {
      let res = await axios.get(apiUrl + '/reporte/ingresosDia', {
        params: {
          fecha: '08/12/2012'
        }
      })
      this.reportItems = res.data
      console.log(this.reportItems)
      this.$refs.reportTable.refresh()
    },
    showAlert () {
      this.alertCountDown = this.alertSecs
    },
    showAlertError () {
      this.alertC.ountDownError = this.alertSecs
    },
    onSearchExpedientes (search, loading) {
      if (search.length) {
        loading(true)
        this.searchingExpedientes(search, loading)
      }
    },
    searchingExpedientes (search, loading) {
      axios.get(apiUrl + '/expedientes/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.expedientes = response.data
        loading(false)
      })
    },
    generarPDF () {
      switch (this.pdf_select_caja) {
        case 1:
          this.modPdf(1)
          break
      }

      switch (this.pdf_select_farmacia) {
        case 1:
          this.generarPDFFarmacia()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 2:
          this.generarPDFFarmacia2()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 3:
          this.generarPDFFarmacia3()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 4:
          this.generarPDFFarmacia4()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 5:
          this.generarPDFFarmacia5()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
      }

      switch (this.pdf_select_enfermeria) {
        case 1:
          this.generarPDFPacientes()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 2:
          this.generarPDFPacientes2()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 3:
          this.generarPDFPacientes3()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 4:
          this.generarPDFPacientes4()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 5:
          this.generarPDFPacientes5()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 6:
          this.generarPDFPacientes6()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
        case 7:
          this.generarPDFPacientes7()
          this.selectedReport = null
          this.pdf_select_enfermeria = null
          break
      }

      switch (this.pdf_select_medicos) {
        case 1:
          this.generarPDFMedicos()
          this.selectedReport = null
          this.pdf_select_medicos = null
          break
        case 2:
          this.generarPDFMedicos2()
          this.selectedReport = null
          this.pdf_select_medicos = null
          break
        case 3:
          this.generarPDFMedicos3()
          this.selectedReport = null
          this.pdf_select_medicos = null
          break
      }
    },
    generarEXCEL () {
      switch (this.pdf_select_farmacia) {
        case 1:
          this.generarExcelEnfermeria()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 2:
          this.generarExcelEnfermeria2()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 3:
          this.generarExcelEnfermeria3()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 4:
          this.generarExcelEnfermeria4()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
        case 5:
          this.generarExcelEnfermeria5()
          this.selectedReport = null
          this.pdf_select_farmacia = null
          break
      }

      switch (this.pdf_select_enfermeria) {
        case 1:
          this.generarExcelPacientes()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 2:
          this.generarExcelPacientes2()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 3:
          this.generarExcelPacientes3()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 4:
          this.generarExcelPacientes4()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 5:
          this.generarExcelPacientes5()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 6:
          this.generarExcelPacientes6()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 7:
          this.generarExcelPacientes7()
          this.selectedReport = null
          this.selectedReport = null
          break
      }
      switch (this.pdf_select_medicos) {
        case 1:
          this.generarExcelMedicos()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 2:
          this.generarExcelMedicos2()
          this.selectedReport = null
          this.selectedReport = null
          break
        case 3:
          this.generarExcelMedicos3()
          this.selectedReport = null
          break
      }
    },

    /* FARMACIA REPORTES */
    primerReporteFarmacia (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/farmacia/productosMasUtilizados',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataFarmacia = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFFarmacia () {
      const {
        comunMasConsumido,
        comunes,
        medicamentoMasConsumido,
        medicamentos,
        quirurgicosMasConsumido,
        quirurgicos
      } = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Reporte de Productos Más Utilizados', 105, 50, { align: 'center' })
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 56, { align: 'center' })

      // Material común más consumido
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Material Común Más Utilizado', 14, 80)
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Nombre: ${comunMasConsumido.nombre}`, 14, 90)
      doc.text(`Precio Unitario: Q${comunMasConsumido.precio_unitario}`, 14, 96)
      doc.text(`Cantidad: ${comunMasConsumido.cantidad_total}`, 14, 102)

      // Detalle de consumos: Material común
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Consumo - Material Común', 14, 112)
      doc.autoTable({
        head: [['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida']],
        body: comunes.map((item, index) => [
          index + 1,
          item.nombre,
          `Q${item.precio_unitario}`,
          item.cantidad_total
        ]),
        startY: 118,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      // Detalle de consumos: Medicamentos
      doc.addPage()
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Medicamento Más Utilizado', 14, 20)
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Nombre: ${medicamentoMasConsumido.nombre}`, 14, 30)
      doc.text(`Precio Unitario: Q${medicamentoMasConsumido.precio_unitario}`, 14, 36)
      doc.text(`Cantidad: ${medicamentoMasConsumido.cantidad_total}`, 14, 42)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Consumo - Medicamentos', 14, 52)
      doc.autoTable({
        head: [['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida']],
        body: medicamentos.map((item, index) => [
          index + 1,
          item.nombre,
          `Q${item.precio_unitario}`,
          item.cantidad_total
        ]),
        startY: 58,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      // Detalle de consumos: Material quirúrgico
      doc.addPage()
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Material Quirúrgico Más Utilizado', 14, 20)
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Nombre: ${quirurgicosMasConsumido.nombre}`, 14, 30)
      doc.text(`Precio Unitario: Q${quirurgicosMasConsumido.precio_unitario}`, 14, 36)
      doc.text(`Cantidad: ${quirurgicosMasConsumido.cantidad_total}`, 14, 42)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Consumo - Material Quirúrgico', 14, 52)
      doc.autoTable({
        head: [['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida']],
        body: quirurgicos.map((item, index) => [
          index + 1,
          item.nombre,
          `Q${item.precio_unitario}`,
          item.cantidad_total
        ]),
        startY: 58,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Reporte_Productos_Mas_Utilizados_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.pdf`)
    },
    generarExcelEnfermeria () {
      const {
        comunMasConsumido,
        comunes,
        medicamentoMasConsumido,
        medicamentos,
        quirurgicosMasConsumido,
        quirurgicos
      } = this.dataFarmacia

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      // Crear un nuevo workbook
      const workbook = new ExcelJS.Workbook()

      // Hoja de "Material Común"
      const hojaComunes = workbook.addWorksheet('Material Común')
      hojaComunes.addRow(['HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'])
      hojaComunes.addRow(['Reporte de Productos Más Utilizados'])
      hojaComunes.addRow([`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`])
      hojaComunes.addRow([])
      hojaComunes.addRow(['Material Común Más Utilizado'])
      hojaComunes.addRow(['Nombre', 'Precio Unitario', 'Cantidad Total'])
      hojaComunes.addRow([comunMasConsumido.nombre, comunMasConsumido.precio_unitario, comunMasConsumido.cantidad_total])
      hojaComunes.addRow([])
      hojaComunes.addRow(['Detalle de Consumo - Material Común'])
      hojaComunes.addRow(['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida'])
      comunes.forEach((item, index) => {
        hojaComunes.addRow([index + 1, item.nombre, item.precio_unitario, item.cantidad_total])
      })

      // Hoja de "Medicamentos"
      const hojaMedicamentos = workbook.addWorksheet('Medicamentos')
      hojaMedicamentos.addRow(['HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'])
      hojaMedicamentos.addRow(['Reporte de Productos Más Utilizados'])
      hojaMedicamentos.addRow([`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`])
      hojaMedicamentos.addRow([])
      hojaMedicamentos.addRow(['Medicamento Más Utilizado'])
      hojaMedicamentos.addRow(['Nombre', 'Precio Unitario', 'Cantidad Total'])
      hojaMedicamentos.addRow([medicamentoMasConsumido.nombre, medicamentoMasConsumido.precio_unitario, medicamentoMasConsumido.cantidad_total])
      hojaMedicamentos.addRow([])
      hojaMedicamentos.addRow(['Detalle de Consumo - Medicamentos'])
      hojaMedicamentos.addRow(['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida'])
      medicamentos.forEach((item, index) => {
        hojaMedicamentos.addRow([index + 1, item.nombre, item.precio_unitario, item.cantidad_total])
      })

      // Hoja de "Material Quirúrgico"
      const hojaQuirurgicos = workbook.addWorksheet('Material Quirúrgico')
      hojaQuirurgicos.addRow(['HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'])
      hojaQuirurgicos.addRow(['Reporte de Productos Más Utilizados'])
      hojaQuirurgicos.addRow([`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`])
      hojaQuirurgicos.addRow([])
      hojaQuirurgicos.addRow(['Material Quirúrgico Más Utilizado'])
      hojaQuirurgicos.addRow(['Nombre', 'Precio Unitario', 'Cantidad Total'])
      hojaQuirurgicos.addRow([quirurgicosMasConsumido.nombre, quirurgicosMasConsumido.precio_unitario, quirurgicosMasConsumido.cantidad_total])
      hojaQuirurgicos.addRow([])
      hojaQuirurgicos.addRow(['Detalle de Consumo - Material Quirúrgico'])
      hojaQuirurgicos.addRow(['#', 'Nombre', 'Precio Unitario', 'Cantidad Vendida'])
      quirurgicos.forEach((item, index) => {
        hojaQuirurgicos.addRow([index + 1, item.nombre, item.precio_unitario, item.cantidad_total])
      })

      // Guardar el archivo
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `Reporte_Productos_Mas_Utilizados_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.xlsx`
        a.click()
        window.URL.revokeObjectURL(url)
      })
    },

    segundoReporteFarmacia (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/farmacia/proveedores',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataFarmacia = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFFarmacia2 () {
      const {
        proveedorMasSolicitado,
        resultado
      } = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Reporte Proveedores más solicitados', 105, 50, { align: 'center' })
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 56, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Proveedor Más Solicitado', 14, 80)
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Nombre: ${proveedorMasSolicitado.nombre}`, 14, 90)
      doc.text(`Representante: ${proveedorMasSolicitado.representante}`, 14, 96)
      doc.text(`Telefono: ${proveedorMasSolicitado.telefono}`, 14, 102)

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Proveedores', 14, 112)
      doc.autoTable({
        head: [['#', 'Nombre', 'Representante', 'Numero de Telefono']],
        body: resultado.map((item, index) => [
          index + 1,
          item.nombre,
          item.representante,
          item.telefono
        ]),
        startY: 118,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Reporte_Proveedores_Mas_Solicitados_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.pdf`)
    },
    async generarExcelEnfermeria2 () {
      const {
        proveedorMasSolicitado,
        resultado
      } = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Proveedores Más Solicitados')

      // Encabezado
      worksheet.mergeCells('A1:D1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 14 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:D2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:D3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:D5')
      worksheet.getCell('A5').value = 'Reporte Proveedores Más Solicitados'
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }
      worksheet.mergeCells('A6:D6')
      worksheet.getCell('A6').value = `Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      // Proveedor Más Solicitado
      worksheet.addRow([])
      worksheet.addRow(['Proveedor Más Solicitado'])
      worksheet.getCell('A8').font = { bold: true, size: 12 }
      worksheet.addRow([`Nombre: ${proveedorMasSolicitado.nombre}`])
      worksheet.addRow([`Representante: ${proveedorMasSolicitado.representante}`])
      worksheet.addRow([`Teléfono: ${proveedorMasSolicitado.telefono}`])

      // Detalle de Consumos
      worksheet.addRow([])
      worksheet.addRow(['Detalle de Proveedores'])
      worksheet.getCell('A12').font = { bold: true, size: 12 }

      // Agregar encabezados de la tabla
      const headerRow = worksheet.addRow(['#', 'Nombre', 'Representante', 'Número de Teléfono'])
      headerRow.font = { bold: true }
      headerRow.alignment = { horizontal: 'center' }

      // Agregar filas con los datos
      resultado.forEach((item, index) => {
        worksheet.addRow([index + 1, item.nombre, item.representante, item.telefono])
      })

      // Aplicar estilo a las columnas
      worksheet.columns = [
        { key: 'numero', width: 5 },
        { key: 'nombre', width: 25 },
        { key: 'representante', width: 25 },
        { key: 'telefono', width: 15 }
      ]

      // Guardar el archivo Excel
      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const fileName = `Reporte_Proveedores_Mas_Solicitados_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.xlsx`

      // Descargar el archivo
      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    tercerReporteFarmacia (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/farmacia/inventarioMedicina',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataFarmacia = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFFarmacia3 () {
      const medicamentos = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      let medicamentosArray = []
      for (let key in medicamentos) {
        if (Array.isArray(medicamentos[key])) {
          medicamentosArray = medicamentosArray.concat(medicamentos[key])
        }
      }

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Inventario de todas las medicinas', 105, 50, { align: 'center' })
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 56, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Inventario Medicamentos', 14, 80)
      doc.autoTable({
        head: [['#', 'Nombre Medicamento', 'Marca', 'Precio Costo', 'Precio Venta', 'Exist. Actual', 'Exist. Qirofano', 'Exist. Farmacia']],
        body: medicamentosArray.map((item, index) => [
          index + 1,
          item.nombre_medicamento,
          item.marca,
          `Q${item.precio_costo}`,
          `Q${item.precio_venta}`,
          item.existencia_actual,
          item.existencia_actual_quirofano,
          item.existencia_actual_farmacia
        ]),
        startY: 86,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Reporte_Productos_Mas_Utilizados_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.pdf`)
    },
    async generarExcelEnfermeria3 () {
      const medicamentos = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      let medicamentosArray = []
      for (let key in medicamentos) {
        if (Array.isArray(medicamentos[key])) {
          medicamentosArray = medicamentosArray.concat(medicamentos[key])
        }
      }

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Inventario Medicamentos')

      // Encabezado del documento
      worksheet.mergeCells('A1:H1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 14 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:H2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:H3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').alignment = { horizontal: 'center' }
      worksheet.mergeCells('A5:H5')
      worksheet.getCell('A5').value = 'Inventario de todas las medicinas'
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:H6')
      worksheet.getCell('A6').value = `Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.addRow([])
      worksheet.addRow(['Detalle de Inventario Medicamentos'])
      worksheet.getCell('A8').font = { bold: true, size: 12 }

      const headerRow = worksheet.addRow([
        '#',
        'Nombre Medicamento',
        'Marca',
        'Precio Costo',
        'Precio Venta',
        'Exist. Actual',
        'Exist. Quirófano',
        'Exist. Farmacia'
      ])
      headerRow.font = { bold: true }
      headerRow.alignment = { horizontal: 'center' }

      medicamentosArray.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.nombre_medicamento,
          item.marca,
          `Q${item.precio_costo.toFixed(2)}`,
          `Q${item.precio_venta.toFixed(2)}`,
          item.existencia_actual,
          item.existencia_actual_quirofano,
          item.existencia_actual_farmacia
        ])
      })

      worksheet.columns = [
        { key: 'indice', width: 5 },
        { key: 'nombre_medicamento', width: 30 },
        { key: 'marca', width: 20 },
        { key: 'precio_costo', width: 15 },
        { key: 'precio_venta', width: 15 },
        { key: 'existencia_actual', width: 15 },
        { key: 'existencia_actual_quirofano', width: 20 },
        { key: 'existencia_actual_farmacia', width: 20 }
      ]

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const fileName = `Reporte_Inventario_Medicamentos_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.xlsx`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    cuartoReporteFarmacia (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/farmacia/iventarioGeneral',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataFarmacia = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFFarmacia4 () {
      const {
        comunes,
        medicamentos,
        quirurgicos
      } = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Inventario General', 105, 50, { align: 'center' })
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 56, { align: 'center' })

      // Detalle de consumos: Material común
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Inventario - Material Común', 14, 112)
      doc.autoTable({
        head: [['#', 'Nombre', 'Marca', 'existencia_actual']],
        body: comunes.map((item, index) => [
          index + 1,
          item.nombre,
          item.marca,
          item.existencia_actual
        ]),
        startY: 118,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      // Detalle de consumos: Medicamentos
      doc.addPage()
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Inventario - Medicamentos', 14, 20)
      doc.autoTable({
        head: [['#', 'Nombre', 'Marca', 'existencia_actual']],
        body: medicamentos.map((item, index) => [
          index + 1,
          item.nombre,
          item.marca,
          item.existencia_actual
        ]),
        startY: 26,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      // Detalle de consumos: Material quirúrgico
      doc.addPage()
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Detalle de Inventario - Material Quirúrgico', 14, 20)
      doc.autoTable({
        head: [['#', 'Nombre', 'Marca', 'existencia_actual']],
        body: quirurgicos.map((item, index) => [
          index + 1,
          item.nombre,
          item.marca,
          item.existencia_actual
        ]),
        startY: 26,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Inventario_General_Comunes_Medicamentos_Quirurgicos_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.pdf`)
    },
    async generarExcelEnfermeria4 () {
      const { comunes, medicamentos, quirurgicos } = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const workbook = new ExcelJS.Workbook()
      function agregarHoja (worksheetName, data, columns) {
        const worksheet = workbook.addWorksheet(worksheetName)
        worksheet.mergeCells('A1:D1')
        worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
        worksheet.getCell('A1').font = { bold: true, size: 14 }
        worksheet.getCell('A1').alignment = { horizontal: 'center' }

        worksheet.mergeCells('A2:D2')
        worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
        worksheet.getCell('A2').alignment = { horizontal: 'center' }

        worksheet.mergeCells('A3:D3')
        worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
        worksheet.getCell('A3').alignment = { horizontal: 'center' }

        worksheet.mergeCells('A5:D5')
        worksheet.getCell('A5').value = `Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`
        worksheet.getCell('A5').alignment = { horizontal: 'center' }

        worksheet.addRow([])
        worksheet.addRow(columns.map(col => col.header)).font = { bold: true }
        data.forEach((item, index) => {
          const row = [index + 1]
          columns.slice(1).forEach(col => {
            row.push(item[col.key])
          })
          worksheet.addRow(row)
        })
        worksheet.columns = columns.map(col => ({ key: col.key, width: col.width }))
      }

      agregarHoja('Material Común', comunes, [
        { header: '#', key: 'index', width: 5 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Existencia Actual', key: 'existencia_actual', width: 20 }
      ])

      agregarHoja('Medicamentos', medicamentos, [
        { header: '#', key: 'index', width: 5 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Existencia Actual', key: 'existencia_actual', width: 20 }
      ])

      agregarHoja('Material Quirúrgico', quirurgicos, [
        { header: '#', key: 'index', width: 5 },
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Marca', key: 'marca', width: 20 },
        { header: 'Existencia Actual', key: 'existencia_actual', width: 20 }
      ])

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const fileName = `Inventario_General_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.xlsx`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    quintoReporteFarmacia (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/farmacia/suministroMedicamentos',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataFarmacia = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFFarmacia5 () {
      const medicamentos = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      let medicamentosArray = []
      for (let key in medicamentos) {
        if (Array.isArray(medicamentos[key])) {
          medicamentosArray = medicamentosArray.concat(medicamentos[key])
        }
      }

      // Encabezado
      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('Suministro de Medicamentos a Pacientes', 105, 50, { align: 'center' })
      doc.setFontSize(12).setFont(undefined, 'normal')
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 56, { align: 'center' })

      doc.autoTable({
        head: [['#', 'Nombre Medicamento', 'Cantidad Suministrada', 'Nombre Paciente', 'Expediente', 'Administracion']],
        body: medicamentosArray.map((item, index) => [
          index + 1,
          item.nombre_medicamento,
          item.cantidad_total,
          item.paciente,
          item.cui,
          new Date(item.fecha).toLocaleDateString()
        ]),
        startY: 80,
        theme: 'grid',
        styles: { fontSize: 10, cellPadding: 2 },
        headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [240, 240, 240] }
      })

      doc.save(`Suministro_medicamentos_a_pacientes_de_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.pdf`)
    },
    async generarExcelEnfermeria5 () {
      const medicamentos = this.dataFarmacia
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      let medicamentosArray = []
      for (let key in medicamentos) {
        if (Array.isArray(medicamentos[key])) {
          medicamentosArray = medicamentosArray.concat(medicamentos[key])
        }
      }

      // Crear un nuevo libro de trabajo
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Inventario Medicamentos')

      // Encabezado del documento
      worksheet.mergeCells('A1:H1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 14 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:H2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:H3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').alignment = { horizontal: 'center' }
      worksheet.mergeCells('A5:H5')
      worksheet.getCell('A5').value = 'Inventario de todas las medicinas'
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:H6')
      worksheet.getCell('A6').value = `Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.addRow([])
      worksheet.addRow(['Detalle de Inventario Medicamentos'])
      worksheet.getCell('A8').font = { bold: true, size: 12 }

      const headerRow = worksheet.addRow([
        '#',
        'Nombre Medicamento',
        'Cantidad Suministrada',
        'Nombre Paciente',
        'Expediente',
        'Administracion'
      ])
      headerRow.font = { bold: true }
      headerRow.alignment = { horizontal: 'center' }

      medicamentosArray.forEach((item, index) => {
        worksheet.addRow([
          index + 1,
          item.nombre_medicamento,
          item.cantidad_total,
          item.paciente,
          item.cui,
          new Date(item.fecha).toLocaleDateString()
        ])
      })

      worksheet.columns = [
        { key: 'indice', width: 5 },
        { key: 'nombre_medicamento', width: 30 },
        { key: 'marca', width: 20 },
        { key: 'precio_costo', width: 15 },
        { key: 'precio_venta', width: 15 },
        { key: 'existencia_actual', width: 15 },
        { key: 'existencia_actual_quirofano', width: 20 },
        { key: 'existencia_actual_farmacia', width: 20 }
      ]

      const buffer = await workbook.xlsx.writeBuffer()
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })

      const fileName = `Reporte_Inventario_Medicamentos_${moment(fechaInicio).format('YYYY-MM-DD')}_a_${moment(fechaFin).format('YYYY-MM-DD')}.xlsx`

      const link = document.createElement('a')
      link.href = URL.createObjectURL(blob)
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    },

    /* ENFERMERIA REPORTES */
    primerReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/pacientesLugar',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes () {
      const data = this.dataEnfermeria1
      const detalles = data.detalles
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const doc = new JsPDF()

      doc.addImage(logo, 'JPEG', 14, 10, 30, 25)

      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

      doc.setFontSize(14)
      doc.text('Reporte de Pacientes por lugar', 105, 50, { align: 'center' })
      doc.setFontSize(12)
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 60, { align: 'center' })

      let currentY = 75
      for (const lugar in detalles) {
        if (detalles.hasOwnProperty(lugar)) {
          const pacientes = detalles[lugar]
          if (pacientes.length > 0) {
            doc.setFontSize(12)
            doc.text(`PACIENTES EN ${lugar.toUpperCase()} \t\t Total: ${pacientes.length}`, 14, currentY)
            const tableColumn = ['Nombre', 'Apellidos', 'CUI', 'Fecha', 'Lugar']
            const tableRows = []
            pacientes.forEach((paciente) => {
              tableRows.push([
                paciente.nombres || 'N/A',
                paciente.apellidos || 'N/A',
                paciente.cui || 'N/A',
                new Date(paciente.fecha).toLocaleDateString() || 'N/A',
                lugar || 'N/A'
              ])
            })
            doc.autoTable({
              head: [tableColumn],
              body: tableRows,
              startY: currentY + 5,
              theme: 'grid',
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [240, 240, 240] }
            })

            currentY = doc.lastAutoTable.finalY + 10
          }
        }
      }

      doc.save(`Reporte_Pacientes_${fechaInicio}_a_${fechaFin}.pdf`)
    },
    generarExcelPacientes () {
      const dataEnfermeria = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Pacientes Hubo en cada Lugar')

      worksheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 30 },
        { header: 'Apellidos', key: 'apellidos', width: 30 },
        { header: 'CUI', key: 'cui', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Lugar', key: 'lugar', width: 25 }
      ]
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Pacientes que Hubo en cada Lugar de la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 7

      this.procesarDetalles(dataEnfermeria.detalles).then((rows) => {
        Object.keys(dataEnfermeria.detalles).forEach((lugar) => {
          const pacientes = dataEnfermeria.detalles[lugar]
          if (pacientes.length > 0) {
            worksheet.mergeCells(`A${currentRow}:E${currentRow}`)
            worksheet.getCell(`A${currentRow}`).value = `${lugar.toUpperCase()} - Total: ${pacientes.length} pacientes`
            worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
            worksheet.addRow(['Nombres', 'Apellidos', 'CUI', 'Fecha', 'Lugar'])
            currentRow++
            pacientes.forEach((paciente) => {
              worksheet.addRow({
                nombre: paciente.nombres || 'N/A',
                apellidos: paciente.apellidos || 'N/A',
                cui: paciente.cui || 'N/A',
                fecha: new Date(paciente.fecha).toLocaleDateString(),
                lugar: lugar || 'N/A'
              })
              currentRow++
            })
            worksheet.addRow([])
            currentRow++
          }
        })

        workbook.xlsx.writeBuffer().then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'Reporte_Pacientes_hubo_en_cada_Lugar.xlsx'
          link.click()

          console.log('¡Archivo Excel generado correctamente!')
        }).catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
      }).catch((error) => {
        console.error('Error al procesar los detalles:', error)
      })
    },
    procesarDetalles (detalles) {
      return new Promise((resolve, reject) => {
        const rows = []
        Object.keys(detalles).forEach((lugar) => {
          const pacientes = detalles[lugar]
          pacientes.forEach((paciente) => {
            rows.push({
              nombre: paciente.nombres || 'N/A',
              apellidos: paciente.apellidos || 'N/A',
              cui: paciente.cui || 'N/A',
              fecha: new Date(paciente.fecha).toLocaleDateString(),
              lugar: lugar || 'N/A'
            })
          })
        })
        resolve(rows)
      })
    },

    segundoReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/pacientesActuales',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes2 () {
      const data = this.dataEnfermeria1
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      try {
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte de Pacientes Actuales', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        let currentY = 75

        const lugares = [
          { nombre: 'Hospitalización', pacientes: data.pacientes.filter(p => p.estado === 'Hospitalizacion') },
          { nombre: 'Quirofano', pacientes: data.pacientes.filter(p => p.estado === 'Quirofano') },
          { nombre: 'Intensivos', pacientes: data.pacientes.filter(p => p.estado === 'Intensivos') },
          { nombre: 'Emergencia', pacientes: data.pacientes.filter(p => p.estado === 'Emergencia') }
        ]

        lugares.forEach((lugar) => {
          const tableColumn = ['#', 'Nombre Completo', 'CUI', 'Fecha de Ingreso']
          const tableRows = lugar.pacientes.map((paciente, index) => [
            index + 1,
            `${paciente.nombres} ${paciente.apellidos}`,
            paciente.cui || 'N/A',
            paciente.updatedAt
              ? new Date(paciente.updatedAt).toLocaleDateString()
              : 'N/A'
          ])

          doc.setFontSize(14)
          doc.text(`${lugar.nombre} (${lugar.pacientes.length} paciente(s))`, 14, currentY)

          doc.autoTable({
            head: [tableColumn],
            body: tableRows,
            startY: currentY + 5,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
            alternateRowStyles: { fillColor: [240, 240, 240] }
          })

          currentY = doc.lastAutoTable.finalY + 10

          if (currentY > 270) {
            doc.addPage()
            currentY = 20
          }
        })

        doc.save(`Reporte_Pacientes_Actuales_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.')
      }
    },
    generarExcelPacientes2 () {
      const dataEnfermeria = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Pacientes Actuales en cada Lugar')

      worksheet.columns = [
        { header: 'Nombres', key: 'nombre', width: 30 },
        { header: 'Apellidos', key: 'apellidos', width: 30 },
        { header: 'CUI', key: 'cui', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 20 },
        { header: 'Lugar', key: 'estado', width: 25 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Pacientes Actuales en cada Lugar de la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 7
      const pacientesPorEstado = this.procesarDetalles2(dataEnfermeria.pacientes)
      Object.keys(pacientesPorEstado).forEach((estado) => {
        const pacientes = pacientesPorEstado[estado]
        if (pacientes.length > 0) {
          worksheet.mergeCells(`A${currentRow}:E${currentRow}`)
          worksheet.getCell(`A${currentRow}`).value = `${estado} - Total: ${pacientes.length} pacientes`
          worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
          worksheet.addRow(['Nombres', 'Apellidos', 'CUI', 'Fecha', 'Lugar'])
          currentRow++
          pacientes.forEach((paciente) => {
            worksheet.addRow({
              nombre: paciente.nombres || 'N/A',
              apellidos: paciente.apellidos || 'N/A',
              cui: paciente.cui || 'N/A',
              fecha: paciente.updatedAt ? new Date(paciente.updatedAt).toLocaleDateString() : 'N/A',
              estado: estado || 'N/A'
            })
            currentRow++
          })
          worksheet.addRow([])
          currentRow++
        }
      })
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'Reporte_Pacientes_Actuales.xlsx'
        link.click()

        console.log('¡Archivo Excel generado correctamente!')
      }).catch((error) => {
        console.error('Error al generar el archivo Excel:', error)
      })
    },
    procesarDetalles2 (pacientes) {
      const grupos = {}
      pacientes.forEach((paciente) => {
        const estado = paciente.estado
        if (!grupos[estado]) {
          grupos[estado] = []
        }
        grupos[estado].push(paciente)
      })
      return grupos
    },

    tercerReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/pacientesTodos',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes3 () {
      const pacientes = this.dataEnfermeria1
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const pacientesPorEstado = {
          0: { estado: 'Fallecido', pacientes: [] },
          1: { estado: 'Hospitalización', pacientes: [] },
          3: { estado: 'Quirófano', pacientes: [] },
          4: { estado: 'Intensivos', pacientes: [] },
          5: { estado: 'Emergencia', pacientes: [] },
          6: { estado: 'Desahuciado', pacientes: [] },
          7: { estado: 'Egreso normal', pacientes: [] },
          8: { estado: 'Contraindicado', pacientes: [] },
          9: { estado: 'Referido', pacientes: [] },
          10: { estado: 'Pendiente', pacientes: [] },
          11: { estado: 'Laboratorio', pacientes: [] }
        }

        pacientes.forEach((paciente) => {
          if (pacientesPorEstado[paciente.estado]) {
            const esEgreso = [0, 6, 7, 8].includes(paciente.estado)

            pacientesPorEstado[paciente.estado].pacientes.push({
              nombreCompleto: `${paciente.nombres} ${paciente.apellidos}`,
              cui: paciente.cui || 'N/A',
              fechaIngreso: esEgreso
                ? paciente.createdAt
                  ? new Date(paciente.createdAt).toLocaleDateString()
                  : 'N/A'
                : paciente.updatedAt
                  ? new Date(paciente.updatedAt).toLocaleDateString()
                  : 'N/A',
              fechaEgreso: esEgreso
                ? paciente.updatedAt
                  ? new Date(paciente.updatedAt).toLocaleDateString()
                  : 'N/A'
                : 'Sin Egreso'
            })
          }
        })

        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte Detallado de Todos los Pacientes', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })
        let currentY = 65

        Object.keys(pacientesPorEstado).forEach((key) => {
          const { estado, pacientes } = pacientesPorEstado[key]

          if (pacientes.length > 0) {
            doc.setFontSize(14)
            doc.text(`${estado} (${pacientes.length} paciente(s))`, 14, currentY)

            const tableRows = []
            pacientes.forEach((paciente, i) => {
              tableRows.push([
                i + 1,
                paciente.nombreCompleto,
                paciente.fechaIngreso,
                paciente.fechaEgreso
              ])
            })

            doc.autoTable({
              head: [['#', 'Nombre Completo', 'Fecha Ingreso', 'Fecha Egreso']],
              body: tableRows,
              startY: currentY + 5,
              theme: 'grid',
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [240, 240, 240] }
            })

            currentY = doc.lastAutoTable.finalY + 10
            if (currentY > 270) {
              doc.addPage()
              currentY = 20
            }
          }
        })

        doc.save(`reporte_detallado_de_pacientes_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.')
      }
    },
    generarExcelPacientes3 () {
      const dataEnfermeria = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Pacientes')

      worksheet.columns = [
        { header: 'Nombres', key: 'nombre', width: 30 },
        { header: 'Apellidos', key: 'apellidos', width: 30 },
        { header: 'Fecha Ingreso', key: 'fechaIngreso', width: 20 },
        { header: 'Fecha Egreso', key: 'fechaEgreso', width: 20 },
        { header: 'Lugar', key: 'estado', width: 25 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:F1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:F2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:F3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:F5')
      worksheet.getCell('A5').value = `Reporte de Pacientes desde la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:F6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 7
      const pacientesPorEstado = this.procesarDetalles3(dataEnfermeria)
      Object.keys(pacientesPorEstado).forEach((estado) => {
        const pacientes = pacientesPorEstado[estado]
        if (pacientes.length > 0) {
          worksheet.mergeCells(`A${currentRow}:F${currentRow}`)
          worksheet.getCell(`A${currentRow}`).value = `${estado} - Total: ${pacientes.length} pacientes`
          worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
          currentRow++

          worksheet.addRow({
            nombre: 'Nombres',
            apellidos: 'Apellidos',
            fechaIngreso: 'Fecha Ingreso',
            fechaEgreso: 'Fecha Egreso',
            estado: 'Estado'
          })
          pacientes.forEach((paciente) => {
            const fechaIngreso =
              ['Fallecido', 'Desahuciado', 'Egreso normal', 'Contraindicado'].includes(estado)
                ? paciente.createdAt
                  ? new Date(paciente.createdAt).toLocaleDateString()
                  : 'N/A'
                : paciente.updatedAt
                  ? new Date(paciente.updatedAt).toLocaleDateString()
                  : 'N/A'

            const fechaEgreso =
              ['Fallecido', 'Desahuciado', 'Egreso normal', 'Contraindicado'].includes(estado)
                ? paciente.updatedAt
                  ? new Date(paciente.updatedAt).toLocaleDateString()
                  : 'N/A'
                : 'Sin Egreso'

            worksheet.addRow({
              nombre: paciente.nombres || 'N/A',
              apellidos: paciente.apellidos || 'N/A',
              fechaIngreso,
              fechaEgreso,
              estado
            })
            currentRow++
          })

          worksheet.addRow([])
          currentRow++
        }
      })

      workbook.xlsx.writeBuffer()
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })

          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'Reporte_Pacientes.xlsx'
          link.click()

          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    },
    procesarDetalles3 (pacientes) {
      const estadoMap = {
        0: 'Fallecido',
        1: 'Hospitalización',
        3: 'Quirófano',
        4: 'Intensivos',
        5: 'Emergencia',
        6: 'Desahuciado',
        7: 'Egreso normal',
        8: 'Contraindicado',
        9: 'Referido',
        10: 'Pendiente',
        11: 'Laboratorio'
      }
      const grupos = {}
      pacientes.forEach((paciente) => {
        const estadoNombre = estadoMap[paciente.estado] || 'Desconocido'
        if (!grupos[estadoNombre]) {
          grupos[estadoNombre] = []
        }
        grupos[estadoNombre].push(paciente)
      })
      return grupos
    },

    cuartoReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/serviciosMasConsumidos',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes4 () {
      const { consumos, consumoMasAlto } = this.dataEnfermeria1
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const consumosOrdenados = consumos.sort((a, b) => b.total_consumido - a.total_consumido)
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte de Consumos de Servicios', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        doc.setFontSize(14)
        doc.text('Servicio Más Consumido', 14, 70)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`Nombre: ${consumoMasAlto.nombre_servicio}`, 14, 78)
        doc.text(`Precio Unitario: Q${consumoMasAlto.precio_unitario}`, 14, 84)
        doc.text(`Cantidad: ${consumoMasAlto.cantidad}`, 14, 90)

        doc.setFontSize(14)
        doc.text('Otros Consumos', 14, 110)

        const tableRows = consumosOrdenados.map((consumo, index) => [
          index + 1,
          consumo.nombre_servicio,
          `Q${consumo.precio_unitario}`,
          consumo.cantidad,
          `Q${consumo.total_consumido}`
        ])

        doc.autoTable({
          head: [['#', 'Nombre del Servicio', 'Precio Unitario', 'Cantidad']],
          body: tableRows,
          startY: 120,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(`reporte_consumo_de_servicios_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    generarExcelPacientes4 () {
      const { consumos, consumoMasAlto } = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de consumo de servicios')

      worksheet.columns = [
        { header: '#', key: 'numero_orden', width: 10 },
        { header: 'Nombre del Servicio', key: 'nombre_servicio', width: 30 },
        { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
        { header: 'Cantidad', key: 'cantidad', width: 15 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Consumos de Servicios (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A8:E8')
      worksheet.getCell('A8').value = 'Servicio Más Consumido'
      worksheet.getCell('A8').font = { bold: true, size: 14 }

      worksheet.getCell('A9').value = 'Nombre'
      worksheet.getCell('B9').value = consumoMasAlto.nombre_servicio
      worksheet.getCell('A10').value = 'Precio Unitario'
      worksheet.getCell('B10').value = `Q${consumoMasAlto.precio_unitario}`
      worksheet.getCell('A11').value = 'Cantidad'
      worksheet.getCell('B11').value = consumoMasAlto.cantidad

      worksheet.getColumn('B').width = 30

      worksheet.addRow([])
      worksheet.addRow(['#', 'Nombre del Servicio', 'Precio Unitario', 'Cantidad'])
      worksheet.getRow(9).font = { bold: true }
      worksheet.getRow(9).alignment = { horizontal: 'center' }

      const consumosOrdenados = consumos.sort((a, b) => b.cantidad - a.cantidad)
      consumosOrdenados.forEach((consumo, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_servicio: consumo.nombre_servicio,
          precio_unitario: `Q${consumo.precio_unitario}`,
          cantidad: consumo.cantidad
        })
      })

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Reporte_Consumo_Servicios_${fechaInicio}_a_${fechaFin}.xlsx`
          link.click()
          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    },

    quintoReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/medicamentos',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes5 () {
      const medicamentos = this.dataEnfermeria1.medicamentos
      const masconsumido = this.dataEnfermeria1.mas_consumido
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        if (!masconsumido || !masconsumido.nombre_medicamento || !masconsumido.precio_unitario || !masconsumido.cantidad_total) {
          this.$alert('No se encontraron datos del medicamento más consumido.', 'Error')
          return
        }
        if (!Array.isArray(medicamentos) || medicamentos.length === 0) {
          this.$alert('No se encontraron datos de medicamentos consumidos.', 'Error')
          return
        }

        const consumosOrdenados = medicamentos.sort((a, b) => b.total_consumido - a.total_consumido)
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte de Consumo de Medicamentos', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        doc.setFontSize(14)
        doc.text('Medicamento Más Consumido', 14, 70)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`Nombre: ${masconsumido.nombre_medicamento}`, 14, 78)
        doc.text(`Precio Unitario: Q${masconsumido.precio_unitario}`, 14, 84)
        doc.text(`Cantidad: ${masconsumido.cantidad_total}`, 14, 90)

        doc.setFontSize(14)
        doc.text('Otros Consumos', 14, 110)

        const tableRows = consumosOrdenados.map((medicamento, index) => {
          return [
            index + 1,
            medicamento.nombre_medicamento || 'Desconocido',
            `Q${medicamento.precio_unitario || '0.00'}`,
            medicamento.cantidad_total || '0',
            `Q${medicamento.total_consumido || '0.00'}`
          ]
        })

        if (tableRows.length === 0) {
          this.$alert('No se encontraron datos de consumos para mostrar en la tabla.', 'Error')
          return
        }

        doc.autoTable({
          head: [['#', 'Nombre del Medicamento', 'Precio Unitario', 'Cantidad']],
          body: tableRows,
          startY: 120,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(`reporte_consumo_de_medicamentos_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    generarExcelPacientes5 () {
      const consumoMasAlto = this.dataEnfermeria1.mas_consumido
      const consumos = this.dataEnfermeria1.medicamentos
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Consumo Medicamentos')

      worksheet.columns = [
        { header: '#', key: 'numero_orden', width: 10 },
        { header: 'Nombre Medicamento', key: 'nombre_servicio', width: 30 },
        { header: 'Precio Unitario', key: 'precio_unitario', width: 20 },
        { header: 'Cantidad', key: 'cantidad', width: 15 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Medicamentos de la Fecha: (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A8:E8')
      worksheet.getCell('A8').value = 'Servicio Más Consumido'
      worksheet.getCell('A8').font = { bold: true, size: 14 }

      worksheet.getCell('A9').value = 'Nombre'
      worksheet.getCell('B9').value = consumoMasAlto.nombre_medicamento
      worksheet.getCell('A10').value = 'Precio Unitario'
      worksheet.getCell('B10').value = `Q${consumoMasAlto.precio_unitario}`
      worksheet.getCell('A11').value = 'Cantidad'
      worksheet.getCell('B11').value = consumoMasAlto.cantidad_total

      worksheet.getColumn('B').width = 30

      worksheet.addRow([])
      worksheet.addRow(['#', 'Nombre del Medicamento', 'Precio Unitario', 'Cantidad'])
      worksheet.getRow(9).font = { bold: true }
      worksheet.getRow(9).alignment = { horizontal: 'center' }

      const consumosOrdenados = consumos.sort((a, b) => b.cantidad_total - a.cantidad_total)
      consumosOrdenados.forEach((consumo, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_servicio: consumo.nombre_medicamento,
          precio_unitario: `Q${consumo.precio_unitario}`,
          cantidad: consumo.cantidad_total
        })
      })

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Reporte_Consumo_Medicamentos_${fechaInicio}_a_${fechaFin}.xlsx`
          link.click()
          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    },

    sextoReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/fallecidos',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes6 () {
      const pacientes = this.dataEnfermeria1
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const pacientesPorEstado = {
          0: { estado: 'Fallecido', pacientes: [] }
        }

        pacientes.forEach((paciente) => {
          if (pacientesPorEstado[paciente.estado]) {
            pacientesPorEstado[paciente.estado].pacientes.push({
              nombreCompleto: `${paciente.nombres} ${paciente.apellidos}`,
              cui: paciente.cui || 'N/A',
              fechaIngreso: paciente.updatedAt
                ? new Date(paciente.updatedAt).toLocaleDateString()
                : 'N/A'
            })
          }
        })

        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte de Pacientes Fallecidos', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })
        let currentY = 65

        Object.keys(pacientesPorEstado).forEach((key) => {
          const { estado, pacientes } = pacientesPorEstado[key]

          if (pacientes.length > 0) {
            doc.setFontSize(14)
            doc.text(`${estado} (${pacientes.length} paciente(s))`, 14, currentY)

            const tableRows = []
            pacientes.forEach((paciente, i) => {
              tableRows.push([
                i + 1,
                paciente.nombreCompleto,
                paciente.cui,
                paciente.fechaIngreso
              ])
            })

            doc.autoTable({
              head: [['#', 'Nombre Completo', 'CUI', 'Fecha de Fallecimiento']],
              body: tableRows,
              startY: currentY + 5,
              theme: 'grid',
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [240, 240, 240] }
            })

            currentY = doc.lastAutoTable.finalY + 10
            if (currentY > 270) {
              doc.addPage()
              currentY = 20
            }
          }
        })

        doc.save(`reporte_pacientes_fallecidos_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.')
      }
    },
    generarExcelPacientes6 () {
      const dataEnfermeria = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Pacientes Fallecidos')

      worksheet.columns = [
        { header: 'Nombres', key: 'nombre', width: 30 },
        { header: 'Apellidos', key: 'apellidos', width: 30 },
        { header: 'CUI', key: 'cui', width: 20 },
        { header: 'Fecha de Fallecimiento', key: 'fecha', width: 20 },
        { header: 'Lugar', key: 'estado', width: 25 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Pacientes Fallecidos desde la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 8
      const pacientesPorEstado = this.procesarDetalles6(dataEnfermeria)
      Object.keys(pacientesPorEstado).forEach((estado) => {
        const pacientes = pacientesPorEstado[estado]
        if (pacientes.length > 0) {
          worksheet.mergeCells(`A${currentRow}:E${currentRow}`)
          worksheet.getCell(`A${currentRow}`).value = `${estado} - Total: ${pacientes.length} pacientes`
          worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
          worksheet.addRow(['Nombres', 'Apellidos', 'CUI', 'Fecha de Fallecimiento', 'Estado'])
          currentRow++
          pacientes.forEach((paciente) => {
            worksheet.addRow({
              nombre: paciente.nombres || 'N/A',
              apellidos: paciente.apellidos || 'N/A',
              cui: paciente.cui || 'N/A',
              fecha: paciente.updatedAt ? new Date(paciente.updatedAt).toLocaleDateString() : 'N/A',
              estado: estado || 'N/A'
            })
            currentRow++
          })
          worksheet.addRow([])
          currentRow++
        }
      })
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'Reporte_Pacientes_fallecidos.xlsx'
        link.click()

        console.log('¡Archivo Excel generado correctamente!')
      }).catch((error) => {
        console.error('Error al generar el archivo Excel:', error)
      })
    },
    procesarDetalles6 (pacientes) {
      const estadoMap = {
        0: 'Fallecido'
      }
      const grupos = {}
      pacientes.forEach((paciente) => {
        const estadoNombre = estadoMap[paciente.estado] || 'Desconocido'
        if (!grupos[estadoNombre]) {
          grupos[estadoNombre] = []
        }
        grupos[estadoNombre].push(paciente)
      })
      return grupos
    },

    septimoReporteEnfermeria (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/enfermeria/egresados',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataEnfermeria1 = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFPacientes7 () {
      const pacientes = this.dataEnfermeria1
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const pacientesPorEstado = {
          0: { estado: 'Fallecidos', pacientes: [] },
          6: { estado: 'Desahuciados', pacientes: [] },
          7: { estado: 'Egreso normal', pacientes: [] },
          8: { estado: 'Egreso Contraindicado', pacientes: [] }
        }

        pacientes.forEach((paciente) => {
          if (pacientesPorEstado[paciente.estado]) {
            pacientesPorEstado[paciente.estado].pacientes.push({
              nombreCompleto: `${paciente.nombres} ${paciente.apellidos}`,
              cui: paciente.cui || 'N/A',
              fechaIngreso: paciente.updatedAt
                ? new Date(paciente.updatedAt).toLocaleDateString()
                : 'N/A'
            })
          }
        })

        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte de Pacientes Egresados', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })
        let currentY = 65

        Object.keys(pacientesPorEstado).forEach((key) => {
          const { estado, pacientes } = pacientesPorEstado[key]

          if (pacientes.length > 0) {
            doc.setFontSize(14)
            doc.text(`${estado} (${pacientes.length} paciente(s))`, 14, currentY)

            const tableRows = []
            pacientes.forEach((paciente, i) => {
              tableRows.push([
                i + 1,
                paciente.nombreCompleto,
                paciente.cui,
                paciente.fechaIngreso
              ])
            })

            doc.autoTable({
              head: [['#', 'Nombre Completo', 'CUI', 'Fecha Egreso']],
              body: tableRows,
              startY: currentY + 5,
              theme: 'grid',
              styles: { fontSize: 10, cellPadding: 2 },
              headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
              alternateRowStyles: { fillColor: [240, 240, 240] }
            })

            currentY = doc.lastAutoTable.finalY + 10
            if (currentY > 270) {
              doc.addPage()
              currentY = 20
            }
          }
        })

        doc.save(`reporte_pacientes_egresados_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.')
      }
    },
    generarExcelPacientes7 () {
      const dataEnfermeria = this.dataEnfermeria1
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Egreso de Pacientes')

      worksheet.columns = [
        { header: 'Nombres', key: 'nombre', width: 30 },
        { header: 'Apellidos', key: 'apellidos', width: 30 },
        { header: 'CUI', key: 'cui', width: 20 },
        { header: 'Fecha de Egreso', key: 'fecha', width: 20 },
        { header: 'Lugar', key: 'estado', width: 25 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Egreso de Pacientes desde la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 8
      const pacientesPorEstado = this.procesarDetalles7(dataEnfermeria)
      Object.keys(pacientesPorEstado).forEach((estado) => {
        const pacientes = pacientesPorEstado[estado]
        if (pacientes.length > 0) {
          worksheet.mergeCells(`A${currentRow}:E${currentRow}`)
          worksheet.getCell(`A${currentRow}`).value = `${estado} - Total: ${pacientes.length} pacientes`
          worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
          worksheet.addRow(['Nombres', 'Apellidos', 'CUI', 'Fecha de Egreso', 'Estado'])
          currentRow++
          pacientes.forEach((paciente) => {
            worksheet.addRow({
              nombre: paciente.nombres || 'N/A',
              apellidos: paciente.apellidos || 'N/A',
              cui: paciente.cui || 'N/A',
              fecha: paciente.updatedAt ? new Date(paciente.updatedAt).toLocaleDateString() : 'N/A',
              estado: estado || 'N/A'
            })
            currentRow++
          })
          worksheet.addRow([])
          currentRow++
        }
      })
      workbook.xlsx.writeBuffer().then((buffer) => {
        const blob = new Blob([buffer], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        })

        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'Reporte__De_Egreso_Pacientes.xlsx'
        link.click()

        console.log('¡Archivo Excel generado correctamente!')
      }).catch((error) => {
        console.error('Error al generar el archivo Excel:', error)
      })
    },
    procesarDetalles7 (pacientes) {
      const estadoMap = {
        0: 'Fallecido',
        6: 'Desahuciado',
        7: 'Egreso normal',
        8: 'Egreso Contraindicado'
      }
      const grupos = {}
      pacientes.forEach((paciente) => {
        const estadoNombre = estadoMap[paciente.estado] || 'Desconocido'
        if (!grupos[estadoNombre]) {
          grupos[estadoNombre] = []
        }
        grupos[estadoNombre].push(paciente)
      })
      return grupos
    },

    /* REPORTES MEDICOS */
    primerReporteMedicos (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/medicos/honorarios',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataMedicos = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFMedicos () {
      const data = this.dataMedicos
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const sinPagar = data.sinPagar
        const pagado = data.pagados

        const sinPagarOrdenados = sinPagar.sort((a, b) => b.total_honorario - a.total_honorario)
        const pagadoOrdenados = pagado.sort((a, b) => b.total_honorario - a.total_honorario)

        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte Detallado de Honorarios Medicos', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        // Sección "Sin pagar"
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('Honorarios Sin Pagar', 14, 70)

        if (sinPagarOrdenados.length > 0) {
          const sinPagarRows = sinPagarOrdenados.map((medico, index) => [
            index + 1,
            medico.nombre_medico,
            medico.paciente || 'Desconocido',
            medico.lugar,
            medico.descripcion,
            `Q${medico.total_honorario.toFixed(2)}`,
            medico.fecha,
            'Sin Pagar'
          ])

          doc.autoTable({
            head: [['#', 'Nombre del Medico', 'Nombre del Paciente', 'Lugar', 'Descripción', 'Total Honorarios', 'Fecha', 'Estado']],
            body: sinPagarRows,
            startY: 75,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [255, 99, 71], textColor: 255, fontStyle: 'bold' }, // Color de encabezado para "Sin pagar"
            alternateRowStyles: { fillColor: [240, 240, 240] }
          })
        } else {
          doc.setFontSize(10)
          doc.text('No hay honorarios pendientes de pago.', 14, 90)
        }

        // Sección "Pagado"
        const startYPagado = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 120
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('Honorarios Pagados', 14, startYPagado)

        if (pagadoOrdenados.length > 0) {
          const pagadoRows = pagadoOrdenados.map((medico, index) => [
            index + 1,
            medico.nombre_medico,
            medico.paciente || 'Desconocido',
            medico.lugar,
            medico.descripcion,
            `Q${medico.total_honorario.toFixed(2)}`,
            medico.fecha,
            'Pagado'
          ])

          doc.autoTable({
            head: [['#', 'Nombre del Medico', 'Nombre del Paciente', 'Lugar', 'Descripción', 'Total Honorarios', 'Fecha', 'Estado']],
            body: pagadoRows,
            startY: startYPagado + 5,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 2 },
            headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' }, // Color de encabezado para "Pagado"
            alternateRowStyles: { fillColor: [240, 240, 240] }
          })
        } else {
          doc.setFontSize(10)
          doc.text('No hay honorarios pagados.', 14, startYPagado + 10)
        }

        // Guardar el PDF
        doc.save(`reporte_detallado_honorarios_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    generarExcelMedicos () {
      const data = this.dataMedicos
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Honorarios Médicos')

      worksheet.columns = [
        { header: '#', key: 'numero_orden', width: 10 },
        { header: 'Nombre del Médico', key: 'nombre_medico', width: 30 },
        { header: 'Nombre del Paciente', key: 'nombre_paciente', width: 30 },
        { header: 'Lugar', key: 'lugar', width: 20 },
        { header: 'Descripción', key: 'descripcion', width: 20 },
        { header: 'Total Honorarios', key: 'total_honorarios', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Estado', key: 'estado', width: 15 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      // Encabezados generales
      worksheet.mergeCells('A1:H1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:H2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:H3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:H5')
      worksheet.getCell('A5').value = `Reporte Detallado de Honorarios Médicos (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:H6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.addRow([])
      worksheet.addRow(['Honorarios Sin Pagar'])
      worksheet.getRow(8).font = { bold: true, size: 14 }

      worksheet.addRow([])
      worksheet.getRow(10).values = ['#', 'Nombre del Médico', 'Nombre del Paciente', 'Lugar', 'Descripción', 'Total Honorarios', 'Fecha', 'Estado']
      worksheet.getRow(10).font = { bold: true }
      worksheet.getRow(10).alignment = { horizontal: 'center' }

      const sinPagar = data.sinPagar.sort((a, b) => b.total_honorario - a.total_honorario)
      sinPagar.forEach((medico, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_medico: medico.nombre_medico,
          nombre_paciente: medico.paciente || 'Desconocido',
          lugar: medico.lugar,
          descripcion: medico.descripcion,
          total_honorarios: `Q${medico.total_honorario.toFixed(2)}`,
          fecha: medico.fecha,
          estado: 'Sin Pagar'
        })
      })

      const startRowPagado = worksheet.lastRow.number + 2
      worksheet.addRow([])
      worksheet.addRow(['Honorarios Pagados'])
      worksheet.getRow(startRowPagado).font = { bold: true, size: 14 }

      worksheet.addRow([])
      worksheet.getRow(startRowPagado + 2).values = ['#', 'Nombre del Médico', 'Nombre del Paciente', 'Lugar', 'Descripción', 'Total Honorarios', 'Fecha', 'Estado']
      worksheet.getRow(startRowPagado + 2).font = { bold: true }
      worksheet.getRow(startRowPagado + 2).alignment = { horizontal: 'center' }

      const pagado = data.pagados.sort((a, b) => b.total_honorario - a.total_honorario)
      pagado.forEach((medico, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_medico: medico.nombre_medico,
          nombre_paciente: medico.paciente || 'Desconocido',
          lugar: medico.lugar,
          descripcion: medico.descripcion,
          total_honorarios: `Q${medico.total_honorario.toFixed(2)}`,
          fecha: medico.fecha,
          estado: 'Pagado'
        })
      })

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Reporte_Detallado_de_Honorarios_${fechaInicio}_a_${fechaFin}.xlsx`
          link.click()
          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    },

    segundoReporteMedicos (fechainicio, fechafin) {
      axios.get(apiUrl + '/reporte/medicos/medicoMasHonorarios',
        {
          params: {
            fechaInicio: fechainicio,
            fechaFin: fechafin
          }
        }
      )
        .then((response) => {
          this.dataMedicos = response.data
          this.startDateEnfermeria = fechainicio
          this.endDateEnfermeria = fechafin
          console.log(response.data)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPDFMedicos2 () {
      const { listaDeMedicos, medicoConMasHonorarios } = this.dataMedicos
      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria

      try {
        const medicosOrdenados = listaDeMedicos.sort((a, b) => b.total_honorarios - a.total_honorarios)
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14).setFont(undefined, 'bold')
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 110, 20, { align: 'center' })
        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 110, 26, { align: 'center' })
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 105, 32, { align: 'center' })

        doc.setFontSize(16)
        doc.text('Reporte De Honorarios Medicos', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        doc.setFontSize(14)
        doc.text('Medico que ha recibido mas honorarios', 14, 70)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`Nombre: ${medicoConMasHonorarios.nombre_medico}`, 14, 78)
        doc.text(`Total Honorarios: Q${medicoConMasHonorarios.total_honorarios}`, 14, 84)

        const tableRows = medicosOrdenados.map((medico, index) => [
          index + 1,
          medico.nombre_medico,
          `Q${medico.total_honorarios}`
        ])

        doc.autoTable({
          head: [['#', 'Nombre del Medico', 'Honorarios Recibidos']],
          body: tableRows,
          startY: 120,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(`Reporte_Medicos_Con_Mas_Honorarios_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    generarExcelMedicos2 () {
      const { listaDeMedicos, medicoConMasHonorarios } = this.dataMedicos
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Honrarios Medicos')

      worksheet.columns = [
        { header: '#', key: 'numero_orden', width: 10 },
        { header: 'Nombre del Medico', key: 'nombre_medico', width: 30 },
        { header: 'Honorarios Recibidos', key: 'total_honorarios', width: 20 }
      ]

      const fechaInicio = this.startDateEnfermeria
      const fechaFin = this.endDateEnfermeria
      const currentDate = new Date().toLocaleDateString('es-ES')

      worksheet.mergeCells('A1:E1')
      worksheet.getCell('A1').value = 'HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.'
      worksheet.getCell('A1').font = { bold: true, size: 16 }
      worksheet.getCell('A1').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A2:E2')
      worksheet.getCell('A2').value = '6ta. Calle 12-28 Zona 3 Quetzaltenango'
      worksheet.getCell('A2').font = { bold: true, size: 14 }
      worksheet.getCell('A2').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A3:E3')
      worksheet.getCell('A3').value = 'Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223'
      worksheet.getCell('A3').font = { bold: true, size: 14 }
      worksheet.getCell('A3').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A5:E5')
      worksheet.getCell('A5').value = `Reporte de Medicos Con Más honorarios (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A8:E8')
      worksheet.getCell('A8').value = 'Medico que ha recibido mas honorarios'
      worksheet.getCell('A8').font = { bold: true, size: 14 }

      worksheet.getCell('A9').value = 'Nombre'
      worksheet.getCell('B9').value = medicoConMasHonorarios.nombre_medico
      worksheet.getCell('A10').value = 'Total Honorarios Recibidos'
      worksheet.getCell('B10').value = `Q${medicoConMasHonorarios.total_honorarios}`

      worksheet.getColumn('B').width = 30

      worksheet.addRow([])
      worksheet.addRow(['#', 'Nombre del Medico', 'Honorarios Recibidos'])
      worksheet.getRow(9).font = { bold: true }
      worksheet.getRow(9).alignment = { horizontal: 'center' }

      const MedicosOrdenados = listaDeMedicos.sort((a, b) => b.total_honorarios - a.total_honorarios)
      MedicosOrdenados.forEach((medico, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_medico: medico.nombre_medico,
          total_honorarios: `Q${medico.total_honorarios}`
        })
      })

      workbook.xlsx
        .writeBuffer()
        .then((buffer) => {
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
          })
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = `Reporte_Medicos_Con_Mas_Honorarios_${fechaInicio}_a_${fechaFin}.xlsx`
          link.click()
          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    },

    onSearchDatosMedicos (search, loading) {
      if (search.length) {
        loading(true)
        this.onSearchMedicos(search, loading)
      }
    },
    onSearchMedicos (search, loading) {
      axios.get(apiUrl + '/voucher/getSearch',
        {
          params: {
            search: search
          }
        }
      ).then((response) => {
        this.fechaActual = response.data.fechaActual
        this.numero_voucher = response.data.numero
        this.medicos = response.data.Medicos
        loading(false)
      })
    },
    agregarPacientes (newValue) {
      this.formVoucher.medico = newValue
      const idMedico = newValue.id
      axios.get(apiUrl + '/reporte/medicos/optenerPacientes', {
        params: {
          idMedico: idMedico
        }
      })
        .then(response => {
          this.pacientes = response.data.pacientes
          this.formVoucher.cantidad = response.data.Total
          const idsPacientes = this.pacientes.map(paciente => paciente.id)
          this.formVoucher.id_paciente = idsPacientes
          console.log(response.data)
          if (response.data.Total === 0) {
            alert('El medico seleccionado no posee honorarios')
            this.closeModal('save')
          }
        })
        .catch(error => {
          console.error('Error al obtener los pacientes:', error)
        })
    },
    crearVoucher () {
      if (!this.formVoucher.cantidadEscrita || this.formVoucher.cantidadEscrita.trim() === '') {
        alert('Debe agregar la cantidad por escrito.')
        return
      }

      axios.post(apiUrl + '/voucher/create', this.formVoucher)
        .then(response => {
          this.generarPDFMedicos3()
          this.closeModal('save')
        })
        .catch(error => {
          console.error('Error al crear el voucher:', error)
        })
    },
    generarPDFMedicos3 () {
      const data = this.formVoucher
      const Pacientes = this.pacientes
      const numero = this.numero_voucher
      const fechaInicio = this.fechaActual

      try {
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(16)
        doc.text(`VOUCHER DE PAGO No. ${numero}`, 65, 20)
        doc.setFontSize(12)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 26)

        doc.setFontSize(10)
        doc.text('TIPO DE PAGO:     HONORARIOS.', 15, 50)
        doc.text(`FECHA DE PAGO:     ${moment(fechaInicio).format('DD/MM/YYYY')}`, 140, 50)

        doc.setFontSize(10)
        doc.text('PROVEEDOR:      HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 15, 60)

        let currentY = 70

        const tableRows = Pacientes.map((paciente, index) => [
          index + 1,
          paciente.paciente,
          paciente.expediente,
          new Date(paciente.fecha).toLocaleDateString(),
          `Q${paciente.total}`
        ])

        doc.autoTable({
          head: [['#', 'Nombre del Paciente', 'No. Expediente', 'Fecha', 'Honorarios']],
          body: tableRows,
          startY: currentY + 5,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        currentY = doc.lastAutoTable.finalY + 10

        doc.setFontSize(10).setFont(undefined, 'bold')
        doc.text(`TOTAL:                    Q${data.cantidad}`, 133, currentY - 5)
        doc.text('________________________________', 133, currentY - 4)
        doc.text('________________________________', 133, currentY - 3)

        doc.setFontSize(10).setFont(undefined, 'normal')
        doc.text('F)._________________________________________', 20, currentY + 10)
        doc.text(`PAGUESE A: ${data.medico.nombre}.`, 20, currentY + 16)
        doc.text(`LA SUMA DE: ${data.cantidadEscrita}.`, 20, currentY + 22)
        doc.text('-------------------------------------------------------------', 0, currentY + 28)
        doc.text('-------------------------------------------------------------', 71.7, currentY + 28)
        doc.text('---------------------------------------------------------', 142.3, currentY + 28)

        doc.save(`Vaoucher_Pago_Honorarios_${data.medico.nombre}_Fecha_${moment(fechaInicio).format('DD/MM/YYYY')}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    }
  }
}
</script>

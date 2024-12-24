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
                <b-form-select v-model="selectedReport" v-if="selectedArea == 1" :options="reportOptionsCaja" @change="incomeByDate()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 2" :options="reportOptionsFarmacia" @change="incomeByDay()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 3" :options="reportOptionsEnfermeria" @change="incomeByDay()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 4" :options="reportOptionsMedicos" @change="incomeByDay()"></b-form-select>
                <b-form-select v-model="selectedReport" v-if="selectedArea == 5" :options="reportOptionsPacientes" @change="incomeByDay()"></b-form-select>
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
        { value: 1, text: 'Reporte Farmacia 1' },
        { value: 2, text: 'Reporte Farmacia 2' },
        { value: 3, text: 'Reporte Farmacia 3' },
        { value: 4, text: 'Reporte Farmacia 4' }
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
      pdf_select: null,
      pdf_select_medicos: null,
      // Enfermeria
      dataEnfermeria1: null,
      startDateEnfermeria: null,
      endDateEnfermeria: null,
      // MEDICOS
      dataMedicos: null
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
        return
      }
      if (this.selectedArea === '1') {
        this.pdf_select_caja = 1
        this.modPdf(1)
      }
      if (this.selectedArea === '3') {
        switch (this.selectedReport) {
          case 1:
            this.primerReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 1
            return
          case 2:
            this.segundoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 2
            return
          case 3:
            this.tercerReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 3
            return
          case 4:
            this.cuartoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 4
            return
          case 5:
            this.quintoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 5
            return
          case 6:
            this.sextoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 6
            return
          case 7:
            this.septimoReporteEnfermeria(this.startDate, this.endDate)
            this.pdf_select = 7
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
            this.tercerReporteMedicos(this.startDate, this.endDate)
            this.pdf_select_medicos = 3
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

      switch (this.pdf_select) {
        case 1:
          this.generarPDFPacientes()
          break
        case 2:
          this.generarPDFPacientes2()
          break
        case 3:
          this.generarPDFPacientes3()
          break
        case 4:
          this.generarPDFPacientes4()
          break
        case 5:
          this.generarPDFPacientes5()
          break
        case 6:
          this.generarPDFPacientes6()
          break
        case 7:
          this.generarPDFPacientes7()
          break
      }

      switch (this.pdf_select_medicos) {
        case 1:
          this.generarPDFMedicos()
          break
        case 2:
          this.generarPDFMedicos2()
          break
        case 3:
          this.generarPDFMedicos3()
          break
      }
    },
    generarEXCEL () {
      switch (this.pdf_select) {
        case 1:
          this.generarExcelPacientes()
          break
        case 2:
          this.generarExcelPacientes2()
          break
        case 3:
          this.generarExcelPacientes3()
          break
        case 4:
          this.generarExcelPacientes4()
          break
        case 5:
          this.generarExcelPacientes5()
          break
        case 6:
          this.generarExcelPacientes6()
          break
        case 7:
          this.generarExcelPacientes7()
          break
      }
      switch (this.pdf_select_medicos) {
        case 1:
          this.generarExcelMedicos()
          break
        case 2:
          this.generarExcelMedicos2()
          break
        case 3:
          this.generarExcelMedicos3()
          break
      }
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

      doc.setFontSize(14)
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
      doc.setFontSize(10)
      doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
      doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

      doc.setFontSize(14)
      doc.text('Reporte de Pacientes por lugar', 14, 50)

      doc.setFontSize(12)
      doc.text(`Rango de Fechas: ${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')}`, 14, 60)

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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
                paciente.cui,
                paciente.fechaIngreso
              ])
            })

            doc.autoTable({
              head: [['#', 'Nombre Completo', 'CUI', 'Fecha Ingreso']],
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
      worksheet.getCell('A5').value = `Reporte de Pacientes desde la Fecha: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`
      worksheet.getCell('A5').font = { bold: true, size: 14 }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }

      let currentRow = 7
      const pacientesPorEstado = this.procesarDetalles3(dataEnfermeria)
      Object.keys(pacientesPorEstado).forEach((estado) => {
        const pacientes = pacientesPorEstado[estado]
        if (pacientes.length > 0) {
          worksheet.mergeCells(`A${currentRow}:E${currentRow}`)
          worksheet.getCell(`A${currentRow}`).value = `${estado} - Total: ${pacientes.length} pacientes`
          worksheet.getCell(`A${currentRow}`).font = { bold: true, size: 12 }
          worksheet.addRow(['Nombres', 'Apellidos', 'CUI', 'Fecha', 'Estado'])
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
        link.download = 'Reporte_Pacientes.xlsx'
        link.click()

        console.log('¡Archivo Excel generado correctamente!')
      }).catch((error) => {
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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

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
          console.log(response.data)
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
        const honorariosOrdenados = data.sort((a, b) => b.total_honorario - a.total_honorario)
        const doc = new JsPDF()

        doc.addImage(logo, 'JPEG', 14, 10, 30, 25)
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

        doc.setFontSize(16)
        doc.text('Reporte de Honorarios', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        doc.setFontSize(14)
        doc.text('Detalle de los Honorarios de Medicos', 14, 110)

        const tableRows = honorariosOrdenados.map((medico, index) => [
          index + 1,
          medico.nombre_medico,
          medico.descripcion,
          `Q${medico.total_honorario}`,
          medico.fecha
        ])

        doc.autoTable({
          head: [['#', 'Nombre del Medico', 'Descripcion', 'Honorarios Recibidos', 'Fecha']],
          body: tableRows,
          startY: 120,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(`reporte_honorarios_${fechaInicio}_a_${fechaFin}.pdf`)
      } catch (error) {
        console.error('Error al generar el reporte:', error)
        this.$alert('Ocurrió un error al generar el reporte. Por favor, intente de nuevo.', 'Error')
      }
    },
    generarExcelMedicos () {
      const data = this.dataMedicos
      const workbook = new ExcelJS.Workbook()
      const worksheet = workbook.addWorksheet('Reporte de Honrarios Medicos')

      worksheet.columns = [
        { header: '#', key: 'numero_orden', width: 10 },
        { header: 'Nombre del Medico', key: 'nombre_medico', width: 30 },
        { header: 'Descripcion', key: 'descripcion', width: 20 },
        { header: 'Honorario Recibido', key: 'total_honorarios', width: 20 },
        { header: 'Fecha', key: 'fecha', width: 15 }
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
      worksheet.getCell('A5').value = `Reporte Detallado de Honorarios de Medicos (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
      worksheet.getCell('A5').font = { bold: true, size: 14 }
      worksheet.getCell('A5').alignment = { horizontal: 'center' }

      worksheet.mergeCells('A6:E6')
      worksheet.getCell('A6').value = `Generado el: ${currentDate}`
      worksheet.getCell('A6').font = { italic: true }
      worksheet.getCell('A6').alignment = { horizontal: 'center' }

      worksheet.getColumn('A').width = 30

      worksheet.addRow([])
      worksheet.addRow(['#', 'Nombre del Medico', 'Descripcion', 'Honorarios Recibidos', 'Fecha'])
      worksheet.getRow(9).font = { bold: true }
      worksheet.getRow(9).alignment = { horizontal: 'center' }

      const MedicosOrdenados = data.sort((a, b) => b.total_honorario - a.total_honorario)
      MedicosOrdenados.forEach((medico, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_medico: medico.nombre_medico,
          descripcion: medico.descripcion,
          total_honorarios: `Q${medico.total_honorario}`,
          fecha: medico.fecha
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
        doc.setFontSize(14)
        doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE, S.A.', 50, 20)
        doc.setFontSize(10)
        doc.text('6ta. Calle 12-28 Zona 3 Quetzaltenango', 50, 26)
        doc.text('Tels: 7763-5225-7763-6167-7763-5226 Fax 7763-5223', 50, 32)

        doc.setFontSize(16)
        doc.text('Reporte Detallado de honorarios Medicos', 105, 50, { align: 'center' })
        doc.setFontSize(12)
        doc.text(`Desde: ${moment(fechaInicio).format('DD/MM/YYYY')} | Hasta: ${moment(fechaFin).format('DD/MM/YYYY')}`, 105, 58, { align: 'center' })

        doc.setFontSize(14)
        doc.text('Medico que ha recibido mas honorarios', 14, 70)
        doc.setFontSize(12)
        doc.setTextColor(0, 0, 0)
        doc.text(`Nombre: ${medicoConMasHonorarios.nombre_medico}`, 14, 78)
        doc.text(`Total Honorarios: Q${medicoConMasHonorarios.total_honorarios}`, 14, 84)
        doc.text(`Fechas: ${medicoConMasHonorarios.fechas}`, 14, 90)

        doc.setFontSize(14)
        doc.text('Otros Consumos', 14, 110)

        const tableRows = medicosOrdenados.map((medico, index) => [
          index + 1,
          medico.nombre_medico,
          `Q${medico.total_honorarios}`,
          medico.fechas
        ])

        doc.autoTable({
          head: [['#', 'Nombre del Medico', 'Honorarios Recibidos', 'Fecha']],
          body: tableRows,
          startY: 120,
          theme: 'grid',
          styles: { fontSize: 10, cellPadding: 2 },
          headStyles: { fillColor: [22, 160, 133], textColor: 255, fontStyle: 'bold' },
          alternateRowStyles: { fillColor: [240, 240, 240] }
        })

        doc.save(`Reporte_Detallado_Medico_Con_Mas_Honorarios_${fechaInicio}_a_${fechaFin}.pdf`)
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
        { header: 'Honorarios Recibidos', key: 'total_honorarios', width: 20 },
        { header: 'Fechas', key: 'fechas', width: 15 }
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
      worksheet.getCell('A5').value = `Reporte Detallado de Honorarios de Medicos (${moment(fechaInicio).format('DD/MM/YYYY')} - ${moment(fechaFin).format('DD/MM/YYYY')})`
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
      worksheet.getCell('A11').value = 'Fechas'
      worksheet.getCell('B11').value = medicoConMasHonorarios.fechas

      worksheet.getColumn('B').width = 30

      worksheet.addRow([])
      worksheet.addRow(['#', 'Nombre del Medico', 'Honorarios Recibidos', 'Fecha'])
      worksheet.getRow(9).font = { bold: true }
      worksheet.getRow(9).alignment = { horizontal: 'center' }

      const MedicosOrdenados = listaDeMedicos.sort((a, b) => b.total_honorarios - a.total_honorarios)
      MedicosOrdenados.forEach((medico, index) => {
        worksheet.addRow({
          numero_orden: index + 1,
          nombre_medico: medico.nombre_medico,
          total_honorarios: `Q${medico.total_honorarios}`,
          fechas: medico.fechas
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
          link.download = `Reporte_Detallado_Medico_Con_Mas_Honorarios_${fechaInicio}_a_${fechaFin}.xlsx`
          link.click()
          console.log('¡Archivo Excel generado correctamente!')
        })
        .catch((error) => {
          console.error('Error al generar el archivo Excel:', error)
        })
    }
  }
}
</script>

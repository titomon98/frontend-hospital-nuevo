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
      <b-modal id="modal-3-account" ref="modal-3-account" title="Desactivar cuenta">
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
          ¿Desea desactivar la cuenta: {{ form.numero }} ?
        </h6>
        <template #modal-footer="{}">
          <b-button
            type="submit"
            variant="primary"
            @click="onState()
            $bvModal.hide('modal-3-account')"
            >Desactivar</b-button
          >
          <b-button variant="danger" @click="$bvModal.hide('modal-3-account')"
            >Cancelar</b-button
          >
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
                  <label for="example-datepicker">Fecha de inicio</label>
                  <b-form-datepicker id="example-datepicker" v-model="startDate" class="mb-2"></b-form-datepicker>
                </div>
                <div>
                  <label for="example-datepicker">Fecha fin</label>
                  <b-form-datepicker id="example-datepicker" v-model="endDate" class="mb-2"></b-form-datepicker>
                </div>
                <div v-if="selectedReport != null">
                  <b-button variant="primary" @click="modPdf(1)">Descargar PDF</b-button>
                  <b-button variant="primary">Descargar Excel</b-button>
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
import autoTable from 'jspdf-autotable'
import logoLab from '../../../assets/images/logo.png'
import moment from 'moment'
// import { mapGetters } from 'vuex'

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
        { value: 1, text: 'Reporte Enfermería 1' },
        { value: 2, text: 'Reporte Enfermería 2' },
        { value: 3, text: 'Reporte Enfermería 3' },
        { value: 4, text: 'Reporte Enfermería 4' }
      ],
      reportOptionsMedicos: [
        { value: null, text: 'Seleccione un reporte' },
        { value: 1, text: 'Reporte Médicos 1' },
        { value: 2, text: 'Reporte Médicos 2' },
        { value: 3, text: 'Reporte Médicos 3' },
        { value: 4, text: 'Reporte Médicos 4' }
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
      expedientes: []
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
        autoTable(this.pdf, {
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
        autoTable(this.pdf, {
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
    }
  }
}
</script>

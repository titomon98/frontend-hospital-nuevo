<template>
  <b-container fluid>
    <b-alert :variant="alertVariant" :show="alertCountDown" dismissible fade @dismissed="alertCountDown=0" class="bg-white">
      <div class="iq-alert-text">{{ alertText }}</div>
    </b-alert>
    <b-alert :show="alertCountDownError" dismissible fade @dismissed="alertCountDownError=0" class="text-white bg-danger">
      <div class="iq-alert-text">{{ alertErrorText }}</div>
    </b-alert>
    <b-row>
      <b-col md="12">
        <iq-card>
          <template v-slot:headerTitle>
            <h4 class="card-title mt-3">Reportes de Gerencia</h4>
          </template>
          <template v-slot:body>
            <b-tabs content-class="mt-3">
              <!-- HOSPITALIZACION -->
              <b-tab title="Hospitalización" active>
                <h5 class="mt-2">Censo diario de pacientes hospitalizados</h5>
                <b-row>
                  <b-col md="4">
                    <b-form-group label="Día:">
                      <b-form-input type="date" v-model="censo.dia"></b-form-input>
                    </b-form-group>
                  </b-col>
                  <b-col md="4" class="d-flex align-items-end">
                    <b-button variant="success" v-anti-doble @click="generarCenso">Generar PDF</b-button>
                  </b-col>
                </b-row>
                <hr>
                <h5>Estadística de pacientes (fecha, paciente, médico)</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="estad.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="estad.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="4" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarEstadistica">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- FARMACIA -->
              <b-tab title="Farmacia">
                <h5 class="mt-2">Inventario general (medicamentos, quirúrgico, común y equipo)</h5>
                <b-button variant="success" v-anti-doble @click="generarInventario">Generar PDF</b-button>
                <hr>
                <h5>Pedidos surtidos a farmacia</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Tipo:"><b-form-select v-model="pedidos.tipo" :options="tipoOptions"></b-form-select></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Área:"><b-form-select v-model="pedidos.area" :options="areaOptions"></b-form-select></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="pedidos.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="pedidos.fechaFin"></b-form-input></b-form-group></b-col>
                </b-row>
                <b-button variant="success" v-anti-doble @click="generarPedidos">Generar PDF</b-button>
                <hr>
                <h5>Reportes de consumo / proveedores</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Reporte:"><b-form-select v-model="farm.reporte" :options="farmOptions"></b-form-select></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="farm.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="farm.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="3" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarFarmacia">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- CAJA / SEGUROS -->
              <b-tab title="Caja / Seguros">
                <h5 class="mt-2">Cuenta detallada de paciente (con seguros)</h5>
                <b-row>
                  <b-col md="5">
                    <b-form-group label="Buscar cuenta (número, expediente o nombre):">
                      <b-input-group>
                        <b-form-input v-model="cuenta.busqueda" @keyup.enter="buscarCuentas"></b-form-input>
                        <b-input-group-append><b-button variant="info" @click="buscarCuentas">Buscar</b-button></b-input-group-append>
                      </b-input-group>
                    </b-form-group>
                  </b-col>
                  <b-col md="5">
                    <b-form-group label="Cuenta:">
                      <b-form-select v-model="cuenta.seleccionada" :options="cuenta.opciones"></b-form-select>
                    </b-form-group>
                  </b-col>
                  <b-col md="2" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarCuentaDetallada">Generar PDF</b-button></b-col>
                </b-row>
                <hr>
                <h5>Cuentas por cobrar (saldo pendiente)</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="cobrar.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="cobrar.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="4" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarCuentasPorCobrar">Generar PDF</b-button></b-col>
                </b-row>
                <hr>
                <h5>Ingresos por fechas (pagos recibidos)</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="ingresos.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="ingresos.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="4" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarIngresos">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- SALA DE OPERACIONES -->
              <b-tab title="Sala de Operaciones">
                <h5 class="mt-2">Cirugías realizadas</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="cirugias.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="cirugias.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="4" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarCirugias">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- ENFERMERIA -->
              <b-tab title="Enfermería">
                <h5 class="mt-2">Reportes de pacientes</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Reporte:"><b-form-select v-model="enf.reporte" :options="enfOptions"></b-form-select></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="enf.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="enf.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="3" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarEnfermeria">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- LABORATORIO -->
              <b-tab title="Laboratorio">
                <h5 class="mt-2">Reportes de exámenes</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Reporte:"><b-form-select v-model="lab.reporte" :options="labOptions"></b-form-select></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="lab.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="lab.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="3" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarLaboratorio">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>

              <!-- MEDICOS -->
              <b-tab title="Médicos">
                <h5 class="mt-2">Honorarios por médico</h5>
                <b-row>
                  <b-col md="3"><b-form-group label="Fecha inicial:"><b-form-input type="date" v-model="med.fechaInicio"></b-form-input></b-form-group></b-col>
                  <b-col md="3"><b-form-group label="Fecha final:"><b-form-input type="date" v-model="med.fechaFin"></b-form-input></b-form-group></b-col>
                  <b-col md="4" class="d-flex align-items-end"><b-button variant="success" v-anti-doble @click="generarHonorarios">Generar PDF</b-button></b-col>
                </b-row>
              </b-tab>
            </b-tabs>
          </template>
        </iq-card>
      </b-col>
    </b-row>
  </b-container>
</template>
<script>
import { xray } from '../../../config/pluginInit'
import axios from 'axios'
import { apiUrl } from '../../../config/constant'
import JsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import moment from 'moment'

export default {
  name: 'ReportesGerencia',
  mounted () {
    xray.index()
  },
  data () {
    return {
      alertSecs: 5,
      alertCountDown: 0,
      alertCountDownError: 0,
      alertText: '',
      alertErrorText: '',
      alertVariant: '',
      censo: { dia: '' },
      estad: { fechaInicio: '', fechaFin: '' },
      cobrar: { fechaInicio: '', fechaFin: '' },
      cirugias: { fechaInicio: '', fechaFin: '' },
      cuenta: { busqueda: '', opciones: [], seleccionada: null },
      pedidos: { tipo: 'todos', area: '', fechaInicio: '', fechaFin: '' },
      ingresos: { fechaInicio: '', fechaFin: '' },
      enf: { reporte: 'todos', fechaInicio: '', fechaFin: '' },
      lab: { reporte: 'general', fechaInicio: '', fechaFin: '' },
      med: { fechaInicio: '', fechaFin: '' },
      farm: { reporte: 'productos', fechaInicio: '', fechaFin: '' },
      farmOptions: [
        { value: 'productos', text: 'Productos más utilizados' },
        { value: 'proveedores', text: 'Proveedores más solicitados' },
        { value: 'suministro', text: 'Suministro de medicamentos a pacientes' }
      ],
      enfOptions: [
        { value: 'todos', text: 'Todos los pacientes por fechas' },
        { value: 'egresados', text: 'Pacientes egresados' },
        { value: 'fallecidos', text: 'Pacientes fallecidos' },
        { value: 'porLugar', text: 'Pacientes por lugar (resumen)' },
        { value: 'servicios', text: 'Servicios más consumidos' },
        { value: 'medicamentos', text: 'Medicamentos más consumidos' }
      ],
      labOptions: [
        { value: 'general', text: 'Exámenes: más generados (general)' },
        { value: 'diarios', text: 'Exámenes realizados por día' }
      ],
      estadosExp: { 0: 'Fallecido', 1: 'Activo', 6: 'Egresado', 7: 'Egresado', 8: 'Egresado' },
      tipoOptions: [
        { value: 'todos', text: 'Todos los tipos' },
        { value: 'medicamentos', text: 'Medicamentos' },
        { value: 'comunes', text: 'Material común' },
        { value: 'quirurgicos', text: 'Material quirúrgico' }
      ],
      areaOptions: [
        { value: '', text: 'Todas las áreas' },
        { value: 'Quirofano', text: 'Quirófano' },
        { value: 'Hospitalizacion', text: 'Hospitalización' },
        { value: 'Intensivo', text: 'Intensivo' },
        { value: 'Emergencia', text: 'Emergencia' }
      ]
    }
  },
  methods: {
    showAlert () { this.alertCountDown = this.alertSecs },
    showAlertError () { this.alertCountDownError = this.alertSecs },
    ok (msg) { this.alertVariant = 'success'; this.alertText = msg; this.showAlert() },
    error (e, def) {
      this.alertVariant = 'danger'
      this.alertErrorText = (e && e.response && e.response.data && e.response.data.msg) || def
      this.showAlertError()
    },
    // Encabezado + tabla estándar para los PDF.
    nuevoDoc (titulo, subtitulos) {
      const doc = new JsPDF()
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A.', 105, 15, { align: 'center' })
      doc.setFontSize(12)
      doc.text(titulo, 105, 22, { align: 'center' })
      doc.setFontSize(10).setFont(undefined, 'normal')
      let y = 30
      ;(subtitulos || []).forEach(s => { doc.text(s, 14, y); y += 5 })
      return { doc, y }
    },
    tabla (doc, startY, head, body, foot) {
      autoTable(doc, {
        startY,
        head,
        body,
        foot: foot || undefined,
        styles: { fontSize: 8 },
        headStyles: { fillColor: [40, 118, 74] },
        footStyles: { fillColor: [230, 230, 230], textColor: 20, fontStyle: 'bold' }
      })
      return doc.lastAutoTable.finalY + 6
    },
    async pedirDatos (url, params) {
      const r = await axios.get(apiUrl + url, { params })
      return r.data
    },
    /* ---- Censo diario ---- */
    async generarCenso () {
      if (!this.censo.dia) { this.error(null, 'Debe indicar el día'); return }
      try {
        const p = await this.pedirDatos('/reporte/gerencia/censo', { dia: this.censo.dia })
        if (!p.data || p.data.length === 0) { this.ok('No hay pacientes hospitalizados ese día'); return }
        const { doc, y } = this.nuevoDoc('CENSO DE PACIENTES DEL ' + p.fechaTitulo, [])
        const finY = this.tabla(doc,
          y,
          [['No.', 'Nombre Paciente', 'No. Cuarto', 'Edad', 'Médico Tratante', 'Ingreso', 'Egreso']],
          p.data.map(d => [d.no, d.paciente, d.cuarto, d.edad, d.medico, d.ingreso, d.egreso])
        )
        doc.setFontSize(10)
        doc.text('(f) _______________________________', 105, finY + 18, { align: 'center' })
        doc.text('Enfermera que Extiende', 105, finY + 24, { align: 'center' })
        doc.save('Censo_' + this.censo.dia + '.pdf')
      } catch (e) { this.error(e, 'Error al generar el censo') }
    },
    /* ---- Estadística de pacientes ---- */
    async generarEstadistica () {
      if (!this.estad.fechaInicio || !this.estad.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        const p = await this.pedirDatos('/reporte/gerencia/estadisticaPacientes', this.estad)
        if (!p.data || p.data.length === 0) { this.ok('No hay pacientes en ese rango'); return }
        const { doc, y } = this.nuevoDoc('ESTADÍSTICA DE PACIENTES', [
          'Del ' + moment(this.estad.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.estad.fechaFin).format('DD/MM/YYYY'),
          'Total: ' + p.total
        ])
        this.tabla(doc, y,
          [['Fecha', 'Expediente', 'Paciente', 'Médico']],
          p.data.map(d => [moment(d.fecha).format('DD/MM/YYYY'), d.expediente, d.paciente, d.medico]))
        doc.save('Estadistica_pacientes.pdf')
      } catch (e) { this.error(e, 'Error al generar la estadística') }
    },
    /* ---- Inventario general ---- */
    async generarInventario () {
      try {
        const p = await this.pedirDatos('/reporte/gerencia/inventario', {})
        if (!p.data || p.data.length === 0) { this.ok('No hay existencias registradas'); return }
        const { doc, y } = this.nuevoDoc('INVENTARIO GENERAL', ['Total de productos: ' + p.total])
        this.tabla(doc, y,
          [['Tipo', 'Nombre', 'Existencia']],
          p.data.map(d => [d.tipo, d.nombre, d.existencia]))
        doc.save('Inventario_general.pdf')
      } catch (e) { this.error(e, 'Error al generar el inventario') }
    },
    /* ---- Pedidos surtidos ---- */
    async generarPedidos () {
      if (!this.pedidos.fechaInicio || !this.pedidos.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        const params = { tipo: this.pedidos.tipo, area: this.pedidos.area, modo: 'rango', fechaInicio: this.pedidos.fechaInicio, fechaFin: this.pedidos.fechaFin }
        const p = await this.pedirDatos('/reporte/pedidos/surtidos', params)
        if (!p.data || p.data.length === 0) { this.ok('No hay pedidos surtidos con esos filtros'); return }
        const conTipo = p.tipo === 'todos'
        const { doc, y } = this.nuevoDoc('PEDIDOS SURTIDOS A FARMACIA', [
          'Área: ' + (p.area || 'Todas'),
          'Del ' + moment(p.desde).format('DD/MM/YYYY') + ' al ' + moment(p.hasta).format('DD/MM/YYYY')
        ])
        const head = conTipo
          ? [['Fecha surtido', 'Código pedido', 'Tipo', 'Producto', 'Cantidad', 'Destino']]
          : [['Fecha surtido', 'Código pedido', 'Producto', 'Cantidad', 'Destino']]
        const body = p.data.map(d => conTipo
          ? [d.fecha, d.codigoPedido, d.tipoProducto, d.producto, d.cantidad, d.destino]
          : [d.fecha, d.codigoPedido, d.producto, d.cantidad, d.destino])
        this.tabla(doc, y, head, body)
        doc.save('Pedidos_surtidos.pdf')
      } catch (e) { this.error(e, 'Error al generar el reporte de pedidos') }
    },
    /* ---- Cuentas por cobrar ---- */
    async generarCuentasPorCobrar () {
      if (!this.cobrar.fechaInicio || !this.cobrar.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        const p = await this.pedirDatos('/reporte/gerencia/cuentasPorCobrar', this.cobrar)
        if (!p.data || p.data.length === 0) { this.ok('No hay cuentas por cobrar en ese rango'); return }
        const { doc, y } = this.nuevoDoc('CUENTAS POR COBRAR', [
          'Del ' + moment(this.cobrar.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.cobrar.fechaFin).format('DD/MM/YYYY'),
          'Total pendiente: Q' + p.total_pendiente
        ])
        this.tabla(doc, y,
          [['Cuenta', 'Fecha ingreso', 'Paciente', 'Total', 'Pagado', 'Pendiente']],
          p.data.map(d => [d.numero, moment(d.fecha_ingreso).format('DD/MM/YYYY'), d.paciente, d.total, d.total_pagado, d.pendiente]),
          [['', '', '', '', 'Pendiente', p.total_pendiente]])
        doc.save('Cuentas_por_cobrar.pdf')
      } catch (e) { this.error(e, 'Error al generar el reporte') }
    },
    /* ---- Cirugías realizadas ---- */
    async generarCirugias () {
      if (!this.cirugias.fechaInicio || !this.cirugias.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        const p = await this.pedirDatos('/reporte/gerencia/cirugias', this.cirugias)
        if (!p.data || p.data.length === 0) { this.ok('No hay cirugías en ese rango'); return }
        const { doc, y } = this.nuevoDoc('CIRUGÍAS REALIZADAS', [
          'Del ' + moment(this.cirugias.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.cirugias.fechaFin).format('DD/MM/YYYY'),
          'Total: Q' + p.total_general
        ])
        this.tabla(doc, y,
          [['Fecha', 'Paciente', 'Médico', 'Categoría', 'Descripción', 'Horas', 'Total']],
          p.data.map(d => [d.fecha, d.paciente, d.medico, d.categoria, d.descripcion, d.horas, d.total]),
          [['', '', '', '', '', 'Total', p.total_general]])
        doc.save('Cirugias_realizadas.pdf')
      } catch (e) { this.error(e, 'Error al generar el reporte') }
    },
    /* ---- Cuenta detallada ---- */
    async buscarCuentas () {
      if (!this.cuenta.busqueda) return
      try {
        const r = await axios.get(apiUrl + '/cuentas/getSearch', { params: { search: this.cuenta.busqueda, page: 1, limit: 15 } })
        const filas = (r.data && r.data.data) ? r.data.data : []
        this.cuenta.opciones = filas.map(c => {
          const exp = c.expediente || c.Expediente || {}
          return { value: c.id, text: c.numero + ' - ' + ((exp.apellidos || '') + ' ' + (exp.nombres || '')).trim() }
        })
        if (this.cuenta.opciones.length === 0) this.ok('No se encontraron cuentas')
      } catch (e) { this.error(e, 'Error al buscar cuentas') }
    },
    async generarCuentaDetallada () {
      if (!this.cuenta.seleccionada) { this.error(null, 'Debe seleccionar una cuenta'); return }
      try {
        const p = await this.pedirDatos('/reporte/gerencia/cuentaDetallada', { id_cuenta: this.cuenta.seleccionada })
        const { doc } = this.nuevoDoc('CUENTA DETALLADA', [
          'Cuenta: ' + p.cuenta.numero + '   Expediente: ' + (p.paciente.expediente || ''),
          'Paciente: ' + p.paciente.nombre + '   Médico: ' + p.paciente.medico,
          'Fecha ingreso: ' + (p.cuenta.fecha_ingreso ? moment(p.cuenta.fecha_ingreso).format('DD/MM/YYYY') : '')
        ])
        let y = 48
        if (p.cargos.consumos.length) {
          y = this.tabla(doc, y, [['Producto', 'Cantidad', 'Precio', 'Total']], p.cargos.consumos.map(c => [c.producto, c.cantidad, c.precio_venta, c.total]))
        }
        if (p.cargos.habitaciones.length) {
          y = this.tabla(doc, y, [['Habitación', 'Costo base', 'Ingreso', 'Salida']], p.cargos.habitaciones.map(h => [h.tipo, h.costo_base, h.ingreso, h.salida]))
        }
        if (p.cargos.honorarios.length) {
          y = this.tabla(doc, y, [['Médico', 'Honorario', 'Total']], p.cargos.honorarios.map(h => [h.medico, h.descripcion, h.total]))
        }
        if (p.cargos.cirugias.length) {
          y = this.tabla(doc, y, [['Categoría', 'Descripción', 'Horas', 'Total']], p.cargos.cirugias.map(c => [c.categoria, c.descripcion, c.horas, c.total]))
        }
        doc.setFontSize(11).setFont(undefined, 'bold')
        doc.text('Total de cargos: Q' + p.cargos.total_cargos, 14, y)
        doc.text('Cuenta total: Q' + p.cuenta.total + '   Pagado: Q' + p.cuenta.total_pagado + '   Pendiente: Q' + p.cuenta.pendiente_de_pago, 14, y + 6)
        y += 14
        doc.setFont(undefined, 'normal')
        if (p.polizas.length) {
          y = this.tabla(doc, y, [['Aseguradora', 'Póliza', 'Asegurado', 'Solvente']], p.polizas.map(s => [s.aseguradora, s.poliza, s.asegurado, s.solvente]))
        }
        if (p.pagos_seguros.length) {
          y = this.tabla(doc, y, [['Aseguradora', 'Póliza', 'Total', 'Pagado', 'Por pagar']], p.pagos_seguros.map(s => [s.aseguradora, s.poliza, s.total, s.pagado, s.por_pagar]))
        }
        doc.save('Cuenta_detallada_' + p.cuenta.numero + '.pdf')
      } catch (e) { this.error(e, 'Error al generar la cuenta detallada') }
    },
    /* ---- Ingresos por fechas (caja) ---- */
    async generarIngresos () {
      if (!this.ingresos.fechaInicio || !this.ingresos.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        // Este endpoint usa fecha_inicio/fecha_final.
        const p = await this.pedirDatos('/reporte/ingresosFechas', { fecha_inicio: this.ingresos.fechaInicio, fecha_final: this.ingresos.fechaFin })
        if (!p || p.length === 0) { this.ok('No hay ingresos en ese rango'); return }
        let totalPagado = 0
        const body = p.map(c => {
          const exp = c.expediente || c.Expediente || {}
          totalPagado += (isNaN(parseFloat(c.total_pagado)) ? 0 : parseFloat(c.total_pagado))
          return [
            c.numero_cuenta,
            ((exp.apellidos || '') + ' ' + (exp.nombres || '')).trim(),
            this.q(c.total), this.q(c.total_pagado), this.q(c.pendiente_de_pago), this.q(c.descuento)
          ]
        })
        const { doc, y } = this.nuevoDoc('INGRESOS POR FECHAS', [
          'Del ' + moment(this.ingresos.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.ingresos.fechaFin).format('DD/MM/YYYY'),
          'Total pagado: Q' + totalPagado.toFixed(2)
        ])
        this.tabla(doc, y, [['Cuenta', 'Paciente', 'Total', 'Pagado', 'Pendiente', 'Descuento']], body,
          [['', '', '', 'Pagado', totalPagado.toFixed(2), '']])
        doc.save('Ingresos_por_fechas.pdf')
      } catch (e) { this.error(e, 'Error al generar el reporte de ingresos') }
    },
    /* ---- Enfermería ---- */
    async generarEnfermeria () {
      if (!this.enf.fechaInicio || !this.enf.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      const rango = { fechaInicio: this.enf.fechaInicio, fechaFin: this.enf.fechaFin }
      const sub = 'Del ' + moment(this.enf.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.enf.fechaFin).format('DD/MM/YYYY')
      const r = this.enf.reporte
      try {
        if (r === 'todos' || r === 'egresados' || r === 'fallecidos') {
          const mapa = {
            todos: { url: '/reporte/enfermeria/pacientesTodos', titulo: 'PACIENTES POR FECHAS' },
            egresados: { url: '/reporte/enfermeria/egresados', titulo: 'PACIENTES EGRESADOS' },
            fallecidos: { url: '/reporte/enfermeria/fallecidos', titulo: 'PACIENTES FALLECIDOS' }
          }
          const cfg = mapa[r]
          const p = await this.pedirDatos(cfg.url, rango)
          if (!p || p.length === 0) { this.ok('No hay pacientes con esos filtros'); return }
          const { doc, y } = this.nuevoDoc(cfg.titulo, [sub, 'Total: ' + p.length])
          this.tabla(doc, y, [['Paciente', 'CUI', 'Estado', 'Fecha']],
            p.map(x => [((x.apellidos || '') + ' ' + (x.nombres || '')).trim(), x.cui || '', this.estadosExp[x.estado] || x.estado, moment(x.updatedAt || x.createdAt).format('DD/MM/YYYY')]))
          doc.save('Enfermeria_' + r + '.pdf')
        } else if (r === 'porLugar') {
          const p = await this.pedirDatos('/reporte/enfermeria/pacientesLugar', rango)
          const { doc, y } = this.nuevoDoc('PACIENTES POR LUGAR', [sub])
          this.tabla(doc, y, [['Lugar', 'Cantidad']], [
            ['Hospitalización', p.cantidadHospitalizacion || 0],
            ['Intensivo', p.cantidadIntensivo || 0],
            ['Quirófano', p.cantidadQuirófano || 0],
            ['Emergencia', p.cantidadEmergencia || 0],
            ['Sala de Operaciones', p.cantidadSalaOperaciones || 0]
          ])
          doc.save('Pacientes_por_lugar.pdf')
        } else if (r === 'servicios') {
          const p = await this.pedirDatos('/reporte/enfermeria/serviciosMasConsumidos', rango)
          const lista = (p && p.consumos) || []
          if (lista.length === 0) { this.ok('No hay servicios en ese rango'); return }
          const { doc, y } = this.nuevoDoc('SERVICIOS MÁS CONSUMIDOS', [sub])
          this.tabla(doc, y, [['Servicio', 'Descripción', 'Cantidad', 'Total']],
            lista.map(x => [x.nombre_servicio, x.descripcion, x.cantidad, this.q(x.total_consumido)]))
          doc.save('Servicios_mas_consumidos.pdf')
        } else if (r === 'medicamentos') {
          const p = await this.pedirDatos('/reporte/enfermeria/medicamentos', rango)
          const lista = (p && p.medicamentos) || []
          if (lista.length === 0) { this.ok('No hay medicamentos en ese rango'); return }
          const { doc, y } = this.nuevoDoc('MEDICAMENTOS MÁS CONSUMIDOS', [sub])
          this.tabla(doc, y, [['Medicamento', 'Cantidad', 'Total']],
            lista.map(x => [x.nombre_medicamento, x.cantidad_total, this.q(x.total_venta)]))
          doc.save('Medicamentos_mas_consumidos.pdf')
        }
      } catch (e) { this.error(e, 'Error al generar el reporte') }
    },
    /* ---- Farmacia: consumo / proveedores ---- */
    async generarFarmacia () {
      if (!this.farm.fechaInicio || !this.farm.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      const rango = { fechaInicio: this.farm.fechaInicio, fechaFin: this.farm.fechaFin }
      const sub = 'Del ' + moment(this.farm.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.farm.fechaFin).format('DD/MM/YYYY')
      try {
        if (this.farm.reporte === 'productos') {
          const p = await this.pedirDatos('/reporte/farmacia/productosMasUtilizados', rango)
          const { doc, y } = this.nuevoDoc('PRODUCTOS MÁS UTILIZADOS', [sub])
          let yy = y
          const secc = (titulo, arr) => {
            if (!arr || !arr.length) return
            doc.setFontSize(11).setFont(undefined, 'bold'); doc.text(titulo, 14, yy); yy += 4
            yy = this.tabla(doc, yy, [['Nombre', 'Cantidad', 'Total']], arr.map(x => [x.nombre, x.cantidad_total, this.q(x.total_venta)]))
          }
          secc('Medicamentos', p.medicamentos)
          secc('Material quirúrgico', p.quirurgicos)
          secc('Material común', p.comunes)
          doc.save('Productos_mas_utilizados.pdf')
        } else if (this.farm.reporte === 'proveedores') {
          const p = await this.pedirDatos('/reporte/farmacia/proveedores', rango)
          const lista = (p && p.resultado) || []
          if (lista.length === 0) { this.ok('No hay proveedores en ese rango'); return }
          const { doc, y } = this.nuevoDoc('PROVEEDORES MÁS SOLICITADOS', [sub])
          this.tabla(doc, y, [['Proveedor', 'Representante', 'Teléfono', 'Solicitudes']],
            lista.map(x => [x.nombre, x.representante || '', x.telefono || '', x.conteo]))
          doc.save('Proveedores_mas_solicitados.pdf')
        } else {
          const p = await this.pedirDatos('/reporte/farmacia/suministroMedicamentos', rango)
          const lista = (p && p.medicamentos) || []
          if (lista.length === 0) { this.ok('No hay suministros en ese rango'); return }
          const { doc, y } = this.nuevoDoc('SUMINISTRO DE MEDICAMENTOS A PACIENTES', [sub])
          this.tabla(doc, y, [['Medicamento', 'Paciente', 'Cantidad', 'Total']],
            lista.map(x => [x.nombre_medicamento, x.paciente, x.cantidad_total, this.q(x.total_venta)]))
          doc.save('Suministro_medicamentos.pdf')
        }
      } catch (e) { this.error(e, 'Error al generar el reporte') }
    },
    /* ---- Laboratorio: exámenes ---- */
    async generarLaboratorio () {
      if (!this.lab.fechaInicio || !this.lab.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        if (this.lab.reporte === 'general') {
          const p = await this.pedirDatos('/reporte/laboratio/examenesGeneral', { fechaInicio: this.lab.fechaInicio, fechaFin: this.lab.fechaFin })
          if (!p || p.length === 0) { this.ok('No hay exámenes en ese rango'); return }
          const { doc, y } = this.nuevoDoc('EXÁMENES MÁS GENERADOS', [
            'Del ' + moment(this.lab.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.lab.fechaFin).format('DD/MM/YYYY')
          ])
          this.tabla(doc, y, [['Examen', 'Total generado']], p.map(x => [x.nombreExamen, this.q(x.totalGenerado)]))
          doc.save('Examenes_general.pdf')
        } else {
          const p = await this.pedirDatos('/reporte/laboratio/examenesDiarios', { fechaInicio: this.lab.fechaInicio, fechaFin: this.lab.fechaFin })
          if (!p || p.length === 0) { this.ok('No hay exámenes en ese rango'); return }
          const { doc, y } = this.nuevoDoc('EXÁMENES REALIZADOS POR DÍA', [
            'Del ' + moment(this.lab.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.lab.fechaFin).format('DD/MM/YYYY')
          ])
          this.tabla(doc, y, [['Fecha', 'Examen', 'Paciente', 'Total']],
            p.map(x => [moment(x.fecha).format('DD/MM/YYYY'), x.nombre_examen, x.nombre_paciente, this.q(x.total)]))
          doc.save('Examenes_diarios.pdf')
        }
      } catch (e) { this.error(e, 'Error al generar el reporte') }
    },
    /* ---- Médicos: honorarios ---- */
    async generarHonorarios () {
      if (!this.med.fechaInicio || !this.med.fechaFin) { this.error(null, 'Debe indicar el rango de fechas'); return }
      try {
        const p = await this.pedirDatos('/reporte/medicos/honorarios', { fechaInicio: this.med.fechaInicio, fechaFin: this.med.fechaFin })
        const sinPagar = p.sinPagar || []
        const pagados = p.pagados || []
        if (sinPagar.length === 0 && pagados.length === 0) { this.ok('No hay honorarios en ese rango'); return }
        const { doc, y } = this.nuevoDoc('HONORARIOS POR MÉDICO', [
          'Del ' + moment(this.med.fechaInicio).format('DD/MM/YYYY') + ' al ' + moment(this.med.fechaFin).format('DD/MM/YYYY')
        ])
        let yy = y
        const fila = x => [x.nombre_medico, x.paciente, x.descripcion, this.q(x.total_honorario)]
        if (sinPagar.length) {
          doc.setFontSize(11).setFont(undefined, 'bold'); doc.text('Sin pagar', 14, yy); yy += 4
          yy = this.tabla(doc, yy, [['Médico', 'Paciente', 'Descripción', 'Total']], sinPagar.map(fila))
        }
        if (pagados.length) {
          doc.setFontSize(11).setFont(undefined, 'bold'); doc.text('Pagados', 14, yy); yy += 4
          this.tabla(doc, yy, [['Médico', 'Paciente', 'Descripción', 'Total']], pagados.map(fila))
        }
        doc.save('Honorarios_por_medico.pdf')
      } catch (e) { this.error(e, 'Error al generar el reporte de honorarios') }
    },
    q (v) { return (isNaN(parseFloat(v)) ? 0 : parseFloat(v)).toFixed(2) }
  }
}
</script>

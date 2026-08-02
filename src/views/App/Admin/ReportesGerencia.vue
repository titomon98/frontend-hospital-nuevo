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
    }
  }
}
</script>

// Contrato y sumario del paciente (PDF). Movido de Caja/Expedientes para reusarlo en
// Gerencia (DetalleManejoModal). El componente debe tener el modal ref="modal-contrato"
// (iframe con previewURL) y, para ver el sumario en pantalla, ref="modal-sumario"
// (iframe con previewSumarioURL); ademas alertas (showAlert/showAlertError).
import axios from 'axios'
import JsPDF from 'jspdf'
import { apiUrl } from '../config/constant'
import logo from '../assets/images/login/1.png'

export default {
  data () {
    return {
      paciente: null,
      previewURL: null,
      previewSumarioURL: null,
      pdf: null,
      pdfName: 'Contrato_General.pdf',
      dataPDFsumario: null
    }
  },
  methods: {
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
        '', 'uno', 'dos', 'tres', 'cuatro', 'cinco', 'seis', 'siete', 'ocho', 'nueve',
        'diez', 'once', 'doce', 'trece', 'catorce', 'quince', 'dieciséis', 'diecisiete',
        'dieciocho', 'diecinueve', 'veinte', 'veintiuno', 'veintidós', 'veintitrés',
        'veinticuatro', 'veinticinco', 'veintiséis', 'veintisiete', 'veintiocho',
        'veintinueve', 'treinta', 'treinta y uno', 'treinta y dos', 'treinta y tres',
        'treinta y cuatro', 'treinta y cinco', 'treinta y seis', 'treinta y siete',
        'treinta y ocho', 'treinta y nueve', 'cuarenta', 'cuarenta y uno', 'cuarenta y dos',
        'cuarenta y tres', 'cuarenta y cuatro', 'cuarenta y cinco', 'cuarenta y seis',
        'cuarenta y siete', 'cuarenta y ocho', 'cuarenta y nueve', 'cincuenta',
        'cincuenta y uno', 'cincuenta y dos', 'cincuenta y tres', 'cincuenta y cuatro',
        'cincuenta y cinco', 'cincuenta y seis', 'cincuenta y siete', 'cincuenta y ocho',
        'cincuenta y nueve', 'sesenta', 'sesenta y uno', 'sesenta y dos', 'sesenta y tres',
        'sesenta y cuatro', 'sesenta y cinco', 'sesenta y seis', 'sesenta y siete',
        'sesenta y ocho', 'sesenta y nueve', 'setenta', 'setenta y uno', 'setenta y dos',
        'setenta y tres', 'setenta y cuatro', 'setenta y cinco', 'setenta y seis',
        'setenta y siete', 'setenta y ocho', 'setenta y nueve', 'ochenta',
        'ochenta y uno', 'ochenta y dos', 'ochenta y tres', 'ochenta y cuatro',
        'ochenta y cinco', 'ochenta y seis', 'ochenta y siete', 'ochenta y ocho',
        'ochenta y nueve', 'noventa'
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
      const edad = diasTexto[this.paciente.edad_encargado]

      // Encabezado
      this.pdf.addImage(logo, 'JPEG', 1.5, 1, 3, 3)

      this.pdf.setFontSize(16).setFont(undefined, 'bold')
      this.pdf.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A.', 12, 1.5, { align: 'center' })
      this.pdf.text('QUETZALTENANGO', 12, 2.2, { align: 'center' })
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
        `DE:                  ${edad}                          años`,
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
        `Domiciliado en: ${this.paciente.direccion}`,
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
        `Con residencia:  ${this.paciente.direccion}`,
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
expresamente al  HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A. para que le preste tratamiento  médico
necesario a: ${this.paciente.nombres} ${this.paciente.apellidos} utilizando los servicios médicos necesarios así
como  los  medicamentos  que  los  profesionales  de  mérito  estimen  conveniente,  aplicando los tratamientos que
estos  prescriban. SEGUNDO: que  me  comprometo expresamente  a  cancelar  el monto  de la liquidación que me
presente  el  HOSPITAL  DE  ESPECIALIDADES  DE  OCCIDENTE,  S.A.  Por los conceptos indicados en el punto
anterior,  ósea  HOSPITALIZACIÓN,  MEDICINAS,  Y  HONORARIOS  por servicios  médicos prestados;  y para tal
efecto  acepto  desde ya  como  líquidas,  exigibles,  ejecutivas y de  plazo  vencido,  las  cantidades  que  arroje  la
liquidación relacionada. TERCERO:  la falta de pago de la cantidad a que haciende la liquidación mencionada en el
punto anterior, dará derecho al  HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A. a cobrar ejecutivamente
la misma, para cuyo efecto servirá de título ejecutivo el presente documento y la liquidación que presente la entidad
indicada,  que formará  parte del mismo  renunciando para dicho efecto al fuero de mi domicilio y sujetándome a los
tribunales que fija el HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A. CUARTO: en fe de lo anterior, firmo
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




 Direccion: ${this.paciente.direccion_encargado}

 Tel: ${this.paciente.contacto_encargado}
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
    // ver=true: muestra el sumario en pantalla (modal-sumario) en vez de descargarlo.
    generarSumario (data, ver = false) {
      if (data.estado === 10) {
        this.alertVariant = 'danger'
        this.showAlert()
        this.alertText = 'No se puede generar el sumario de un paciente con datos incompletos'
      }
      axios.get(apiUrl + `/consumos/sumario/${data.id}`)
        .then((response) => {
          this.dataPDFsumario = response.data
          this.generarPdfSumario(data, ver)
        })
        .catch((error) => {
          console.error('Error al generar el reporte de cuenta parcial:', error)
          this.alertErrorText = 'Hubo un problema al generar el reporte. Por favor, intente nuevamente.'
          this.showAlertError()
        })
    },
    generarPdfSumario (paciente, ver = false) {
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

      dibujarRect(10, 5, 200, 250)

      doc.addImage(logo, 'JPEG', 14, 6, 25, 20)
      doc.setFontSize(14).setFont(undefined, 'bold')
      doc.text('HOSPITAL DE ESPECIALIDADES DE OCCIDENTE S.A.', 120, 13, { align: 'center' })
      doc.text('QUETZALTENANGO', 120, 20, { align: 'center' })

      dibujarLinea(10, 25, 210, 25)

      let posY = 30

      escribirTexto('Apellidos:', 12, posY, 10, 'bold')
      escribirTexto(paciente.apellidos, 12, posY += 5)
      escribirTexto('Nombres:', 87, posY -= 5, 10, 'bold')
      escribirTexto(paciente.nombres, 87, posY += 5)
      escribirTexto('Exp:', 185, posY -= 5, 10, 'bold')
      escribirTexto(paciente.expediente, 185, posY += 5)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      escribirTexto('Dirección:', 12, posY, 10, 'bold')
      escribirTexto(paciente.direccion, 30, posY)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 5) Fecha Nac., Edad, Sexo, Tel (el teléfono va en esta misma fila)
      // -------------------------------------
      escribirTexto('Fecha Nacimiento:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nacimiento, 45, posY)
      escribirTexto('Tel:', 150, posY, 10, 'bold')
      escribirTexto(paciente.telefono, 162, posY)
      escribirTexto('Edad:', 70, posY, 10, 'bold')
      escribirTexto(String(paciente.edad), 80, posY)
      escribirTexto('Sexo:', 100, posY, 10, 'bold')
      escribirTexto(paciente.genero, 115, posY)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      escribirTexto('Lugar de Nacimiento:', 12, posY, 10, 'bold')
      escribirTexto(paciente.lugar_nacimiento, 60, posY)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // ----------------------------------------------
      // -----------------------------------------------
      escribirTexto('Estado Civil:', 12, posY, 10, 'bold')
      escribirTexto(paciente.estado_civil, 12, posY += 5)
      escribirTexto('Ocupacion:', 40, posY -= 5, 10, 'bold')
      escribirTexto(paciente.profesion, 40, posY += 5)
      escribirTexto('Nacionalidad', 155, posY -= 5, 10, 'bold')
      escribirTexto(paciente.nacionalidad, 155, posY += 5)
      escribirTexto('CUI:', 180, posY -= 5, 10, 'bold')
      escribirTexto(paciente.cui, 180, posY += 5)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -----------------------------------------
      // -----------------------------------------

      escribirTexto('Nombre  de Conyugue:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nombre_conyuge, 12, posY += 5)
      escribirTexto('Direccion:', 105, posY -= 5, 10, 'bold')
      escribirTexto(paciente.direccion_conyuge, 105, posY += 5)
      escribirTexto('Tel:', 180, posY -= 5, 10, 'bold')
      escribirTexto(paciente.telefono_conyuge, 180, posY += 5)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Padre y Madre
      // -------------------------------------
      escribirTexto('Nombre del Padre:', 12, posY, 10, 'bold')
      escribirTexto(paciente.nombre_padre, 44, posY)
      escribirTexto('Nombre de la Madre:', 110, posY, 10, 'bold')
      escribirTexto(paciente.nombre_madre, 145, posY)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 10

      // ----------------------------------------------
      // -----------------------------------------------
      escribirTexto('En caso de emergencia notificar a:', 12, posY -= 6, 10, 'bold')
      escribirTexto(paciente.nombre_encargado, 12, posY += 6)
      escribirTexto('Parentesco:', 87, posY -= 6, 10, 'bold')
      escribirTexto(paciente.parentesco_encargado, 87, posY += 6)
      escribirTexto('Direccion:', 115, posY -= 6, 10, 'bold')
      escribirTexto(paciente.direccion_encargado, 115, posY += 6)
      escribirTexto('Tel:', 190, posY -= 6, 10, 'bold')
      escribirTexto(paciente.contacto_encargado, 190, posY += 6)

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Teléfono
      // -------------------------------------
      escribirTexto('Otras Hospitalizaciones:', 12, posY, 10, 'bold')

      escribirTexto('Referido de:', 112, posY, 10, 'bold')
      escribirTexto(paciente.medico.nombre, 134, posY)

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 6) Data
      // -------------------------------------

      escribirTexto('Ingreso:', 12, posY, 10, 'bold')
      escribirTexto(paciente.fecha_ingreso_reciente, 30, posY)
      escribirTexto(String(paciente.hora_ingreso_reciente), 50, posY)
      escribirTexto('Egreso:', 80, posY, 10, 'bold')

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

      posY += 2
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

      posY += 2
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

      posY += 2
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 2

      // -------------------------------------
      // 10) Casillas de verificación
      // -------------------------------------
      escribirTexto('Egreso', 12, posY + 6, 10, 'bold')
      const opciones = [
        ['Vivo', 'Contraindicación', 'Transferencia a otra institución'],
        ['Muerto', 'Antes de 48 horas', 'Después de 48 horas']
      ]

      const tamCaja = 5 // tamaño del cuadro
      const anchoCol = 22 // ancho por columna
      let xPos

      opciones.forEach(fila => {
        xPos = 35 // inicio de cada fila

        fila.forEach(texto => {
          // Dibuja cuadro vacío
          doc.rect(xPos, posY, tamCaja, tamCaja)

          // Texto a la derecha del cuadro
          escribirTexto(texto, xPos + 6, posY + 3, 5, 'bold')

          // Pasar a la siguiente columna
          xPos += anchoCol
        })
        // Siguiente fila
        posY += tamCaja + 2
      })

      posY -= 7
      // -------------------------------------
      // 10.1) Casillas de verificación de autopsia
      // -------------------------------------
      escribirTexto('Autopsia', 125, posY, 10, 'bold')
      const opciones2 = [ ['Si', 'No'] ]
      const tamCaja2 = 5 // tamaño del cuadro
      const anchoCol2 = 15 // ancho por columna
      let xPos2
      posY -= 3

      opciones2.forEach(fila => {
        xPos2 = 150 // inicio de cada fila

        fila.forEach(texto => {
          // Dibuja cuadro vacío
          doc.rect(xPos2, posY, tamCaja2, tamCaja2)

          // Texto a la derecha del cuadro
          escribirTexto(texto, xPos2 + 6, posY + 3, 5, 'bold')

          // Pasar a la siguiente columna
          xPos2 += anchoCol2
        })
        // Siguiente fila
        posY += tamCaja2 + 2
      })

      posY += 8
      escribirTexto('Causa de muerte', 12, posY + 3, 10, 'bold')

      posY += 5
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      escribirTexto('Fecha', 12, posY, 10, 'bold')

      posY += 2 // espacio antes de la firma
      dibujarLinea(10, posY, 210, posY)
      posY += 5

      // -------------------------------------
      // 11) Firma del Médico
      // -------------------------------------
      escribirTexto('Firma Médico Responsable:', 150, posY, 10, 'bold')

      // -------------------------------------
      // 12) Guardar el PDF
      // -------------------------------------
      if (ver && this.$refs['modal-sumario']) {
        this.previewSumarioURL = URL.createObjectURL(doc.output('blob'))
        this.$refs['modal-sumario'].show()
        return
      }
      doc.save(`Sumario_Paciente_${paciente.nombres}_${paciente.apellidos}.pdf`)
    }
  }
}

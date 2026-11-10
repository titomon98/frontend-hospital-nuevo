// Monto en quetzales a letras: "DOSCIENTOS QUETZALES EXACTOS", "... CON 05/100". Hasta 999,999.99.
export function numeroALetras (valor) {
  const num = Math.abs(Number(valor) || 0)
  const entero = Math.floor(num)
  const centavos = Math.round((num - entero) * 100)

  const unidades = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE']
  const diez19 = ['DIEZ', 'ONCE', 'DOCE', 'TRECE', 'CATORCE', 'QUINCE', 'DIECISEIS', 'DIECISIETE', 'DIECIOCHO', 'DIECINUEVE']
  const decenas = ['', '', 'VEINTI', 'TREINTA', 'CUARENTA', 'CINCUENTA', 'SESENTA', 'SETENTA', 'OCHENTA', 'NOVENTA']
  const centenas = ['', 'CIENTO', 'DOSCIENTOS', 'TRESCIENTOS', 'CUATROCIENTOS', 'QUINIENTOS', 'SEISCIENTOS', 'SETECIENTOS', 'OCHOCIENTOS', 'NOVECIENTOS']

  const aLetras = (x) => { // 0..999
    if (x === 0) return 'CERO'
    if (x === 100) return 'CIEN'
    let txt = ''
    const c = Math.floor(x / 100)
    const resto = x % 100
    if (c) txt += centenas[c] + ' '
    if (resto > 0) {
      if (resto < 10) txt += unidades[resto]
      else if (resto < 20) txt += diez19[resto - 10]
      else {
        const d = Math.floor(resto / 10)
        const u = resto % 10
        if (resto < 30) txt += 'VEINTI' + unidades[u].toLowerCase()
        else txt += decenas[d] + (u ? ' Y ' + unidades[u] : '')
      }
    }
    return txt.trim().toUpperCase()
  }

  let palabras
  if (entero < 1000) palabras = aLetras(entero)
  else {
    const miles = Math.floor(entero / 1000)
    const resto = entero % 1000
    const milesTxt = (miles === 1 ? 'MIL' : aLetras(miles).replace(/UNO$/, 'UN') + ' MIL')
    palabras = milesTxt + (resto ? ' ' + aLetras(resto) : '')
  }

  // Apócope ante sustantivo masculino: UNO/VEINTIUNO -> UN/VEINTIUN quetzal(es)
  palabras = palabras.replace(/UNO$/, 'UN')
  const moneda = entero === 1 ? 'QUETZAL' : 'QUETZALES'
  if (centavos === 0) return `${palabras} ${moneda} ${entero === 1 ? 'EXACTO' : 'EXACTOS'}`
  return `${palabras} ${moneda} CON ${String(centavos).padStart(2, '0')}/100`
}

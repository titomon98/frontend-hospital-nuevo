# Revisión pendiente

Temas abiertos que necesitan una decisión antes de tocar código. Cada sección
tiene lo que sí está confirmado en el código y las preguntas que faltan responder.

---

## 1. Consumos no se muestran en Gerencia (hospitalizados y egresados)

Reportado en `src/config/documento_final.txt`, punto 2.

**No se aplicó ninguna corrección.** La causa está confirmada solo para la mitad
del síntoma y el arreglo obvio toca un endpoint compartido con Enfermería.

### Dónde está

Botón "Ver servicios" → `mostrarVerServicio(props.rowData.id)` → `getDataConsumos(id)`,
que apunta la vuetable a `/consumos/getId?id=<id_expediente>`.

Mismo código, triplicado, en los tres componentes de Gerencia (Admin):

| Componente | Listado | Línea del endpoint |
|---|---|---|
| `Admin/PacientesHospitalizados.vue` | `/expedientes/listPacientesActivos` | 899 |
| `Admin/PacientesHistorial.vue` (egresados) | `/expedientes/listPacientesHistorial` | 899 |
| `Admin/EmergenciasHistorial.vue` | `/expedientes/listEmergenciaHistorial` | 899 |

Backend: `controllers/caja/consumosController.js` → `getId`, línea 217.

### Causa confirmada (solo egresados)

`getId` recorre las cuentas del expediente y **solo acepta la que tenga
`estado == 1`** (cuenta abierta):

```js
for (const cuenta of cuentas) {
  if (cuenta.dataValues.estado == 1) { cuentaSeleccionada = cuenta; break; }
}
if (!cuentaSeleccionada) {
  return res.status(400).json({ msg: 'No se encontró ninguna cuenta activa para este expediente' });
}
```

`cuentasController.onPay` (línea 596) pone la cuenta en `estado: 0` al pagarla.
Entonces, para todo paciente egresado y con cuenta pagada, `getId` responde 400
y la tabla queda vacía. Esto explica el caso de **egresados**.

### Lo que NO está confirmado (hospitalizados)

Un paciente actualmente hospitalizado debería tener su cuenta en `estado 1`, así
que el filtro de arriba no explica por sí solo que tampoco se vean sus consumos.
Posibilidades que no pude descartar sin ver datos reales:

- `listPacientesActivos` filtra expedientes por `estado IN [1, 3, 4, 5, 91, 93, 94, 95]`
  (`expedientesController.js:40`). Falta confirmar qué significan los códigos `9x`
  y si esos pacientes conservan una cuenta abierta.
- Un expediente con varias cuentas donde la más reciente ya se pagó.

Hace falta una consulta a la base: para unos cuantos expedientes que Gerencia
lista como hospitalizados, ver `cuentas.estado` y si existe alguna con `estado = 1`.

### Por qué no se corrigió

Quitar el filtro `estado == 1` de `getId` es el arreglo evidente, pero **no es de
bajo riesgo**: ese endpoint también lo usan las pantallas de Enfermería
(`Hospitalizacion.vue:2717`, `Intensivo.vue:2689`, `Quirofano.vue:3152`). Hoy
esas pantallas dependen de que el endpoint apunte a la cuenta *abierta*; si pasa
a tomar la más reciente sin importar el estado, un paciente reingresado podría
mostrar consumos de una cuenta ya pagada — y eso sí toca cobro.

Ya existe `/consumos/getById/:id` (`obtenerConsumosPorIdCuenta`, línea 287) que
toma la cuenta más reciente sin filtrar por estado, que es justo lo que Gerencia
necesita. **Pero no es reemplazo directo:** devuelve un agregado sin paginar
(servicios + comunes + medicamentos + quirúrgicos + exámenes), incompatible con
la forma `{ total, last_page, current_page, data }` que espera la vuetable.

### Opciones para decidir

1. Endpoint nuevo de solo lectura para Gerencia: misma forma paginada que `getId`,
   pero tomando la cuenta más reciente sin filtrar por estado. No toca Enfermería.
2. Parámetro opcional en `getId` (ej. `?incluir_cerradas=1`) que Gerencia mande y
   Enfermería no. Menos código, pero modifica un endpoint compartido.
3. Antes de cualquiera de las dos: resolver el caso de hospitalizados con la
   consulta a la base descrita arriba, no sea que sean dos bugs distintos.

---

## 2. Flujo de paquetes en sala de operaciones

### Estado actual (confirmado en código)

`Quirofano.vue` → `setPaquete(data)` (~línea 4020) recorre `detalle_paquetes` y
mete cada ítem en `consumosTemporales`. Por cada ítem consulta
`/comun/getOne`, `/quirurgico/getOne` o `/medicamentos/getOne` según cuál de
`id_comun` / `id_quirurgico` / `id_medicamento` venga no nulo, y guarda:

```
id, tipo, nombre, cantidad, incluye_paquete, precio_venta, existencias, inventariado
```

- `precio_venta` sale de `subtotal / cantidad` del detalle del paquete, **no** del
  precio de lista del producto.
- Cambio de UI ya aplicado (commit `4a6a5d6`): la casilla **Cantidad** ahora
  arranca vacía (lo que se va a utilizar) y se muestra **Incluye el paquete** en
  lugar de las existencias. **No se tocó nada de cobro ni de inventario.**
- Al guardar, `onSaveMedicamento` / `onSaveQuirurgico` / `onSaveComunes` registran
  un movimiento por ítem. La validación previa
  (`cantidad <= 0 || (cantidad > existencias && inventariado === 'INVENTARIADO')`)
  sigue intacta.

### Lo que hoy hace el cobro

Cada ítem del paquete se cobra como movimiento individual al `precio_venta`
derivado del paquete, por la cantidad que quede en la casilla. **No existe hoy
ningún concepto de "precio del paquete" a nivel de cuenta**: el total del paquete
es la suma de sus ítems. Tampoco hay ninguna marca que diga que un movimiento
vino de un paquete.

### Preguntas

**Cobro completo vs. descuento de lo utilizado**

1. ¿El paquete se cobra siempre completo (precio cerrado), o se cobra solo lo que
   efectivamente se utilizó? Si es precio cerrado, ¿para qué sirve entonces la
   casilla de cantidad — solo para descargar inventario?
2. Si se utiliza **más** de lo que incluye el paquete, ¿el excedente se cobra
   aparte al precio normal del producto, o se absorbe?
3. Si se utiliza **menos**, ¿se rebaja la cuenta, o el paquete se cobra igual y la
   diferencia solo afecta inventario?
4. ¿Puede quedar en cero un ítem del paquete (no se usó nada) y aun así el paquete
   se cobra completo?

**Marcar material quirúrgico como "parte de paquete"**

5. ¿Dónde tiene que verse esa marca: solo en la pantalla de Quirófano, o también
   en la cuenta, el sumario y los PDF?
6. ¿Es una columna nueva en los movimientos (`movimientos_quirurgico` y las otras
   dos tablas de movimiento) o basta con derivarlo en el momento de mostrar?
   Lo primero es una migración; lo segundo no persiste nada y se pierde el dato
   histórico.
7. ¿Aplica solo a material quirúrgico, o también a medicamentos y comunes que
   vengan dentro de un paquete? Hoy los tres se guardan igual.

**Caso de seguro ítem por ítem**

8. Cuando el paciente tiene seguro, ¿el seguro cubre el paquete como una sola
   línea o hay que desglosarlo ítem por ítem para que el seguro apruebe cada uno?
9. Si es ítem por ítem: ¿qué precio se le reporta al seguro, el `precio_venta`
   derivado del paquete o el precio de lista del producto? Son distintos y hoy
   solo se persiste el primero.
10. ¿Hay ítems del paquete que el seguro típicamente no cubre? Si sí, ¿esos se le
    cobran al paciente por separado?

**Consumos sin inventario**

11. Hoy la validación solo bloquea por existencias si `inventariado === 'INVENTARIADO'`.
    ¿Los productos no inventariados dentro de un paquete se cobran igual que los
    inventariados, o tienen otra regla?
12. ¿Qué debe pasar si un ítem del paquete ya no tiene existencias al momento de
    usarlo — se bloquea el paquete completo, se permite guardar el resto, o se
    sustituye por otro producto?

---

## 3. Separar los cortes de hospital, laboratorio y honorarios

### Estado actual (confirmado en código)

`Caja/Cortes/Cortes.vue` es hoy una sola pantalla que mezcla las tres fuentes:

| Fuente | Endpoint |
|---|---|
| Cuentas de hospital | `/cuentas/payList`, `/cuentas/listCortesPerDate` |
| Honorarios médicos | `/reporte/medicos/honorarios`, `/voucher/getPacientesHonorarios` |
| Vouchers / banco | `/voucher/*`, `/banco/*` |

Del lado de laboratorio ya existe la infraestructura paralela pero **no está
conectada a esta pantalla**:

- `/lab_cuentas/list`, `/lab_cuentas/payList`, `/lab_cuentas/listDiscount`
- `/detalle/listCortesPerDate` (`labDetalleCuentasController`), que es el
  equivalente de `/cuentas/listCortesPerDate`

Es decir: el backend de laboratorio para cortes ya está; falta decidir la forma
de la pantalla.

### Preguntas

1. ¿"Separar" significa tres pestañas dentro de la misma pantalla de Cortes, o
   tres pantallas independientes en el menú (y por lo tanto tres rutas y permisos
   distintos)?
2. ¿Cada corte se cierra por separado, o se sigue cerrando un corte único de caja
   que internamente se desglosa en tres? Esto cambia si hace falta tabla nueva.
3. ¿Quién ve cada corte? Hoy `Cortes.vue` es de Caja. ¿El corte de laboratorio lo
   ve el personal de laboratorio, o sigue siendo solo de Caja/Gerencia?
4. ¿Los honorarios son un corte propio o una sección dentro del corte de hospital?
   Hoy salen de `/reporte/medicos/*`, que no es el mismo modelo que `cuentas`.
5. Para el rango de fechas: ¿los tres cortes usan el mismo corte de día, o
   laboratorio maneja otro horario? (El corte de habitación es a las 2 PM, pero
   eso es facturación de cuarto, no de caja.)
6. ¿Hace falta un consolidado que sume los tres, o con verlos por separado basta?

---

## 4. Egresados: reutilizar acciones de pacientes activos

### Estado actual (confirmado en código)

`Admin/PacientesHistorial.vue` (egresados) es prácticamente una copia de
`Admin/PacientesHospitalizados.vue`. **Ya tienen los mismos botones**: Ver recetas,
Ver servicios, Ver honorarios, Ver Examen, Consumos, Historial Cuenta, Ver
evolución, Ver órdenes médicas, Ver notas de enfermería.

El problema no es que falten botones, es que varios apuntan a endpoints que
exigen cuenta activa — ver la sección 1 de este documento.

Lo que **sí** existe en Caja y no está en Gerencia/egresados:

| Acción | Dónde vive hoy | Endpoint / método |
|---|---|---|
| Generar contrato | `Caja/Expedientes/Expedientes.vue:1118` | `generatePDF()`, jsPDF local, tamaño `legal` |
| Generar sumario | `Caja/Expedientes/Expedientes.vue:1393` | `/consumos/sumario/:id` + `generarPdfSumario()` |
| Cuenta total | `Caja/Expedientes/Expedientes.vue:562` | `generarCuentaTotal(...)` |
| Cuenta parcial | backend | `/consumos/cuentaParcial/:id` |
| Facturas | backend | `/facturas/getList`, `/facturas/create` |

### Preguntas

1. ¿Qué se necesita exactamente sobre un egresado: **ver** el contrato/sumario que
   ya se le generó, o poder **generar uno nuevo** después del egreso? Es una
   diferencia grande — hoy el contrato se arma en el navegador con jsPDF y no se
   guarda en ningún lado, así que "ver el original" no es posible sin persistirlo.
2. ¿Se guarda hoy el PDF del contrato en algún lugar (disco, tabla, sistema
   externo)? No encontré nada en el repo que lo persista. Si no se guarda, hay que
   decidir si se empieza a guardar o si se regenera cada vez.
3. Para el sumario y la cuenta: `/consumos/sumario/:id` y `/consumos/cuentaParcial/:id`
   ahora toman la cuenta vía `Cuenta.findOne` sobre el expediente. ¿Para un egresado
   con varias cuentas históricas, cuál se muestra: la última, o hay que poder elegir?
4. ¿La factura de un egresado es de solo lectura, o Gerencia necesita poder emitir
   una factura después del egreso?
5. ¿Estas acciones van en `PacientesHistorial.vue` (Gerencia) o también en Caja
   para pacientes ya egresados? Cambia dónde poner el código y qué permisos aplican.
6. ¿Aplica igual para egresados de emergencia (`EmergenciasHistorial.vue`), que
   tienen su propia hoja (`/consumos/hojaEmergencia/:id`)?

---

## 5. Pedidos pendientes por "medicamento" en vez de por "pedido"

### Estado actual (confirmado en código)

Hay dos juegos de pantallas de pedidos:

- `Enfermeria/Pedidos/` — `PedidosMedicamento.vue` usa `apiBase: '/pedidos/list'` y
  arma el correlativo con `/pedidos/getPerYear`. Este es el flujo que funciona.
- `Farmacia/Pedidos/` — `PedidosMedicamento.vue`, `PedidosComun.vue`,
  `PedidosQuirurgico.vue`, bajo `PedidosPendientesParent.vue`.

Las columnas de la tabla están definidas a nivel de **pedido**: la primera columna
de datos es `codigoPedido`. O sea, hoy una fila = un pedido, y el detalle
(los medicamentos que lo componen) vive en `detalle_pedidos`
(`/detalle_pedidos/list`, `/detalle_pedidos/getByAccount`).

### Hallazgo aparte que conviene revisar

En `Farmacia/Pedidos/PedidosMedicamento.vue:154` el `apiBase` es **`/banco/list`**,
y los métodos de create/update/deactivate apuntan a `/banco/*`. Los campos de la
tabla sí son de pedido (`codigoPedido`). Esto parece código copiado de la pantalla
de bancos que quedó a medio adaptar. No lo toqué. Habría que confirmar si esa
pantalla realmente funciona hoy o si nadie la usa.

### Preguntas

1. "Pendientes por medicamento" — ¿la fila pasa a ser un renglón de
   `detalle_pedidos` (un medicamento dentro de un pedido), o un medicamento
   **agregado** que suma las cantidades pendientes de todos los pedidos abiertos?
   Lo segundo es un agrupado nuevo en backend.
2. Si es agregado: ¿qué se muestra en la columna de pedido cuando un mismo
   medicamento viene de tres pedidos distintos — se listan los códigos, se omite,
   o se puede expandir la fila?
3. ¿Qué cuenta como "pendiente"? Falta confirmar qué campo/estado marca un renglón
   de `detalle_pedidos` como ya surtido.
4. ¿Se puede marcar como surtido un medicamento suelto desde esta pantalla, o las
   acciones siguen siendo a nivel de pedido completo?
5. ¿Este cambio aplica también a `PedidosComun.vue` y `PedidosQuirurgico.vue`, o
   solo a medicamentos?
6. Antes de nada: ¿se corrige primero lo del `apiBase` apuntando a `/banco/list`?
   Si esa pantalla hoy no trae datos reales, rehacerla por medicamento es
   reescribirla completa, no ajustarla.

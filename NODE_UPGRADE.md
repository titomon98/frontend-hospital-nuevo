# Subida a Node 20 LTS — frontend

Rama: `node-nuevos-cambios`. Objetivo: dejar `npm run build` en verde con Node 20.

---

## Fase 1 — Diagnóstico

Entorno de partida: Node 20.17.0, npm 10.8.2, nvm 0.40.1 (ya instalado, no hizo
falta instalarlo). Máquina Apple Silicon (arm64).

### Qué obliga a Node 14

**Ningún paquete lo declara en `engines`.** El bloqueo es de binario nativo, no de
metadatos, así que `npm ls` / `check-engine` no lo detectan.

Recorrí los 695 paquetes de `node_modules` que declaran `engines.node` y solo uno
excluye formalmente a Node 20:

| Paquete | Versión | `engines.node` | ¿Bloquea el build? |
|---|---|---|---|
| `@achrinza/node-ipc` | 9.2.2 | `8 \|\| 10 \|\| 12 \|\| 14 \|\| 16 \|\| 17` | No |

`@achrinza/node-ipc` entra como transitiva de `@vue/cli-shared-utils` (vía
`@vue/cli-service` y `@vue/cli-plugin-babel`). Lo usa el *dev server* para
comunicarse con la extensión de devtools, no la compilación. No hay que tocarlo.

### El bloqueo real: node-sass

`node-sass@4.14.1` declara `engines.node: ">=0.10.0"` — o sea, miente: no expresa
ninguna restricción. Pero es un módulo nativo y su binding compilado no sirve:

```
Node Sass does not yet support your current environment:
OS X Unsupported architecture (arm64) with Unsupported runtime (115)
```

Dos incompatibilidades a la vez:

- **Runtime 115** = ABI de Node 20. El binding instalado es `darwin-x64-83`
  (ABI 83 = Node 14), o sea que el `node_modules` actual se instaló con Node 14.
- **arm64**: node-sass 4.14.1 nunca publicó binarios para Apple Silicon; el
  binding presente es x64, instalado bajo Rosetta.

node-sass 4.x no tiene ninguna versión compatible con Node 20. La rama 4.x quedó
congelada y el proyecto está deprecado upstream en favor de dart-sass.

### Reemplazo: ya está en el proyecto

`sass` (dart-sass) **ya figura en devDependencies** en `1.51.0` y ya está
instalado. Es JS puro, sin binarios, y funciona en Node 20 / arm64 sin más.

O sea que hoy conviven las dos implementaciones. `sass-loader@8.0.2` resuelve cuál
usar en `getDefaultSassImplementation.js`, y **prefiere node-sass** si logra
resolverlo:

```js
let sassImplPkg = 'node-sass';
try { require.resolve('node-sass'); }
catch (error) { try { require.resolve('sass'); sassImplPkg = 'sass'; } ... }
```

Por eso el build muere: existe `node-sass`, el loader lo elige, y el binario no
carga. Quitando `node-sass` del `package.json`, el loader cae solo en `sass`, sin
tocar configuración ni `sass-loader`.

El proyecto tiene 9 archivos `.scss`, así que la ruta de sass sí se ejercita.

### Conclusión

No hay bloqueo. Un solo paquete a quitar (`node-sass`), con reemplazo ya presente
(`sass`). No hace falta subir `sass-loader` ni `@vue/cli-service`.

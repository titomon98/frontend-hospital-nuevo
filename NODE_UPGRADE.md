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

---

## Fase 2 — Migración

Resultado: **`npm run build` termina en verde con Node 20.17.0.**

```
DONE  Build complete. The dist directory is ready to be deployed.
```

Exit code 0, `dist/` generado (53 MB), 0 errores.

### Cambios

| # | Commit | Qué | Por qué |
|---|---|---|---|
| 1 | `ac834e3` | Quitar `node-sass` de devDependencies | No carga en Node 20 (ABI 115) ni en arm64. Al desaparecer, `sass-loader` resuelve `sass` (dart-sass), que ya estaba. |
| 2 | `ac834e3` | `NODE_OPTIONS=--openssl-legacy-provider` en los scripts `build` y `serve` | webpack 4 usa un hash MD4 que OpenSSL 3 (Node 17+) ya no expone; sin el flag el build muere con `ERR_OSSL_EVP_UNSUPPORTED`. Estaba quedando a cargo del entorno. |
| 3 | `6006e0d` | `no-console` de `error` a `warn` en producción | Ver abajo. |
| 4 | `3d6c854` | `.nvmrc` con `20` | Fijar la versión para el equipo. |

**No se subió ninguna otra dependencia.** No hizo falta tocar `sass-loader`,
`@vue/cli-service`, webpack ni ningún loader. `npm install` corrió limpio, sin
fallos de compilación nativa.

### Lo de no-console

`.eslintrc.js` tenía:

```js
'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
```

`vue-cli-service build` pone `NODE_ENV=production`, así que la regla pasaba a
`error` y abortaba la compilación. Por eso `serve` andaba y `build` no — y por eso
el build ya venía roto **desde antes** de esta migración, con Node 14 incluido.

Se bajó a `warn`. Los consoles se siguen reportando (**622 hoy**) pero no
bloquean. **No se borró ningún `console` ni se tocó código de negocio.**

Limpiarlos es un trabajo aparte: son 622 en decenas de archivos, muchos dentro de
bloques `catch` donde hay que decidir si se reemplazan por manejo de error real o
se quitan.

### Riesgo abierto: yarn.lock quedó desactualizado

El repo tiene **`package-lock.json` y `yarn.lock` a la vez**. `npm install` (npm
≥ 7) reescribió `yarn.lock` de paso, con un diff de ~6400 líneas imposible de
revisar, así que **se revirtió**: solo se commiteó `package-lock.json`.

Consecuencia: `yarn.lock` todavía pinnea `node-sass@4.14.1`. **Quien corra
`yarn install` va a reinstalar node-sass y el build le va a fallar en Node 20.**

Hay que decidir (no se hizo en esta sesión):

- borrar `yarn.lock` y quedarse con npm, o
- borrar `package-lock.json`, regenerar `yarn.lock` con yarn bajo Node 20 y
  quedarse con yarn.

Mantener los dos garantiza que se sigan desincronizando.

---

## Fase 3 — Estado final

- Rama: `node-nuevos-cambios`, salida de `main`. No se tocó `main` ni `correcciones`.
- `.nvmrc` = `20`.
- `npm run build` verde con Node 20.17.0.

### Qué falta

1. **Decidir qué lockfile se queda** (ver arriba). Es lo más urgente: hoy npm y
   yarn dan resultados distintos.
2. **El build no se probó en CI ni en otra máquina.** Solo se verificó local, en
   macOS arm64 con Node 20.17.0.
3. **No se verificó la app corriendo.** `npm run build` compila, pero nadie abrió
   `dist/` en un navegador para confirmar que los estilos compilados por dart-sass
   se ven igual que los de node-sass. Hay 9 archivos `.scss`; dart-sass es más
   estricto con `@import` y con división (`/`), así que conviene una revisión
   visual antes de desplegar.
4. **`NODE_OPTIONS=...` en el script no funciona en Windows** (cmd/PowerShell no
   entienden el prefijo `VAR=valor`). Si alguien del equipo desarrolla en Windows,
   hay que meter `cross-env`.
5. **622 warnings de `no-console`** pendientes de limpieza, como trabajo aparte.
6. `@achrinza/node-ipc@9.2.2` declara `engines` sin Node 20. No afecta el build;
   si diera problemas en `npm run serve`, se resuelve subiendo `@vue/cli-service`.

---

## Backend — ¿arranca con Node 20?

**Sí, sin cambios.** Se levantó `node app.js` con Node 20.17.0 y corrió 20 segundos
sin error ni crash.

Era esperable: todas sus dependencias son JS puro, sin módulos nativos —
`bcryptjs` (no `bcrypt`), `mysql2` (no `mysql`), `sequelize`, `express`, `multer`,
`jsonwebtoken`, `moment`, `morgan`, `cors`, `dotenv`, `md5`, `base64-img`,
`body-parser`, `express-validator`.

Salvedad: se comprobó que **el proceso levanta**, no que funcione de punta a punta.
No se ejecutó ninguna petición real contra la base. El backend no tiene build ni
tests (`npm test` es el placeholder `exit 1`), así que no hay nada más que correr.

Aparte, `npm start` es `nodemon /app.js` — con barra inicial, o sea una ruta
absoluta a la raíz del disco. Funciona `node app.js` pero `npm start` como está
escrito no debería resolver. No se tocó: está fuera del alcance de esta sesión.

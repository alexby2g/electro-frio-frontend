# Corrección AGR - Frontend Electro Frío

Se corrigió el error de Vite:

```text
Failed to resolve import "src/services/api"
Failed to fetch dynamically imported module
```

## Cambios aplicados

- Se mantuvo `src/services/api.js` como servicio central de Axios.
- Se cambiaron los imports de todas las páginas desde:

```js
import api, { extraerMensajeError } from 'src/services/api'
```

hacia:

```js
import api, { extraerMensajeError } from '../services/api.js'
```

- Páginas corregidas:
  - `src/pages/IndexPage.vue`
  - `src/pages/ClientesPage.vue`
  - `src/pages/ServiciosPage.vue`
  - `src/pages/TecnicosPage.vue`
  - `src/pages/EquiposPage.vue`
  - `src/pages/CitasPage.vue`
  - `src/pages/PagosPage.vue`

## Cómo probar

1. Copia este frontend reemplazando tu carpeta actual `ftelectrofrio`.
2. Crea el archivo `.env` si no existe:

```env
VITE_API_URL=http://127.0.0.1:8000/api
```

3. Instala dependencias:

```bash
npm install
```

4. Levanta Quasar:

```bash
npm run dev
```

## Importante

Este proyecto usa versiones nuevas de Quasar/Vite. Usa Node `22.22.0` o superior. Recomendado: Node 24 LTS.

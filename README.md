# API de programas académicos CUAC

API pública de solo lectura con el catálogo vigente de programas de la
Corporación Universitaria Autónoma del Cauca (CUAC).

Repositorio: <https://github.com/BICHO128/api-programas-cuac>

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/BICHO128/api-programas-cuac)

## Endpoint

```text
GET https://<proyecto>.vercel.app/carreras
```

También queda disponible:

```text
GET https://<proyecto>.vercel.app/carreras.json
```

La respuesta mantiene la forma de la API anterior:

```json
{
  "success": true,
  "cantidad": 25,
  "carreras": [
    {
      "_id": "68f01b83144b6d49ae7cdd0b",
      "codigoCu": "CU027",
      "codigoSnies": "19828",
      "titulo": "Administración de Empresas",
      "nivel": "Pregrado",
      "tipo": "Profesional",
      "facultad": "Facultad de Ciencias Administrativas, Contables y Económicas",
      "modalidad": "Presencial",
      "modalidades": ["Presencial"],
      "duracion": "9 semestres",
      "creditos": 175,
      "sede": "Popayán",
      "municipio": "Popayán",
      "departamento": "Cauca",
      "resolucion": "9941",
      "fechaResolucion": "2020-06-17",
      "costoMatricula": 3536000,
      "activo": true,
      "estadoSnies": "Activo",
      "imagen": "http://localhost:3000/Carreras/administracion.png",
      "imagenR": "administracion.png",
      "descripcion": "Formación para la dirección, administración y gestión estratégica de organizaciones.",
      "videoUrl": "https://www.youtube.com/watch?v=W82DiTm6liU",
      "updatedAt": "2026-11-04T23:13:10.356Z"
    }
  ]
}
```

## Contenido

- **25 programas vigentes**: 14 de pregrado y 11 de posgrado.
- Solo se incluyen programas con registro **SNIES activo**. Si un programa tiene
  varios registros activos, se usa el más reciente.
- Todos los registros publicados tienen `activo: true` y `estadoSnies: "Activo"`.
- Los 10 programas que ya existían en la API anterior conservan su `_id`, para
  que la sincronización de SIAC los actualice en lugar de duplicarlos.
- Todas las carreras publican `imagen` como URL absoluta con el formato
  `http://localhost:3000/Carreras/<archivo>` e `imagenR` con el nombre del
  archivo. El origen se puede cambiar con `CUAC_IMAGENES_BASE_URL` al regenerar
  el JSON.
- `descripcion` y `videoUrl` quedan en `null` cuando no hay información
  disponible. No se inventó contenido.
- La duración de **Hotelería y Turismo** se tomó del registro SNIES 52378 porque
  el registro activo 51774 no la reporta. El campo `nota` del registro lo indica.
- `modalidad` conserva la modalidad principal y `modalidades` lista las
  modalidades disponibles. **Especialización en Proyectos de Desarrollo** se
  publica una vez con `["Presencial", "Virtual"]`.

### Programas excluidos

Se excluyeron programas inactivos o reemplazados por una versión más reciente:

- Ingeniería de Sistemas (CU002, las dos filas).
- Ingeniería de Sistemas Informáticos (CU019).
- Licenciatura en Educación Preescolar (CU008).
- Licenciatura en Educación para la Primera Infancia (CU024).
- Deporte y Actividad Física (CU016).
- Técnica Profesional en Deporte y Recreación (CU018).
- Técnicos inactivos CU014, CU015, CU009 y CU017.
- Ingeniería Ambiental y Sanitaria (SNIES 20873): se considera reemplazada por
  Ingeniería Ambiental y de Saneamiento (SNIES 110683, 2021).
- Mercadeo (CU013): no tiene registro SNIES activo.
- Administración de Empresas CU006: comparte el mismo SNIES 19828 que CU027, que
  es el código que se publica para evitar duplicados.

## Regenerar el JSON

El JSON ya está generado. Para regenerarlo necesitas los dos Excel y `exceljs`.

### En el repositorio standalone `api-programas-cuac`

```bash
npm install exceljs
# Coloca los Excel en ./docs/ o define CUAC_FICHA_XLSX y CUAC_SNIES_XLSX
node generar-carreras.mjs
```

### Dentro del repositorio SIAC

```bash
node API/generar-carreras.mjs
```

El generador escribe `carreras.json` junto al script. Si los Excel no están en
`docs/`, puedes indicar sus rutas:

```bash
CUAC_FICHA_XLSX="C:\ruta\EDUINNOVA_ficha_programas_2026-2.xlsx"
CUAC_SNIES_XLSX="C:\ruta\Programas (1).xlsx"
```

Las imágenes se publican por defecto en `http://localhost:3000/Carreras`. Para
usar otro origen, define `CUAC_IMAGENES_BASE_URL` (sin barra final):

```bash
CUAC_IMAGENES_BASE_URL="https://sitio-cuac.vercel.app/Carreras" node generar-carreras.mjs
```

## Publicar en Vercel

### Si usas el repositorio standalone `api-programas-cuac` (recomendado)

1. Tener el repositorio en GitHub con `carreras.json` y `vercel.json` en la raíz.
2. Vercel → **Create New → Project**.
3. Importar `BICHO128/api-programas-cuac`.
4. **Framework Preset**: `Other`.
5. **Root Directory**: dejar la raíz del repositorio (no cambiarla).
6. **Build Command**: vacío.
7. **Output Directory**: `.`.
8. **Deploy**.
9. Probar `https://<proyecto>.vercel.app/carreras`.

Este proyecto queda independiente de SIAC, en tu cuenta de Vercel.

### Si publicas solo la carpeta `API/` desde el repo SIAC

1. Vercel → **Create New → Project**.
2. Importar el repositorio SIAC.
3. En **Root Directory**, seleccionar `API`.
4. **Framework Preset**: `Other`.
5. **Build Command**: vacío.
6. **Output Directory**: `.`.
7. **Deploy**.

> **Importante:** no dejes la raíz del repositorio SIAC como Root Directory; eso
> intentaría publicar todo el proyecto.

### Con la CLI, sin GitHub

```bash
cd API
npx vercel --prod
```

En la primera ejecución:

- **Framework**: Other.
- **Build Command**: vacío.
- **Output Directory**: `.`.
- **Link to existing project**: No.

Vercel imprimirá la URL del despliegue. El endpoint queda en
`https://<proyecto>.vercel.app/carreras`.

## Configuración de Vercel

`vercel.json` hace dos cosas:

1. Reescribe `/carreras` a `/carreras.json` para que la URL sea igual a la del
   ejemplo.
2. Agrega `Access-Control-Allow-Origin: *` y cache para que la API pueda
   llamarse desde otros dominios.

El archivo `.vercelignore` evita publicar este README, el generador, los Excel
de `docs/` y `node_modules/`. El despliegue queda con `carreras.json` (servido
en `/carreras` y `/carreras.json`) y `vercel.json` (configuración).

## Conectar SIAC con la nueva API

Cuando la API esté publicada, cambiar en `Backend/.env` y en las variables de
entorno de Render:

```env
CARRERAS_API_URL="https://<proyecto>.vercel.app/carreras"
```

Después ejecutar la sincronización desde SIAC:

```text
POST /api/v1/integracion/sincronizar-carreras
```

Los 10 programas que ya existían se actualizan por `_id`; los nuevos se insertan
y los que no aparezcan en el catálogo se marcan como inactivos.

## Actualizar el catálogo

1. Reemplazar los Excel en `docs/` si la universidad entrega una versión nueva.
2. Ajustar la lista `PROGRAMAS` del generador si hay altas, bajas o cambios de
   código SNIES.
3. Ejecutar `node generar-carreras.mjs` (standalone) o
   `node API/generar-carreras.mjs` (dentro de SIAC).
4. Revisar el cambio con `git diff carreras.json`.
5. Hacer commit y push. Si el proyecto de Vercel está conectado al repositorio,
   el redespliegue es automático. Si no, ejecutar `npx vercel --prod`.

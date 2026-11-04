/**
 * Genera carreras.json a partir de:
 *   - docs/EDUINNOVA_ficha_programas_2026-2.xlsx
 *   - docs/Programas (1).xlsx
 *
 * Funciona en dos ubicaciones:
 *   1. Dentro de SIAC:  node API/generar-carreras.mjs
 *   2. Repo standalone: node generar-carreras.mjs
 *
 * Los Excel se buscan en:
 *   - process.env.CUAC_FICHA_XLSX / process.env.CUAC_SNIES_XLSX
 *   - <carpeta del script>/docs/
 *   - <carpeta padre>/docs/  (cuando el script vive en API/)
 *
 * exceljs se busca en:
 *   - el node_modules del proyecto (npm install exceljs)
 *   - ../Backend/node_modules/exceljs (dentro de SIAC)
 *
 * Solo se publican programas con registro SNIES activo. Cuando un programa
 * tiene varios registros activos se usa el más reciente (ver PROGRAMAS).
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const scriptDir = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(scriptDir, '..');

function cargarExcelJS() {
  const candidatos = [
    'exceljs',
    path.join(scriptDir, 'node_modules', 'exceljs'),
    path.join(repoRoot, 'Backend', 'node_modules', 'exceljs'),
  ];
  for (const candidato of candidatos) {
    try {
      return require(candidato);
    } catch {
      // Probar el siguiente candidato.
    }
  }
  throw new Error(
    'No se encontró exceljs. Instálalo con "npm install exceljs" o ejecuta "cd Backend && pnpm install" dentro de SIAC.',
  );
}

function buscarArchivo(nombre, variableEntorno) {
  const candidatos = [
    process.env[variableEntorno],
    path.join(scriptDir, 'docs', nombre),
    path.join(repoRoot, 'docs', nombre),
  ].filter(Boolean);
  const encontrado = candidatos.find((ruta) => fs.existsSync(ruta));
  if (!encontrado) {
    throw new Error(
      `No se encontró "${nombre}". Colócalo en docs/ o define la variable ${variableEntorno}.`,
    );
  }
  return encontrado;
}

let ExcelJS;
try {
  ExcelJS = cargarExcelJS();
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

let RUTA_FICHA;
let RUTA_SNIES;
try {
  RUTA_FICHA = buscarArchivo(
    'EDUINNOVA_ficha_programas_2026-2.xlsx',
    'CUAC_FICHA_XLSX',
  );
  RUTA_SNIES = buscarArchivo('Programas (1).xlsx', 'CUAC_SNIES_XLSX');
} catch (error) {
  console.error(error.message);
  process.exit(1);
}

const RUTA_SALIDA = path.join(scriptDir, 'carreras.json');

/**
 * Catálogo vigente. Cada entrada apunta al registro SNIES activo que se
 * publica. Las descripciones, imágenes y videos se conservan solo cuando
 * ya existían en la API anterior; si no, quedan en null.
 */
const PROGRAMAS = [
  // Pregrado
  {
    codigoCu: 'CU027',
    codigoSnies: '19828',
    idExistente: '68f01b83144b6d49ae7cdd0b',
    imagen: 'administracion',
    descripcion:
      'Formación para la dirección, administración y gestión estratégica de organizaciones.',
    videoUrl: 'https://www.youtube.com/watch?v=W82DiTm6liU',
  },
  {
    codigoCu: 'CU028',
    codigoSnies: '103461',
    idExistente: '68f01b83144b6d49ae7cdd0c',
    imagen: 'contaduria',
    descripcion:
      'Formación en contabilidad, auditoría y finanzas para organizaciones públicas y privadas.',
    videoUrl: 'https://www.youtube.com/watch?v=YjzNGAfVJZA',
  },
  {
    codigoCu: 'CU005',
    codigoSnies: '20434',
    idExistente: '68f01b83144b6d49ae7cdd0d',
    imagen: 'derecho',
    descripcion:
      'Formación jurídica para promover justicia, derechos humanos y políticas públicas.',
    videoUrl: null,
  },
  {
    codigoCu: 'CU036',
    codigoSnies: '118108',
    idExistente: '68f01b83144b6d49ae7cdd13',
    imagen: 'entrenamiento_deportivo',
    descripcion:
      'El programa de pregrado en Entrenamiento Deportivo enfatiza el desarrollo de habilidades investigativas mediante laboratorios especializados en Fisiología del Ejercicio y Biomecánica. Profesional en Entrenamiento Deportivo bajo la Ley del Entrenador Deportivo (2020).',
    videoUrl: 'https://www.youtube.com/watch?v=TsqtscFlbjs',
  },
  {
    codigoCu: 'CU012',
    codigoSnies: '51772',
    idExistente: '68f01b83144b6d49ae7cdd0e',
    imagen: 'finanzas',
    descripcion:
      'Programa orientado al análisis financiero, mercados globales y comercio internacional.',
    videoUrl: 'https://www.youtube.com/watch?v=_Muo6YAT6KA',
  },
  {
    codigoCu: 'CU039',
    codigoSnies: '110011',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU007',
    codigoSnies: '51774',
    imagen: null,
    descripcion: null,
    videoUrl: null,
    duracionOverride: '10 semestres',
    nota: 'Duración tomada del registro SNIES 52378; el registro activo 51774 no la reporta.',
  },
  {
    codigoCu: 'CU046',
    codigoSnies: '110683',
    idExistente: '68f01b83144b6d49ae7cdd10',
    imagen: 'ambiental',
    descripcion:
      'Programa dedicado al diseño y gestión sostenible de recursos ambientales y saneamiento.',
    videoUrl: 'https://www.youtube.com/watch?v=IkV3DJVvupM',
  },
  {
    codigoCu: 'CU048',
    codigoSnies: '111155',
    idExistente: '68f01b83144b6d49ae7cdd11',
    imagen: 'civil',
    descripcion:
      'Ingeniero Civil será un profesional integral e innovador, con amplia visión gerencial para planificar y gestionar proyectos de ingeniería civil, generador de oportunidades de emprendimiento y con capacidad para liderar proyectos con un enfoque en el desarrollo sostenible de la región y el país.',
    videoUrl: 'https://www.youtube.com/watch?v=h3mxRWTTdII',
  },
  {
    codigoCu: 'CU038',
    codigoSnies: '110398',
    idExistente: '68f01b83144b6d49ae7cdd09',
    imagen: 'ingenieria_software',
    descripcion:
      'Programa de ingeniería enfocado en diseño, desarrollo y mantenimiento de software y sistemas computacionales.',
    videoUrl: 'https://www.youtube.com/watch?v=kb6ZG3GBscI',
  },
  {
    codigoCu: 'CU003',
    codigoSnies: '20415',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU044',
    codigoSnies: '110423',
    idExistente: '68f01b83144b6d49ae7cdd12',
    imagen: 'energetica',
    descripcion:
      'El Ingeniero energético egresado será un profesional capaz de proponer, liderar, gestionar y desarrollar soluciones en materia energética en el marco del desarrollo sostenible, eficiencia energética, calidad de la energía y sustitución de generación convencional por sistemas de energías limpias.',
    videoUrl: 'https://www.youtube.com/watch?v=jG_k7NfUOes',
  },
  {
    codigoCu: 'CU037',
    codigoSnies: '110414',
    idExistente: '68f01b83144b6d49ae7cdd0f',
    imagen: 'licenciatura',
    descripcion:
      'Formar Licenciados en Educación Infantil, con formación pedagógica incluyente desde una confluencia transdisciplinar y multicultural de saberes, que definen un perfil asociado al desarrollo de competencias en diversos contextos de los ámbitos local, nacional e internacional, lo que garantiza la proyección de profesionales competitivos, innovadores, emprendedores, con sensibilidad social y espíritu investigativo, capacitados para generar procesos de transformación de las diversas realidades asociadas a la primera infancia.',
    videoUrl: 'https://www.youtube.com/watch?v=llGJ11B2Sow',
  },
  {
    codigoCu: 'CU045',
    codigoSnies: '110670',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },

  // Posgrado
  {
    codigoCu: 'CU064',
    codigoSnies: '117987',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU035',
    codigoSnies: '118731',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU032',
    codigoSnies: '103900',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU030',
    codigoSnies: '103505',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU033',
    codigoSnies: '103579',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU031',
    codigoSnies: '104347',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU029',
    codigoSnies: '103767',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU063',
    codigoSnies: '110381',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU042',
    codigoSnies: '111545',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
  {
    codigoCu: 'CU034',
    codigoSnies: '103738',
    imagen: null,
    descripcion: null,
    videoUrl: null,
    modalidades: ['Presencial', 'Virtual'],
  },
  {
    codigoCu: 'CU062',
    codigoSnies: '117492',
    imagen: null,
    descripcion: null,
    videoUrl: null,
  },
];

const FACULTADES = {
  'Ciencias Administrativas, Contables y Económicas':
    'Facultad de Ciencias Administrativas, Contables y Económicas',
  'Ciencias Ambientales y Desarrollo Sostenible':
    'Facultad de Ciencias Ambientales y Desarrollo Sostenible',
  'Derecho, Ciencias Sociales y Políticas':
    'Facultad de Derecho, Ciencias Sociales y Políticas',
  Educación: 'Facultad de Educación',
  Ingeniería: 'Facultad de Ingeniería',
  'Escuela De Posgrados': 'Escuela de Posgrados',
};

function valor(celda) {
  const v = celda.value;
  if (v == null) return null;
  if (v instanceof Date) return v.toISOString().slice(0, 10);
  if (typeof v === 'object') {
    if ('result' in v) return v.result;
    if ('richText' in v) return v.richText.map((t) => t.text).join('');
    if ('text' in v) return v.text;
  }
  return v;
}

function texto(valorCelda) {
  const v = valor(valorCelda);
  return v == null ? null : String(v).trim() || null;
}

function numero(valorCelda) {
  const v = valor(valorCelda);
  if (v == null || v === '') return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function formatearDuracion(periodos, periodicidad) {
  if (!periodos || periodos <= 0) return null;
  const p = String(periodicidad ?? '').toLowerCase();
  if (p.includes('semestral')) {
    return `${periodos} ${periodos === 1 ? 'semestre' : 'semestres'}`;
  }
  if (p.includes('anual')) {
    return `${periodos} ${periodos === 1 ? 'año' : 'años'}`;
  }
  return `${periodos} ${periodos === 1 ? 'período' : 'períodos'}`;
}

function generarId(codigoCu, codigoSnies, titulo) {
  return crypto
    .createHash('sha1')
    .update(`cuac:${codigoCu}:${codigoSnies}:${titulo}`)
    .digest('hex')
    .slice(0, 24);
}

async function leerFicha() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(RUTA_FICHA);
  const ws = wb.getWorksheet('Ficha de programas');
  if (!ws) throw new Error('No existe la hoja "Ficha de programas".');

  const porCodigo = new Map();
  for (let r = 5; r <= ws.rowCount; r++) {
    const fila = ws.getRow(r);
    const codigoCu = texto(fila.getCell(1));
    if (!codigoCu) continue;
    if (porCodigo.has(codigoCu)) continue;
    porCodigo.set(codigoCu, {
      codigoCu,
      titulo: texto(fila.getCell(4)),
      tipo: texto(fila.getCell(5)),
      nivel: texto(fila.getCell(6)),
      facultad: texto(fila.getCell(7)),
      estado: texto(fila.getCell(8)),
    });
  }
  return porCodigo;
}

async function leerSnies() {
  const wb = new ExcelJS.Workbook();
  await wb.xlsx.readFile(RUTA_SNIES);
  const ws = wb.getWorksheet('Programas');
  if (!ws) throw new Error('No existe la hoja "Programas".');

  const porCodigo = new Map();
  for (let r = 2; r <= ws.rowCount; r++) {
    const fila = ws.getRow(r);
    const codigo = texto(fila.getCell(8));
    if (!codigo) continue;
    if (porCodigo.has(codigo)) {
      throw new Error(`Código SNIES duplicado en el Excel: ${codigo}`);
    }
    porCodigo.set(codigo, {
      codigo,
      nombre: texto(fila.getCell(10)),
      estado: texto(fila.getCell(12)),
      resolucion: texto(fila.getCell(16)),
      fechaResolucion: texto(fila.getCell(17)),
      nivel: texto(fila.getCell(26)),
      formacion: texto(fila.getCell(27)),
      modalidad: texto(fila.getCell(28)),
      creditos: numero(fila.getCell(29)),
      periodos: numero(fila.getCell(30)),
      periodicidad: texto(fila.getCell(31)),
      departamento: texto(fila.getCell(35)),
      municipio: texto(fila.getCell(36)),
      costo: numero(fila.getCell(37)),
    });
  }
  return porCodigo;
}

async function main() {
  const ficha = await leerFicha();
  const snies = await leerSnies();
  const generadoEn = new Date().toISOString();
  const ids = new Set();
  const codigosCu = new Set();

  const carreras = PROGRAMAS.map((config) => {
    const f = ficha.get(config.codigoCu);
    const s = snies.get(config.codigoSnies);

    if (!f) throw new Error(`No existe ${config.codigoCu} en la ficha.`);
    if (!s) {
      throw new Error(
        `No existe el código SNIES ${config.codigoSnies} (${config.codigoCu}).`,
      );
    }
    if (f.estado !== 'Activo') {
      throw new Error(`${config.codigoCu} no está activo en la ficha.`);
    }
    if (s.estado !== 'Activo') {
      throw new Error(
        `${config.codigoCu} / SNIES ${config.codigoSnies} no está activo en SNIES.`,
      );
    }

    const facultad = FACULTADES[f.facultad];
    if (!facultad) {
      throw new Error(
        `Facultad sin normalizar para ${config.codigoCu}: "${f.facultad}".`,
      );
    }

    const id =
      config.idExistente ??
      generarId(config.codigoCu, config.codigoSnies, f.titulo);
    if (ids.has(id)) {
      throw new Error(`ID duplicado: ${id} (${config.codigoCu}).`);
    }
    if (codigosCu.has(config.codigoCu)) {
      throw new Error(`Código CU duplicado: ${config.codigoCu}.`);
    }
    ids.add(id);
    codigosCu.add(config.codigoCu);

    const modalidades = (config.modalidades ?? [s.modalidad]).filter(Boolean);

    return {
      _id: id,
      codigoCu: config.codigoCu,
      codigoSnies: config.codigoSnies,
      titulo: f.titulo,
      nivel: f.nivel,
      tipo: f.tipo,
      facultad,
      modalidad: s.modalidad,
      modalidades,
      duracion:
        config.duracionOverride ??
        formatearDuracion(s.periodos, s.periodicidad),
      creditos: s.creditos,
      sede: s.municipio,
      municipio: s.municipio,
      departamento: s.departamento,
      resolucion: s.resolucion,
      fechaResolucion: s.fechaResolucion,
      costoMatricula: s.costo,
      activo: true,
      estadoSnies: s.estado,
      imagen: config.imagen ?? null,
      imagenR: config.imagen ?? null,
      descripcion: config.descripcion ?? null,
      videoUrl: config.videoUrl ?? null,
      updatedAt: generadoEn,
      ...(config.nota ? { nota: config.nota } : {}),
    };
  });

  carreras.sort((a, b) => {
    const ordenNivel = { Pregrado: 0, Posgrado: 1 };
    const porNivel =
      (ordenNivel[a.nivel] ?? 9) - (ordenNivel[b.nivel] ?? 9);
    if (porNivel !== 0) return porNivel;
    return a.titulo.localeCompare(b.titulo, 'es', { sensitivity: 'base' });
  });

  const salida = {
    success: true,
    cantidad: carreras.length,
    version: '2026-2',
    institucion: 'Corporación Universitaria Autónoma del Cauca',
    generadoEn,
    fuente: [
      'docs/EDUINNOVA_ficha_programas_2026-2.xlsx',
      'docs/Programas (1).xlsx',
    ],
    carreras,
  };

  fs.writeFileSync(RUTA_SALIDA, `${JSON.stringify(salida, null, 2)}\n`, 'utf8');

  const pregrado = carreras.filter((c) => c.nivel === 'Pregrado').length;
  const posgrado = carreras.filter((c) => c.nivel === 'Posgrado').length;
  console.log(
    `Generado ${path.relative(process.cwd(), RUTA_SALIDA) || path.basename(RUTA_SALIDA)}: ${carreras.length} programas (${pregrado} pregrado, ${posgrado} posgrado).`,
  );
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});

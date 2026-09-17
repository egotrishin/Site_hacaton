export type CompetitionApplication = {
  id: string;
  applicant_id: string;
  university: string;
  program: string;
  competition: string;
  education_form: 'Очная' | 'Очно-заочная' | 'Заочная';
  places: number;
  score: number;
  current_rank: number;
  priority: number;
  consent: boolean;
  status: string;
  additional_points: number;
  demo: true;
};

export const competitionDemoApplications: CompetitionApplication[] = [
  {
    id: 'APP-001',
    applicant_id: 'DEMO-001',
    university: 'Демонстрационный университет',
    program: 'Прикладная информатика',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 25,
    score: 287,
    current_rank: 8,
    priority: 1,
    consent: true,
    status: 'В конкурсном списке',
    additional_points: 10,
    demo: true,
  },
  {
    id: 'APP-002',
    applicant_id: 'DEMO-001',
    university: 'Северный политехнический институт',
    program: 'Программная инженерия',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 18,
    score: 287,
    current_rank: 21,
    priority: 2,
    consent: false,
    status: 'Ожидает согласие',
    additional_points: 10,
    demo: true,
  },
  {
    id: 'APP-003',
    applicant_id: 'DEMO-001',
    university: 'Городской университет технологий',
    program: 'Информационная безопасность',
    competition: 'Особая квота (демо)',
    education_form: 'Очная',
    places: 6,
    score: 287,
    current_rank: 4,
    priority: 3,
    consent: false,
    status: 'В конкурсном списке',
    additional_points: 10,
    demo: true,
  },
  {
    id: 'APP-004',
    applicant_id: 'DEMO-002',
    university: 'Волжская академия экономики',
    program: 'Экономика и анализ данных',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 30,
    score: 254,
    current_rank: 33,
    priority: 1,
    consent: true,
    status: 'Условно не проходит (демо)',
    additional_points: 6,
    demo: true,
  },
  {
    id: 'APP-005',
    applicant_id: 'DEMO-002',
    university: 'Институт гуманитарных практик',
    program: 'Медиакоммуникации',
    competition: 'Общий конкурс',
    education_form: 'Очно-заочная',
    places: 40,
    score: 254,
    current_rank: 18,
    priority: 2,
    consent: false,
    status: 'В конкурсном списке',
    additional_points: 6,
    demo: true,
  },
  {
    id: 'APP-006',
    applicant_id: 'DEMO-003',
    university: 'Северный политехнический институт',
    program: 'Системный анализ и управление',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 20,
    score: 273,
    current_rank: 12,
    priority: 1,
    consent: true,
    status: 'Условно проходит (демо)',
    additional_points: 4,
    demo: true,
  },
  {
    id: 'APP-007',
    applicant_id: 'DEMO-003',
    university: 'Демонстрационный университет',
    program: 'Бизнес-информатика',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 22,
    score: 273,
    current_rank: 27,
    priority: 2,
    consent: false,
    status: 'Условно не проходит (демо)',
    additional_points: 4,
    demo: true,
  },
  {
    id: 'APP-008',
    applicant_id: 'DEMO-003',
    university: 'Городской университет технологий',
    program: 'Информационные системы и технологии',
    competition: 'Целевая квота (демо)',
    education_form: 'Очная',
    places: 10,
    score: 273,
    current_rank: 9,
    priority: 3,
    consent: false,
    status: 'В конкурсном списке',
    additional_points: 4,
    demo: true,
  },
  {
    id: 'APP-009',
    applicant_id: 'DEMO-004',
    university: 'Институт гуманитарных практик',
    program: 'Лингвистика и цифровые сервисы',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 26,
    score: 241,
    current_rank: 14,
    priority: 1,
    consent: true,
    status: 'Условно проходит (демо)',
    additional_points: 8,
    demo: true,
  },
  {
    id: 'APP-010',
    applicant_id: 'DEMO-004',
    university: 'Волжская академия экономики',
    program: 'Государственное и муниципальное управление',
    competition: 'Общий конкурс',
    education_form: 'Заочная',
    places: 35,
    score: 241,
    current_rank: 41,
    priority: 2,
    consent: false,
    status: 'Условно не проходит (демо)',
    additional_points: 8,
    demo: true,
  },
  {
    id: 'APP-011',
    applicant_id: 'DEMO-005',
    university: 'Городской университет технологий',
    program: 'Прикладная математика и информатика',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 28,
    score: 299,
    current_rank: 3,
    priority: 1,
    consent: true,
    status: 'Условно проходит (демо)',
    additional_points: 10,
    demo: true,
  },
  {
    id: 'APP-012',
    applicant_id: 'DEMO-005',
    university: 'Северный политехнический институт',
    program: 'Искусственный интеллект и данные',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 15,
    score: 299,
    current_rank: 5,
    priority: 2,
    consent: false,
    status: 'В конкурсном списке',
    additional_points: 10,
    demo: true,
  },
  {
    id: 'APP-013',
    applicant_id: 'DEMO-005',
    university: 'Демонстрационный университет',
    program: 'Робототехника',
    competition: 'Общий конкурс',
    education_form: 'Очная',
    places: 12,
    score: 299,
    current_rank: 2,
    priority: 3,
    consent: false,
    status: 'В конкурсном списке',
    additional_points: 10,
    demo: true,
  },
];

export const competitionRequiredColumns = [
  'applicant_id',
  'university',
  'program',
  'competition',
  'education_form',
  'places',
  'score',
  'current_rank',
  'priority',
  'consent',
  'status',
  'additional_points',
] as const;

type CompetitionRequiredColumn = (typeof competitionRequiredColumns)[number];

type CompetitionStats = {
  rows: number;
  applications: number;
  uniqueApplicants: number;
};

export class CompetitionFileError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CompetitionFileError';
  }
}

function normalizeHeader(value: unknown) {
  return String(value ?? '').trim().toLowerCase();
}

function splitCsvLine(line: string, delimiter: string) {
  const cells: string[] = [];
  let current = '';
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index];

    if (char === '"') {
      const next = line[index + 1];
      if (quoted && next === '"') {
        current += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
      continue;
    }

    if (char === delimiter && !quoted) {
      cells.push(current.trim());
      current = '';
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function detectDelimiter(headerLine: string) {
  const delimiters = [',', ';', '\t'];
  const scored = delimiters.map((delimiter) => ({ delimiter, score: (headerLine.match(new RegExp(`\\${delimiter}`, 'g')) ?? []).length }));
  scored.sort((left, right) => right.score - left.score);
  return scored[0]?.score ? scored[0].delimiter : ',';
}

function toTableRowsFromCsv(text: string) {
  const lines = text
    .replace(/^\uFEFF/, '')
    .split(/\r?\n/)
    .filter((line) => line.trim().length > 0);

  if (lines.length === 0) {
    throw new CompetitionFileError('Файл пустой. Добавьте данные и попробуйте снова.');
  }

  const delimiter = detectDelimiter(lines[0]);
  return lines.map((line) => splitCsvLine(line, delimiter));
}

function parseNumber(value: unknown, label: string) {
  const prepared = String(value ?? '').trim().replace(',', '.');
  const parsed = Number(prepared);

  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < 0) {
    throw new CompetitionFileError(`Неверное число в поле «${label}».`);
  }

  return parsed;
}

function parseConsent(value: unknown) {
  const normalized = String(value ?? '').trim().toLowerCase();

  if (['true', '1', 'yes', 'да', 'y', 'д'].includes(normalized)) return true;
  if (['false', '0', 'no', 'нет', 'n', 'н'].includes(normalized)) return false;

  throw new CompetitionFileError('Поле «consent» должно быть true/false, 1/0 или да/нет.');
}

function parseEducationForm(value: unknown): CompetitionApplication['education_form'] {
  const normalized = String(value ?? '').trim();
  if (normalized === 'Очная' || normalized === 'Очно-заочная' || normalized === 'Заочная') {
    return normalized;
  }

  throw new CompetitionFileError('Поле «education_form» должно быть: Очная, Очно-заочная или Заочная.');
}

function parseRows(rows: unknown[][]) {
  if (!rows.length || rows[0].length === 0) {
    throw new CompetitionFileError('Файл поврежден или не содержит заголовков.');
  }

  const headers = rows[0].map((cell) => normalizeHeader(cell));
  const headerIndex = new Map<string, number>();
  headers.forEach((header, index) => {
    if (header) headerIndex.set(header, index);
  });

  const missingColumns = competitionRequiredColumns.filter((column) => !headerIndex.has(column));
  if (missingColumns.length > 0) {
    throw new CompetitionFileError(`Отсутствуют обязательные столбцы: ${missingColumns.join(', ')}.`);
  }

  const getCell = (row: unknown[], column: CompetitionRequiredColumn) => {
    const index = headerIndex.get(column);
    if (index === undefined) return '';
    return row[index] ?? '';
  };

  const applications: CompetitionApplication[] = [];
  let nonEmptyRows = 0;

  for (let rowIndex = 1; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex] ?? [];
    const isEmpty = row.every((cell) => String(cell ?? '').trim() === '');
    if (isEmpty) continue;
    nonEmptyRows += 1;

    const applicantId = String(getCell(row, 'applicant_id')).trim();
    if (!applicantId) {
      throw new CompetitionFileError(`Строка ${rowIndex + 1}: отсутствует applicant_id.`);
    }

    const university = String(getCell(row, 'university')).trim();
    const program = String(getCell(row, 'program')).trim();
    const competition = String(getCell(row, 'competition')).trim();
    const status = String(getCell(row, 'status')).trim();

    if (!university || !program || !competition || !status) {
      throw new CompetitionFileError(`Строка ${rowIndex + 1}: заполните обязательные текстовые поля.`);
    }

    applications.push({
      id: `IMP-${String(applications.length + 1).padStart(3, '0')}`,
      applicant_id: applicantId,
      university,
      program,
      competition,
      education_form: parseEducationForm(getCell(row, 'education_form')),
      places: parseNumber(getCell(row, 'places'), 'places'),
      score: parseNumber(getCell(row, 'score'), 'score'),
      current_rank: parseNumber(getCell(row, 'current_rank'), 'current_rank'),
      priority: parseNumber(getCell(row, 'priority'), 'priority'),
      consent: parseConsent(getCell(row, 'consent')),
      status,
      additional_points: parseNumber(getCell(row, 'additional_points'), 'additional_points'),
      demo: true,
    });
  }

  if (nonEmptyRows === 0) {
    throw new CompetitionFileError('Файл пустой. Добавьте хотя бы одну строку с данными.');
  }

  if (applications.length === 0) {
    throw new CompetitionFileError('Не удалось прочитать строки с заявлениями.');
  }

  return {
    applications,
    stats: {
      rows: nonEmptyRows,
      applications: applications.length,
      uniqueApplicants: new Set(applications.map((item) => item.applicant_id)).size,
    } satisfies CompetitionStats,
  };
}

export function getCompetitionStats(records: CompetitionApplication[], rows = records.length) {
  return {
    rows,
    applications: records.length,
    uniqueApplicants: new Set(records.map((item) => item.applicant_id)).size,
  } satisfies CompetitionStats;
}

export async function parseCompetitionFile(file: File) {
  const extension = file.name.split('.').pop()?.toLowerCase();

  if (extension !== 'csv' && extension !== 'xlsx') {
    throw new CompetitionFileError('Поддерживаются только CSV и XLSX файлы.');
  }

  if (file.size === 0) {
    throw new CompetitionFileError('Файл пустой. Добавьте данные и попробуйте снова.');
  }

  try {
    if (extension === 'csv') {
      const text = await file.text();
      const rows = toTableRowsFromCsv(text);
      return parseRows(rows);
    }

    const { read, utils } = await import('xlsx');
    const buffer = await file.arrayBuffer();
    const workbook = read(buffer, { type: 'array', cellDates: false });
    const firstSheetName = workbook.SheetNames[0];

    if (!firstSheetName) {
      throw new CompetitionFileError('Файл поврежден: не найден лист с данными.');
    }

    const worksheet = workbook.Sheets[firstSheetName];
    const rows = utils.sheet_to_json<(string | number | boolean)[]>(worksheet, {
      header: 1,
      defval: '',
      raw: false,
      blankrows: false,
    }) as unknown[][];

    return parseRows(rows);
  } catch (error) {
    if (error instanceof CompetitionFileError) {
      throw error;
    }

    throw new CompetitionFileError('Файл поврежден или имеет некорректный формат.');
  }
}

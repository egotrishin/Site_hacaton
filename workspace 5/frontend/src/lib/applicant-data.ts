export type AdmissionStrategy = 'ege' | 'olympiads' | 'both' | 'undecided';

export type PreparationLevel = 'not_started' | 'starting' | 'preparing' | 'active' | 'unknown';

export type ChecklistTask = {
  id: string;
  title: string;
  description: string;
  category: string;
  deadline: string;
  completed: boolean;
  custom: boolean;
};

export type FavoriteType = 'ege_review' | 'olympiad_advice' | 'material' | 'olympiad' | 'event';

export type FavoriteItem = {
  id: string;
  type: FavoriteType;
  title: string;
  sourceId: string;
  savedAt: string;
};

export type PersonalDeadlineCategory = 'ЕГЭ' | 'олимпиады' | 'документы' | 'выбор вуза' | 'подготовка' | 'другое';

export type PersonalDeadline = {
  id: string;
  title: string;
  description: string;
  date: string;
  category: PersonalDeadlineCategory;
  completed: boolean;
};

export type OnboardingData = {
  grade: string;
  admissionYear: string;
  strategy: AdmissionStrategy | '';
  subjects: string[];
  direction: string;
  preparationLevel: PreparationLevel | '';
  completed: boolean;
};

const ONBOARDING_KEY = 'applicant-notebook:onboarding:v1';
const CHECKLIST_KEY = 'applicant-notebook:checklist:v1';
const FAVORITES_KEY = 'applicant-notebook:favorites:v1';
const PERSONAL_DEADLINES_KEY = 'applicant-notebook:personal-deadlines:v1';

const emptyOnboardingState: OnboardingData = {
  grade: '',
  admissionYear: '',
  strategy: '',
  subjects: [],
  direction: '',
  preparationLevel: '',
  completed: false,
};

const strategyLabels: Record<AdmissionStrategy, string> = {
  ege: 'ЕГЭ',
  olympiads: 'Олимпиады',
  both: 'ЕГЭ + олимпиады',
  undecided: 'Пока не определился',
};

const preparationLabels: Record<PreparationLevel, string> = {
  not_started: 'Не начинал',
  starting: 'Начинаю',
  preparing: 'Готовлюсь',
  active: 'Активно готовлюсь',
  unknown: 'Не знаю',
};

type ChecklistTemplate = Omit<ChecklistTask, 'id' | 'completed' | 'custom'>;

const baseTemplates: ChecklistTemplate[] = [
  { title: 'Определить направление', description: 'Выбрать приоритетное направление поступления.', category: 'Общие', deadline: '' },
  { title: 'Выбрать предметы', description: 'Определить набор предметов для подготовки.', category: 'Общие', deadline: '' },
  { title: 'Составить список вузов', description: 'Собрать список интересующих вузов и программ.', category: 'Общие', deadline: '' },
  { title: 'Изучить требования', description: 'Проверить проходные баллы и условия поступления.', category: 'Общие', deadline: '' },
  { title: 'Проверить достижения', description: 'Оценить дипломы, портфолио и индивидуальные достижения.', category: 'Общие', deadline: '' },
  { title: 'Составить план', description: 'Разложить подготовку по неделям.', category: 'Общие', deadline: '' },
  { title: 'Подготовить документы', description: 'Собрать обязательный пакет документов заранее.', category: 'Общие', deadline: '' },
  { title: 'Отметить важные даты', description: 'Зафиксировать дедлайны и ключевые этапы.', category: 'Общие', deadline: '' },
];

const egeTemplates: ChecklistTemplate[] = [
  { title: 'Выбрать материалы', description: 'Подобрать учебники, курсы и практикумы.', category: 'ЕГЭ', deadline: '' },
  { title: 'Пройти пробный вариант', description: 'Решить пробник и оценить текущий уровень.', category: 'ЕГЭ', deadline: '' },
  { title: 'Составить график', description: 'Определить регулярные сессии подготовки.', category: 'ЕГЭ', deadline: '' },
  { title: 'Завести список ошибок', description: 'Фиксировать типичные ошибки и повторять темы.', category: 'ЕГЭ', deadline: '' },
];

const olympiadTemplates: ChecklistTemplate[] = [
  { title: 'Найти олимпиады', description: 'Выбрать релевантные олимпиады по профилю.', category: 'Олимпиады', deadline: '' },
  { title: 'Проверить сроки', description: 'Зафиксировать даты отборочных и финалов.', category: 'Олимпиады', deadline: '' },
  { title: 'Изучить задания', description: 'Разобрать формат и сложность прошлых лет.', category: 'Олимпиады', deadline: '' },
  { title: 'Выбрать материалы', description: 'Подобрать подготовительные сборники и разборы.', category: 'Олимпиады', deadline: '' },
  { title: 'Составить план', description: 'Построить маршрут подготовки к этапам.', category: 'Олимпиады', deadline: '' },
];

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function safeRead<T>(key: string, fallback: T): T {
  if (!isBrowser()) return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeWrite<T>(key: string, value: T) {
  if (!isBrowser()) return;

  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore write errors in restricted environments
  }
}

function safeRemove(key: string) {
  if (!isBrowser()) return;
  window.localStorage.removeItem(key);
}

function normalizeOnboardingData(value: unknown): OnboardingData {
  if (!value || typeof value !== 'object') return getEmptyOnboardingData();

  const source = value as Partial<OnboardingData>;

  const strategy = typeof source.strategy === 'string' ? source.strategy : '';
  const preparationLevel = typeof source.preparationLevel === 'string' ? source.preparationLevel : '';

  return {
    grade: typeof source.grade === 'string' ? source.grade : '',
    admissionYear: typeof source.admissionYear === 'string' ? source.admissionYear : '',
    strategy: strategy as OnboardingData['strategy'],
    subjects: Array.isArray(source.subjects) ? source.subjects.filter((item): item is string => typeof item === 'string') : [],
    direction: typeof source.direction === 'string' ? source.direction : '',
    preparationLevel: preparationLevel as OnboardingData['preparationLevel'],
    completed: Boolean(source.completed),
  };
}

function normalizeChecklist(value: unknown): ChecklistTask[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const source = item as Partial<ChecklistTask>;
      return {
        id: typeof source.id === 'string' ? source.id : crypto.randomUUID(),
        title: typeof source.title === 'string' ? source.title : '',
        description: typeof source.description === 'string' ? source.description : '',
        category: typeof source.category === 'string' ? source.category : 'Общие',
        deadline: typeof source.deadline === 'string' ? source.deadline : '',
        completed: Boolean(source.completed),
        custom: Boolean(source.custom),
      };
    })
    .filter((task) => task.title.trim().length > 0);
}

function toTaskKey(task: Pick<ChecklistTask, 'title' | 'category'>) {
  return `${task.category.trim().toLowerCase()}::${task.title.trim().toLowerCase()}`;
}

function makeDefaultTask(template: ChecklistTemplate): ChecklistTask {
  return {
    id: crypto.randomUUID(),
    title: template.title,
    description: template.description,
    category: template.category,
    deadline: template.deadline,
    completed: false,
    custom: false,
  };
}

export function getEmptyOnboardingData(): OnboardingData {
  return { ...emptyOnboardingState, subjects: [] };
}

export function getStrategyLabel(strategy: OnboardingData['strategy']) {
  if (!strategy) return 'Пока не выбрана';
  return strategyLabels[strategy as AdmissionStrategy] ?? 'Пока не выбрана';
}

export function getPreparationLabel(level: OnboardingData['preparationLevel']) {
  if (!level) return 'Не указан';
  return preparationLabels[level as PreparationLevel] ?? 'Не указан';
}

export function loadOnboardingData(): OnboardingData {
  return normalizeOnboardingData(safeRead<unknown>(ONBOARDING_KEY, getEmptyOnboardingData()));
}

export function saveOnboardingData(value: OnboardingData) {
  safeWrite(ONBOARDING_KEY, value);
}

export function clearOnboardingData() {
  safeRemove(ONBOARDING_KEY);
}

function resolveTemplates(strategy: OnboardingData['strategy']): ChecklistTemplate[] {
  if (strategy === 'ege') return [...baseTemplates, ...egeTemplates];
  if (strategy === 'olympiads') return [...baseTemplates, ...olympiadTemplates];
  if (strategy === 'both') return [...baseTemplates, ...egeTemplates, ...olympiadTemplates];
  return [...baseTemplates];
}

export function createDefaultChecklist(strategy: OnboardingData['strategy']): ChecklistTask[] {
  return resolveTemplates(strategy).map(makeDefaultTask);
}

export function mergeChecklistWithDefaults(existing: ChecklistTask[], strategy: OnboardingData['strategy']) {
  const defaults = createDefaultChecklist(strategy);
  const existingKeys = new Set(existing.map(toTaskKey));
  const missing = defaults.filter((task) => !existingKeys.has(toTaskKey(task)));
  return [...existing, ...missing];
}

export function loadChecklist(): ChecklistTask[] {
  return normalizeChecklist(safeRead<unknown>(CHECKLIST_KEY, []));
}

export function saveChecklist(tasks: ChecklistTask[]) {
  safeWrite(CHECKLIST_KEY, tasks);
}

export function clearChecklist() {
  safeRemove(CHECKLIST_KEY);
}

export function getChecklistProgress(tasks: ChecklistTask[]) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);
  return { total, completed, percent };
}

export function getNearestActiveTask(tasks: ChecklistTask[]) {
  const active = tasks.filter((task) => !task.completed);
  if (active.length === 0) return null;

  const withDate = active.filter((task) => task.deadline);
  if (withDate.length > 0) {
    return withDate.sort((a, b) => {
      const timeA = new Date(a.deadline).getTime();
      const timeB = new Date(b.deadline).getTime();
      return timeA - timeB;
    })[0];
  }

  return active[0];
}

function normalizeFavoriteType(value: unknown): FavoriteType | null {
  if (value === 'ege_review' || value === 'olympiad_advice' || value === 'material' || value === 'olympiad' || value === 'event') {
    return value;
  }
  return null;
}

function normalizeFavorites(value: unknown): FavoriteItem[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const source = item as Partial<FavoriteItem>;
      const type = normalizeFavoriteType(source.type);
      if (!type) return null;

      const sourceId = typeof source.sourceId === 'string' ? source.sourceId.trim() : '';
      const title = typeof source.title === 'string' ? source.title.trim() : '';
      const id = typeof source.id === 'string' && source.id.trim().length > 0 ? source.id : `${type}:${sourceId}`;
      const savedAt = typeof source.savedAt === 'string' && source.savedAt.trim().length > 0 ? source.savedAt : new Date().toISOString();

      if (!sourceId || !title) return null;

      return {
        id,
        type,
        title,
        sourceId,
        savedAt,
      } as FavoriteItem;
    })
    .filter((item): item is FavoriteItem => item !== null);
}

function normalizePersonalDeadlineCategory(value: unknown): PersonalDeadlineCategory {
  if (value === 'ЕГЭ' || value === 'олимпиады' || value === 'документы' || value === 'выбор вуза' || value === 'подготовка' || value === 'другое') {
    return value;
  }
  return 'другое';
}

function normalizePersonalDeadlines(value: unknown): PersonalDeadline[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item) => item && typeof item === 'object')
    .map((item) => {
      const source = item as Partial<PersonalDeadline>;
      const title = typeof source.title === 'string' ? source.title.trim() : '';
      if (!title) return null;

      return {
        id: typeof source.id === 'string' && source.id.trim().length > 0 ? source.id : crypto.randomUUID(),
        title,
        description: typeof source.description === 'string' ? source.description : '',
        date: typeof source.date === 'string' ? source.date : '',
        category: normalizePersonalDeadlineCategory(source.category),
        completed: Boolean(source.completed),
      } as PersonalDeadline;
    })
    .filter((item): item is PersonalDeadline => item !== null);
}

export function loadFavorites(): FavoriteItem[] {
  return normalizeFavorites(safeRead<unknown>(FAVORITES_KEY, []));
}

export function saveFavorites(items: FavoriteItem[]) {
  safeWrite(FAVORITES_KEY, items);
}

export function clearFavorites() {
  safeRemove(FAVORITES_KEY);
}

export function isFavorite(type: FavoriteType, sourceId: string, favorites = loadFavorites()) {
  return favorites.some((item) => item.type === type && item.sourceId === sourceId);
}

export function toggleFavorite(payload: { type: FavoriteType; title: string; sourceId: string }) {
  const current = loadFavorites();
  const exists = current.some((item) => item.type === payload.type && item.sourceId === payload.sourceId);

  const next = exists
    ? current.filter((item) => !(item.type === payload.type && item.sourceId === payload.sourceId))
    : [
        {
          id: `${payload.type}:${payload.sourceId}`,
          type: payload.type,
          title: payload.title,
          sourceId: payload.sourceId,
          savedAt: new Date().toISOString(),
        },
        ...current,
      ];

  saveFavorites(next);
  return next;
}

export function loadPersonalDeadlines(): PersonalDeadline[] {
  return normalizePersonalDeadlines(safeRead<unknown>(PERSONAL_DEADLINES_KEY, []));
}

export function savePersonalDeadlines(deadlines: PersonalDeadline[]) {
  safeWrite(PERSONAL_DEADLINES_KEY, deadlines);
}

export function clearPersonalDeadlines() {
  safeRemove(PERSONAL_DEADLINES_KEY);
}

export function sortPersonalDeadlinesByDate(deadlines: PersonalDeadline[]) {
  return [...deadlines].sort((a, b) => {
    if (!a.date && !b.date) return a.title.localeCompare(b.title, 'ru');
    if (!a.date) return 1;
    if (!b.date) return -1;
    return new Date(a.date).getTime() - new Date(b.date).getTime();
  });
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today.getTime();
}

export function getNearestPersonalDeadlines(deadlines: PersonalDeadline[], limit = 3) {
  const now = startOfToday();

  return sortPersonalDeadlinesByDate(deadlines)
    .filter((item) => !item.completed && item.date && new Date(item.date).getTime() >= now)
    .slice(0, limit);
}

export function getOverduePersonalDeadlines(deadlines: PersonalDeadline[]) {
  const now = startOfToday();

  return sortPersonalDeadlinesByDate(deadlines)
    .filter((item) => !item.completed && item.date && new Date(item.date).getTime() < now);
}

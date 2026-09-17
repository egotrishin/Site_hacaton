import { useMemo, useState } from 'react';
import { BookOpenText, CalendarRange, ExternalLink, Filter, Heart, LogIn, Search, Trophy } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import { isFavorite, loadFavorites, toggleFavorite } from '@/lib/applicant-data';

type OlympiadItem = {
  id: string;
  title: string;
  subject: string;
  level: string;
  organizer: string;
  registrationStart: string;
  registrationEnd: string;
  eventDate: string;
  format: string;
  benefits: string;
  officialUrl: string;
  description: string;
  demo: boolean;
};

type AdviceItem = {
  id: string;
  author: string;
  olympiad: string;
  subject: string;
  level: string;
  preparationPlace: string;
  sourcesUsed: string;
  mentors: string;
  links: string[];
  tip: string;
  materialType: string;
};

const olympiadDemoItems: OlympiadItem[] = [
  {
    id: 'north-vector',
    title: 'Олимпиада «Северный вектор»',
    subject: 'Математика',
    level: 'Высокий',
    organizer: 'Учебный центр «Полюс знаний»',
    registrationStart: '2026-01-12',
    registrationEnd: '2026-02-07',
    eventDate: '2026-03-16',
    format: 'Онлайн + очный финал',
    benefits: 'Демо-описание льгот: возможны бонусы при поступлении в зависимости от правил вуза.',
    officialUrl: 'https://example.com/demo-olympiad-1',
    description: 'Подойдет тем, кто любит нестандартные задачи и хочет попробовать силы в многоэтапном формате.',
    demo: true,
  },
  {
    id: 'code-wave',
    title: 'Олимпиада «Кодовая волна»',
    subject: 'Информатика',
    level: 'Средний',
    organizer: 'Лаборатория «Техно-старт»',
    registrationStart: '2026-02-01',
    registrationEnd: '2026-02-25',
    eventDate: '2026-04-06',
    format: 'Онлайн',
    benefits: 'Демо-описание льгот: тренировочный формат для выбора дальнейшей стратегии подготовки.',
    officialUrl: 'https://example.com/demo-olympiad-2',
    description: 'Фокус на алгоритмах и логике. Хороший вариант для первого знакомства с олимпиадным темпом.',
    demo: true,
  },
  {
    id: 'human-track',
    title: 'Олимпиада «Гуманитарный трек»',
    subject: 'Обществознание',
    level: 'Базовый',
    organizer: 'Клуб «Диалог и аргумент»',
    registrationStart: '2026-01-25',
    registrationEnd: '2026-03-02',
    eventDate: '2026-04-20',
    format: 'Очный',
    benefits: 'Демо-описание льгот: может помочь выстроить портфолио и план подготовки к поступлению.',
    officialUrl: 'https://example.com/demo-olympiad-3',
    description: 'Подходит тем, кто хочет системно прокачать аргументацию, анализ текстов и работу с источниками.',
    demo: true,
  },
];

const adviceDemoItems: AdviceItem[] = [
  {
    id: 'advice-1',
    author: 'Анна, 11 класс',
    olympiad: 'Северный вектор',
    subject: 'Математика',
    level: 'Высокий',
    preparationPlace: 'Школьный кружок + самостоятельная подготовка',
    sourcesUsed: 'Сборники задач прошлых лет, еженедельные мини-разборы',
    mentors: 'Факультатив у школьного преподавателя',
    links: ['https://example.com/demo-math-notes', 'https://example.com/demo-math-archive'],
    tip: 'Лучше решать меньше, но регулярно: короткие сессии каждый день помогают держать форму.',
    materialType: 'Задания прошлых лет',
  },
  {
    id: 'advice-2',
    author: 'Илья, выпускник',
    olympiad: 'Кодовая волна',
    subject: 'Информатика',
    level: 'Средний',
    preparationPlace: 'Онлайн-группа с еженедельными встречами',
    sourcesUsed: 'Подборка алгоритмов и тренировочные контесты',
    mentors: 'Курс с куратором (демо)',
    links: ['https://example.com/demo-code-course', 'https://example.com/demo-code-tasks'],
    tip: 'После каждого пробника фиксируй 2–3 главные ошибки и повторяй их через неделю.',
    materialType: 'Курсы',
  },
  {
    id: 'advice-3',
    author: 'Мария, 10 класс',
    olympiad: 'Гуманитарный трек',
    subject: 'Обществознание',
    level: 'Базовый',
    preparationPlace: 'Школьный клуб дебатов',
    sourcesUsed: 'Короткие лекции, конспекты и карточки терминов',
    mentors: 'Поддержка преподавателя по обществознанию',
    links: ['https://example.com/demo-social-guide'],
    tip: 'Полезно готовить мини-план ответа заранее: это снижает стресс на очных турах.',
    materialType: 'Лекции',
  },
];

const futureMaterialBuckets = ['Лекции', 'Книги', 'Каналы', 'Сайты', 'Разборы', 'Задания прошлых лет', 'Курсы'];

const formatDate = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Демо-дата';
  }
  return new Intl.DateTimeFormat('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' }).format(date);
};

const getMonthKey = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return '';
  }
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
};

const getMonthLabel = (value: string) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return 'Без месяца';
  }
  return new Intl.DateTimeFormat('ru-RU', { month: 'long', year: 'numeric' }).format(date);
};

export default function Olympiads() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => loadFavorites());
  const [searchTerm, setSearchTerm] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [levelFilter, setLevelFilter] = useState('all');
  const [monthFilter, setMonthFilter] = useState('all');
  const [formatFilter, setFormatFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [adviceSubjectFilter, setAdviceSubjectFilter] = useState('all');
  const [adviceOlympiadFilter, setAdviceOlympiadFilter] = useState('all');
  const [adviceLevelFilter, setAdviceLevelFilter] = useState('all');
  const [adviceMaterialTypeFilter, setAdviceMaterialTypeFilter] = useState('all');

  const olympiadSubjects = useMemo(() => Array.from(new Set(olympiadDemoItems.map((item) => item.subject))), []);
  const olympiadLevels = useMemo(() => Array.from(new Set(olympiadDemoItems.map((item) => item.level))), []);
  const olympiadFormats = useMemo(() => Array.from(new Set(olympiadDemoItems.map((item) => item.format))), []);
  const olympiadMonths = useMemo(
    () =>
      Array.from(
        new Map(
          olympiadDemoItems.map((item) => {
            const key = getMonthKey(item.eventDate);
            return [key, getMonthLabel(item.eventDate)];
          }),
        ).entries(),
      ),
    [],
  );

  const filteredOlympiads = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return olympiadDemoItems.filter((item) => {
      const passesSearch = normalizedSearch.length === 0 || item.title.toLowerCase().includes(normalizedSearch);
      const passesSubject = subjectFilter === 'all' || item.subject === subjectFilter;
      const passesLevel = levelFilter === 'all' || item.level === levelFilter;
      const passesFormat = formatFilter === 'all' || item.format === formatFilter;
      const passesMonth = monthFilter === 'all' || getMonthKey(item.eventDate) === monthFilter;
      return passesSearch && passesSubject && passesLevel && passesFormat && passesMonth;
    });
  }, [searchTerm, subjectFilter, levelFilter, formatFilter, monthFilter]);

  const adviceSubjects = useMemo(() => Array.from(new Set(adviceDemoItems.map((item) => item.subject))), []);
  const adviceOlympiads = useMemo(() => Array.from(new Set(adviceDemoItems.map((item) => item.olympiad))), []);
  const adviceLevels = useMemo(() => Array.from(new Set(adviceDemoItems.map((item) => item.level))), []);
  const adviceMaterialTypes = useMemo(() => Array.from(new Set(adviceDemoItems.map((item) => item.materialType))), []);

  const filteredAdvice = useMemo(
    () =>
      adviceDemoItems.filter((item) => {
        const passesSubject = adviceSubjectFilter === 'all' || item.subject === adviceSubjectFilter;
        const passesOlympiad = adviceOlympiadFilter === 'all' || item.olympiad === adviceOlympiadFilter;
        const passesLevel = adviceLevelFilter === 'all' || item.level === adviceLevelFilter;
        const passesMaterialType = adviceMaterialTypeFilter === 'all' || item.materialType === adviceMaterialTypeFilter;
        return passesSubject && passesOlympiad && passesLevel && passesMaterialType;
      }),
    [adviceSubjectFilter, adviceOlympiadFilter, adviceLevelFilter, adviceMaterialTypeFilter],
  );

  const requestSignIn = () => {
    navigate('/login');
  };

  const handleToggleOlympiadFavorite = (item: OlympiadItem) => {
    if (!isSignedIn) {
      requestSignIn();
      return;
    }

    const next = toggleFavorite({
      type: 'olympiad',
      title: item.title,
      sourceId: item.id,
    });

    setFavorites(next);
  };

  const handleToggleAdviceFavorite = (item: AdviceItem) => {
    if (!isSignedIn) {
      requestSignIn();
      return;
    }

    const next = toggleFavorite({
      type: 'olympiad_advice',
      title: `Совет: ${item.author} — ${item.olympiad}`,
      sourceId: item.id,
    });

    setFavorites(next);
  };

  const handleToggleMaterialFavorite = (material: string) => {
    if (!isSignedIn) {
      requestSignIn();
      return;
    }

    const next = toggleFavorite({
      type: 'material',
      title: `Материал по олимпиадам: ${material}`,
      sourceId: `olympiads-material:${material.toLowerCase()}`,
    });

    setFavorites(next);
  };

  return (
    <PageFrame>
      <PageHero
        eyebrow="Раздел в разработке"
        title="Олимпиады: выбор, сроки и понятная подготовка"
        description="Сравнивай варианты, отслеживай дедлайны и собирай удобный маршрут подготовки без перегруза."
        icon={Trophy}
        aside={
          <div className="progress-card" aria-live="polite">
            <span>Демо-режим</span>
            <strong>{filteredOlympiads.length} олимпиад в подборке</strong>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${Math.max(25, Math.round((filteredOlympiads.length / olympiadDemoItems.length) * 100))}%` }} />
            </div>
          </div>
        }
      />

      <section className="content-section">
        <SectionHeading
          eyebrow="Календарь олимпиад"
          title="Подбери подходящие олимпиады"
          description="Все записи ниже демонстрационные и отмечены как «Демо». Реальные сроки и условия позже заполняются вручную."
        />

        <div className="task-form-card olympiad-controls" role="search" aria-label="Поиск и фильтры календаря олимпиад">
          <label className="wizard-block">
            <span className="wizard-label">Поиск по названию</span>
            <div className="olympiad-input-wrap">
              <Search size={16} aria-hidden="true" />
              <input
                className="wizard-input"
                type="search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                placeholder="Например, Кодовая волна"
              />
            </div>
          </label>

          <div className="olympiad-controls__grid">
            <label className="wizard-block">
              <span className="wizard-label">Предмет</span>
              <select className="wizard-input" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
                <option value="all">Все предметы</option>
                {olympiadSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Уровень</span>
              <select className="wizard-input" value={levelFilter} onChange={(event) => setLevelFilter(event.target.value)}>
                <option value="all">Все уровни</option>
                {olympiadLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Месяц</span>
              <select className="wizard-input" value={monthFilter} onChange={(event) => setMonthFilter(event.target.value)}>
                <option value="all">Любой месяц</option>
                {olympiadMonths.map(([monthKey, monthLabel]) => (
                  <option key={monthKey} value={monthKey}>{monthLabel}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Формат</span>
              <select className="wizard-input" value={formatFilter} onChange={(event) => setFormatFilter(event.target.value)}>
                <option value="all">Любой формат</option>
                {olympiadFormats.map((format) => (
                  <option key={format} value={format}>{format}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filteredOlympiads.length === 0 ? (
          <div className="empty-state empty-state--small">
            <div className="empty-state__art" aria-hidden="true"><Filter size={30} /><span>?</span></div>
            <h2>Ничего не найдено</h2>
            <p>Попробуй сбросить часть фильтров — тогда снова появятся демонстрационные карточки.</p>
          </div>
        ) : (
          <div className="events-grid">
            {filteredOlympiads.map((item, index) => {
              const toneClass = index % 4 === 0 ? 'event-card--blue' : index % 4 === 1 ? 'event-card--yellow' : index % 4 === 2 ? 'event-card--coral' : 'event-card--mint';
              const isExpanded = expandedId === item.id;

              return (
                <FadeIn key={item.id} className="event-wrap">
                  <article className={`event-card ${toneClass}`}>
                    <div className="event-card__meta">
                      <span><CalendarRange size={14} /> {formatDate(item.eventDate)}</span>
                      {item.demo && <span className="demo-badge">Демо</span>}
                    </div>

                    <div className="olympiad-card__copy">
                      <h3>{item.title}</h3>
                      <p>{item.description}</p>
                    </div>

                    <div className="olympiad-card__facts" aria-label="Краткие параметры олимпиады">
                      <div className="olympiad-card__fact"><strong>Предмет:</strong> <span>{item.subject}</span></div>
                      <div className="olympiad-card__fact"><strong>Уровень:</strong> <span>{item.level}</span></div>
                      <div className="olympiad-card__fact"><strong>Формат:</strong> <span>{item.format}</span></div>
                    </div>

                    {isExpanded && (
                      <div className="olympiad-details">
                        <p><strong>Организатор:</strong> {item.organizer}</p>
                        <p><strong>Регистрация:</strong> {formatDate(item.registrationStart)} — {formatDate(item.registrationEnd)}</p>
                        <p><strong>Преимущества:</strong> {item.benefits}</p>
                      </div>
                    )}

                    <div className="wizard-actions wizard-actions--wrap">
                      <button className="button button--secondary" type="button" onClick={() => setExpandedId((prev) => (prev === item.id ? null : item.id))}>
                        {isExpanded ? 'Скрыть' : 'Подробнее'}
                      </button>

                      {isSignedIn ? (
                        <button className="button button--secondary" type="button" onClick={() => handleToggleOlympiadFavorite(item)}>
                          <Heart size={16} /> {isFavorite('olympiad', item.id, favorites) ? 'В избранном' : 'Добавить в избранное'}
                        </button>
                      ) : (
                        <Link className="button button--secondary" to="/login">
                          <LogIn size={16} /> Войти, чтобы сохранить
                        </Link>
                      )}

                      <a className="button button--primary" href={item.officialUrl} target="_blank" rel="noreferrer">
                        Официальная страница <ExternalLink size={16} />
                      </a>
                    </div>
                  </article>
                </FadeIn>
              );
            })}
          </div>
        )}
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Советы по подготовке"
          title="Демонстрационные карточки с рабочими подходами"
          description="Здесь можно быстро отфильтровать советы и посмотреть, какие форматы подготовки подходят под конкретный предмет."
        />

        <div className="task-form-card olympiad-controls" aria-label="Фильтры советов по подготовке">
          <div className="olympiad-controls__grid">
            <label className="wizard-block">
              <span className="wizard-label">Предмет</span>
              <select className="wizard-input" value={adviceSubjectFilter} onChange={(event) => setAdviceSubjectFilter(event.target.value)}>
                <option value="all">Все предметы</option>
                {adviceSubjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Олимпиада</span>
              <select className="wizard-input" value={adviceOlympiadFilter} onChange={(event) => setAdviceOlympiadFilter(event.target.value)}>
                <option value="all">Все олимпиады</option>
                {adviceOlympiads.map((olympiad) => (
                  <option key={olympiad} value={olympiad}>{olympiad}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Уровень</span>
              <select className="wizard-input" value={adviceLevelFilter} onChange={(event) => setAdviceLevelFilter(event.target.value)}>
                <option value="all">Любой уровень</option>
                {adviceLevels.map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Тип материала</span>
              <select className="wizard-input" value={adviceMaterialTypeFilter} onChange={(event) => setAdviceMaterialTypeFilter(event.target.value)}>
                <option value="all">Любой тип</option>
                {adviceMaterialTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        {filteredAdvice.length === 0 ? (
          <div className="empty-state empty-state--small">
            <div className="empty-state__art" aria-hidden="true"><BookOpenText size={30} /><span>!</span></div>
            <h2>По выбранным фильтрам советов пока нет</h2>
            <p>Сбрось фильтры, чтобы снова увидеть демонстрационные рекомендации по подготовке.</p>
          </div>
        ) : (
          <div className="advice-grid">
            {filteredAdvice.map((item) => (
              <FadeIn key={item.id} className="event-wrap">
                <article className="advice-card">
                  <div className="event-card__meta">
                    <span>{item.subject} · {item.level}</span>
                    <span className="demo-badge">Демо</span>
                  </div>

                  <h3>{item.author}</h3>
                  <p className="advice-card__text">{item.tip}</p>

                  <div className="advice-list">
                    <p><strong>Олимпиада:</strong> {item.olympiad}</p>
                    <p><strong>Где готовился:</strong> {item.preparationPlace}</p>
                    <p><strong>Источники:</strong> {item.sourcesUsed}</p>
                    <p><strong>Курсы/преподаватели:</strong> {item.mentors}</p>
                    <p><strong>Тип материала:</strong> {item.materialType}</p>
                  </div>

                  <div className="advice-links" aria-label="Полезные ссылки из карточки">
                    {item.links.map((link) => (
                      <a key={link} className="advice-link" href={link} target="_blank" rel="noreferrer">
                        Демо-ссылка <ExternalLink size={14} />
                      </a>
                    ))}
                  </div>

                  <div className="wizard-actions wizard-actions--wrap">
                    {isSignedIn ? (
                      <button className="button button--secondary" type="button" onClick={() => handleToggleAdviceFavorite(item)}>
                        <Heart size={16} /> {isFavorite('olympiad_advice', item.id, favorites) ? 'В избранном' : 'Добавить в избранное'}
                      </button>
                    ) : (
                      <Link className="button button--secondary" to="/login">
                        <LogIn size={16} /> Войти, чтобы сохранить
                      </Link>
                    )}
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Полезные материалы"
          title="Раздел для будущего наполнения"
          description="Пока здесь только демонстрационная заготовка без реальных материалов и внешнего импорта."
        />

        <div className="materials-placeholder">
          <span className="demo-badge">Демо</span>
          <p>Скоро здесь появятся тематические подборки по разделам:</p>
          <div className="materials-grid">
            {futureMaterialBuckets.map((item) => {
              const sourceId = `olympiads-material:${item.toLowerCase()}`;
              const saved = isFavorite('material', sourceId, favorites);

              return (
                <button key={item} type="button" className="materials-chip materials-chip--action" onClick={() => handleToggleMaterialFavorite(item)}>
                  <span>{item}</span>
                  <small>{saved ? 'В избранном' : 'Сохранить'}</small>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <FadeIn className="quote-card">
        <BookOpenText size={24} />
        <p>Сейчас раздел работает в демонстрационном режиме: можно тренировать выбор, фильтры и планирование без реальных источников.</p>
      </FadeIn>
    </PageFrame>
  );
}

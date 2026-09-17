import { useEffect, useMemo, useRef, useState, type ChangeEvent } from 'react';
import { AlertTriangle, FileSearch, ListFilter, Rows3, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import {
  CompetitionFileError,
  competitionDemoApplications,
  getCompetitionStats,
  parseCompetitionFile,
  type CompetitionApplication,
} from '@/lib/competition-demo';

type LoadState = 'idle' | 'loading' | 'loaded' | 'error';

type DemoIndicator = {
  label: string;
  tone: 'pass' | 'warn' | 'fail';
  reason: string;
};

function getIndicator(application: CompetitionApplication): DemoIndicator {
  if (application.consent && application.current_rank <= application.places) {
    return {
      label: 'Условное прохождение (демо)',
      tone: 'pass',
      reason: 'Есть согласие, а текущее место находится в пределах количества мест.',
    };
  }

  if (application.current_rank <= application.places + 3) {
    return {
      label: 'Пограничная зона (демо)',
      tone: 'warn',
      reason: 'Текущее место рядом с границей мест, ситуация может измениться.',
    };
  }

  return {
    label: 'Условное непрохождение (демо)',
    tone: 'fail',
    reason: 'Текущее место заметно ниже числа мест или нет согласия.',
  };
}

function formatConsent(value: boolean) {
  return value ? 'Да' : 'Нет';
}

export default function Competition() {
  const [loadState, setLoadState] = useState<LoadState>('idle');
  const [applications, setApplications] = useState<CompetitionApplication[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [universityFilter, setUniversityFilter] = useState('all');
  const [programFilter, setProgramFilter] = useState('all');
  const [competitionFilter, setCompetitionFilter] = useState('all');
  const [educationFormFilter, setEducationFormFilter] = useState('all');
  const [consentFilter, setConsentFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [scoreMin, setScoreMin] = useState('');
  const [scoreMax, setScoreMax] = useState('');
  const [rankMin, setRankMin] = useState('');
  const [rankMax, setRankMax] = useState('');

  const [importNote, setImportNote] = useState('');
  const [loadError, setLoadError] = useState('');
  const [datasetStats, setDatasetStats] = useState<{ rows: number; applications: number; uniqueApplicants: number } | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const universityOptions = useMemo(() => ['all', ...new Set(applications.map((item) => item.university))], [applications]);
  const programOptions = useMemo(() => ['all', ...new Set(applications.map((item) => item.program))], [applications]);
  const competitionOptions = useMemo(() => ['all', ...new Set(applications.map((item) => item.competition))], [applications]);
  const educationFormOptions = useMemo(() => ['all', ...new Set(applications.map((item) => item.education_form))], [applications]);
  const statusOptions = useMemo(() => ['all', ...new Set(applications.map((item) => item.status))], [applications]);

  const filteredApplications = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    const parsedScoreMin = scoreMin === '' ? null : Number(scoreMin);
    const parsedScoreMax = scoreMax === '' ? null : Number(scoreMax);
    const parsedRankMin = rankMin === '' ? null : Number(rankMin);
    const parsedRankMax = rankMax === '' ? null : Number(rankMax);

    return applications.filter((item) => {
      const matchSearch = !normalizedSearch
        || item.applicant_id.toLowerCase().includes(normalizedSearch)
        || item.id.toLowerCase().includes(normalizedSearch)
        || item.university.toLowerCase().includes(normalizedSearch)
        || item.program.toLowerCase().includes(normalizedSearch)
        || item.competition.toLowerCase().includes(normalizedSearch);

      const matchUniversity = universityFilter === 'all' || item.university === universityFilter;
      const matchProgram = programFilter === 'all' || item.program === programFilter;
      const matchCompetition = competitionFilter === 'all' || item.competition === competitionFilter;
      const matchEducationForm = educationFormFilter === 'all' || item.education_form === educationFormFilter;
      const matchStatus = statusFilter === 'all' || item.status === statusFilter;
      const matchConsent = consentFilter === 'all'
        || (consentFilter === 'yes' && item.consent)
        || (consentFilter === 'no' && !item.consent);

      const matchScoreMin = parsedScoreMin === null || item.score >= parsedScoreMin;
      const matchScoreMax = parsedScoreMax === null || item.score <= parsedScoreMax;
      const matchRankMin = parsedRankMin === null || item.current_rank >= parsedRankMin;
      const matchRankMax = parsedRankMax === null || item.current_rank <= parsedRankMax;

      return matchSearch
        && matchUniversity
        && matchProgram
        && matchCompetition
        && matchEducationForm
        && matchStatus
        && matchConsent
        && matchScoreMin
        && matchScoreMax
        && matchRankMin
        && matchRankMax;
    });
  }, [applications, search, universityFilter, programFilter, competitionFilter, educationFormFilter, statusFilter, consentFilter, scoreMin, scoreMax, rankMin, rankMax]);

  useEffect(() => {
    if (loadState !== 'loaded') return;

    if (filteredApplications.length === 0) {
      setSelectedId(null);
      return;
    }

    const existsInFiltered = filteredApplications.some((item) => item.id === selectedId);
    if (!existsInFiltered) {
      setSelectedId(filteredApplications[0].id);
    }
  }, [filteredApplications, loadState, selectedId]);

  const selectedApplication = useMemo(
    () => filteredApplications.find((item) => item.id === selectedId) ?? null,
    [filteredApplications, selectedId],
  );

  const selectedApplicantRecords = useMemo(() => {
    if (!selectedApplication) return [];

    return applications
      .filter((item) => item.applicant_id === selectedApplication.applicant_id)
      .sort((left, right) => left.priority - right.priority);
  }, [applications, selectedApplication]);

  const foundApplicants = useMemo(
    () => new Set(filteredApplications.map((item) => item.applicant_id)).size,
    [filteredApplications],
  );

  const activeFilters = useMemo(() => {
    const entries: string[] = [];

    if (search.trim()) entries.push(`Поиск: ${search.trim()}`);
    if (universityFilter !== 'all') entries.push(`Вуз: ${universityFilter}`);
    if (programFilter !== 'all') entries.push(`Направление: ${programFilter}`);
    if (competitionFilter !== 'all') entries.push(`Конкурс: ${competitionFilter}`);
    if (educationFormFilter !== 'all') entries.push(`Форма: ${educationFormFilter}`);
    if (consentFilter !== 'all') entries.push(`Согласие: ${consentFilter === 'yes' ? 'Да' : 'Нет'}`);
    if (statusFilter !== 'all') entries.push(`Статус: ${statusFilter}`);
    if (scoreMin) entries.push(`Баллы от: ${scoreMin}`);
    if (scoreMax) entries.push(`Баллы до: ${scoreMax}`);
    if (rankMin) entries.push(`Место от: ${rankMin}`);
    if (rankMax) entries.push(`Место до: ${rankMax}`);

    return entries;
  }, [search, universityFilter, programFilter, competitionFilter, educationFormFilter, consentFilter, statusFilter, scoreMin, scoreMax, rankMin, rankMax]);

  const indicator = selectedApplication ? getIndicator(selectedApplication) : null;

  const resetFilters = () => {
    setSearch('');
    setUniversityFilter('all');
    setProgramFilter('all');
    setCompetitionFilter('all');
    setEducationFormFilter('all');
    setConsentFilter('all');
    setStatusFilter('all');
    setScoreMin('');
    setScoreMax('');
    setRankMin('');
    setRankMax('');
  };

  const applyDataset = (records: CompetitionApplication[], rows: number) => {
    setApplications(records);
    setDatasetStats(getCompetitionStats(records, rows));
    setSelectedId(records[0]?.id ?? null);
    setLoadState('loaded');
  };

  const handleLoadDemoData = () => {
    setLoadState('loading');
    setLoadError('');
    setImportNote('');

    window.setTimeout(() => {
      applyDataset(competitionDemoApplications, competitionDemoApplications.length);
      setImportNote('Загружен встроенный демо-набор с полностью вымышленными записями.');
    }, 280);
  };

  const handleChooseFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoadState('loading');
    setLoadError('');
    setImportNote('');

    try {
      const parsed = await parseCompetitionFile(file);
      applyDataset(parsed.applications, parsed.stats.rows);
      setImportNote(`Файл «${file.name}» успешно прочитан в демонстрационном режиме.`);
    } catch (error) {
      const message = error instanceof CompetitionFileError
        ? error.message
        : 'Ошибка загрузки файла. Проверьте формат и содержимое.';

      setLoadError(message);
      setLoadState('error');
      setApplications([]);
      setDatasetStats(null);
      setSelectedId(null);
    } finally {
      event.currentTarget.value = '';
    }
  };

  return (
    <PageFrame>
      <PageHero
        eyebrow="Конкурсные списки"
        title="Демо-раздел для спокойной тренировки сценариев"
        description="Здесь можно посмотреть, как выглядит загрузка, фильтрация и просмотр заявлений на полностью вымышленных данных."
        icon={Rows3}
        aside={<DemoBadge />}
      />

      <section className="content-section">
        <FadeIn className="competition-warning" role="note" aria-live="polite">
          <AlertTriangle size={20} />
          <div>
            <p>Демонстрационный режим. Данные и расчеты не являются официальным прогнозом поступления</p>
            <p>Не загружайте реальные персональные данные. Раздел работает в демонстрационном режиме</p>
          </div>
        </FadeIn>
      </section>

      <section className="content-section competition-controls-section">
        <SectionHeading
          eyebrow="Загрузка"
          title="Подключи демонстрационный набор"
          description="Файлы обрабатываются только локально в текущем окне браузера и не публикуются."
        />

        <FadeIn className="competition-toolbar">
          <div className="competition-toolbar__actions">
            <button type="button" className="button button--primary" onClick={handleLoadDemoData}>
              <Upload size={16} />
              {loadState === 'loading' ? 'Загружаем...' : 'Загрузить демо-данные'}
            </button>

            <button type="button" className="button button--secondary" onClick={handleChooseFile}>
              Выбрать CSV или XLSX
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx"
              className="competition-file-input"
              onChange={handleFileChange}
            />
          </div>

          {importNote && <p className="competition-note competition-note--success">{importNote}</p>}
          {loadState === 'error' && <p className="competition-note competition-note--error">{loadError}</p>}

          {datasetStats && (
            <div className="competition-stats-grid">
              <article className="competition-stat-card">
                <span>Количество строк</span>
                <strong>{datasetStats.rows}</strong>
              </article>
              <article className="competition-stat-card">
                <span>Количество заявлений</span>
                <strong>{datasetStats.applications}</strong>
              </article>
              <article className="competition-stat-card">
                <span>Уникальные абитуриенты</span>
                <strong>{datasetStats.uniqueApplicants}</strong>
              </article>
            </div>
          )}
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Поиск и фильтры"
          title="Найди нужные заявления"
          description="Все фильтры работают одновременно, чтобы быстро сужать выборку и видеть только нужные записи."
        />

        <FadeIn className="competition-toolbar">
          <div className="competition-toolbar__search">
            <FileSearch size={17} aria-hidden="true" />
            <input
              type="search"
              className="wizard-input"
              placeholder="Поиск по ID, вузу, направлению, конкурсу"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              disabled={loadState !== 'loaded'}
            />
          </div>

          <div className="competition-toolbar__filters competition-toolbar__filters--extended">
            <label>
              <span><ListFilter size={14} /> Вуз</span>
              <select className="wizard-input" value={universityFilter} onChange={(event) => setUniversityFilter(event.target.value)} disabled={loadState !== 'loaded'}>
                {universityOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'Все вузы' : option}</option>
                ))}
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Направление</span>
              <select className="wizard-input" value={programFilter} onChange={(event) => setProgramFilter(event.target.value)} disabled={loadState !== 'loaded'}>
                {programOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'Все направления' : option}</option>
                ))}
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Конкурс</span>
              <select className="wizard-input" value={competitionFilter} onChange={(event) => setCompetitionFilter(event.target.value)} disabled={loadState !== 'loaded'}>
                {competitionOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'Все конкурсы' : option}</option>
                ))}
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Форма обучения</span>
              <select className="wizard-input" value={educationFormFilter} onChange={(event) => setEducationFormFilter(event.target.value)} disabled={loadState !== 'loaded'}>
                {educationFormOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'Любая форма' : option}</option>
                ))}
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Согласие</span>
              <select className="wizard-input" value={consentFilter} onChange={(event) => setConsentFilter(event.target.value as 'all' | 'yes' | 'no')} disabled={loadState !== 'loaded'}>
                <option value="all">Любое</option>
                <option value="yes">Только с согласием</option>
                <option value="no">Только без согласия</option>
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Статус</span>
              <select className="wizard-input" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} disabled={loadState !== 'loaded'}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>{option === 'all' ? 'Любой статус' : option}</option>
                ))}
              </select>
            </label>

            <label>
              <span><ListFilter size={14} /> Баллы от</span>
              <input type="number" className="wizard-input" placeholder="например, 240" value={scoreMin} onChange={(event) => setScoreMin(event.target.value)} disabled={loadState !== 'loaded'} />
            </label>

            <label>
              <span><ListFilter size={14} /> Баллы до</span>
              <input type="number" className="wizard-input" placeholder="например, 300" value={scoreMax} onChange={(event) => setScoreMax(event.target.value)} disabled={loadState !== 'loaded'} />
            </label>

            <label>
              <span><ListFilter size={14} /> Место от</span>
              <input type="number" className="wizard-input" placeholder="например, 1" value={rankMin} onChange={(event) => setRankMin(event.target.value)} disabled={loadState !== 'loaded'} />
            </label>

            <label>
              <span><ListFilter size={14} /> Место до</span>
              <input type="number" className="wizard-input" placeholder="например, 30" value={rankMax} onChange={(event) => setRankMax(event.target.value)} disabled={loadState !== 'loaded'} />
            </label>
          </div>

          <div className="competition-toolbar__meta">
            <p><strong>Найдено заявлений:</strong> {filteredApplications.length}</p>
            <p><strong>Найдено абитуриентов:</strong> {foundApplicants}</p>
            <button type="button" className="button button--secondary" onClick={resetFilters} disabled={loadState !== 'loaded'}>
              Сбросить фильтры
            </button>
          </div>

          {activeFilters.length > 0 && (
            <div className="competition-active-filters" aria-label="Активные фильтры">
              {activeFilters.map((item) => <span key={item}>{item}</span>)}
            </div>
          )}
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Конкурсные заявления"
          title="Таблица демонстрационных записей"
          description="Нажми на строку или карточку, чтобы выбрать запись. По идентификатору можно перейти на страницу абитуриента."
        />

        {loadState === 'idle' && (
          <FadeIn className="empty-state empty-state--small">
            <h2>Данные пока не загружены</h2>
            <p>Нажми «Загрузить демо-данные» или выбери CSV/XLSX, чтобы увидеть вымышленные конкурсные заявления.</p>
          </FadeIn>
        )}

        {loadState === 'loaded' && filteredApplications.length === 0 && (
          <FadeIn className="empty-state empty-state--small">
            <h2>Ничего не найдено</h2>
            <p>По текущим условиям поиска заявлений нет. Ослабь фильтры или нажми «Сбросить фильтры».</p>
          </FadeIn>
        )}

        {loadState === 'loaded' && filteredApplications.length > 0 && (
          <>
            <FadeIn className="competition-table-wrap">
              <table className="competition-table" aria-label="Таблица конкурсных заявлений">
                <thead>
                  <tr>
                    <th>Идентификатор</th>
                    <th>Вуз</th>
                    <th>Направление</th>
                    <th>Конкурс</th>
                    <th>Форма</th>
                    <th>Баллы</th>
                    <th>Мест</th>
                    <th>Место</th>
                    <th>Приоритет</th>
                    <th>Согласие</th>
                    <th>Статус</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredApplications.map((item) => (
                    <tr
                      key={item.id}
                      className={`competition-table__row${item.id === selectedId ? ' competition-table__row--active' : ''}`}
                      onClick={() => setSelectedId(item.id)}
                    >
                      <td>
                        <Link
                          to={`/competition/applicant/${item.applicant_id}`}
                          state={{ applications }}
                          className="competition-applicant-link"
                          onClick={(event) => event.stopPropagation()}
                        >
                          {item.applicant_id}
                        </Link>
                        <small>{item.id}</small>
                      </td>
                      <td>{item.university}</td>
                      <td>{item.program}</td>
                      <td>{item.competition}</td>
                      <td>{item.education_form}</td>
                      <td>{item.score}</td>
                      <td>{item.places}</td>
                      <td>{item.current_rank}</td>
                      <td>{item.priority}</td>
                      <td>{formatConsent(item.consent)}</td>
                      <td>{item.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </FadeIn>

            <div className="competition-cards" aria-label="Карточки конкурсных заявлений">
              {filteredApplications.map((item) => (
                <article key={item.id} className={`competition-card${item.id === selectedId ? ' competition-card--active' : ''}`}>
                  <button type="button" className="competition-card__pick" onClick={() => setSelectedId(item.id)}>
                    <div className="competition-card__head">
                      <strong>{item.applicant_id}</strong>
                      <span>{item.id}</span>
                    </div>

                    <div className="competition-card__grid">
                      <p><span>Вуз</span><strong>{item.university}</strong></p>
                      <p><span>Направление</span><strong>{item.program}</strong></p>
                      <p><span>Конкурс</span><strong>{item.competition}</strong></p>
                      <p><span>Форма</span><strong>{item.education_form}</strong></p>
                      <p><span>Баллы</span><strong>{item.score}</strong></p>
                      <p><span>Мест</span><strong>{item.places}</strong></p>
                      <p><span>Место</span><strong>{item.current_rank}</strong></p>
                      <p><span>Приоритет</span><strong>{item.priority}</strong></p>
                      <p><span>Согласие</span><strong>{formatConsent(item.consent)}</strong></p>
                      <p><span>Статус</span><strong>{item.status}</strong></p>
                    </div>
                  </button>

                  <Link to={`/competition/applicant/${item.applicant_id}`} state={{ applications }} className="competition-card__applicant-link">
                    Открыть абитуриента {item.applicant_id}
                  </Link>
                </article>
              ))}
            </div>
          </>
        )}
      </section>

      {selectedApplication && indicator && (
        <section className="content-section">
          <SectionHeading
            eyebrow="Выбранная запись"
            title={`Абитуриент ${selectedApplication.applicant_id}`}
            description="Ниже показаны все заявления выбранного абитуриента внутри демо-набора и условный индикатор ситуации."
          />

          <FadeIn className="competition-selected-card">
            <div className="competition-selected-card__top">
              <div>
                <h3>{selectedApplication.university}</h3>
                <p>{selectedApplication.program} · {selectedApplication.education_form}</p>
              </div>
              <span className="demo-badge">DEMO</span>
            </div>

            <div className="competition-selected-grid">
              <p><span>Конкурс</span><strong>{selectedApplication.competition}</strong></p>
              <p><span>Баллы</span><strong>{selectedApplication.score}</strong></p>
              <p><span>Доп. баллы</span><strong>{selectedApplication.additional_points}</strong></p>
              <p><span>Количество мест</span><strong>{selectedApplication.places}</strong></p>
              <p><span>Текущее место</span><strong>{selectedApplication.current_rank}</strong></p>
              <p><span>Приоритет</span><strong>{selectedApplication.priority}</strong></p>
              <p><span>Согласие</span><strong>{formatConsent(selectedApplication.consent)}</strong></p>
              <p><span>Статус</span><strong>{selectedApplication.status}</strong></p>
              <p><span>Идентификатор</span><strong>{selectedApplication.id}</strong></p>
            </div>

            <div className={`competition-indicator competition-indicator--${indicator.tone}`}>
              <strong>Демонстрационный прогноз: {indicator.label}</strong>
              <p>{indicator.reason}</p>
              <p>Это демонстрационный индикатор интерфейса, а не официальный прогноз поступления.</p>
            </div>

            <div className="competition-selected-card__actions">
              <Link className="button button--secondary" to={`/competition/applicant/${selectedApplication.applicant_id}`} state={{ applications }}>
                Открыть страницу абитуриента
              </Link>
            </div>

            <div className="competition-applications-list">
              <h4>Заявления этого абитуриента</h4>
              <ul>
                {selectedApplicantRecords.map((item) => (
                  <li key={item.id}>
                    <span>{item.priority}. {item.university} — {item.program}</span>
                    <strong>{item.current_rank}/{item.places}</strong>
                  </li>
                ))}
              </ul>
            </div>
          </FadeIn>
        </section>
      )}
    </PageFrame>
  );
}

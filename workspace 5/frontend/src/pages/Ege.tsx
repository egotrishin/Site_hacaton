import { useMemo, useState } from 'react';
import { GraduationCap, Heart, LogIn, Search, SlidersHorizontal, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn, Stagger } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import { isFavorite, loadFavorites, toggleFavorite } from '@/lib/applicant-data';

type EgeReview = {
  id: string;
  author: string;
  subject: string;
  score: number;
  year: string;
  university: string;
  direction: string;
  preparationType: string;
  school: string;
  teacher: string;
  duration: string;
  rating: number;
  pros: string[];
  cons: string[];
  text: string;
  materials: string[];
  demo: true;
};

const subjects = [
  'русский язык',
  'математика',
  'обществознание',
  'история',
  'физика',
  'информатика',
  'химия',
  'биология',
  'география',
  'литература',
  'английский язык',
];

const scoreRanges = [
  { value: 'all', label: 'Любой балл' },
  { value: '0-70', label: 'До 70' },
  { value: '71-80', label: '71–80' },
  { value: '81-90', label: '81–90' },
  { value: '91-100', label: '91–100' },
];

const preparationTypes = ['Самостоятельно', 'С преподавателем', 'Онлайн-курс'];

const sortOptions = [
  { value: 'score-desc', label: 'Сначала высокий балл' },
  { value: 'score-asc', label: 'Сначала низкий балл' },
  { value: 'rating-desc', label: 'По рейтингу' },
  { value: 'year-desc', label: 'Сначала новый год' },
  { value: 'year-asc', label: 'Сначала ранний год' },
];

const demoReviews: EgeReview[] = [
  {
    id: 'review-hist-1',
    author: 'Полина (псевдоним)',
    subject: 'история',
    score: 86,
    year: '2025',
    university: 'Гуманитарный вуз (демо)',
    direction: 'История и культурные исследования',
    preparationType: 'С преподавателем',
    school: 'Городская школа (демо)',
    teacher: 'Куратор по истории (демо)',
    duration: '8 месяцев',
    rating: 4.6,
    pros: ['Структурный план тем', 'Еженедельные пробники'],
    cons: ['Нужно много времени на конспекты'],
    text: 'Лучше всего сработал режим коротких, но частых повторений и разбор ошибок сразу после тренировок.',
    materials: ['Демо-конспекты', 'Демо-сборник заданий'],
    demo: true,
  },
  {
    id: 'review-inf-1',
    author: 'Игорь (псевдоним)',
    subject: 'информатика',
    score: 92,
    year: '2024',
    university: 'Технический вуз (демо)',
    direction: 'Прикладная информатика',
    preparationType: 'Онлайн-курс',
    school: 'Лицей (демо)',
    teacher: 'Наставник курса (демо)',
    duration: '10 месяцев',
    rating: 4.8,
    pros: ['Понятные разборы задач', 'Удобный график'],
    cons: ['Иногда слишком быстрый темп'],
    text: 'Самый заметный рост дал разбор типовых ошибок после каждого пробного варианта.',
    materials: ['Демо-тренажер', 'Демо-архив задач'],
    demo: true,
  },
  {
    id: 'review-rus-1',
    author: 'Алина (псевдоним)',
    subject: 'русский язык',
    score: 81,
    year: '2025',
    university: 'Университет коммуникаций (демо)',
    direction: 'Журналистика',
    preparationType: 'Самостоятельно',
    school: 'Школа (демо)',
    teacher: 'Школьный преподаватель (демо)',
    duration: '6 месяцев',
    rating: 4.3,
    pros: ['Гибкий режим занятий', 'Легко повторять правила по карточкам'],
    cons: ['Сложно держать дисциплину без расписания'],
    text: 'Мне помогла простая привычка: каждый день по 30 минут на один блок и один мини-тест.',
    materials: ['Демо-подборка правил'],
    demo: true,
  },
];

const materialsBuckets = ['Лекции', 'Учебники', 'Сайты', 'Каналы', 'Тренировочные варианты', 'Рекомендации'];

const normalize = (value: string) => value.trim().toLowerCase();

const inScoreRange = (score: number, range: string) => {
  if (range === 'all') return true;
  const [minRaw, maxRaw] = range.split('-');
  const min = Number(minRaw);
  const max = Number(maxRaw);
  if (Number.isNaN(min) || Number.isNaN(max)) return true;
  return score >= min && score <= max;
};

const sortReviews = (list: EgeReview[], mode: string) => {
  const reviews = [...list];
  reviews.sort((a, b) => {
    if (mode === 'score-asc') return a.score - b.score;
    if (mode === 'score-desc') return b.score - a.score;
    if (mode === 'rating-desc') return b.rating - a.rating;
    if (mode === 'year-asc') return Number(a.year) - Number(b.year);
    if (mode === 'year-desc') return Number(b.year) - Number(a.year);
    return 0;
  });
  return reviews;
};

export default function Ege() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [subjectFilter, setSubjectFilter] = useState<string>('история');
  const [scoreFilter, setScoreFilter] = useState<string>('all');
  const [preparationFilter, setPreparationFilter] = useState<string>('all');
  const [search, setSearch] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('score-desc');
  const [favorites, setFavorites] = useState(() => loadFavorites());

  const filteredReviews = useMemo(() => {
    const searchValue = normalize(search);

    const prepared = demoReviews.filter((review) => {
      const bySubject = subjectFilter === 'all' || review.subject === subjectFilter;
      const byScore = inScoreRange(review.score, scoreFilter);
      const byPreparation = preparationFilter === 'all' || review.preparationType === preparationFilter;
      const bySearch =
        searchValue.length === 0 ||
        normalize(review.author).includes(searchValue) ||
        normalize(review.subject).includes(searchValue) ||
        normalize(review.direction).includes(searchValue) ||
        normalize(review.text).includes(searchValue);

      return bySubject && byScore && byPreparation && bySearch;
    });

    return sortReviews(prepared, sortBy);
  }, [subjectFilter, scoreFilter, preparationFilter, search, sortBy]);

  const resetFilters = () => {
    setSubjectFilter('all');
    setScoreFilter('all');
    setPreparationFilter('all');
    setSearch('');
    setSortBy('score-desc');
  };

  const handleToggleReviewFavorite = (review: EgeReview) => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    const next = toggleFavorite({
      type: 'ege_review',
      title: `Отзыв ЕГЭ: ${review.subject} · ${review.score} баллов`,
      sourceId: review.id,
    });

    setFavorites(next);
  };

  const handleToggleMaterialFavorite = (material: string) => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    const next = toggleFavorite({
      type: 'material',
      title: `Материал по ЕГЭ: ${material}`,
      sourceId: `ege-material:${material.toLowerCase()}`,
    });

    setFavorites(next);
  };

  return (
    <PageFrame>
      <PageHero
        eyebrow="Раздел подготовки"
        title="Отзывы по ЕГЭ по выбранному предмету"
        description="Выбирай предмет, сравнивай опыт подготовки и отмечай подходящий формат без лишнего шума."
        icon={GraduationCap}
        aside={<div className="hero-sticker"><SlidersHorizontal size={22} /><span>Сначала предмет, потом отзывы</span></div>}
      />

      <section className="content-section">
        <div className="section-heading-row">
          <SectionHeading
            eyebrow="Выбор предмета"
            title="Главный сценарий: выбери предмет и смотри отзывы"
            description="Карточки ниже демонстрационные и помечены как «Демо»."
          />
          <DemoBadge />
        </div>

        <Stagger className="subject-picker" stagger={0.03}>
          <FadeIn>
            <button
              type="button"
              className={`subject-chip${subjectFilter === 'all' ? ' subject-chip--active' : ''}`}
              onClick={() => setSubjectFilter('all')}
              aria-pressed={subjectFilter === 'all'}
            >
              Все предметы
            </button>
          </FadeIn>
          {subjects.map((subject) => (
            <FadeIn key={subject}>
              <button
                type="button"
                className={`subject-chip${subjectFilter === subject ? ' subject-chip--active' : ''}`}
                onClick={() => setSubjectFilter(subject)}
                aria-pressed={subjectFilter === subject}
              >
                {subject}
              </button>
            </FadeIn>
          ))}
        </Stagger>

        <div className="task-form-card ege-controls" role="search" aria-label="Фильтры и поиск по отзывам ЕГЭ">
          <label className="wizard-block">
            <span className="wizard-label">Поиск</span>
            <div className="olympiad-input-wrap">
              <Search size={16} aria-hidden="true" />
              <input
                className="wizard-input"
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Имя, предмет, направление, текст"
              />
            </div>
          </label>

          <div className="ege-controls__grid">
            <label className="wizard-block">
              <span className="wizard-label">Предмет</span>
              <select className="wizard-input" value={subjectFilter} onChange={(event) => setSubjectFilter(event.target.value)}>
                <option value="all">Все предметы</option>
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Диапазон баллов</span>
              <select className="wizard-input" value={scoreFilter} onChange={(event) => setScoreFilter(event.target.value)}>
                {scoreRanges.map((range) => (
                  <option key={range.value} value={range.value}>{range.label}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Тип подготовки</span>
              <select className="wizard-input" value={preparationFilter} onChange={(event) => setPreparationFilter(event.target.value)}>
                <option value="all">Любой тип</option>
                {preparationTypes.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </label>

            <label className="wizard-block">
              <span className="wizard-label">Сортировка</span>
              <select className="wizard-input" value={sortBy} onChange={(event) => setSortBy(event.target.value)}>
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="wizard-actions wizard-actions--wrap">
            <button type="button" className="button button--secondary" onClick={resetFilters}>Сбросить фильтры</button>
          </div>
        </div>

        {filteredReviews.length === 0 ? (
          <div className="empty-state empty-state--small">
            <h2>Пока нет отзывов по этому предмету. Мы добавим их позже</h2>
          </div>
        ) : (
          <div className="review-grid">
            {filteredReviews.map((review) => (
              <FadeIn key={review.id} className="event-wrap">
                <article className="review-card">
                  <div className="event-card__meta">
                    <span>{review.author}</span>
                    {review.demo && <span className="demo-badge">Демо</span>}
                  </div>

                  <h3>{review.subject} · {review.score} баллов</h3>
                  <p className="review-card__meta-line">{review.year} · {review.university}</p>
                  <p className="review-card__meta-line">{review.direction}</p>

                  <div className="review-card__meta-grid" aria-label="Параметры подготовки">
                    <p><strong>Где готовился:</strong> {review.preparationType}</p>
                    <p><strong>Школа:</strong> {review.school}</p>
                    <p><strong>Преподаватель:</strong> {review.teacher}</p>
                    <p><strong>Длительность:</strong> {review.duration}</p>
                    <p className="review-card__rating"><strong>Рейтинг:</strong> <Star size={14} /> {review.rating.toFixed(1)}</p>
                  </div>

                  <div className="review-card__lists">
                    <div>
                      <strong>Плюсы</strong>
                      <ul>
                        {review.pros.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <strong>Минусы</strong>
                      <ul>
                        {review.cons.map((item) => <li key={item}>{item}</li>)}
                      </ul>
                    </div>
                  </div>

                  <p className="review-card__text">{review.text}</p>

                  <div className="wizard-actions wizard-actions--wrap">
                    {isSignedIn ? (
                      <button type="button" className="button button--secondary" onClick={() => handleToggleReviewFavorite(review)}>
                        <Heart size={16} />
                        {isFavorite('ege_review', review.id, favorites) ? 'В избранном' : 'Добавить в избранное'}
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
          eyebrow="Материалы по ЕГЭ"
          title="Будущий блок с полезным контентом"
          description="Сейчас это аккуратная демо-заготовка без подтвержденных реальных материалов."
        />

        <div className="materials-placeholder">
          <span className="demo-badge">Демо</span>
          <p>В следующих этапах сюда можно добавить:</p>
          <div className="materials-grid">
            {materialsBuckets.map((item) => {
              const sourceId = `ege-material:${item.toLowerCase()}`;
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

      <FadeIn className="lined-note">
        <strong>Подсказка</strong>
        <p>Если отзывов мало, начни с одного предмета и постепенно расширяй выбор — так проще увидеть, что действительно помогает.</p>
      </FadeIn>
    </PageFrame>
  );
}

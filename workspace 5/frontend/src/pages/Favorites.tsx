import { useMemo, useState } from 'react';
import { ArrowRight, Bookmark, Heart, LogIn, Search, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import { loadFavorites, toggleFavorite, type FavoriteItem, type FavoriteType } from '@/lib/applicant-data';

const favoriteTypeOptions: { value: 'all' | FavoriteType; label: string }[] = [
  { value: 'all', label: 'Все типы' },
  { value: 'ege_review', label: 'Отзывы ЕГЭ' },
  { value: 'olympiad_advice', label: 'Советы по олимпиадам' },
  { value: 'material', label: 'Материалы' },
  { value: 'olympiad', label: 'Олимпиады' },
  { value: 'event', label: 'Мероприятия' },
];

const favoriteTypeLabel: Record<FavoriteType, string> = {
  ege_review: 'Отзыв ЕГЭ',
  olympiad_advice: 'Совет по олимпиадам',
  material: 'Материал',
  olympiad: 'Олимпиада',
  event: 'Мероприятие',
};

function formatSavedAt(value: string) {
  if (!value) return 'Только что';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Только что';

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });
}

export default function Favorites() {
  const { isSignedIn } = useAuth();
  const [filter, setFilter] = useState<'all' | FavoriteType>('all');
  const [favorites, setFavorites] = useState<FavoriteItem[]>(() => loadFavorites());

  const filtered = useMemo(() => {
    if (filter === 'all') return favorites;
    return favorites.filter((item) => item.type === filter);
  }, [favorites, filter]);

  const handleRemove = (item: FavoriteItem) => {
    const next = toggleFavorite({ type: item.type, title: item.title, sourceId: item.sourceId });
    setFavorites(next);
  };

  if (!isSignedIn) {
    return (
      <PageFrame>
        <PageHero eyebrow="Личная подборка" title="Избранное" description="Чтобы видеть и сохранять личную подборку, сначала войди в демо-профиль в этом браузере." icon={Heart} aside={<DemoBadge />} />
        <FadeIn className="empty-state">
          <div className="empty-state__art" aria-hidden="true"><LogIn size={40} /><span>!</span></div>
          <h2>Ты пока не вошёл</h2>
          <p>После входа здесь появятся сохранённые карточки: отзывы, советы, материалы, олимпиады и мероприятия.</p>
          <div className="wizard-actions wizard-actions--wrap">
            <Link className="button button--primary" to="/login"><LogIn size={18} /> Войти</Link>
            <Link className="button button--secondary" to="/">На главную <ArrowRight size={16} /></Link>
          </div>
        </FadeIn>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <PageHero eyebrow="Личная подборка" title="Избранное" description="Здесь собраны карточки, которые ты сохранил в текущем браузере." icon={Heart} />

      <section className="content-section">
        <SectionHeading eyebrow="Фильтр" title="Выбери, что показать" description="Можно посмотреть сразу всё или оставить только один тип материалов." />
        <div className="filter-row" aria-label="Фильтр избранного по типу">
          {favoriteTypeOptions.map((option) => (
            <button
              key={option.value}
              type="button"
              className={`filter-chip${filter === option.value ? ' filter-chip--active' : ''}`}
              onClick={() => setFilter(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        {favorites.length === 0 ? (
          <FadeIn className="empty-state">
            <div className="empty-state__art" aria-hidden="true"><Bookmark size={44} /><span><Search size={18} /></span></div>
            <span className="section-kicker">Пока здесь тихо</span>
            <h2>В избранном ещё ничего нет</h2>
            <p>Открой разделы ЕГЭ, Олимпиады или Мероприятия и добавь карточки в личную подборку.</p>
            <Link className="button button--primary" to="/">Вернуться на главную <ArrowRight size={18} /></Link>
          </FadeIn>
        ) : filtered.length === 0 ? (
          <FadeIn className="empty-state empty-state--small">
            <h2>По этому фильтру ничего нет</h2>
            <p>Попробуй выбрать другой тип материалов.</p>
          </FadeIn>
        ) : (
          <div className="events-grid">
            {filtered.map((item) => (
              <FadeIn key={item.id} className="event-wrap">
                <article className="event-card">
                  <div className="event-card__meta">
                    <span>{favoriteTypeLabel[item.type]}</span>
                    <span className="demo-badge">В избранном</span>
                  </div>
                  <div>
                    <h3>{item.title}</h3>
                    <p>Сохранено: {formatSavedAt(item.savedAt)}</p>
                  </div>
                  <div className="wizard-actions wizard-actions--wrap">
                    <button type="button" className="button button--secondary" onClick={() => handleRemove(item)}>
                      <Trash2 size={16} /> Удалить
                    </button>
                  </div>
                </article>
              </FadeIn>
            ))}
          </div>
        )}
      </section>

      <FadeIn className="lined-note">
        <strong>Важно</strong>
        <p>Избранное хранится только в этом браузере и не синхронизируется между устройствами.</p>
      </FadeIn>
    </PageFrame>
  );
}

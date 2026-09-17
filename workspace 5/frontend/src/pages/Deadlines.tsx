import { useMemo, useState } from 'react';
import { CalendarDays, Check, Circle, Clock3, LogIn, PencilLine, Plus, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getNearestPersonalDeadlines,
  getOverduePersonalDeadlines,
  loadPersonalDeadlines,
  savePersonalDeadlines,
  sortPersonalDeadlinesByDate,
  type PersonalDeadline,
  type PersonalDeadlineCategory,
} from '@/lib/applicant-data';

const categories: PersonalDeadlineCategory[] = ['ЕГЭ', 'олимпиады', 'документы', 'выбор вуза', 'подготовка', 'другое'];

type DeadlineFormState = {
  title: string;
  description: string;
  date: string;
  category: PersonalDeadlineCategory;
};

const initialForm: DeadlineFormState = {
  title: '',
  description: '',
  date: '',
  category: 'ЕГЭ',
};

function formatDate(value: string) {
  if (!value) return 'Без даты';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'Без даты';

  return date.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function getStatusLabel(deadline: PersonalDeadline) {
  if (deadline.completed) return 'Выполнено';

  if (!deadline.date) return 'Без даты';

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(deadline.date);

  if (!Number.isNaN(due.getTime()) && due.getTime() < today.getTime()) {
    return 'Просрочено';
  }

  return 'Активно';
}

export default function Deadlines() {
  const { isSignedIn } = useAuth();
  const [deadlines, setDeadlines] = useState<PersonalDeadline[]>(() => loadPersonalDeadlines());
  const [filterCategory, setFilterCategory] = useState<'all' | PersonalDeadlineCategory>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<DeadlineFormState>(initialForm);
  const [formError, setFormError] = useState('');

  const nearest = useMemo(() => getNearestPersonalDeadlines(deadlines, 3), [deadlines]);
  const overdue = useMemo(() => getOverduePersonalDeadlines(deadlines), [deadlines]);

  const filtered = useMemo(() => {
    const byCategory = filterCategory === 'all' ? deadlines : deadlines.filter((item) => item.category === filterCategory);
    return sortPersonalDeadlinesByDate(byCategory);
  }, [deadlines, filterCategory]);

  const updateDeadlines = (updater: (prev: PersonalDeadline[]) => PersonalDeadline[]) => {
    setDeadlines((prev) => {
      const next = updater(prev);
      savePersonalDeadlines(next);
      return next;
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError('Добавь название дедлайна.');
      return;
    }

    if (!form.date) {
      setFormError('Выбери дату дедлайна.');
      return;
    }

    if (editingId) {
      updateDeadlines((prev) => prev.map((item) => (
        item.id === editingId
          ? {
              ...item,
              title: form.title.trim(),
              description: form.description.trim(),
              date: form.date,
              category: form.category,
            }
          : item
      )));
    } else {
      const next: PersonalDeadline = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        description: form.description.trim(),
        date: form.date,
        category: form.category,
        completed: false,
      };

      updateDeadlines((prev) => [...prev, next]);
    }

    resetForm();
  };

  const handleEdit = (item: PersonalDeadline) => {
    setEditingId(item.id);
    setForm({
      title: item.title,
      description: item.description,
      date: item.date,
      category: item.category,
    });
    setFormError('');
  };

  const handleToggleCompleted = (id: string) => {
    updateDeadlines((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const handleDelete = (id: string) => {
    if (!window.confirm('Удалить этот дедлайн?')) return;

    updateDeadlines((prev) => prev.filter((item) => item.id !== id));
    if (editingId === id) resetForm();
  };

  if (!isSignedIn) {
    return (
      <PageFrame>
        <PageHero eyebrow="Личные дедлайны" title="Войди, чтобы видеть персональные даты" description="Дедлайны доступны только после входа в демо-профиль в этом браузере." icon={CalendarDays} aside={<DemoBadge />} />
        <FadeIn className="empty-state">
          <div className="empty-state__art"><LogIn size={36} /><span>!</span></div>
          <h2>Ты пока не вошёл</h2>
          <p>После входа здесь появятся твои личные дедлайны и статусы выполнения.</p>
          <div className="wizard-actions wizard-actions--wrap">
            <Link className="button button--primary" to="/login"><LogIn size={18} /> Войти</Link>
            <Link className="button button--secondary" to="/profile">Открыть личный кабинет</Link>
          </div>
        </FadeIn>
      </PageFrame>
    );
  }

  return (
    <PageFrame>
      <PageHero
        eyebrow="Личные дедлайны"
        title="Планируй важные даты поступления"
        description="Добавляй дедлайны, отмечай выполнение и держи фокус на ближайших шагах. Всё хранится только в этом браузере."
        icon={CalendarDays}
        aside={(
          <div className="progress-card">
            <span>Всего дедлайнов</span>
            <strong>{deadlines.length}</strong>
            <div className="progress-track" aria-hidden="true">
              <span style={{ width: `${deadlines.length === 0 ? 12 : Math.min(100, deadlines.length * 16)}%` }} />
            </div>
          </div>
        )}
      />

      <section className="content-section">
        <SectionHeading eyebrow="Обзор" title="Ближайшие и просроченные" description="Сначала показаны самые срочные пункты, чтобы проще держать приоритеты." />

        <div className="events-grid">
          <FadeIn className="event-wrap">
            <article className="event-card event-card--blue">
              <div className="event-card__meta"><span><Clock3 size={14} /> Ближайшие</span></div>
              <div>
                <h3>{nearest.length > 0 ? `${nearest.length} в фокусе` : 'Пока нет ближайших'}</h3>
                <p>{nearest.length > 0 ? nearest.map((item) => `${item.title} · ${formatDate(item.date)}`).join(' • ') : 'Добавь дедлайн с датой, и он появится здесь.'}</p>
              </div>
            </article>
          </FadeIn>

          <FadeIn className="event-wrap">
            <article className="event-card event-card--coral">
              <div className="event-card__meta"><span><Clock3 size={14} /> Просроченные</span></div>
              <div>
                <h3>{overdue.length > 0 ? `${overdue.length} требуют внимания` : 'Просроченных нет'}</h3>
                <p>{overdue.length > 0 ? overdue.map((item) => `${item.title} · ${formatDate(item.date)}`).join(' • ') : 'Отлично — все активные дедлайны в сроке.'}</p>
              </div>
            </article>
          </FadeIn>
        </div>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Управление" title="Добавить или изменить дедлайн" description="Можно редактировать, удалять и отмечать выполнение в любой момент." />

        <FadeIn className="task-form-card">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-form__grid">
              <label>
                Название
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="wizard-input"
                  placeholder="Например, подать документы"
                />
              </label>

              <label>
                Категория
                <select
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value as PersonalDeadlineCategory }))}
                  className="wizard-input"
                >
                  {categories.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </label>

              <label>
                Дата
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((prev) => ({ ...prev, date: event.target.value }))}
                  className="wizard-input"
                />
              </label>
            </div>

            <label>
              Описание
              <textarea
                value={form.description}
                onChange={(event) => setForm((prev) => ({ ...prev, description: event.target.value }))}
                className="wizard-input wizard-textarea"
                placeholder="Короткая заметка по шагу"
              />
            </label>

            {formError && <p className="wizard-error">{formError}</p>}

            <div className="wizard-actions wizard-actions--wrap">
              <button type="submit" className="button button--primary">
                {editingId ? <><PencilLine size={16} /> Сохранить изменения</> : <><Plus size={16} /> Добавить дедлайн</>}
              </button>
              {editingId && (
                <button type="button" className="button button--secondary" onClick={resetForm}>Отменить редактирование</button>
              )}
            </div>
          </form>
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading eyebrow="Список" title="Все дедлайны по дате" description="Список отсортирован по дате, а сверху доступны фильтры по категориям." />

        <div className="filter-row" aria-label="Фильтр дедлайнов по категории">
          <button
            type="button"
            className={`filter-chip${filterCategory === 'all' ? ' filter-chip--active' : ''}`}
            onClick={() => setFilterCategory('all')}
          >
            Все
          </button>
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={`filter-chip${filterCategory === item ? ' filter-chip--active' : ''}`}
              onClick={() => setFilterCategory(item)}
            >
              {item}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <FadeIn className="empty-state empty-state--small">
            <h2>По этому фильтру дедлайнов нет</h2>
            <p>Смени фильтр или добавь новый дедлайн.</p>
          </FadeIn>
        ) : (
          <div className="checklist">
            {filtered.map((item) => (
              <article key={item.id} className={`check-item${item.completed ? ' check-item--done' : ''}`}>
                <button type="button" className="check-item__control" onClick={() => handleToggleCompleted(item.id)} aria-label={item.completed ? 'Отменить выполнение' : 'Отметить выполнение'}>
                  {item.completed ? <Check size={17} /> : <Circle size={17} />}
                </button>

                <span className="check-item__copy">
                  <strong>{item.title}</strong>
                  <small>{item.description || 'Без описания'}</small>
                  <small className="task-meta">{item.category} · {formatDate(item.date)}</small>
                </span>

                <span className="check-item__status">{getStatusLabel(item)}</span>

                <span className="check-item__actions">
                  <button type="button" className="task-action" onClick={() => handleEdit(item)} aria-label="Редактировать дедлайн">
                    <PencilLine size={16} />
                  </button>
                  <button type="button" className="task-action task-action--danger" onClick={() => handleDelete(item.id)} aria-label="Удалить дедлайн">
                    <Trash2 size={16} />
                  </button>
                </span>
              </article>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  );
}

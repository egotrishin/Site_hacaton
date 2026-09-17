import { useMemo, useState } from 'react';
import { BookOpenCheck, Check, Circle, Filter, PencilLine, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import {
  createDefaultChecklist,
  getChecklistProgress,
  getStrategyLabel,
  loadChecklist,
  loadOnboardingData,
  mergeChecklistWithDefaults,
  saveChecklist,
  type ChecklistTask,
} from '@/lib/applicant-data';

type FilterMode = 'all' | 'active' | 'completed';

type TaskFormState = {
  title: string;
  description: string;
  category: string;
  deadline: string;
};

const initialForm: TaskFormState = {
  title: '',
  description: '',
  category: 'Общие',
  deadline: '',
};

const categoryOrder = ['Общие', 'ЕГЭ', 'Олимпиады'];

function formatDeadline(deadline: string) {
  if (!deadline) return 'Без дедлайна';
  const date = new Date(deadline);
  if (Number.isNaN(date.getTime())) return 'Без дедлайна';
  return date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
}

function sortTasksByDeadline(tasks: ChecklistTask[]) {
  return [...tasks].sort((a, b) => {
    if (!a.deadline && !b.deadline) return a.title.localeCompare(b.title, 'ru');
    if (!a.deadline) return 1;
    if (!b.deadline) return -1;
    return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
  });
}

export default function Checklist() {
  const onboarding = useMemo(() => loadOnboardingData(), []);
  const [tasks, setTasks] = useState<ChecklistTask[]>(() => {
    if (!onboarding.completed) return [];

    const stored = loadChecklist();
    if (stored.length === 0) {
      const seeded = createDefaultChecklist(onboarding.strategy);
      saveChecklist(seeded);
      return seeded;
    }

    const merged = mergeChecklistWithDefaults(stored, onboarding.strategy);
    if (merged.length !== stored.length) saveChecklist(merged);
    return merged;
  });

  const [filter, setFilter] = useState<FilterMode>('all');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<TaskFormState>(initialForm);
  const [formError, setFormError] = useState('');

  if (!onboarding.completed) {
    return (
      <PageFrame>
        <PageHero
          eyebrow="Сначала знакомство"
          title="Пройди онбординг, чтобы получить личный чек-лист"
          description="После короткого опроса здесь появится персональный список задач по твоему маршруту поступления."
          icon={BookOpenCheck}
        />
        <section className="content-section">
          <FadeIn className="empty-state">
            <div className="empty-state__art"><BookOpenCheck size={32} /><span>!</span></div>
            <h2>Онбординг ещё не пройден</h2>
            <p>Открой страницу знакомства, заполни 5 шагов и вернись сюда — чек-лист соберётся автоматически.</p>
            <Link className="button button--primary" to="/onboarding">Пройти онбординг</Link>
          </FadeIn>
        </section>
      </PageFrame>
    );
  }

  const progress = getChecklistProgress(tasks);

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed;
    if (filter === 'completed') return task.completed;
    return true;
  });

  const groupedTasks = sortTasksByDeadline(filteredTasks).reduce<Record<string, ChecklistTask[]>>((acc, task) => {
    if (!acc[task.category]) acc[task.category] = [];
    acc[task.category].push(task);
    return acc;
  }, {});

  const orderedCategories = Object.keys(groupedTasks).sort((a, b) => {
    const indexA = categoryOrder.indexOf(a);
    const indexB = categoryOrder.indexOf(b);

    if (indexA === -1 && indexB === -1) return a.localeCompare(b, 'ru');
    if (indexA === -1) return 1;
    if (indexB === -1) return -1;
    return indexA - indexB;
  });

  const updateTasks = (updater: (prev: ChecklistTask[]) => ChecklistTask[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveChecklist(next);
      return next;
    });
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
    setFormError('');
  };

  const handleToggle = (taskId: string) => {
    updateTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)));
  };

  const handleDelete = (taskId: string) => {
    updateTasks((prev) => prev.filter((task) => task.id !== taskId));
    if (editingId === taskId) resetForm();
  };

  const handleEdit = (task: ChecklistTask) => {
    setEditingId(task.id);
    setForm({
      title: task.title,
      description: task.description,
      category: task.category,
      deadline: task.deadline,
    });
    setFormError('');
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setFormError('Добавь название задачи.');
      return;
    }

    if (!form.category.trim()) {
      setFormError('Укажи категорию задачи.');
      return;
    }

    if (editingId) {
      updateTasks((prev) => prev.map((task) => (
        task.id === editingId
          ? {
              ...task,
              title: form.title.trim(),
              description: form.description.trim(),
              category: form.category.trim(),
              deadline: form.deadline,
            }
          : task
      )));
    } else {
      const nextTask: ChecklistTask = {
        id: crypto.randomUUID(),
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category.trim(),
        deadline: form.deadline,
        completed: false,
        custom: true,
      };
      updateTasks((prev) => [...prev, nextTask]);
    }

    resetForm();
  };

  const handleResetChecklist = () => {
    if (!window.confirm('Сбросить текущий чек-лист и вернуть стартовые задачи?')) return;
    const fresh = createDefaultChecklist(onboarding.strategy);
    saveChecklist(fresh);
    setTasks(fresh);
    resetForm();
  };

  return (
    <PageFrame>
      <PageHero
        eyebrow="Маршрут поступления"
        title="Твой персональный чек-лист"
        description="Отмечай прогресс, добавляй свои задачи и держи перед глазами ближайшие шаги."
        icon={BookOpenCheck}
        aside={(
          <div className="progress-card">
            <span>Стратегия: {getStrategyLabel(onboarding.strategy)}</span>
            <strong>{progress.completed} из {progress.total} выполнено ({progress.percent}%)</strong>
            <div className="progress-track" role="progressbar" aria-label="Прогресс чек-листа" aria-valuenow={progress.percent} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress.percent}%` }} />
            </div>
          </div>
        )}
      />

      <section className="content-section">
        <div className="section-heading-row">
          <SectionHeading eyebrow="Задачи" title="Что нужно сделать" description="Можно отмечать, редактировать, удалять и добавлять собственные пункты." />
          <div className="filter-mock"><Filter size={15} />Сейчас: {filter === 'all' ? 'Все задачи' : filter === 'active' ? 'Активные' : 'Выполненные'}</div>
        </div>

        <FadeIn className="task-form-card">
          <form className="task-form" onSubmit={handleSubmit}>
            <div className="task-form__grid">
              <label>
                Название задачи
                <input
                  type="text"
                  value={form.title}
                  onChange={(event) => setForm((prev) => ({ ...prev, title: event.target.value }))}
                  className="wizard-input"
                  placeholder="Например, записаться на пробник"
                />
              </label>

              <label>
                Категория
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) => setForm((prev) => ({ ...prev, category: event.target.value }))}
                  className="wizard-input"
                  placeholder="Общие / ЕГЭ / Олимпиады"
                />
              </label>

              <label>
                Дедлайн
                <input
                  type="date"
                  value={form.deadline}
                  onChange={(event) => setForm((prev) => ({ ...prev, deadline: event.target.value }))}
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
                placeholder="Короткая заметка к задаче"
              />
            </label>

            {formError && <p className="wizard-error">{formError}</p>}

            <div className="wizard-actions wizard-actions--wrap">
              <button type="submit" className="button button--primary">
                {editingId ? <><PencilLine size={18} /> Сохранить изменения</> : <><Plus size={18} /> Добавить задачу</>}
              </button>
              {editingId && (
                <button type="button" className="button button--secondary" onClick={resetForm}>
                  Отменить редактирование
                </button>
              )}
              <button type="button" className="button button--secondary" onClick={handleResetChecklist}>
                <RotateCcw size={18} /> Сбросить чек-лист
              </button>
            </div>
          </form>
        </FadeIn>

        <div className="filter-row" aria-label="Фильтры чек-листа">
          <button type="button" className={`filter-chip${filter === 'all' ? ' filter-chip--active' : ''}`} onClick={() => setFilter('all')}>Все</button>
          <button type="button" className={`filter-chip${filter === 'active' ? ' filter-chip--active' : ''}`} onClick={() => setFilter('active')}>Активные</button>
          <button type="button" className={`filter-chip${filter === 'completed' ? ' filter-chip--active' : ''}`} onClick={() => setFilter('completed')}>Выполненные</button>
        </div>

        {orderedCategories.length === 0 ? (
          <FadeIn className="empty-state empty-state--small">
            <h2>По текущему фильтру задач нет</h2>
            <p>Попробуй переключить фильтр или добавить новую задачу.</p>
          </FadeIn>
        ) : (
          <div className="task-groups">
            {orderedCategories.map((category) => (
              <FadeIn key={category} className="task-group">
                <h3 className="task-group__title">{category}</h3>
                <div className="checklist">
                  {groupedTasks[category].map((task) => (
                    <article key={task.id} className={`check-item${task.completed ? ' check-item--done' : ''}`}>
                      <button type="button" className="check-item__control" onClick={() => handleToggle(task.id)} aria-label={task.completed ? 'Отменить выполнение' : 'Отметить выполнение'}>
                        {task.completed ? <Check size={17} /> : <Circle size={17} />}
                      </button>

                      <span className="check-item__copy">
                        <strong>{task.title}</strong>
                        <small>{task.description || 'Без описания'}</small>
                        <small className="task-meta">{task.custom ? 'Пользовательская задача' : 'Базовая задача'} · {formatDeadline(task.deadline)}</small>
                      </span>

                      <span className="check-item__status">{task.completed ? 'Выполнено' : 'Активно'}</span>

                      <span className="check-item__actions">
                        <button type="button" className="task-action" onClick={() => handleEdit(task)} aria-label="Редактировать задачу">
                          <PencilLine size={16} />
                        </button>
                        <button type="button" className="task-action task-action--danger" onClick={() => handleDelete(task.id)} aria-label="Удалить задачу">
                          <Trash2 size={16} />
                        </button>
                      </span>
                    </article>
                  ))}
                </div>
              </FadeIn>
            ))}
          </div>
        )}
      </section>
    </PageFrame>
  );
}

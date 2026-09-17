import { BarChart3, CheckCircle2, ClipboardList, ClockAlert } from 'lucide-react';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { getChecklistProgress, loadChecklist, loadPersonalDeadlines } from '@/lib/applicant-data';

const futureBlocks = [
  'Прогресс чек-листа',
  'Выполненные задачи',
  'Активные задачи',
  'Просроченные задачи',
  'Ближайшие дедлайны',
  'Прогресс по категориям',
  'Рекомендации',
];

export default function Analytics() {
  const checklist = loadChecklist();
  const progress = getChecklistProgress(checklist);
  const personalDeadlines = loadPersonalDeadlines();

  return (
    <PageFrame>
      <PageHero
        eyebrow="Аналитика"
        title="Базовая сводка личного плана"
        description="Страница показывает только простые доступные данные без прогнозов, сложной аналитики и внешних подключений."
        icon={BarChart3}
        aside={<DemoBadge />}
      />

      <section className="content-section">
        <FadeIn className="competition-warning" role="note" aria-live="polite">
          <div>
            <p>Аналитика находится в разработке. Сейчас доступны только базовые данные личного плана.</p>
          </div>
        </FadeIn>
      </section>

      <section className="content-section competition-controls-section">
        <SectionHeading
          eyebrow="Доступно сейчас"
          title="Только базовые данные"
          description="Показаны только реальные счётчики из текущего плана: без выдуманных процентов, графиков и прогнозов."
        />

        <FadeIn className="competition-stats-grid competition-stats-grid--in-card">
          <article className="competition-stat-card">
            <span>Количество задач</span>
            <strong>{progress.total}</strong>
          </article>

          <article className="competition-stat-card">
            <span>Количество выполненных задач</span>
            <strong>{progress.completed}</strong>
          </article>

          <article className="competition-stat-card">
            <span>Количество дедлайнов</span>
            <strong>{personalDeadlines.length}</strong>
          </article>
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Скоро"
          title="Будущие аналитические блоки"
          description="Эти блоки пока не активны и показываются как аккуратные заглушки следующего этапа."
        />

        <div className="events-grid">
          {futureBlocks.map((item) => (
            <FadeIn key={item} className="event-wrap">
              <article className="event-card event-card--blue">
                <div className="event-card__meta">
                  <span><ClockAlert size={14} /> Скоро</span>
                  <span className="demo-badge">В разработке</span>
                </div>
                <div>
                  <h3>{item}</h3>
                  <p>Блок подготовлен как демонстрационная заглушка и будет реализован на следующих этапах.</p>
                </div>
              </article>
            </FadeIn>
          ))}
        </div>
      </section>

      <section className="content-section">
        <FadeIn className="lined-note">
          <strong><CheckCircle2 size={16} /> Что уже работает</strong>
          <p>
            <ClipboardList size={16} /> Базовая сводка считывает существующие данные из твоего плана и не использует внешние сервисы.
          </p>
        </FadeIn>
      </section>
    </PageFrame>
  );
}

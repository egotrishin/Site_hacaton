import { AlertTriangle, ArrowLeft, IdCard, ListChecks } from 'lucide-react';
import { Link, useLocation, useParams } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { competitionDemoApplications, type CompetitionApplication } from '@/lib/competition-demo';

function formatConsent(value: boolean) {
  return value ? 'Да' : 'Нет';
}

type LocationState = {
  applications?: CompetitionApplication[];
};

export default function CompetitionDetails() {
  const { applicantId } = useParams<{ applicantId: string }>();
  const location = useLocation();
  const state = (location.state as LocationState | null) ?? null;
  const sourceApplications = state?.applications?.length ? state.applications : competitionDemoApplications;

  const records = sourceApplications
    .filter((item) => item.applicant_id === applicantId)
    .sort((left, right) => left.priority - right.priority);

  if (!applicantId || records.length === 0) {
    return (
      <PageFrame>
        <section className="content-section">
          <FadeIn className="empty-state empty-state--small">
            <h2>Абитуриент не найден</h2>
            <p>В текущем демонстрационном наборе нет записей с таким идентификатором.</p>
            <div className="wizard-actions wizard-actions--wrap">
              <Link className="button button--secondary" to="/competition">
                <ArrowLeft size={16} /> Вернуться к списку
              </Link>
            </div>
          </FadeIn>
        </section>
      </PageFrame>
    );
  }

  const universities = Array.from(new Set(records.map((item) => item.university)));
  const programs = Array.from(new Set(records.map((item) => item.program)));

  return (
    <PageFrame>
      <PageHero
        eyebrow="Страница абитуриента"
        title={`Демо-идентификатор: ${applicantId}`}
        description="Карточка показывает только демонстрационные записи и нужна для проверки сценария просмотра заявлений одного абитуриента."
        icon={IdCard}
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

      <section className="content-section">
        <SectionHeading
          eyebrow="Сводка"
          title="Все заявления абитуриента"
          description="Здесь показаны вузы, направления, конкурсы, баллы, текущие места, количество мест, приоритеты, согласия и условные статусы."
        />

        <FadeIn className="competition-selected-card">
          <div className="competition-stats-grid">
            <article className="competition-stat-card">
              <span>Заявлений</span>
              <strong>{records.length}</strong>
            </article>
            <article className="competition-stat-card">
              <span>Уникальные вузы</span>
              <strong>{universities.length}</strong>
            </article>
            <article className="competition-stat-card">
              <span>Уникальные направления</span>
              <strong>{programs.length}</strong>
            </article>
          </div>

          <div className="competition-lists-grid">
            <div className="competition-applications-list">
              <h4>Все вузы</h4>
              <ul>
                {universities.map((item) => (
                  <li key={item}><span>{item}</span></li>
                ))}
              </ul>
            </div>

            <div className="competition-applications-list">
              <h4>Все направления</h4>
              <ul>
                {programs.map((item) => (
                  <li key={item}><span>{item}</span></li>
                ))}
              </ul>
            </div>
          </div>

          <div className="competition-table-wrap">
            <table className="competition-table" aria-label="Заявления выбранного абитуриента">
              <thead>
                <tr>
                  <th>Вуз</th>
                  <th>Направление</th>
                  <th>Конкурс</th>
                  <th>Баллы</th>
                  <th>Место</th>
                  <th>Мест</th>
                  <th>Приоритет</th>
                  <th>Согласие</th>
                  <th>Условный статус</th>
                </tr>
              </thead>
              <tbody>
                {records.map((item) => (
                  <tr key={item.id}>
                    <td>{item.university}</td>
                    <td>{item.program}</td>
                    <td>{item.competition}</td>
                    <td>{item.score}</td>
                    <td>{item.current_rank}</td>
                    <td>{item.places}</td>
                    <td>{item.priority}</td>
                    <td>{formatConsent(item.consent)}</td>
                    <td>{item.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="competition-cards" aria-label="Карточки заявлений выбранного абитуриента">
            {records.map((item) => (
              <article key={item.id} className="competition-card competition-card--active">
                <div className="competition-card__head">
                  <strong>{item.university}</strong>
                  <span>Приоритет {item.priority}</span>
                </div>
                <div className="competition-card__grid">
                  <p><span>Направление</span><strong>{item.program}</strong></p>
                  <p><span>Конкурс</span><strong>{item.competition}</strong></p>
                  <p><span>Баллы</span><strong>{item.score}</strong></p>
                  <p><span>Место</span><strong>{item.current_rank}</strong></p>
                  <p><span>Мест</span><strong>{item.places}</strong></p>
                  <p><span>Согласие</span><strong>{formatConsent(item.consent)}</strong></p>
                  <p><span>Условный статус</span><strong>{item.status}</strong></p>
                </div>
              </article>
            ))}
          </div>

          <div className="competition-selected-card__actions">
            <Link className="button button--secondary" to="/competition">
              <ArrowLeft size={16} /> Вернуться к списку
            </Link>
          </div>
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Важно"
          title="Только демонстрация интерфейса"
          description="Этот раздел не подключён к внешним сервисам и не формирует официальный прогноз поступления."
        />

        <FadeIn className="competition-selected-card competition-selected-card--soft">
          <p>
            <ListChecks size={16} /> Данные полностью вымышлены и используются только для демонстрации.
          </p>
        </FadeIn>
      </section>
    </PageFrame>
  );
}

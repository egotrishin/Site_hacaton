import { Bell, CalendarClock, ClipboardCheck, MessageCircleMore } from 'lucide-react';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';

const notificationCards = [
  {
    title: 'Telegram-бот',
    description: 'Будущий канал напоминаний о личных шагах. В этом этапе подключение не реализовано.',
    icon: MessageCircleMore,
    tone: 'blue' as const,
  },
  {
    title: 'Напоминания о дедлайнах',
    description: 'В будущем здесь появятся напоминания о важных датах личного плана.',
    icon: CalendarClock,
    tone: 'coral' as const,
  },
  {
    title: 'Уведомления о задачах',
    description: 'Раздел для будущих напоминаний по чек-листу и текущим задачам.',
    icon: ClipboardCheck,
    tone: 'yellow' as const,
  },
  {
    title: 'Уведомления о мероприятиях',
    description: 'В будущем можно будет получать напоминания о выбранных событиях.',
    icon: Bell,
    tone: 'mint' as const,
  },
];

export default function Notifications() {
  return (
    <PageFrame>
      <PageHero
        eyebrow="Уведомления"
        title="Раздел будущих напоминаний"
        description="Это демонстрационный экран: здесь показана только структура будущих уведомлений без реальных подключений."
        icon={Bell}
        aside={<DemoBadge />}
      />

      <section className="content-section">
        <FadeIn className="competition-warning" role="note" aria-live="polite">
          <div>
            <p>Уведомления пока не подключены. В будущем здесь появятся напоминания о задачах и дедлайнах.</p>
          </div>
        </FadeIn>
      </section>

      <section className="content-section">
        <SectionHeading
          eyebrow="Сценарии"
          title="Что появится на следующих этапах"
          description="Все карточки ниже отмечены как будущие возможности и пока не выполняют отправку уведомлений."
        />

        <div className="events-grid">
          {notificationCards.map((card) => {
            const Icon = card.icon;

            return (
              <FadeIn key={card.title} className="event-wrap">
                <article className={`event-card event-card--${card.tone}`}>
                  <div className="event-card__meta">
                    <span><Icon size={14} /> {card.title}</span>
                    <div className="feature-status-pair">
                      <span className="demo-badge">Скоро</span>
                      <span className="demo-badge">В разработке</span>
                    </div>
                  </div>

                  <div>
                    <h3>{card.title}</h3>
                    <p>{card.description}</p>
                  </div>
                </article>
              </FadeIn>
            );
          })}
        </div>
      </section>
    </PageFrame>
  );
}

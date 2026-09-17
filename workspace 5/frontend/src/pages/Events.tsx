import { useState } from 'react';
import { ArrowUpRight, CalendarDays, Heart, LogIn, Mic2, Presentation, School, UsersRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn, HoverLift, Stagger } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import { isFavorite, loadFavorites, toggleFavorite } from '@/lib/applicant-data';

const events = [
  { id: 'event-open-day', type: 'Знакомство', title: 'День открытых дверей', text: 'Посмотри, как может выглядеть карточка встречи с университетом.', icon: School, tone: 'blue' },
  { id: 'event-strategy', type: 'Разбор', title: 'Как выбрать стратегию', text: 'Демонстрационная встреча о сочетании ЕГЭ и олимпиад.', icon: Presentation, tone: 'yellow' },
  { id: 'event-admission-qna', type: 'Диалог', title: 'Вопросы приёмной комиссии', text: 'Место для будущей онлайн-встречи без указанной реальной даты.', icon: Mic2, tone: 'coral' },
  { id: 'event-students-talk', type: 'Комьюнити', title: 'Разговор со студентами', text: 'Пример спокойной встречи о выборе направления и адаптации.', icon: UsersRound, tone: 'mint' },
];

export default function Events() {
  const { isSignedIn } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState(() => loadFavorites());

  const handleToggleEventFavorite = (eventId: string, title: string) => {
    if (!isSignedIn) {
      navigate('/login');
      return;
    }

    const next = toggleFavorite({
      type: 'event',
      title,
      sourceId: eventId,
    });

    setFavorites(next);
  };

  return (
    <PageFrame>
      <PageHero eyebrow="Исследуй возможности" title="Мероприятия" description="Пример того, как будут выглядеть встречи, разборы и дни открытых дверей. Все карточки — демонстрационные." icon={CalendarDays} aside={<DemoBadge />} />
      <section className="content-section">
        <SectionHeading eyebrow="Подборка" title="Посмотри, какие форматы бывают" description="Без реальных дат и регистрации — сейчас мы настраиваем только структуру и подачу." />
        <Stagger className="events-grid" stagger={0.08}>
          {events.map(({ id, type, title, text, icon: Icon, tone }) => (
            <HoverLift key={id} className="event-wrap">
              <article className={`event-card event-card--${tone}`}>
                <div className="event-card__meta"><span><Icon size={16} />{type}</span><DemoBadge /></div>
                <div><h3>{title}</h3><p>{text}</p></div>
                <div className="wizard-actions wizard-actions--wrap">
                  <button type="button" className="event-card__action">Подробнее <ArrowUpRight size={17} /></button>
                  {isSignedIn ? (
                    <button type="button" className="button button--secondary" onClick={() => handleToggleEventFavorite(id, title)}>
                      <Heart size={16} /> {isFavorite('event', id, favorites) ? 'В избранном' : 'Добавить в избранное'}
                    </button>
                  ) : (
                    <Link className="button button--secondary" to="/login"><LogIn size={16} /> Войти, чтобы сохранить</Link>
                  )}
                </div>
              </article>
            </HoverLift>
          ))}
        </Stagger>
      </section>
      <FadeIn className="lined-note"><strong>Никаких пропущенных дат</strong><p>В полной версии события будут собраны в понятную ленту. Пока это только визуальная концепция.</p></FadeIn>
    </PageFrame>
  );
}

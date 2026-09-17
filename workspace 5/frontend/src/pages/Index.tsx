import { ArrowRight, BookOpenCheck, CalendarDays, Check, Compass, FileText, Flag, GraduationCap, Lightbulb, Medal, MessageCircleMore, MousePointer2, Route, Sparkles, Trophy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, HoverLift, Stagger, motion } from '@/components/MotionPrimitives';
import { BlurText } from '@/components/reactbits/BlurText';
import { SectionHeading, TileGrid } from '@/components/notebook/PageKit';
import { getChecklistProgress, getNearestActiveTask, getStrategyLabel, loadChecklist, loadOnboardingData } from '@/lib/applicant-data';

const howItWorks = [
  { number: '01', title: 'Расскажи о себе', text: 'Укажи класс и цель.' },
  { number: '02', title: 'Выбери стратегию', text: 'ЕГЭ, олимпиады или оба пути.' },
  { number: '03', title: 'Получи план', text: 'Разбей путь на шаги.' },
  { number: '04', title: 'Двигайся по шагам', text: 'Делай по одной задаче.' },
];

const mainDirections = [
  { title: 'ЕГЭ', description: 'Подготовка по предметам.', icon: GraduationCap, tone: 'blue' as const, link: '/ege', label: 'Экзамены' },
  { title: 'Олимпиады', description: 'Сроки и важные советы.', icon: Trophy, tone: 'yellow' as const, link: '/olympiads', label: 'Возможности' },
  { title: 'Чек-лист', description: 'Твой список задач.', icon: BookOpenCheck, tone: 'mint' as const, link: '/checklist', label: 'План' },
  { title: 'Мероприятия', description: 'Полезные события (демо).', icon: CalendarDays, tone: 'coral' as const, link: '/events', label: 'Демо' },
];

const futureFeatures = [
  { title: 'Советы поступивших', description: 'Короткие практичные советы.', icon: MessageCircleMore, tone: 'coral' as const },
  { title: 'Полезные материалы', description: 'Подборки в одном месте.', icon: FileText, tone: 'blue' as const },
  { title: 'Конкурсные списки', description: 'Демо без реальных данных.', icon: Medal, tone: 'yellow' as const },
  { title: 'Подводные камни', description: 'Типичные ошибки.', icon: Flag, tone: 'ink' as const, link: '/pitfalls' },
];

function getNearestTaskText() {
  const tasks = loadChecklist();
  const nearest = getNearestActiveTask(tasks);

  if (!nearest) return 'Все текущие задачи выполнены — можно добавить новый шаг в чек-листе.';
  if (!nearest.deadline) return `Ближайшая задача: ${nearest.title}.`;

  const date = new Date(nearest.deadline);
  if (Number.isNaN(date.getTime())) return `Ближайшая задача: ${nearest.title}.`;

  const formattedDate = date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'short', year: 'numeric' });
  return `Ближайшая задача: ${nearest.title} (до ${formattedDate}).`;
}

const Index = () => {
  const onboarding = loadOnboardingData();
  const checklistTasks = loadChecklist();
  const progress = getChecklistProgress(checklistTasks);
  const isOnboardingCompleted = onboarding.completed;

  return (
    <main className="home-page">
      <section className="hero page-container">
        <div className="hero__copy">
          <FadeIn>
            <span className="eyebrow"><Sparkles size={16} aria-hidden="true" />Твой спокойный старт</span>
          </FadeIn>
          <BlurText text={`привет${'\u00A0'}соси${'\u00A0'}типо`} className="hero__title" />
          <FadeIn delay={0.14}>
            <p className="hero__description">
              {isOnboardingCompleted
                ? `Стратегия: ${getStrategyLabel(onboarding.strategy)}. Выполнено: ${progress.completed} из ${progress.total || 0}.`
                : 'Выбери направление и начни с первого шага.'}
            </p>
            <div className="hero__actions">
              <Link className="button button--primary" to={isOnboardingCompleted ? '/checklist' : '/onboarding'}>
                {isOnboardingCompleted ? 'Открыть мой чек-лист' : 'Начать'} <ArrowRight size={18} />
              </Link>
              <Link className="button button--secondary" to="/checklist"><BookOpenCheck size={18} /> Открыть чек-лист</Link>
            </div>
          </FadeIn>
        </div>

        <FadeIn delay={0.18} className="hero__visual">
          <motion.div className="notebook-scene" whileHover={{ rotate: -1.5, y: -4 }} transition={{ type: 'spring', stiffness: 220, damping: 18 }}>
            <div className="notebook-scene__tab">мой маршрут</div>
            <div className="notebook-scene__paper">
              <div className="paper-heading"><Compass size={20} /> Куда двигаемся?</div>
              {['Выбрать направления', 'Собрать материалы', 'Сделать первый шаг'].map((item, index) => (
                <div className="paper-line" key={item}>
                  <span className={`paper-check${index === 0 ? ' paper-check--done' : ''}`}>{index === 0 && <Check size={12} />}</span>
                  <span>{item}</span>
                </div>
              ))}
              <div className="paper-note"><MousePointer2 size={14} /> Нажми на карточку</div>
            </div>
            <motion.div className="orbit-dot orbit-dot--one" animate={{ y: [0, -6, 0], rotate: [0, 5, 0] }} transition={{ duration: 3.4, repeat: Infinity }} />
            <motion.div className="orbit-dot orbit-dot--two" animate={{ y: [0, 5, 0], rotate: [0, -4, 0] }} transition={{ duration: 4, repeat: Infinity }} />
          </motion.div>
        </FadeIn>
      </section>

      <section className="content-section page-container">
        <SectionHeading eyebrow="Как это работает" title="От цели к шагам" description="Короткий понятный путь." />
        <Stagger className="steps-grid" stagger={0.08}>
          {howItWorks.map((step) => (
            <HoverLift key={step.number} className="step-card-wrap">
              <article className="step-card">
                <span className="step-card__number">{step.number}</span>
                <div><h3>{step.title}</h3><p>{step.text}</p></div>
              </article>
            </HoverLift>
          ))}
        </Stagger>
      </section>

      <section className="content-section page-container">
        <SectionHeading eyebrow="Разделы тетради" title="Всё важное по страницам" description="Открой нужный раздел." />
        <TileGrid items={mainDirections} />
      </section>

      <section className="content-section page-container">
        <FadeIn className="next-step">
          <div className="next-step__icon"><Route size={28} /></div>
          <div className="next-step__copy">
            <span className="section-kicker">Твой следующий шаг</span>
            {isOnboardingCompleted ? (
              <>
                <h2>Стратегия: {getStrategyLabel(onboarding.strategy)}</h2>
                <p>{getNearestTaskText()}</p>
                <p>Текущий прогресс чек-листа: {progress.percent}%.</p>
              </>
            ) : (
              <>
                <h2>Сначала пройди онбординг</h2>
                <p>После него появятся стратегия и личный план.</p>
              </>
            )}
          </div>
          <Link className="button button--light" to={isOnboardingCompleted ? '/checklist' : '/onboarding'}>
            {isOnboardingCompleted ? 'Продолжить по плану' : 'Пройти онбординг'} <ArrowRight size={18} />
          </Link>
        </FadeIn>
      </section>

      <section className="content-section page-container">
        <SectionHeading eyebrow="Дальше" title="Что появится позже" description="Пока это демонстрация." />
        <TileGrid items={futureFeatures} compact />
      </section>
    </main>
  );
};

export default Index;

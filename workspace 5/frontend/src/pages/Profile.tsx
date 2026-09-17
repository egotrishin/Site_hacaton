import { ArrowRight, BarChart3, Bell, CalendarDays, CheckCircle2, CircleAlert, Heart, LogIn, LogOut, PencilLine, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn, HoverLift, Stagger } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';
import {
  getChecklistProgress,
  getNearestActiveTask,
  getNearestPersonalDeadlines,
  getStrategyLabel,
  loadChecklist,
  loadFavorites,
  loadOnboardingData,
  loadPersonalDeadlines,
} from '@/lib/applicant-data';

function formatDeadline(deadline: string) {
  if (!deadline) return 'Пока не задан';
  const date = new Date(deadline);
  return Number.isNaN(date.getTime()) ? 'Пока не задан' : date.toLocaleDateString('ru-RU', { day: '2-digit', month: 'long', year: 'numeric' });
}

export default function Profile() {
  const { profile, isSignedIn, signOut } = useAuth();
  const navigate = useNavigate();
  const onboarding = loadOnboardingData();
  const tasks = loadChecklist();
  const favorites = loadFavorites();
  const personalDeadlines = loadPersonalDeadlines();
  const upcomingDeadlines = getNearestPersonalDeadlines(personalDeadlines, 3);
  const progress = getChecklistProgress(tasks);
  const nearestTask = getNearestActiveTask(tasks);
  const nearestDeadlineTask = upcomingDeadlines[0];
  const nearestDeadlinesSummary = upcomingDeadlines.map((item) => `${item.title} · ${formatDeadline(item.date)}`).join(' • ');

  const handleSignOut = () => {
    signOut();
    navigate('/login', { replace: true });
  };

  if (!isSignedIn || !profile) {
    return (
      <PageFrame>
        <PageHero eyebrow="Личный кабинет" title="Сначала войди в демо-профиль" description="Личный кабинет доступен после демонстрационной регистрации или входа в этом браузере." icon={UserRound} aside={<DemoBadge />} />
        <FadeIn className="empty-state profile-empty">
          <div className="empty-state__art"><UserRound size={36} /><span>!</span></div>
          <h2>Ты пока не вошёл</h2>
          <p>Создай демо-профиль или открой сохранённый — никаких данных на сервер не отправляется.</p>
          <div className="wizard-actions wizard-actions--wrap"><Link className="button button--primary" to="/login"><LogIn size={18} /> Войти</Link><Link className="button button--secondary" to="/register">Зарегистрироваться</Link></div>
        </FadeIn>
      </PageFrame>
    );
  }

  const details = [
    ['Класс', onboarding.grade || 'Не указан'],
    ['Год поступления', onboarding.admissionYear || 'Не указан'],
    ['Стратегия', getStrategyLabel(onboarding.strategy)],
    ['Направление', onboarding.direction || 'Не указано'],
  ];

  return (
    <PageFrame>
      <PageHero eyebrow="Личный кабинет" title={`Привет, ${profile.name}`} description="Это твоя демо-сводка: она собирает локально сохранённые ответы и задачи, но не является защищённой учётной записью." icon={UserRound} aside={<DemoBadge />} />
      <section className="content-section profile-section">
        <FadeIn className="demo-notice profile-notice"><CircleAlert size={18} /><p><strong>Демо-режим:</strong> имя, email и состояние входа сохранены только в этом браузере. Пароль не хранится, сервера нет.</p></FadeIn>
        <SectionHeading eyebrow="Твоя сводка" title="Профиль и маршрут" description="Здесь собраны ответы онбординга и ближайшие шаги из чек-листа." />
        <Stagger className="profile-summary" stagger={0.06}>
          <HoverLift className="profile-card profile-card--identity"><span className="profile-card__label">Демо-профиль</span><h2>{profile.name}</h2><p>{profile.email}</p><DemoBadge /></HoverLift>
          <HoverLift className="profile-card profile-card--progress"><span className="profile-card__label">Чек-лист</span><strong>{progress.percent}%</strong><p>{progress.completed} из {progress.total} задач выполнено</p><div className="progress-track"><span style={{ width: `${progress.percent}%` }} /></div></HoverLift>
          <HoverLift className="profile-card profile-card--next"><span className="profile-card__label">Ближайшая задача</span><h3>{nearestTask?.title || 'Задач пока нет'}</h3><p>{nearestTask?.description || 'Пройди онбординг и открой чек-лист, чтобы собрать маршрут.'}</p></HoverLift>
          <HoverLift className="profile-card profile-card--favorites"><span className="profile-card__label">Избранное</span><strong>{favorites.length}</strong><p>{favorites.length > 0 ? 'Сохранил важные карточки — они уже в подборке.' : 'Пока пусто: добавь первые карточки из разделов.'}</p><Heart size={22} /></HoverLift>
        </Stagger>
      </section>
      <section className="content-section profile-section">
        <div className="profile-details-grid">
          <FadeIn className="profile-details-card"><h2>Учебный профиль</h2><div className="profile-details-list">{details.map(([label, value]) => <div key={label}><span>{label}</span><strong>{value}</strong></div>)}<div><span>Предметы</span><strong>{onboarding.subjects.length ? onboarding.subjects.join(', ') : 'Не выбраны'}</strong></div></div></FadeIn>
          <FadeIn className="profile-deadline-card"><CalendarDays size={24} /><span className="profile-card__label">Ближайший личный дедлайн</span><h2>{formatDeadline(nearestDeadlineTask?.date || '')}</h2><p>{nearestDeadlineTask ? nearestDeadlinesSummary : 'Добавь дедлайн в личном разделе, и он появится здесь.'}</p></FadeIn>
        </div>
      </section>
      <section className="content-section profile-section">
        <SectionHeading eyebrow="Быстрые действия" title="Только важное" description="Убрали дубли вкладок, оставили ключевые переходы." />
        <Stagger className="profile-actions" stagger={0.06}>
          <HoverLift><Link className="profile-action" to="/onboarding"><PencilLine size={20} /><span><strong>Изменить ответы</strong><small>Онбординг</small></span><ArrowRight size={18} /></Link></HoverLift>
          <HoverLift><Link className="profile-action" to="/notifications"><Bell size={20} /><span><strong>Открыть уведомления</strong><small>Скоро</small></span><ArrowRight size={18} /></Link></HoverLift>
          <HoverLift><Link className="profile-action" to="/analytics"><BarChart3 size={20} /><span><strong>Открыть аналитику</strong><small>Базовая сводка</small></span><ArrowRight size={18} /></Link></HoverLift>
        </Stagger>
        <FadeIn><button type="button" className="button button--secondary profile-signout" onClick={handleSignOut}><LogOut size={18} /> Выйти из демо-профиля</button></FadeIn>
      </section>
      <FadeIn className="lined-note profile-note"><CheckCircle2 size={18} /><div><strong>Данные остаются у тебя</strong><p>Выход завершает только текущий демо-сеанс. Онбординг и чек-лист не удаляются из браузера.</p></div></FadeIn>
    </PageFrame>
  );
}

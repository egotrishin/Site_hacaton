import { ArrowRight, CircleAlert, LogIn, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';

export default function Login() {
  const { profile, signIn } = useAuth();
  const navigate = useNavigate();

  const handleSignIn = () => {
    if (signIn()) navigate('/profile', { replace: true });
  };

  return (
    <PageFrame>
      <PageHero eyebrow="Демо-доступ" title="Вход в учебный профиль" description="Здесь нет проверки пароля или защищённой авторизации. Вход доступен, если демо-профиль уже сохранён в этом браузере." icon={LogIn} aside={<DemoBadge />} />
      <section className="auth-layout">
        <FadeIn className="auth-card">
          {profile ? (
            <>
              <div className="auth-card__heading"><LogIn size={22} /><div><h2>Продолжить как {profile.name}</h2><p>{profile.email}</p></div></div>
              <div className="demo-notice"><CircleAlert size={18} /><p><strong>Демо-режим:</strong> достаточно открыть этот браузер. Пароль не проверяется и не используется.</p></div>
              <button className="button button--primary" type="button" onClick={handleSignIn}>Войти в личный кабинет <ArrowRight size={18} /></button>
              <p className="auth-card__footer">Нужен другой демонстрационный профиль? <Link to="/register">Перерегистрироваться</Link></p>
            </>
          ) : (
            <>
              <div className="auth-card__heading"><UserPlus size={22} /><div><h2>Демо-профиль пока не создан</h2><p>Сначала заполни короткую регистрацию — она сохранит только имя и email в браузере.</p></div></div>
              <Link className="button button--primary" to="/register">Зарегистрироваться <ArrowRight size={18} /></Link>
              <p className="auth-card__footer">Без сервера, писем и паролей — только учебная демонстрация.</p>
            </>
          )}
        </FadeIn>
      </section>
    </PageFrame>
  );
}

import { useState } from 'react';
import { ArrowRight, CircleAlert, LockKeyhole, UserPlus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { DemoBadge, PageFrame, PageHero } from '@/components/notebook/PageKit';
import { useAuth } from '@/components/auth/AuthProvider';

type FormState = { name: string; email: string; password: string; passwordRepeat: string };
type FormErrors = Partial<Record<keyof FormState, string>>;

const initialForm: FormState = { name: '', email: '', password: '', passwordRepeat: '' };
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  if (!form.name.trim()) errors.name = 'Укажи имя.';
  if (!form.email.trim()) errors.email = 'Укажи email.';
  else if (!emailPattern.test(form.email.trim())) errors.email = 'Проверь формат email.';
  if (!form.password) errors.password = 'Придумай пароль для формы.';
  if (!form.passwordRepeat) errors.passwordRepeat = 'Повтори пароль.';
  else if (form.password !== form.passwordRepeat) errors.passwordRepeat = 'Пароли не совпадают.';
  return errors;
}

export default function Register() {
  const [form, setForm] = useState<FormState>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const { register } = useAuth();
  const navigate = useNavigate();

  const setField = (field: keyof FormState, value: string) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setErrors((previous) => ({ ...previous, [field]: undefined }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(form);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    register({ name: form.name, email: form.email });
    navigate('/profile', { replace: true });
  };

  return (
    <PageFrame>
      <PageHero eyebrow="Демо-доступ" title="Создай учебный профиль" description="Это демонстрационная форма: имя и email останутся только в браузере. Пароль не сохраняется и никуда не отправляется." icon={UserPlus} aside={<DemoBadge />} />
      <section className="auth-layout">
        <FadeIn className="auth-card">
          <div className="auth-card__heading"><LockKeyhole size={22} /><div><h2>Регистрация в демо-режиме</h2><p>Поля нужны, чтобы показать работу сценария, а не для создания защищённого аккаунта.</p></div></div>
          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <label>Имя<input className="wizard-input" value={form.name} onChange={(event) => setField('name', event.target.value)} autoComplete="name" aria-invalid={Boolean(errors.name)} /></label>
            {errors.name && <p className="wizard-error">{errors.name}</p>}
            <label>Email<input className="wizard-input" type="email" value={form.email} onChange={(event) => setField('email', event.target.value)} autoComplete="email" aria-invalid={Boolean(errors.email)} /></label>
            {errors.email && <p className="wizard-error">{errors.email}</p>}
            <label>Пароль<input className="wizard-input" type="password" value={form.password} onChange={(event) => setField('password', event.target.value)} autoComplete="new-password" aria-invalid={Boolean(errors.password)} /></label>
            {errors.password && <p className="wizard-error">{errors.password}</p>}
            <label>Повтори пароль<input className="wizard-input" type="password" value={form.passwordRepeat} onChange={(event) => setField('passwordRepeat', event.target.value)} autoComplete="new-password" aria-invalid={Boolean(errors.passwordRepeat)} /></label>
            {errors.passwordRepeat && <p className="wizard-error">{errors.passwordRepeat}</p>}
            <div className="demo-notice"><CircleAlert size={18} /><p><strong>Важно:</strong> пароль не сохраняется, не проверяется при следующем входе и не защищает данные. Это только демонстрация интерфейса.</p></div>
            <button className="button button--primary" type="submit">Создать демо-профиль <ArrowRight size={18} /></button>
          </form>
          <p className="auth-card__footer">Уже создал профиль? <Link to="/login">Войти в демо-режиме</Link></p>
        </FadeIn>
      </section>
    </PageFrame>
  );
}

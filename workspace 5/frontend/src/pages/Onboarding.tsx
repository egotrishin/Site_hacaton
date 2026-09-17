import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, BookOpenCheck, Compass, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { PageFrame, PageHero, SectionHeading } from '@/components/notebook/PageKit';
import {
  clearChecklist,
  clearOnboardingData,
  getEmptyOnboardingData,
  getPreparationLabel,
  getStrategyLabel,
  loadOnboardingData,
  saveOnboardingData,
  type OnboardingData,
} from '@/lib/applicant-data';

const questionCount = 5;

const gradeOptions = ['9', '10', '11', 'выпускник'];

const strategyOptions: { value: OnboardingData['strategy']; label: string }[] = [
  { value: 'ege', label: 'ЕГЭ' },
  { value: 'olympiads', label: 'Олимпиады' },
  { value: 'both', label: 'Оба варианта' },
  { value: 'undecided', label: 'Пока не определился' },
];

const preparationOptions: { value: OnboardingData['preparationLevel']; label: string }[] = [
  { value: 'not_started', label: 'Не начинал' },
  { value: 'starting', label: 'Начинаю' },
  { value: 'preparing', label: 'Готовлюсь' },
  { value: 'active', label: 'Активно готовлюсь' },
  { value: 'unknown', label: 'Не знаю' },
];

const subjectsCatalog = ['Математика', 'Русский язык', 'Информатика', 'Физика', 'Химия', 'Биология', 'Обществознание', 'История', 'Английский язык', 'Литература'];

const stepMeta = [
  { eyebrow: 'Шаг 1', title: 'Кто ты сейчас?', description: 'Выбери свой класс или статус, чтобы рекомендации были ближе к твоей ситуации.' },
  { eyebrow: 'Шаг 2', title: 'Когда планируешь поступление?', description: 'Укажи год — это поможет выстроить реалистичный темп подготовки.' },
  { eyebrow: 'Шаг 3', title: 'Какой путь тебе ближе?', description: 'Можно выбрать ЕГЭ, олимпиады или комбинированный маршрут.' },
  { eyebrow: 'Шаг 4', title: 'Что тебя интересует?', description: 'Отметь предметы и кратко напиши направление, которое хочешь рассмотреть.' },
  { eyebrow: 'Шаг 5', title: 'На каком ты этапе подготовки?', description: 'Оцени текущий уровень, чтобы начать с комфортного шага.' },
];

function validateStep(step: number, data: OnboardingData) {
  const currentYear = new Date().getFullYear();

  if (step === 0 && !data.grade) {
    return 'Выбери класс или статус, чтобы продолжить.';
  }

  if (step === 1) {
    const year = Number(data.admissionYear);
    if (!data.admissionYear.trim()) return 'Укажи год поступления.';
    if (!Number.isInteger(year) || data.admissionYear.trim().length !== 4) return 'Год должен быть в формате из 4 цифр.';
    if (year < currentYear - 1 || year > currentYear + 8) return `Укажи реалистичный год в диапазоне ${currentYear - 1}–${currentYear + 8}.`;
  }

  if (step === 2 && !data.strategy) {
    return 'Выбери стратегию подготовки.';
  }

  if (step === 3) {
    if (data.subjects.length === 0) return 'Выбери хотя бы один предмет.';
    if (!data.direction.trim()) return 'Добавь интересующее направление.';
  }

  if (step === 4 && !data.preparationLevel) {
    return 'Оцени текущий уровень подготовки.';
  }

  return '';
}

export default function Onboarding() {
  const initialData = useMemo(() => loadOnboardingData(), []);
  const [answers, setAnswers] = useState<OnboardingData>(initialData);
  const [step, setStep] = useState(initialData.completed ? questionCount : 0);
  const [error, setError] = useState('');

  useEffect(() => {
    saveOnboardingData(answers);
  }, [answers]);

  const progress = Math.round((Math.min(step + 1, questionCount) / questionCount) * 100);

  const setPartial = (patch: Partial<OnboardingData>) => {
    setAnswers((prev) => ({ ...prev, ...patch, completed: prev.completed }));
    setError('');
  };

  const handleSubjectToggle = (subject: string) => {
    setAnswers((prev) => {
      const subjects = prev.subjects.includes(subject)
        ? prev.subjects.filter((item) => item !== subject)
        : [...prev.subjects, subject];
      return { ...prev, subjects, completed: prev.completed };
    });
    setError('');
  };

  const handleNext = () => {
    if (step >= questionCount) return;

    const validationError = validateStep(step, answers);
    if (validationError) {
      setError(validationError);
      return;
    }

    if (step === questionCount - 1) {
      setAnswers((prev) => ({ ...prev, completed: true }));
      setStep(questionCount);
      setError('');
      return;
    }

    setStep((prev) => prev + 1);
  };

  const handleBack = () => {
    if (step <= 0) return;
    setStep((prev) => prev - 1);
    setError('');
  };

  const handleClearAll = () => {
    if (!window.confirm('Очистить ответы и персональный чек-лист?')) return;
    clearOnboardingData();
    clearChecklist();
    setAnswers(getEmptyOnboardingData());
    setStep(0);
    setError('');
  };

  return (
    <PageFrame>
      <PageHero
        eyebrow="Персональный старт"
        title="Заполним короткий онбординг"
        description="Пять шагов, чтобы главная страница и чек-лист стали персональными. Данные сохраняются в браузере и доступны после обновления страницы."
        icon={Sparkles}
        aside={(
          <div className="progress-card">
            <span>{step >= questionCount ? 'Профиль готов' : `Шаг ${step + 1} из ${questionCount}`}</span>
            <strong>{progress}% заполнено</strong>
            <div className="progress-track" role="progressbar" aria-label="Прогресс онбординга" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <span style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      />

      <section className="content-section">
        <SectionHeading
          eyebrow={step >= questionCount ? 'Резюме' : stepMeta[step].eyebrow}
          title={step >= questionCount ? 'Твой профиль заполнен' : stepMeta[step].title}
          description={step >= questionCount ? 'Можно перейти к чек-листу, отредактировать ответы или очистить данные и начать заново.' : stepMeta[step].description}
        />

        <FadeIn className="onboarding-wizard">
          {step === 0 && (
            <div className="wizard-block">
              <p className="wizard-label">Класс / статус</p>
              <div className="subject-picker">
                {gradeOptions.map((grade) => (
                  <button
                    key={grade}
                    type="button"
                    className={`subject-chip${answers.grade === grade ? ' subject-chip--active' : ''}`}
                    onClick={() => setPartial({ grade })}
                  >
                    {grade}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="wizard-block">
              <p className="wizard-label">Год поступления</p>
              <input
                type="number"
                min={new Date().getFullYear() - 1}
                max={new Date().getFullYear() + 8}
                value={answers.admissionYear}
                onChange={(event) => setPartial({ admissionYear: event.target.value })}
                className="wizard-input"
                placeholder="Например, 2027"
              />
            </div>
          )}

          {step === 2 && (
            <div className="wizard-block">
              <p className="wizard-label">Стратегия</p>
              <div className="subject-picker">
                {strategyOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`subject-chip${answers.strategy === option.value ? ' subject-chip--active' : ''}`}
                    onClick={() => setPartial({ strategy: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="wizard-block wizard-block--stack">
              <div>
                <p className="wizard-label">Интересующие предметы</p>
                <div className="subject-picker">
                  {subjectsCatalog.map((subject) => (
                    <button
                      key={subject}
                      type="button"
                      className={`subject-chip${answers.subjects.includes(subject) ? ' subject-chip--active' : ''}`}
                      onClick={() => handleSubjectToggle(subject)}
                    >
                      {subject}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="wizard-label">Направление</p>
                <input
                  type="text"
                  value={answers.direction}
                  onChange={(event) => setPartial({ direction: event.target.value })}
                  className="wizard-input"
                  placeholder="Например, ИТ, экономика, медицина"
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="wizard-block">
              <p className="wizard-label">Уровень подготовки</p>
              <div className="subject-picker">
                {preparationOptions.map((option) => (
                  <button
                    key={option.value}
                    type="button"
                    className={`subject-chip${answers.preparationLevel === option.value ? ' subject-chip--active' : ''}`}
                    onClick={() => setPartial({ preparationLevel: option.value })}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step >= questionCount && (
            <div className="wizard-summary">
              <div className="wizard-summary__row"><strong>Класс / статус:</strong><span>{answers.grade || '—'}</span></div>
              <div className="wizard-summary__row"><strong>Год поступления:</strong><span>{answers.admissionYear || '—'}</span></div>
              <div className="wizard-summary__row"><strong>Стратегия:</strong><span>{getStrategyLabel(answers.strategy)}</span></div>
              <div className="wizard-summary__row"><strong>Предметы:</strong><span>{answers.subjects.length ? answers.subjects.join(', ') : '—'}</span></div>
              <div className="wizard-summary__row"><strong>Направление:</strong><span>{answers.direction || '—'}</span></div>
              <div className="wizard-summary__row"><strong>Уровень:</strong><span>{getPreparationLabel(answers.preparationLevel)}</span></div>
            </div>
          )}

          {error && <p className="wizard-error">{error}</p>}

          {step < questionCount ? (
            <div className="wizard-actions">
              <button type="button" className="button button--secondary" onClick={handleBack} disabled={step === 0}>
                Назад
              </button>
              <button type="button" className="button button--primary" onClick={handleNext}>
                {step === questionCount - 1 ? 'Сохранить профиль' : 'Далее'} <ArrowRight size={18} />
              </button>
            </div>
          ) : (
            <div className="wizard-actions wizard-actions--wrap">
              <button type="button" className="button button--secondary" onClick={() => setStep(0)}>
                Редактировать ответы
              </button>
              <button type="button" className="button button--secondary" onClick={handleClearAll}>
                Очистить данные
              </button>
              <Link className="button button--primary" to="/checklist">
                Перейти к чек-листу <BookOpenCheck size={18} />
              </Link>
            </div>
          )}
        </FadeIn>
      </section>

      <FadeIn className="onboarding-cta">
        <div>
          <Compass size={26} />
          <div>
            <strong>Данные можно изменить в любой момент</strong>
            <p>Повторное редактирование и очистка доступны прямо на этой странице.</p>
          </div>
        </div>
        <Link className="button button--secondary" to="/">
          На главную
        </Link>
      </FadeIn>
    </PageFrame>
  );
}

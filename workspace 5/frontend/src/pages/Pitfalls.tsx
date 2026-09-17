import { AlertTriangle, ArrowRight, CalendarX2, FileWarning, GitFork, Medal, ShieldCheck, Umbrella } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';
import { PageFrame, PageHero, SectionHeading, TileGrid } from '@/components/notebook/PageKit';

const pitfalls = [
  { title: 'Пропущенные сроки', description: 'Важные этапы легко потерять, если они разбросаны по разным источникам.', icon: CalendarX2, tone: 'coral' as const },
  { title: 'Ошибки в документах', description: 'Даже простые формальности лучше проверять заранее и не в последний момент.', icon: FileWarning, tone: 'yellow' as const },
  { title: 'Неправильная стратегия', description: 'Чужой маршрут может не подходить твоим предметам, темпу и целям.', icon: GitFork, tone: 'blue' as const },
  { title: 'Забытые достижения', description: 'Олимпиады, волонтёрство и другие результаты важно вовремя собрать.', icon: Medal, tone: 'mint' as const },
  { title: 'Нет запасного варианта', description: 'План Б снижает тревогу и помогает принимать решения спокойнее.', icon: Umbrella, tone: 'ink' as const },
];

export default function Pitfalls() {
  return (
    <PageFrame>
      <PageHero eyebrow="Проверь заранее" title="Подводные камни поступления" description="Не страшилки, а спокойный список мест, где особенно полезны внимание и запас времени." icon={AlertTriangle} aside={<div className="shield-note"><ShieldCheck size={24} /><span>Знать заранее — уже половина защиты</span></div>} />
      <section className="content-section">
        <SectionHeading eyebrow="Пять частых рисков" title="Что не стоит оставлять на последний момент" description="Карточки пока содержат общие подсказки и не заменяют официальную информацию вузов." />
        <TileGrid items={pitfalls} />
      </section>
      <FadeIn className="next-step next-step--soft"><div className="next-step__copy"><span className="section-kicker">Спокойная проверка</span><h2>Добавь риски в общий маршрут</h2><p>Так они превращаются из повода для тревоги в обычные задачи.</p></div><Link className="button button--primary" to="/checklist">Открыть чек-лист <ArrowRight size={18} /></Link></FadeIn>
    </PageFrame>
  );
}

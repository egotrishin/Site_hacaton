import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn } from '@/components/MotionPrimitives';

export default function NotFound() {
  return (
    <main className="not-found page-container">
      <FadeIn className="not-found__card">
        <span className="not-found__number">404</span>
        <h1>Такой страницы нет в тетради</h1>
        <p>Возможно, ссылка устарела или в адресе появилась лишняя буква.</p>
        <Link className="button button--primary" to="/"><ArrowLeft size={18} />Вернуться на главную</Link>
      </FadeIn>
    </main>
  );
}

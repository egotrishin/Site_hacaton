import { ArrowUpRight, NotebookPen } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <div className="site-footer__brand">
          <span className="brand__mark" aria-hidden="true"><NotebookPen size={18} /></span>
          <div>
            <strong>Тетрадь абитуриента</strong>
            <p>Спокойный старт подготовки к поступлению.</p>
          </div>
        </div>
        <div className="site-footer__links">
          <Link to="/onboarding">Как начать <ArrowUpRight size={15} /></Link>
          <Link to="/pitfalls">Подводные камни <ArrowUpRight size={15} /></Link>
        </div>
        <p className="site-footer__note">Демонстрационная версия · без реальных данных</p>
      </div>
    </footer>
  );
}

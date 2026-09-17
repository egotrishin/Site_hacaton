import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { FadeIn, HoverLift, Stagger, fadeDown } from '@/components/MotionPrimitives';

export type TileItem = {
  title: string;
  description: string;
  icon: LucideIcon;
  tone?: 'blue' | 'coral' | 'yellow' | 'mint' | 'ink';
  link?: string;
  label?: string;
};

export function DemoBadge() {
  return <span className="demo-badge"><Sparkles size={13} aria-hidden="true" /> Демо</span>;
}

export function PageHero({ eyebrow, title, description, icon: Icon, aside }: {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  aside?: ReactNode;
}) {
  return (
    <section className="page-hero">
      <FadeIn variants={fadeDown} className="page-hero__copy">
        <span className="eyebrow"><Icon size={16} aria-hidden="true" />{eyebrow}</span>
        <h1>{title}</h1>
        <p>{description}</p>
      </FadeIn>
      {aside && <FadeIn className="page-hero__aside">{aside}</FadeIn>}
    </section>
  );
}

export function SectionHeading({ eyebrow, title, description }: { eyebrow?: string; title: string; description?: string }) {
  return (
    <FadeIn className="section-heading">
      {eyebrow && <span className="section-kicker">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </FadeIn>
  );
}

export function TileGrid({ items, compact = false }: { items: TileItem[]; compact?: boolean }) {
  return (
    <Stagger className={`tile-grid${compact ? ' tile-grid--compact' : ''}`} stagger={0.07}>
      {items.map(({ title, description, icon: Icon, tone = 'blue', link, label }) => {
        const content = (
          <article className={`tile tile--${tone}`}>
            <div className="tile__top">
              <span className="tile__icon"><Icon size={22} aria-hidden="true" /></span>
              {label && <span className="tile__label">{label}</span>}
            </div>
            <div>
              <h3>{title}</h3>
              <p>{description}</p>
            </div>
            {link && <span className="tile__arrow" aria-hidden="true"><ArrowRight size={19} /></span>}
          </article>
        );

        return (
          <HoverLift key={title} className="tile-wrap">
            {link ? <Link className="tile-link" to={link} aria-label={`${title}: ${description}`}>{content}</Link> : content}
          </HoverLift>
        );
      })}
    </Stagger>
  );
}

export function PageFrame({ children }: { children: ReactNode }) {
  return <main className="page-frame"><div className="page-container">{children}</div></main>;
}

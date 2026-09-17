import { motion, useReducedMotion, type Variants, type HTMLMotionProps } from 'framer-motion';
import { forwardRef, type ReactNode } from 'react';

const ease = [0.22, 1, 0.36, 1] as const;
const springBounce = { type: 'spring', damping: 20, stiffness: 300 } as const;

export const fadeUp: Variants = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.46, ease } } };
export const fadeDown: Variants = { hidden: { opacity: 0, y: -18 }, visible: { opacity: 1, y: 0, transition: { duration: 0.42, ease } } };
export const fadeIn: Variants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.38, ease } } };
export const fadeLeft: Variants = { hidden: { opacity: 0, x: -24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.46, ease } } };
export const fadeRight: Variants = { hidden: { opacity: 0, x: 24 }, visible: { opacity: 1, x: 0, transition: { duration: 0.46, ease } } };
export const scaleUp: Variants = { hidden: { opacity: 0, scale: 0.94 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease } } };
export const blurIn: Variants = { hidden: { opacity: 0, filter: 'blur(8px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.45, ease } } };
const still: Variants = { hidden: { opacity: 1 }, visible: { opacity: 1 } };

export const staggerContainer = (stagger = 0.1, delay = 0): Variants => ({
  hidden: {},
  visible: { transition: { staggerChildren: stagger, delayChildren: delay } },
});

interface FadeInProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variants?: Variants;
  delay?: number;
  duration?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export const FadeIn = forwardRef<HTMLDivElement, FadeInProps>(
  ({ children, variants = fadeUp, delay = 0, duration, className, once = true, amount = 0.2, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduceMotion ? still : variants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        transition={!reduceMotion && (delay || duration) ? { delay, ...(duration ? { duration } : {}) } : undefined}
        className={className}
        {...props}
      >{children}</motion.div>
    );
  },
);
FadeIn.displayName = 'FadeIn';

interface StaggerProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  stagger?: number;
  delay?: number;
  className?: string;
  once?: boolean;
  amount?: number;
}

export const Stagger = forwardRef<HTMLDivElement, StaggerProps>(
  ({ children, stagger = 0.1, delay = 0, className, once = true, amount = 0.15, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    return (
      <motion.div
        ref={ref}
        variants={reduceMotion ? still : staggerContainer(stagger, delay)}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, amount }}
        className={className}
        {...props}
      >{children}</motion.div>
    );
  },
);
Stagger.displayName = 'Stagger';

interface HoverLiftProps extends HTMLMotionProps<'div'> { children: ReactNode; className?: string; lift?: number; }
export const HoverLift = forwardRef<HTMLDivElement, HoverLiftProps>(
  ({ children, className, lift = -4, ...props }, ref) => {
    const reduceMotion = useReducedMotion();
    return <motion.div ref={ref} variants={reduceMotion ? still : fadeUp} whileHover={reduceMotion ? undefined : { y: lift, transition: { duration: 0.22, ease: 'easeOut' } }} className={className} {...props}>{children}</motion.div>;
  },
);
HoverLift.displayName = 'HoverLift';

export { motion, springBounce };

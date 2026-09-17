import { motion, useReducedMotion } from 'framer-motion';

export function BlurText({ text, className = '' }: { text: string; className?: string }) {
  const reduceMotion = useReducedMotion();
  const words = text.split(' ');

  return (
    <motion.h1
      className={className}
      aria-label={text}
      initial="hidden"
      animate="visible"
      variants={{ visible: { transition: { staggerChildren: reduceMotion ? 0 : 0.055 } } }}
    >
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          aria-hidden="true"
          className="blur-word"
          variants={{
            hidden: reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18, filter: 'blur(8px)' },
            visible: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: reduceMotion ? 0 : 0.42 } },
          }}
        >
          {word}{' '}
        </motion.span>
      ))}
    </motion.h1>
  );
}

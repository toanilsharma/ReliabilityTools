import React from 'react';
import { motion, Variants } from 'framer-motion';

type AnimationType = 'slideUp' | 'fade' | 'scaleUp' | 'staggerContainer' | 'staggerItem';

interface AnimatedContainerProps {
  children: React.ReactNode;
  animation?: AnimationType;
  delay?: number;
  duration?: number;
  className?: string;
}

export const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  animation = 'slideUp',
  delay = 0,
  duration = 0.5,
  className = '',
}) => {
  const getVariants = (): Variants | undefined => {
    switch (animation) {
      case 'slideUp':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration, delay, ease: 'easeOut' } },
        };
      case 'fade':
        return {
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { duration, delay, ease: 'easeInOut' } },
        };
      case 'scaleUp':
        return {
          hidden: { opacity: 0, scale: 0.95 },
          visible: { opacity: 1, scale: 1, transition: { duration, delay, type: 'spring', stiffness: 200, damping: 20 } },
        };
      case 'staggerContainer':
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
              delayChildren: delay,
            },
          },
        };
      case 'staggerItem':
        return {
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } },
        };
      default:
        return undefined;
    }
  };

  if (animation === 'staggerItem') {
    return (
      <motion.div variants={getVariants()} className={className}>
        {children}
      </motion.div>
    );
  }

  if (animation === 'staggerContainer') {
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        variants={getVariants()}
        className={className}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={getVariants()}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedContainer;

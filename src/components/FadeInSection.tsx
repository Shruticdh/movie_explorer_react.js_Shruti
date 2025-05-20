import React, { useEffect, useRef } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface FadeInSectionProps {
  children: React.ReactNode;
}

const FadeInSection: React.FC<FadeInSectionProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const controls = useAnimation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          controls.start({ opacity: 1, y: 0 });
        } else {
          controls.start({ opacity: 0, y: 50 });
        }
      },
      {
        root: null, 
        rootMargin: '0px', 
        threshold: 0.3,
      }
    );

    const currentRef = ref.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [controls]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={controls}
      transition={{ duration: 0.6, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  );
};

export default FadeInSection;
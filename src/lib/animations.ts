const ease = [0.25, 0.1, 0.25, 1];

export const fadeIn = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.4, ease },
};

export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, ease },
};

export const stagger = {
  animate: {
    transition: { staggerChildren: 0.06 },
  },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.2, ease },
};

export const slideDown = {
  initial: { opacity: 0, y: -8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease },
};

export const cardHover = {
  whileHover: { y: -2 },
  transition: { duration: 0.2, ease },
};

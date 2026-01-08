import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageWrapperProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "easeOut",
  duration: 0.3,
};

export function PageWrapper({ children }: PageWrapperProps) {
  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={pageVariants}
      transition={pageTransition}
    >
      {children}
    </motion.div>
  );
}

import React from 'react';
import { motion } from 'framer-motion';

const GlassCard = ({ children, className = "", hover = true, ...props }) => {
  return (
    <motion.div
      {...props}
      whileHover={hover ? { y: -5, scale: 1.02 } : {}}
      className={`glass rounded-3xl p-6 transition-all duration-300 ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default GlassCard;

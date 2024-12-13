import React from 'react';
import { motion } from 'framer-motion';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  return (
    <div className="relative group">
      {children}
      <motion.div
        className="absolute left-1/2 transform -translate-x-1/2 bottom-full mb-2 w-max p-2 bg-gray-800 text-white text-xs rounded opacity-0 transition-opacity duration-200 group-hover:opacity-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        {content}
      </motion.div>
    </div>
  );
};

export default Tooltip;

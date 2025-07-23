
import { useState } from "react";
import { motion } from "framer-motion";
import PortfolioItem, { WorkItem } from "./PortfolioItem";

interface PortfolioGridProps {
  items: WorkItem[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { 
      staggerChildren: 0.1
    }
  }
};

const PortfolioGrid = ({ items }: PortfolioGridProps) => {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {items.map((item) => (
        <PortfolioItem
          key={item.id}
          item={item}
          isHovered={hoveredItem === item.id}
          onMouseEnter={() => setHoveredItem(item.id)}
          onMouseLeave={() => setHoveredItem(null)}
        />
      ))}
    </motion.div>
  );
};

export default PortfolioGrid;

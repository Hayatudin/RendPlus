
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Button } from "@/components/ui/button";

export type Category = "all" | "interior" | "residential" | "commercial" | "cultural" | "luxury";

export interface WorkItem {
  id: string;
  title: string;
  category: Category;
  description: string;
  client: string;
  image: string;
  year: string;
  featured?: boolean;
}

interface PortfolioItemProps {
  item: WorkItem;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] }
  }
};

const PortfolioItem = ({ item, isHovered, onMouseEnter, onMouseLeave }: PortfolioItemProps) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="group"
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="relative overflow-hidden rounded-lg">
        <AspectRatio ratio={3/2} className="bg-gray-100">
          <img 
            src={item.image} 
            alt={item.title} 
            className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-105"
          />
        </AspectRatio>
        
        <div className={`absolute inset-0 bg-gradient-to-t from-rend-dark/90 via-rend-dark/40 to-transparent p-6 flex flex-col justify-end transition-opacity duration-300 ${
          isHovered ? "opacity-100" : "opacity-0"
        }`}>
          <div className="transform transition-transform duration-300 ease-out">
            <div className="text-xs font-medium text-rend-accent mb-2">{item.category.toUpperCase()} • {item.year}</div>
            <h3 className="text-xl font-semibold text-white mb-1">{item.title}</h3>
            <p className="text-white/80 text-sm mb-4 line-clamp-2">{item.description}</p>
            <Button 
              variant="outline" 
              size="sm" 
              className="bg-transparent border-white/30 text-white hover:bg-white/10 hover:text-white"
            >
              View Project <ArrowRight className="ml-1 h-3 w-3" />
            </Button>
          </div>
        </div>
        
        {item.featured && (
          <div className="absolute top-4 right-4 bg-rend-accent text-rend-dark text-xs font-medium py-1 px-2 rounded">
            Featured
          </div>
        )}
      </div>
      
      <div className="mt-4">
        <h3 className="text-lg font-medium text-rend-dark">{item.title}</h3>
        <p className="text-rend-light/70 text-sm">{item.client}</p>
      </div>
    </motion.div>
  );
};

export default PortfolioItem;

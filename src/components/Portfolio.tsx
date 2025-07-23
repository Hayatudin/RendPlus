
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import PortfolioItem, { Category, WorkItem } from "./PortfolioItem";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface FilterButtonProps {
  category: Category;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
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

const Portfolio = () => {
  const [filter, setFilter] = useState<Category>("all");
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  // Fetch portfolios from Supabase
  const { data: portfolios, isLoading } = useQuery({
    queryKey: ['portfolios-public'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('portfolios')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error("Error fetching portfolios:", error);
        throw error;
      }
      
      // Transform the data to match WorkItem interface
      return data.map(portfolio => ({
        id: portfolio.id,
        title: portfolio.title,
        category: portfolio.category as Category,
        description: portfolio.description,
        client: portfolio.client,
        image: portfolio.image_url,
        year: portfolio.year,
        featured: portfolio.featured
      })) as WorkItem[];
    }
  });

  const filteredItems = portfolios ? (filter === "all" 
    ? portfolios 
    : portfolios.filter(item => item.category === filter)) : [];

  return (
    <section id="portfolio" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mx-auto">Our Portfolio</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            Explore our collection of high-quality 3D renderings showcasing our expertise 
            in bringing architectural and design concepts to life.
          </p>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            <FilterButton 
              category="all" 
              active={filter === "all"} 
              onClick={() => setFilter("all")}
            >
              All Projects
            </FilterButton>
            <FilterButton 
              category="interior" 
              active={filter === "interior"} 
              onClick={() => setFilter("interior")}
            >
              Interior
            </FilterButton>
            <FilterButton 
              category="residential" 
              active={filter === "residential"} 
              onClick={() => setFilter("residential")}
            >
              Residential
            </FilterButton>
            <FilterButton 
              category="commercial" 
              active={filter === "commercial"} 
              onClick={() => setFilter("commercial")}
            >
              Commercial
            </FilterButton>
            <FilterButton 
              category="cultural" 
              active={filter === "cultural"} 
              onClick={() => setFilter("cultural")}
            >
              Cultural
            </FilterButton>
            <FilterButton 
              category="luxury" 
              active={filter === "luxury"} 
              onClick={() => setFilter("luxury")}
            >
              Luxury
            </FilterButton>
          </div>
        </div>

        {/* Portfolio Grid */}
        {isLoading ? (
          <div className="text-center py-12 space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading portfolio...</p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {filteredItems.map((item) => (
              <PortfolioItem
                key={item.id}
                item={item}
                isHovered={hoveredItem === item.id}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
              />
            ))}
          </motion.div>
        )}

        <div className="text-center mt-12">
          <Button 
            asChild
            className="bg-rend-primary hover:bg-rend-light text-white"
          >
            <Link to="/portfolio">View Full Portfolio</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

const FilterButton = ({ category, active, onClick, children }: FilterButtonProps) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md transition-all ${
        active 
          ? "bg-rend-primary text-white" 
          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
};

export default Portfolio;

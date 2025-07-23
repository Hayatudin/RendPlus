
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  index: number;
  bgImage: string;
  specialistName: string;
}

const ServiceCard = ({ icon, title, description, index, bgImage, specialistName }: ServiceCardProps) => {
  return (
    <div 
      className="service-card-container relative h-[350px] md:h-[380px] overflow-hidden rounded-lg group 
                flex-shrink-0 w-full"
      style={{ 
        backgroundImage: `url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        animationDelay: `${index * 100}ms`
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>
      
      <div className="relative z-10 p-5 flex flex-col h-full">
        <div className="mb-3 text-white">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 backdrop-blur-sm">
            {icon}
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-1 text-white">{title}</h3>
        <div className="text-white/80 text-xs">{specialistName}</div>
        
        <div className="mt-auto opacity-0 transform translate-y-8 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0 w-full">
          <p className="text-white/90 mb-3 bg-black/40 p-3 rounded-lg backdrop-blur-sm text-sm w-full">{description}</p>
          <Button 
            asChild
            variant="outline" 
            size="sm"
            className="bg-white/10 backdrop-blur-sm text-white border-white/30 hover:bg-white/20 hover:text-white text-xs"
          >
            <Link to={`/services#${title.toLowerCase().replace(/\s+/g, '-')}`}>Learn More</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ServiceCard;

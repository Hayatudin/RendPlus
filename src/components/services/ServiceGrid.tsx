
import ServiceCard from "./ServiceCard";
import { getIconComponent } from "./serviceIcons";
import type { Service } from "./types";

interface ServiceGridProps {
  services: Service[];
}

const ServiceGrid = ({ services }: ServiceGridProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-6 gap-6">
      {services.map((service, index) => (
        <div key={service.id} className="w-full">
          <ServiceCard 
            icon={getIconComponent(service.icon_name)}
            title={service.title}
            description={service.description}
            bgImage={service.image_url}
            specialistName={service.specialist_name}
            index={index}
          />
        </div>
      ))}
    </div>
  );
};

export default ServiceGrid;

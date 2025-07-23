
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import ServiceGrid from "./services/ServiceGrid";
import type { Service } from "./services/types";

const Services = () => {
  const [displayedServices, setDisplayedServices] = useState<Service[]>([]);
  
  // Fetch services from Supabase
  const { data: services, isLoading, isError } = useQuery({
    queryKey: ['homepage-services'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('status', 'Active')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Error fetching services:", error);
        throw error;
      }
      
      return data as Service[];
    }
  });
  
  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel('homepage-services-changes')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'services'
      }, () => {
        // Simply refetch the data when any change happens to services
        supabase
          .from('services')
          .select('*')
          .eq('status', 'Active')
          .order('created_at', { ascending: true })
          .then(({ data }) => {
            if (data) {
              setDisplayedServices(data);
            }
          });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);
  
  useEffect(() => {
    if (services && services.length > 0) {
      // Make sure we're getting all services, not just the first few
      setDisplayedServices(services);
      console.log("Services loaded:", services.length);
    }
  }, [services]);
  
  return (
    <section id="services" className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="section-heading mx-auto text-rend-dark after:bg-rend-accent text-2xl md:text-3xl">
            What We Offer
          </h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-6 text-sm md:text-base">
            We provide professional 3D modeling and rendering services to bring your vision to life, 
            tailored to meet the specific needs of different industries.
          </p>
        </div>

        {isLoading ? (
          <div className="text-center py-12 space-y-4">
            <div className="animate-spin h-8 w-8 border-4 border-blue-500 rounded-full border-t-transparent mx-auto"></div>
            <p className="text-muted-foreground">Loading services...</p>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-red-500">Failed to load services. Please try again later.</p>
          </div>
        ) : displayedServices.length > 0 ? (
          <ServiceGrid services={displayedServices} />
        ) : (
          <div className="text-center py-12">
            <p>No services available. Please check back later.</p>
          </div>
        )}

        <div className="text-center mt-10">
          <Button 
            asChild
            className="bg-rend-accent hover:bg-rend-accent/80 text-rend-dark font-medium text-sm"
          >
            <Link to="/services">View All Services</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Services;

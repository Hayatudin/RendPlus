
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { Building2, Home, Palette, PenTool, TreePine, Briefcase, GraduationCap, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const ServicesPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="bg-rend-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">Our Services</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Professional 3D modeling and rendering services tailored to your specific needs.
            </p>
          </div>
        </section>

        {/* Services Overview */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="section-heading mx-auto">What We Offer</h2>
              <p className="text-gray-600">
                At Rend-Plus, we provide comprehensive 3D modeling and rendering services 
                to help visualize architectural and design concepts with stunning clarity and precision.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-16">
              <ServiceSection 
                icon={<Palette className="h-12 w-12" />}
                title="For Interior Designers"
                imageSrc="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158"
                imageAlt="Interior Design Rendering"
                benefits={[
                  "Photorealistic interior renderings",
                  "Virtual tours of designed spaces",
                  "3D floor plans with detailed finishes",
                  "Video walkthroughs for client presentations",
                  "Material and furniture visualization"
                ]}
              />

              <ServiceSection 
                icon={<Building2 className="h-12 w-12" />}
                title="For Architects"
                imageSrc="https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d"
                imageAlt="Architectural Rendering"
                benefits={[
                  "Exterior renderings with precise detailing",
                  "Building massing and concept models",
                  "Site context and environmental integration",
                  "Aerial perspectives and bird's eye views",
                  "Daylight and shadow studies"
                ]}
                reversed
              />

              <ServiceSection 
                icon={<TreePine className="h-12 w-12" />}
                title="For Landscape Designers"
                imageSrc="https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
                imageAlt="Landscape Design Rendering"
                benefits={[
                  "Realistic landscape visualizations",
                  "Garden and outdoor space renderings",
                  "Seasonal variations of landscape designs",
                  "Water feature and hardscape elements",
                  "Growth progression visualization"
                ]}
              />

              <ServiceSection 
                icon={<Home className="h-12 w-12" />}
                title="For Furniture Manufacturers"
                imageSrc="https://images.unsplash.com/photo-1581092795360-fd1ca04f0952"
                imageAlt="Furniture Rendering"
                benefits={[
                  "High-quality furniture product renderings",
                  "Material variations and customization options",
                  "360° views for interactive product displays",
                  "Lifestyle context renderings",
                  "AR-ready 3D models for customer visualization"
                ]}
                reversed
              />

              <ServiceSection 
                icon={<Briefcase className="h-12 w-12" />}
                title="For Commercial Brands"
                imageSrc="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7"
                imageAlt="Product Rendering"
                benefits={[
                  "Product visualization for marketing materials",
                  "Packaging design renderings",
                  "Trade show and display visualizations",
                  "Brand environment and retail space modeling",
                  "Animation for product demonstrations"
                ]}
              />

              <ServiceSection 
                icon={<GraduationCap className="h-12 w-12" />}
                title="For Students"
                imageSrc="https://images.unsplash.com/photo-1519389950473-47ba0277781c"
                imageAlt="Student Project Rendering"
                benefits={[
                  "Thesis project visualizations",
                  "Portfolio-quality architectural renderings",
                  "Concept development and presentation",
                  "Affordable packages for academic projects",
                  "Technical guidance and learning resources"
                ]}
                reversed
              />
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-20 bg-rend-gray">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <h2 className="section-heading mx-auto">Our Process</h2>
              <p className="text-gray-600">
                We follow a structured approach to ensure that every project meets our high standards of quality and client satisfaction.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              <ProcessStep 
                number="01"
                title="Consultation"
                description="We start by understanding your project needs, goals, and vision through a comprehensive consultation."
              />
              <ProcessStep 
                number="02"
                title="Modeling & Design"
                description="Our team creates detailed 3D models based on your specifications, ensuring accuracy and precision."
              />
              <ProcessStep 
                number="03"
                title="Rendering & Delivery"
                description="We add materials, lighting, and environmental elements to create photorealistic renderings of your project."
              />
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

interface ServiceSectionProps {
  icon: React.ReactNode;
  title: string;
  imageSrc: string;
  imageAlt: string;
  benefits: string[];
  reversed?: boolean;
}

const ServiceSection = ({ icon, title, imageSrc, imageAlt, benefits, reversed = false }: ServiceSectionProps) => {
  return (
    <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center`}>
      <div className={`${reversed ? 'lg:order-2' : 'lg:order-1'}`}>
        <div className="inline-flex h-20 w-20 items-center justify-center rounded-lg bg-rend-accent/20 text-rend-primary mb-6">
          {icon}
        </div>
        <h3 className="font-montserrat font-bold text-2xl md:text-3xl text-rend-dark mb-6">{title}</h3>
        <ul className="space-y-3 mb-8">
          {benefits.map((benefit, index) => (
            <li key={index} className="flex items-start">
              <CheckCircle2 className="h-5 w-5 text-rend-accent mr-3 mt-0.5 flex-shrink-0" />
              <span className="text-gray-700">{benefit}</span>
            </li>
          ))}
        </ul>
        <Button 
          asChild
          className="bg-rend-primary hover:bg-rend-light text-white"
        >
          <Link to="/quote">Request Service</Link>
        </Button>
      </div>
      <div className={`relative ${reversed ? 'lg:order-1' : 'lg:order-2'}`}>
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="rounded-lg shadow-xl"
        />
        <div className={`absolute ${reversed ? '-top-8 -right-8' : '-bottom-8 -left-8'} -z-10 w-full h-full bg-rend-accent/20 rounded-lg`}></div>
      </div>
    </div>
  );
};

interface ProcessStepProps {
  number: string;
  title: string;
  description: string;
}

const ProcessStep = ({ number, title, description }: ProcessStepProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rend-primary text-white text-2xl font-bold mb-4">
        {number}
      </div>
      <h3 className="font-montserrat font-semibold text-xl mb-3 text-rend-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

export default ServicesPage;

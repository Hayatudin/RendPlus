
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const About = () => {
  const keyPoints = [
    "Expert team with years of experience in 3D modeling and rendering",
    "Tailored solutions for architecture, interior design, and product visualization",
    "High-quality, photorealistic renders that bring your designs to life",
    "Dedicated support and quick turnaround times",
    "Competitive pricing and flexible packages"
  ];

  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <h2 className="section-heading">About Addis Render</h2>
            <p className="text-gray-600 mb-6">
              Welcome to Addis Render, where ideas come to life through high-quality 3D modeling 
              and design. At Addis Render, we specialize in creating precise, visually striking 
              models tailored to your unique needs, whether for architecture, product design, 
              or interior spaces.
            </p>

            <ul className="space-y-3 mb-8">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start">
                  <CheckCircle2 className="h-5 w-5 text-rend-accent mr-2 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{point}</span>
                </li>
              ))}
            </ul>

            <Button 
              asChild
              className="bg-rend-primary hover:bg-rend-light text-white"
            >
              <Link to="/about">Learn More About Us</Link>
            </Button>
          </div>

          <div className="order-1 lg:order-2 relative">
            <div className="relative z-10">
              <img 
                src="/lovable-uploads/a31c5ccb-6e4d-4a11-a550-78d24cb7bcbb.png" 
                alt="Modern Office Space" 
                className="rounded-lg shadow-xl"
              />
            </div>
            <div className="absolute top-8 -right-8 -z-10 w-full h-full bg-rend-accent/20 rounded-lg"></div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;

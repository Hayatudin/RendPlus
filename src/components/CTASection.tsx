
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const CTASection = () => {
  return (
    <section className="py-20 bg-rend-primary text-white">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-montserrat font-bold text-3xl md:text-4xl mb-6">
          Ready to Transform Your Design Concepts?
        </h2>
        <p className="max-w-2xl mx-auto text-lg mb-8 text-gray-100">
          Take the first step towards bringing your architectural visions to life with our 
          professional 3D rendering services at Addis Render.
        </p>
        <Button 
          asChild
          size="lg" 
          className="bg-rend-accent text-rend-dark hover:bg-white hover:text-rend-primary font-semibold px-8"
        >
          <Link to="/quote">
            Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CTASection;

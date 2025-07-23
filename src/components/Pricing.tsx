
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface PricingTier {
  name: string;
  description: string;
  price: string;
  priceNote: string;
  features: string[];
  buttonText: string;
  href: string;
  highlighted?: boolean;
  plan: string;
}

const pricingTiers: PricingTier[] = [
  {
    name: "Basic 3D Modeling",
    description: "Standard 3D models for simple designs",
    price: "ETB 500-700",
    priceNote: "per 100 sq. meter",
    features: [
      "Basic architectural modeling",
      "Simple furniture modeling",
      "Standard materials",
      "Basic 3D floor plans",
      "Simple environment modeling",
      "14-day delivery"
    ],
    buttonText: "Get Started",
    href: "/quote?plan=basic",
    plan: "basic"
  },
  {
    name: "Standard Rendering",
    description: "High-quality visualizations for professional results",
    price: "ETB 800-1000",
    priceNote: "per 100 sq. meter",
    features: [
      "Detailed 3D modeling",
      "Enhanced material creation",
      "Photorealistic rendering",
      "Multiple viewpoints",
      "Custom lighting setups",
      "10-day delivery"
    ],
    buttonText: "Get Started",
    href: "/quote?plan=standard",
    plan: "standard"
  },
  {
    name: "Premium Package",
    description: "End-to-end solution with superior details",
    price: "ETB 1300-1500",
    priceNote: "per 100 sq. meter",
    features: [
      "Premium 3D modeling",
      "Advanced material creation",
      "Ultra-realistic rendering",
      "Animation options",
      "Unlimited revisions",
      "Priority support",
      "7-day delivery"
    ],
    buttonText: "Get Started",
    href: "/quote?plan=premium",
    highlighted: true,
    plan: "premium"
  },
  {
    name: "Custom Solutions",
    description: "Tailored packages for specialized projects",
    price: "Custom",
    priceNote: "based on requirements",
    features: [
      "Complex architectural visualizations",
      "Large-scale development projects",
      "Interactive 3D applications",
      "VR/AR ready models",
      "White-label service options",
      "Dedicated project manager"
    ],
    buttonText: "Contact Us",
    href: "/quote?plan=custom",
    plan: "custom"
  }
];

const Pricing = () => {
  return (
    <section id="pricing" className="py-20 bg-rend-gray">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mx-auto">Our Pricing</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            We offer competitive rates per 100 square meters to fit different project needs and budgets. 
            All prices include comprehensive support and professional quality results.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
          {pricingTiers.map((tier, index) => (
            <div 
              key={index}
              className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
                tier.highlighted ? 'border-2 border-rend-accent relative' : ''
              }`}
            >
              {tier.highlighted && (
                <div className="absolute top-0 left-0 right-0 bg-rend-accent text-rend-dark py-1 text-center text-sm font-medium">
                  Most Popular
                </div>
              )}

              <div className="p-8">
                <h3 className="font-montserrat font-bold text-xl mb-2 text-rend-dark">{tier.name}</h3>
                <p className="text-gray-600 mb-4 h-12">{tier.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-rend-primary">{tier.price}</span>
                  <span className="text-gray-500"> {tier.priceNote}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start">
                      <CheckCircle2 className="h-5 w-5 text-rend-accent mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  asChild
                  className={`w-full ${
                    tier.highlighted 
                      ? 'bg-rend-accent text-rend-dark hover:bg-rend-primary hover:text-white' 
                      : 'bg-rend-primary text-white hover:bg-rend-light'
                  }`}
                >
                  <Link to={tier.href}>{tier.buttonText}</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-600 mb-4">
            Need a custom solution for your project?
          </p>
          <Button 
            asChild
            variant="outline" 
            className="border-rend-primary text-rend-primary hover:bg-rend-primary hover:text-white"
          >
            <Link to="/quote?plan=custom">Contact Us for Custom Pricing</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Pricing;

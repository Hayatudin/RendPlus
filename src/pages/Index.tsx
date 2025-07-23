
import Hero from "@/components/Hero";
import Services from "@/components/Services";
import About from "@/components/About";
import Portfolio from "@/components/Portfolio";
import Pricing from "@/components/Pricing";
import FloorPlan from "@/components/FloorPlan";
import FAQ from "@/components/FAQ";
import CTASection from "@/components/CTASection";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  
  useEffect(() => {
    // Handle hash links (e.g., /#pricing)
    if (location.hash) {
      const element = document.getElementById(location.hash.substring(1));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Scroll to top when no hash
      window.scrollTo(0, 0);
    }
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        <Services />
        <About />
        <Portfolio />
        <FloorPlan />
        <Pricing />
        <FAQ />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;

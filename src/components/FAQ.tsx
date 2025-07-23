
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const FAQ = () => {
  const faqs = [
    {
      question: "What services does Rend-Plus offer?",
      answer: "We specialize in 3D modeling, rendering, animations, and walkthroughs for architectural designs, product models, and interior spaces."
    },
    {
      question: "How do I place an order for 3D rendering services?",
      answer: "Simply fill out our Order Form with your project details, upload your plans, and we'll get in touch with a personalized quote based on the square meters of your project."
    },
    {
      question: "How are the prices calculated?",
      answer: "Our prices are calculated per square meter, with rates varying based on the complexity and level of detail required. Basic projects start at ETB 5-7/sqm, standard at ETB 8-10/sqm, and premium at ETB 13-15/sqm."
    },
    {
      question: "What is the typical timeline for completion?",
      answer: "The timeline varies based on project complexity and service tier. Basic projects take around 14 days, standard projects 10 days, and premium projects 7 days. Large or complex projects may require additional time."
    },
    {
      question: "What file formats do you accept for project submissions?",
      answer: "We accept architectural files in formats like .dwg, .dxf, .rvt, .skp, .max, .3dm, .pln, and .dae. For reference materials, you can upload images, PDFs, or any visual references that help us understand your vision."
    }
  ];

  return (
    <section id="faq" className="py-20 bg-gradient-to-b from-white to-blue-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="section-heading mx-auto">Frequently Asked Questions</h2>
          <p className="max-w-3xl mx-auto text-gray-600 mb-8">
            Have questions about our 3D rendering services? Find answers to common inquiries below.
          </p>
        </div>

        <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`} className="border-b border-gray-200">
                <AccordionTrigger className="text-left font-semibold py-4 text-rend-primary hover:text-rend-light hover:no-underline transition-colors">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 pb-4">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">Have more questions? Visit our full FAQ page:</p>
            <Button 
              asChild
              className="bg-rend-primary hover:bg-rend-light text-white"
            >
              <Link to="/faq">View All FAQs</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;

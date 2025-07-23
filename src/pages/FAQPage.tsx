
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";

const FAQPage = () => {
  const allFaqs = [
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
    },
    {
      question: "What types of projects do you work on?",
      answer: "We work on a wide range of projects, including residential and commercial buildings, product visualizations, interior designs, and more."
    },
    {
      question: "Can I make revisions during the project?",
      answer: "Yes, we offer revisions based on your feedback. The number of revisions depends on the project scope and package selected, but we'll ensure your satisfaction throughout the process."
    },
    {
      question: "What file formats will I receive my 3D models and renderings in?",
      answer: "You'll receive models in formats like .obj, .fbx, .stl, and renderings in .jpg, .png, .tiff, or .psd. We can adjust the format based on your requirements."
    },
    {
      question: "Do you offer 3D animation and walkthroughs?",
      answer: "Yes, we provide dynamic 3D animations and interactive walkthroughs to help visualize architectural designs or showcase products. These are available as add-ons to our standard packages."
    },
    {
      question: "How can I contact Rend-Plus for custom requests?",
      answer: "You can reach us via email, phone, or by filling out our contact form. For detailed project requests, use our Quote Form to provide your project specifics."
    }
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="h-20"></div> {/* Spacer for navbar */}
      <main className="flex-grow">
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 py-16">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl font-bold text-center mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-lg text-center text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about our 3D rendering services, pricing, and process
            </p>
          </div>
        </div>
        
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-6 md:p-8">
              <Accordion type="single" collapsible className="w-full">
                {allFaqs.map((faq, index) => (
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
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default FAQPage;

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Mail, Phone, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contact_submissions')
        .insert({
          name: formData.name,
          email: formData.email,
          message: `${formData.subject}\n\n${formData.message}`
        });

      if (error) throw error;

      toast.success("Message sent! Thank you for contacting us.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      console.error('Error submitting form:', error);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        <section className="bg-rend-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">Contact Us</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Get in touch with our team to discuss your project or inquire about our services.
            </p>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              <div className="bg-white rounded-lg shadow-lg p-8">
                <h2 className="font-montserrat font-bold text-2xl text-rend-dark mb-6">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input 
                        id="name" 
                        placeholder="John Doe" 
                        required 
                        value={formData.name}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="john@example.com" 
                        required 
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input 
                      id="subject" 
                      placeholder="How can we help you?" 
                      required 
                      value={formData.subject}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      placeholder="Tell us about your project..." 
                      rows={6} 
                      required 
                      value={formData.message}
                      onChange={handleChange}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="bg-rend-primary hover:bg-rend-light text-white w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"} <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              </div>

              <div>
                <h2 className="font-montserrat font-bold text-2xl text-rend-dark mb-6">Contact Information</h2>
                <div className="bg-rend-gray p-8 rounded-lg mb-8">
                  <div className="space-y-6">
                    <ContactInfo 
                      icon={<Mail className="h-6 w-6" />}
                      title="Email Us"
                      info="info@rend-plus.com"
                      description="For general inquiries and information"
                    />
                    <ContactInfo 
                      icon={<Phone className="h-6 w-6" />}
                      title="Call Us"
                      info="+1 (123) 456-7890"
                      description="Monday to Friday, 9:00 AM - 6:00 PM"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-rend-gray">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="section-heading mx-auto">Frequently Asked Questions</h2>
              <p className="max-w-3xl mx-auto text-gray-600">
                Find quick answers to common questions about our services.
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
              <div className="space-y-6">
                <FAQItem 
                  question="What services does Rend-Plus offer?"
                  answer="We specialize in 3D modeling, rendering, animations, and walkthroughs for architectural designs, product models, and interior spaces."
                />
                <FAQItem 
                  question="How do I place an order for a 3D model or rendering?"
                  answer="Simply fill out our Quote Form with your project details, and we'll get in touch with a personalized quote."
                />
                <FAQItem 
                  question="What is the pricing for your services?"
                  answer="Our pricing varies based on the type and complexity of the project. For more details, please refer to our Pricing Page or contact us for a custom quote based on your project needs."
                />
                <FAQItem 
                  question="How long will it take to complete my project?"
                  answer="The timeline varies based on project complexity. Simple projects can take a few days, while larger, more detailed projects may take a few weeks. We will provide an estimated timeline after discussing your needs."
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

interface ContactInfoProps {
  icon: React.ReactNode;
  title: string;
  info: string;
  description: string;
}

const ContactInfo = ({ icon, title, info, description }: ContactInfoProps) => {
  return (
    <div className="flex">
      <div className="mr-4 text-rend-primary">
        {icon}
      </div>
      <div>
        <h3 className="font-medium text-lg text-rend-dark">{title}</h3>
        <p className="font-medium">{info}</p>
        <p className="text-gray-500 text-sm">{description}</p>
      </div>
    </div>
  );
};

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem = ({ question, answer }: FAQItemProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="font-montserrat font-semibold text-lg text-rend-dark mb-3">{question}</h3>
      <p className="text-gray-600">{answer}</p>
    </div>
  );
};

export default ContactPage;

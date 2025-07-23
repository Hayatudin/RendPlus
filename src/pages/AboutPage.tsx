
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import CTASection from "@/components/CTASection";
import { CheckCircle2, Users, Award, Clock, Heart } from "lucide-react";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow pt-20">
        {/* Header */}
        <section className="bg-rend-primary text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="font-montserrat font-bold text-4xl md:text-5xl mb-4">About Rend-Plus</h1>
            <p className="max-w-2xl mx-auto text-lg">
              Learn more about our team, our journey, and our commitment to bringing architectural visions to life.
            </p>
          </div>
        </section>

        {/* Main Content */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="section-heading">Our Story</h2>
                <p className="text-gray-600 mb-6">
                  Welcome to Rend-Plus, where ideas come to life through high-quality 3D modeling 
                  and design. Founded in 2015, Rend-Plus began as a small team of passionate designers 
                  and 3D artists with a vision to transform the way architectural concepts are presented.
                </p>
                <p className="text-gray-600 mb-6">
                  Over the years, we've grown into a diverse team of professionals dedicated to delivering 
                  exceptional 3D modeling and rendering services. Our journey has been marked by continuous 
                  innovation, learning, and a commitment to exceeding client expectations.
                </p>
                <p className="text-gray-600">
                  Today, Rend-Plus stands as a trusted partner for architects, interior designers, 
                  property developers, and marketing professionals seeking to visualize their projects 
                  with stunning clarity and precision.
                </p>
              </div>
              <div className="relative">
                <img 
                  src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158" 
                  alt="Our Team" 
                  className="rounded-lg shadow-xl"
                />
                <div className="absolute -bottom-8 -left-8 -z-10 w-full h-full bg-rend-accent/20 rounded-lg"></div>
              </div>
            </div>

            {/* Values */}
            <div className="mb-20">
              <div className="text-center mb-12">
                <h2 className="section-heading mx-auto">Our Values</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  The core principles that guide our work and relationships.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <ValueCard 
                  icon={<Users className="h-10 w-10" />}
                  title="Collaboration"
                  description="We believe in working closely with our clients, incorporating their feedback and ideas throughout the process."
                />
                <ValueCard 
                  icon={<Award className="h-10 w-10" />}
                  title="Excellence"
                  description="We strive for excellence in every project, paying attention to even the smallest details to deliver outstanding results."
                />
                <ValueCard 
                  icon={<Clock className="h-10 w-10" />}
                  title="Timeliness"
                  description="We respect our clients' timelines and work efficiently to deliver projects on schedule without compromising quality."
                />
                <ValueCard 
                  icon={<Heart className="h-10 w-10" />}
                  title="Passion"
                  description="We approach each project with creativity and passion, always looking for ways to exceed expectations."
                />
              </div>
            </div>

            {/* Team */}
            <div>
              <div className="text-center mb-12">
                <h2 className="section-heading mx-auto">Meet Our Team</h2>
                <p className="max-w-3xl mx-auto text-gray-600">
                  The talented professionals behind our stunning visualizations.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <TeamMember 
                  name="Alex Johnson"
                  role="Founder & Lead Designer"
                  image="https://images.unsplash.com/photo-1472396961693-142e6e269027"
                  bio="With over 15 years in architectural visualization, Alex leads our creative vision and design philosophy."
                />
                <TeamMember 
                  name="Sarah Chen"
                  role="Senior 3D Artist"
                  image="https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9"
                  bio="Sarah specializes in photorealistic rendering and lighting, bringing spaces to life with her technical expertise."
                />
                <TeamMember 
                  name="Michael Rodriguez"
                  role="Technical Director"
                  image="https://images.unsplash.com/photo-1513836279014-a89f7a76ae86"
                  bio="Michael oversees the technical aspects of our projects, ensuring high-quality results and innovative solutions."
                />
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-rend-gray">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <StatCard number="500+" label="Projects Completed" />
              <StatCard number="150+" label="Happy Clients" />
              <StatCard number="12" label="Years of Experience" />
              <StatCard number="25" label="Awards Won" />
            </div>
          </div>
        </section>

        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const ValueCard = ({ icon, title, description }: ValueCardProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-rend-accent/20 text-rend-primary mb-4">
        {icon}
      </div>
      <h3 className="font-montserrat font-semibold text-xl mb-3 text-rend-dark">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
};

interface TeamMemberProps {
  name: string;
  role: string;
  image: string;
  bio: string;
}

const TeamMember = ({ name, role, image, bio }: TeamMemberProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-transform duration-300 hover:-translate-y-2">
      <img 
        src={image} 
        alt={name} 
        className="w-full h-64 object-cover object-center"
      />
      <div className="p-6">
        <h3 className="font-montserrat font-semibold text-xl text-rend-dark">{name}</h3>
        <p className="text-rend-accent font-medium mb-3">{role}</p>
        <p className="text-gray-600">{bio}</p>
      </div>
    </div>
  );
};

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => {
  return (
    <div className="text-center p-6">
      <p className="font-montserrat font-bold text-4xl md:text-5xl text-rend-primary mb-2">{number}</p>
      <p className="text-gray-600 font-medium">{label}</p>
    </div>
  );
};

export default AboutPage;

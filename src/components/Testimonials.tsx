import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const testimonials = [
  {
    name: "Priya Singh",
    title: "PhD Candidate",
    review: "Deep Computers helped me with my thesis binding and plagiarism removal. The quality of work was outstanding, and they delivered on time. Highly recommended!",
    initials: "PS"
  },
  {
    name: "Rahul Verma",
    title: "MBA Student",
    review: "I got my project report printed and bound here. Their pricing is reasonable, and the quality of paper and binding exceeded my expectations. Will surely come back!",
    initials: "RV"
  },
  {
    name: "Ananya Kapoor",
    title: "Research Scholar",
    review: "The plagiarism checking service is thorough and detailed. They helped me identify issues in my research paper that I hadn't noticed. Very professional service.",
    initials: "AK"
  },
  {
    name: "Vikram Mehta",
    title: "College Professor",
    review: "I've been recommending Deep Computers to my students for years. Their academic writing assistance and printing services are top-notch. A reliable partner for academic needs.",
    initials: "VM"
  },
  {
    name: "Neha Sharma",
    title: "B.Tech Student",
    review: "Got my final year project printed and hard bound here. The emboss quality binding looks extremely professional. Fast service and friendly staff!",
    initials: "NS"
  },
  {
    name: "Mohammed Ali",
    title: "Doctoral Student",
    review: "Their AI plagiarism checking service saved my dissertation. They identified AI-generated content that other checkers missed. Worth every rupee!",
    initials: "MA"
  }
];

const Testimonials = () => {
  return (
    <section id="testimonials" className="py-16 bg-primary-50">
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="font-serif text-3xl md:text-4xl font-bold text-primary mb-4">What Our Customers Say</h2>
          <p className="text-gray-600 text-lg">
            Read testimonials from students and researchers who trust our services
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="border border-primary-100 bg-white hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-start mb-4">
                  <Avatar className="h-10 w-10 border border-primary-100">
                    <AvatarFallback className="bg-primary-200 text-primary">{testimonial.initials}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4">
                    <h4 className="font-medium text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.title}</p>
                  </div>
                </div>
                
                <blockquote className="text-gray-700 italic">
                  "{testimonial.review}"
                </blockquote>
                
                <div className="mt-4 flex">
                  {[...Array(5)].map((_, i) => (
                    <svg key={i} className="h-5 w-5 fill-accent-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;

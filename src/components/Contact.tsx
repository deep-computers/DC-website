import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, MessageSquare, MapPin, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Send form data to WhatsApp
      const whatsappMessage = `New Contact Form Submission\n\nName: ${formData.name}\nEmail: ${formData.email}\nPhone: ${formData.phone}\nSubject: ${formData.subject}\n\nMessage:\n${formData.message}`;
      
      const whatsappUrl = `https://wa.me/919311244099?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in a new tab
      window.open(whatsappUrl, '_blank');

      // Also send an email notification
      const emailSubject = `Contact Form: ${formData.subject}`;
      const emailBody = `Name: ${formData.name}%0D%0AEmail: ${formData.email}%0D%0APhone: ${formData.phone}%0D%0A%0D%0AMessage:%0D%0A${formData.message}`;
      const mailtoUrl = `mailto:services@dcprintingpress.com?subject=${encodeURIComponent(emailSubject)}&body=${emailBody}`;
      
      // Open email client
      window.location.href = mailtoUrl;

      toast.success("Message sent! We'll get back to you shortly.");
      
      // Reset form
    setFormData({
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: ""
    });
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message. Please try WhatsApp or email us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 bg-[#faf8f5] overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[350px] h-[350px] bg-gradient-to-br from-[#D4AF37]/30 via-[#faf8f5] to-transparent rounded-full blur-3xl" />
      <div className="absolute -bottom-20 -right-20 w-[350px] h-[350px] bg-gradient-to-tr from-[#B8860B]/30 via-[#faf8f5] to-transparent rounded-full blur-3xl" />
      <div className="container px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <motion.h2
            className="font-serif text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] bg-clip-text text-transparent mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            Contact Us
          </motion.h2>
          <p className="text-gray-600 text-lg">
            Get in touch with us for any queries or to place an order
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-start max-w-6xl mx-auto">
          <motion.div
            className="lg:col-span-2 space-y-8 bg-white/60 backdrop-blur-lg p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <h3 className="font-serif text-xl font-semibold mb-6 text-primary">Contact Information</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500">Phone/WhatsApp</h4>
                  <p className="text-base text-gray-900 font-medium">+91-9311244099</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <Mail className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500">Email</h4>
                  <p className="text-base text-gray-900 font-medium">services@dcprintingpress.com</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500">Location</h4>
                  <p className="text-base text-gray-900 font-medium">Between Ansal Plaza and Bharat Petroleum, Greater Noida</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div className="ml-4">
                  <h4 className="text-sm font-medium text-gray-500">WhatsApp</h4>
                  <a 
                    href="https://wa.me/919311244099" 
                    target="_blank" 
                    rel="noreferrer"
                    className="inline-block mt-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-all duration-300 hover:shadow-lg hover:shadow-green-500/20 hover:scale-105"
                  >
                    Chat on WhatsApp
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-primary-100">
              <h4 className="font-medium text-lg mb-3 text-primary-700">Business Hours</h4>
              <ul className="space-y-2 text-gray-600">
                <li className="flex justify-between">
                  <span>Monday - Sunday:</span>
                  <span>9:00 AM - 9:00 PM</span>
                </li>
                <li className="text-sm italic text-gray-500">
                  <span>Open all days of the week</span>
                </li>
              </ul>
            </div>
          </motion.div>
          
          <motion.form
            onSubmit={handleSubmit}
            className="lg:col-span-3 space-y-6 bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-gray-200 shadow-xl hover:shadow-2xl transition-shadow duration-300"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <h3 className="font-serif text-xl font-semibold mb-6 text-primary">Send us a message</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium text-gray-700">
                  Your Name
                </label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Enter your name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium text-gray-700">
                  Phone Number
                </label>
                <Input
                  id="phone"
                  name="phone"
                  placeholder="Enter your phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="text-sm font-medium text-gray-700">
                  Subject
                </label>
                <Input
                  id="subject"
                  name="subject"
                  placeholder="What is this regarding?"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Your Message
              </label>
              <Textarea
                id="message"
                name="message"
                placeholder="Enter your message"
                rows={5}
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-white hover:shadow-lg hover:shadow-[#D4AF37]/20 hover:scale-105 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
            
            <div className="text-center space-y-2 text-sm text-gray-500 mt-4">
              <p>We'll get back to you as soon as possible.</p>
              <p>Your message will be sent to both our WhatsApp and email.</p>
            </div>
          </motion.form>
        </div>
      </div>
    </section>
  );
};

export default Contact;

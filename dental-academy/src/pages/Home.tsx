import { Link } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

const useSubmitContact = () =>
  useMutation({
    mutationFn: async (payload: { data: { name: string; phone: string; email: string; message: string } }) => {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload.data),
      });
      if (!res.ok) throw new Error("Failed to submit");
      return res.json();
    },
  });
import { toast } from "sonner";
import { ChevronRight, CheckCircle2, MapPin, Clock, CalendarDays, ArrowRight, Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Card, CardContent } from "@/components/ui/card";

const contactSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number is required"),
  email: z.string().email("Valid email is required"),
  message: z.string().min(10, "Please tell us a bit about yourself"),
});

type ContactFormValues = z.infer<typeof contactSchema>;

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const submitContact = useSubmitContact();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = (data: ContactFormValues) => {
    submitContact.mutate(
      { data },
      {
        onSuccess: () => {
          toast.success("Application received! We will contact you shortly.");
          form.reset();
        },
        onError: () => {
          toast.error("Something went wrong. Please try again later.");
        },
      }
    );
  };

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-secondary/30">
      {/* Navbar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm py-4" : "bg-transparent py-6"}`}>
        <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-white font-serif font-bold text-xl">
              D
            </div>
            <span className={`font-serif font-bold text-xl tracking-tight ${isScrolled ? "text-primary" : "text-white drop-shadow-md"}`}>
              Dual Impact
            </span>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("program")} className={`text-sm font-medium hover:text-secondary transition-colors ${isScrolled ? "text-foreground/80" : "text-white/90 drop-shadow-sm"}`}>Program</button>
            <button onClick={() => scrollToSection("details")} className={`text-sm font-medium hover:text-secondary transition-colors ${isScrolled ? "text-foreground/80" : "text-white/90 drop-shadow-sm"}`}>Details</button>
            <button onClick={() => scrollToSection("why-us")} className={`text-sm font-medium hover:text-secondary transition-colors ${isScrolled ? "text-foreground/80" : "text-white/90 drop-shadow-sm"}`}>Why Us</button>
            <Button onClick={() => scrollToSection("apply")} className="bg-secondary text-primary hover:bg-secondary/90 font-semibold rounded-full px-6">
              Apply Now
            </Button>
          </div>

          {/* Mobile Nav Toggle */}
          <button className={`md:hidden p-2 -mr-2 ${isScrolled ? "text-primary" : "text-white"}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white shadow-xl border-t p-4 flex flex-col gap-4 md:hidden">
            <button onClick={() => scrollToSection("program")} className="text-left py-2 px-4 font-medium text-foreground hover:bg-muted rounded">Program</button>
            <button onClick={() => scrollToSection("details")} className="text-left py-2 px-4 font-medium text-foreground hover:bg-muted rounded">Details</button>
            <button onClick={() => scrollToSection("why-us")} className="text-left py-2 px-4 font-medium text-foreground hover:bg-muted rounded">Why Us</button>
            <Button onClick={() => scrollToSection("apply")} className="w-full bg-secondary text-primary hover:bg-secondary/90 font-semibold">
              Apply Now
            </Button>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
        <div className="absolute inset-0 z-0">
          <img 
            src="/hero-bg.jpg" 
            alt="Modern dental office" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-primary/80 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-b from-primary/50 to-primary/95"></div>
        </div>
        
        <div className="container relative z-10 mx-auto px-4 md:px-8 pt-12 md:pt-0">
          <div className="max-w-3xl">
            <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
              <motion.span variants={fadeIn} className="inline-block py-1 px-3 rounded-full bg-secondary/20 text-secondary text-sm font-semibold tracking-wider uppercase mb-6 border border-secondary/30">
                Fort Worth's Premier Dental Academy
              </motion.span>
              <motion.h1 variants={fadeIn} className="text-5xl md:text-6xl lg:text-7xl font-serif font-bold text-white leading-[1.1] mb-6">
                Launch Your Dental Career in <span className="text-secondary italic">12 Weeks</span>
              </motion.h1>
              <motion.p variants={fadeIn} className="text-lg md:text-xl text-white/80 leading-relaxed mb-10 max-w-2xl">
                Master both front office administration and back office clinical skills. Leave job-ready, highly valued, and ahead of the competition.
              </motion.p>
              <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-secondary text-primary hover:bg-secondary/90 text-base font-semibold rounded-full h-14 px-8" onClick={() => scrollToSection("apply")}>
                  Apply Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button size="lg" variant="outline" className="bg-transparent border-white/30 text-white hover:bg-white/10 text-base rounded-full h-14 px-8" onClick={() => scrollToSection("program")}>
                  Learn More
                </Button>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="program" className="py-24 md:py-32 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeIn}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl relative z-10">
                <img src="/about-dental.jpg" alt="Dental assisting student training" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-8 -right-8 w-64 h-64 bg-secondary/10 rounded-full blur-3xl -z-10"></div>
              <div className="absolute -top-8 -left-8 w-40 h-40 bg-primary/5 rounded-full blur-2xl -z-10"></div>
            </motion.div>
            
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}>
              <motion.h2 variants={fadeIn} className="text-3xl md:text-5xl font-serif font-bold text-primary mb-6">
                The Dual-Track Advantage
              </motion.h2>
              <motion.p variants={fadeIn} className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Most programs force you to choose between administrative and clinical paths. We believe the most valuable dental assistants can do both. Our intensive 12-week program builds complete professionals.
              </motion.p>
              
              <div className="space-y-8">
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/5 flex items-center justify-center text-primary border border-primary/10">
                    <span className="font-serif font-bold text-lg">1</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Weeks 1-6: Front Office Excellence</h3>
                    <p className="text-muted-foreground">Master scheduling, billing, insurance verification, and patient communication. Become the face of the practice.</p>
                  </div>
                </motion.div>
                
                <motion.div variants={fadeIn} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center text-secondary-foreground border border-secondary/30">
                    <span className="font-serif font-bold text-lg">2</span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-primary mb-2">Weeks 7-12: Clinical Mastery</h3>
                    <p className="text-muted-foreground">Learn chairside assisting, sterilization, radiography, and clinical procedures hands-on in a real dental environment.</p>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Program Details */}
      <section id="details" className="py-24 bg-muted/50">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-primary mb-4">Program Details</h2>
            <p className="text-muted-foreground text-lg">Everything you need to know to start your journey with Dual Impact Dental Academy.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              { icon: Clock, title: "Duration", value: "12 Weeks", desc: "Fast-tracked comprehensive training" },
              { icon: CalendarDays, title: "Schedule", value: "Dual Track", desc: "6 wks front office + 6 wks clinical" },
              { icon: MapPin, title: "Location", value: "Fort Worth, TX", desc: "3600 Hulen St, Ste D4" },
              { icon: CheckCircle2, title: "Investment", value: "$6,800", desc: "All-inclusive tuition" }
            ].map((item, i) => (
              <motion.div key={i} variants={fadeIn}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 group">
                  <CardContent className="p-8 text-center flex flex-col items-center">
                    <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                      <item.icon className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">{item.title}</h3>
                    <p className="text-2xl font-bold text-primary mb-2">{item.value}</p>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Us */}
      <section id="why-us" className="py-24 md:py-32 bg-primary text-white">
        <div className="container mx-auto px-4 md:px-8">
          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeIn}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-serif font-bold mb-6">Why Choose Dual Impact?</h2>
            <p className="text-white/70 text-lg">We don't just teach dental assisting; we build careers. Our approach is fundamentally different.</p>
          </motion.div>

          <motion.div 
            initial="hidden" whileInView="visible" viewport={{ once: true }} variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8"
          >
            <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif">Dual-Trained, Dual-Valued</h3>
              <p className="text-white/70 leading-relaxed">
                Most programs train one side. We train both. Be the versatile team member every dental practice is desperate to hire.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif">Small Cohorts, Real Attention</h3>
              <p className="text-white/70 leading-relaxed">
                This isn't a factory. We keep our class sizes small to ensure you get personalized instruction and real hands-on practice.
              </p>
            </motion.div>
            
            <motion.div variants={fadeIn} className="bg-white/5 border border-white/10 rounded-2xl p-8 hover:bg-white/10 transition-colors">
              <div className="w-12 h-12 rounded bg-secondary flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-4 font-serif">Fort Worth's Own</h3>
              <p className="text-white/70 leading-relaxed">
                We are a local school with deep roots in the community and strong hiring connections with local dental practices.
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Application / Contact */}
      <section id="apply" className="py-24 md:py-32 bg-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-muted/30 -z-10 skew-x-12 transform origin-top-right"></div>
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border overflow-hidden flex flex-col md:flex-row">
            
            <div className="md:w-5/12 bg-primary p-10 md:p-12 text-white flex flex-col justify-center">
              <h2 className="text-3xl font-serif font-bold mb-4">Start Your Journey</h2>
              <p className="text-white/80 mb-8">Take the first step toward a rewarding career in healthcare. Fill out the form, and our admissions team will be in touch.</p>
              
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">Visit Us</p>
                    <p className="text-white/70 text-sm">3600 Hulen St, Ste D4, Fort Worth, TX 76107</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="font-semibold">Next Cohort</p>
                    <p className="text-white/70 text-sm">Enrolling now</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="md:w-7/12 p-10 md:p-12">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" className="bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-foreground">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(817) 555-0123" className="bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary h-12" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Email Address</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john@example.com" className="bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary h-12" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-foreground">Tell us about yourself</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Why are you interested in dental assisting?" 
                            className="resize-none bg-muted/50 border-muted-foreground/20 focus-visible:ring-primary min-h-[120px]" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    disabled={submitContact.isPending}
                    className="w-full h-14 text-base font-bold bg-primary hover:bg-primary/90 text-white rounded-xl mt-4"
                  >
                    {submitContact.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary pt-16 pb-8 border-t border-white/10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid md:grid-cols-3 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded bg-secondary flex items-center justify-center text-primary font-serif font-bold text-xl">
                  D
                </div>
                <span className="font-serif font-bold text-xl text-white tracking-tight">
                  Dual Impact
                </span>
              </div>
              <p className="text-white/60 leading-relaxed max-w-sm">
                Fort Worth's premier dental assisting academy, providing comprehensive 12-week training in both front office and clinical skills.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-serif">Quick Links</h4>
              <ul className="space-y-3">
                <li><button onClick={() => scrollToSection("program")} className="text-white/60 hover:text-secondary transition-colors">Program Info</button></li>
                <li><button onClick={() => scrollToSection("details")} className="text-white/60 hover:text-secondary transition-colors">Details & Tuition</button></li>
                <li><button onClick={() => scrollToSection("why-us")} className="text-white/60 hover:text-secondary transition-colors">Why Choose Us</button></li>
                <li><button onClick={() => scrollToSection("apply")} className="text-white/60 hover:text-secondary transition-colors">Apply Now</button></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-6 font-serif">Contact</h4>
              <ul className="space-y-4 text-white/60">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                  <span>3600 Hulen St, Ste D4<br/>Fort Worth, TX 76107</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-secondary shrink-0" />
                  <a href="mailto:info@dualimpactdentalacademy.com" className="hover:text-secondary transition-colors">info@dualimpactdentalacademy.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-white/40">
            <p>&copy; {new Date().getFullYear()} Dual Impact Dental Academy. All rights reserved.</p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Mail(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}
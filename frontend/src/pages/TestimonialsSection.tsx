import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

// Enhanced Testimonials Section
const TestimonialsSection = () => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const testimonials = [
      {
        image: "/vite.svg",
        quote: "Through blockchain verification, we can now ensure our premium saffron reaches customers in its pure form, preserving our heritage and livelihood.",
        name: "Abdul Rashid",
        location: "Pampore, Kashmir"
      },
      {
        image: "/vite.svg",
        quote: "The blockchain system has helped us maintain transparency and build trust with our customers worldwide.",
        name: "Mohammad Ayub",
        location: "Pampore, Kashmir"
      },
      {
        image: "/vite.svg",
        quote: "This technology has revolutionized how we sell our saffron, ensuring fair prices for our premium product.",
        name: "Gulzar Ahmad",
        location: "Pampore, Kashmir"
      }
    ];
  
    const nextSlide = () => {
      setCurrentSlide((prev) => (prev + 1) % testimonials.length);
    };
  
    const prevSlide = () => {
      setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };
  
    useEffect(() => {
      const timer = setInterval(nextSlide, 5000);
      return () => clearInterval(timer);
    }, []);
  
    return (
      <div className="relative py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600">
            Farmer Stories
          </h2>
          <div className="max-w-4xl mx-auto relative">
            <button 
              onClick={prevSlide}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ArrowRight className="w-6 h-6 transform rotate-180" />
            </button>
            <button 
              onClick={nextSlide}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 p-2 rounded-full shadow-lg"
            >
              <ArrowRight className="w-6 h-6" />
            </button>
            <div className="overflow-hidden">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="w-full flex-shrink-0">
                    <div className="relative p-8 md:p-12 rounded-3xl bg-black/5 backdrop-blur-md border border-white/10">
                      <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-6 border-4 border-amber-500/30">
                          <img src={testimonial.image} alt="Farmer" className="w-full h-full object-cover" />
                        </div>
                        <p className="text-xl md:text-2xl text-amber-600 mb-6">{testimonial.quote}</p>
                        <p className="font-bold text-black/70">{testimonial.name}</p>
                        <p className="text-black/50">{testimonial.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="flex justify-center mt-4 gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${
                    currentSlide === index ? 'bg-amber-500' : 'bg-amber-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default TestimonialsSection;
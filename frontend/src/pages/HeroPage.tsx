import { useEffect, useState } from 'react';
import { Camera, MapPin, Shield, Leaf, QrCode, LogIn, ChevronDown, Users, Star, ArrowRight, Award, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import QRScannerModal from './QRScannerModel';
import TestimonialsSection from './TestimonialsSection';

// Simplified Paisley Pattern Component
const PaisleyPattern = () => (
  <svg className="absolute inset-0 w-full h-full opacity-5" viewBox="0 0 100 100">
    <path d="M25,50 Q35,20 50,50 T75,50 Q65,80 50,50 T25,50" fill="currentColor" />
  </svg>
);

// Simplified Mountain Component
const Mountains = () => (
  <svg className="absolute bottom-0 w-full" viewBox="0 0 1440 320">
    <path 
      d="M0,160 L48,176 L96,160 L144,176 L192,160 L240,176 L288,160 L336,176 L384,160 L432,176 L480,160 L528,176 L576,160 L624,176 L672,160 L720,176 L768,160 L816,176 L864,160 L912,176 L960,160 L1008,176 L1056,160 L1104,176 L1152,160 L1200,176 L1248,160 L1296,176 L1344,160 L1392,176 L1440,160 L1440,320 L0,320 Z"
      fill="#fff"
      className="opacity-30"
    />
  </svg>
);

// Simplified Saffron Flower Component
const SaffronFlower = ({ className, style }) => (
  <svg className={className} viewBox="0 0 100 100" style={style}>
    <path d="M50,20 C60,40 80,50 50,80 C20,50 40,40 50,20" fill="currentColor" />
    <path d="M50,20 C40,40 20,50 50,80 C80,50 60,40 50,20" fill="currentColor" />
  </svg>
);

// Simplified Kesar Strand Component
const KesarStrand = ({ className, style }) => (
  <svg className={className} viewBox="0 0 20 100" style={style}>
    <path
      d="M10,0 Q15,25 10,50 T10,100"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M10,0 L13,10 L7,10 Z"
      fill="currentColor"
    />
  </svg>
);

// Process Step Card Component
const ProcessStep = ({ icon, title, description, delay }) => (
  <div
    className="relative p-8 rounded-3xl bg-amber-300 backdrop-blur-md border border-black/10 transform transition-all hover:-translate-y-2"
    style={{ animationDelay: delay }}
  >
    <div className="relative z-10">
      <div className="w-16 h-16 bg-black/5 rounded-full flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold mb-2 text-black">{title}</h3>
      <p className="text-black/80">{description}</p>
    </div>
    <PaisleyPattern />
  </div>
);

const HeroPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState({});
  const [isQRScannerOpen, setIsQRScannerOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            setIsVisible(prev => ({
              ...prev,
              [entry.target.id]: entry.isIntersecting
            }));
          });
        },
        { threshold: 0.1 }
      );

      document.querySelectorAll('[data-animate]').forEach((el) => {
        observer.observe(el);
      });
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const processSteps = [
    { icon: <Camera className="w-8 h-8" />, title: "Scan Product", description: "Scan the QR code on your Kesar package" },
    { icon: <Shield className="w-8 h-8" />, title: "Verify Origin", description: "View detailed blockchain-verified origin data" },
    { icon: <Users className="w-8 h-8" />, title: "Meet Producers", description: "Connect with authentic Kashmiri farmers" },
    { icon: <Star className="w-8 h-8" />, title: "Receive NFT", description: "Get your unique digital certificate" }
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-blue">
      {/* Snow Effect */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(50)].map((_, i) => (
          <div
            key={i}
            className="absolute animate-snowfall"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${15 + Math.random() * 10}s`
            }}
          >
            <div className="w-2 h-2 bg-white rounded-full opacity-60" />
          </div>
        ))}
      </div>

      {/* Floating Saffron Flowers */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <SaffronFlower
            key={i}
            className="absolute w-12 h-12 animate-float opacity-40 text-black"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              transform: `rotate(${Math.random() * 360}deg)`
            }}
          />
        ))}
      </div>

      {/* QR Scanner Modal */}
      <QRScannerModal 
        isOpen={isQRScannerOpen}
        onClose={() => setIsQRScannerOpen(false)}
      />
      

      {/* Main Content */}
      <div className="relative container mx-auto px-4 pt-24 pb-32">
        {/* Login Button */}
        <div className="absolute top-4 right-4 z-10">
        <button 
          onClick={() => navigate('/user/login')}
          className="px-6 py-3 bg-black backdrop-blur-md hover:bg-white/20 rounded-full shadow-lg flex items-center gap-2 text-white transition-all border border-white/20"
        >
            <LogIn size={20} />
            <span>Login</span>
          </button>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-4xl mx-auto text-center">
          {/* Decorative Elements */}
          <div className="absolute -top-20 left-1/2 transform -translate-x-1/2 w-64 h-64">
            <SaffronFlower className="w-full h-full text-amber-500 opacity-20 animate-spin-slow" />
          </div>

          <h1 className="relative text-6xl md:text-8xl font-bold mb-8 text-amber-500">
            Kashmiri Kesar
          </h1>
          
          <p className="text-xl md:text-2xl text-black/90 mb-12">
            Experience the authentic essence of Kashmir's finest saffron,
            <br />verified through blockchain technology
          </p>

          <button onClick={() => setIsQRScannerOpen(true)} className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-xl flex items-center gap-3 mx-auto text-lg font-semibold transition-all transform hover:scale-105 hover:shadow-2xl">
            <QrCode size={24} />
            Verify Your Kesar
          </button>

          <div className="mt-16 animate-bounce">
            <ChevronDown className="w-8 h-8 mx-auto text-black/60" />
          </div>
        </div>
      </div>
      
      {/* Features Section with Kashmiri Patterns */}
      <div className="relative bg-black-3 backdrop-blur-md py-24">
        <PaisleyPattern />
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: <Shield className="w-12 h-12 text-amber-400" />,
                title: "Blockchain Verified",
                description: "Every strand traced from the valleys of Kashmir"
              },
              {
                icon: <MapPin className="w-12 h-12 text-amber-400" />,
                title: "Origin Guaranteed",
                description: "Direct from Pampore's saffron fields"
              },
              {
                icon: <Leaf className="w-12 h-12 text-amber-400" />,
                title: "Support Local Farmers",
                description: "Preserving centuries of Kashmiri tradition"
              }
            ].map((feature, index) => (
              <div
                key={index}
                className="relative p-8 rounded-3xl bg-black/5 backdrop-blur-md border border-white/10 transform transition-all hover:-translate-y-2"
              >
                <div className="relative z-10">
                  {feature.icon}
                  <h3 className="text-2xl font-bold mt-4 mb-2 text-black">{feature.title}</h3>
                  <p className="text-black/80">{feature.description}</p>
                </div>
                <PaisleyPattern />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Parallax Mountain Scene */}
      <div className="relative h-screen overflow-hidden">
        <div
          className="absolute inset-0 bg-[url('/api/placeholder/1920/1080')] bg-cover bg-center"
          style={{
            transform: `translateY(${scrollY * 0.5}px)`
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-amber-900/90 to-transparent">
          <Mountains />
        </div>
        <div className="relative h-full flex items-center justify-center text-center px-4">
          <div>
            <h2 className="text-4xl md:text-6xl font-bold mb-6 text-white">
              From Kashmir's Mountains
              <br />
              To Your Home
            </h2>
            <p className="text-xl md:text-2xl text-white/80 mb-8 max-w-2xl mx-auto">
              Experience the world's finest saffron, harvested from the pristine valleys of Kashmir
            </p>
            <button className="px-8 py-4 bg-amber-500 hover:bg-amber-700 text-white rounded-full shadow-lg flex items-center gap-2 mx-auto transition-all hover:scale-105">
              Learn Our Story
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Process Timeline Section */}
      <div className="relative bg-white py-24">
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <KesarStrand
              key={i}
              className="absolute w-5 h-12 animate-float-slow text-amber-600"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 5}s`
              }}
            />
          ))}
        </div>
        <div className="container mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 text-amber-600">
            The Journey of Authenticity
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <ProcessStep key={index} {...step} delay={`${index * 200}ms`} />
            ))}
          </div>
        </div>
      </div>

      {/* Statistics Section */}
      <div className="relative bg-black/5 backdrop-blur-md py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[
              { value: "5000+", label: "Kashmiri Farmers", icon: <Users className="w-8 h-8" /> },
              { value: "100%", label: "Authentic Saffron", icon: <Award className="w-8 h-8" /> },
              { value: "10,000+", label: "Verified Products", icon: <Check className="w-8 h-8" /> }
            ].map((stat, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-3xl bg-black backdrop-blur-md border border-white/10 transform hover:scale-105 transition-all"
              >
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-500 rounded-full flex items-center justify-center text-white">
                  {stat.icon}
                </div>
                <div className="text-5xl font-bold mb-2 text-white">{stat.value}</div>
                <div className="text-xl text-white/80">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative py-24 overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-8 text-amber-600">
              The Art of Harvesting
            </h2>
            <div className="relative rounded-3xl overflow-hidden shadow-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="aspect-video">
                <img
                  src="/public/vite.svg"
                  alt="Saffron Harvesting"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/50 to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Location Section */}
      {/* <LocationSection /> */}

      {/* Testimonials Section */}
      <TestimonialsSection />

      {/* CTA Section */}
      <div className="relative py-24 bg-amber-900">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-8 text-white">
            Experience True Kashmiri Saffron
          </h2>
          <p className="text-xl md:text-2xl text-amber-300 mb-12 max-w-2xl mx-auto">
            Verify your purchase and become part of our journey towards authentic saffron trade
          </p>
          <button className="px-8 py-4 bg-amber-500 hover:bg-amber-600 text-white rounded-full shadow-xl flex items-center gap-3 mx-auto text-lg font-semibold transition-all transform hover:scale-105">
            <QrCode size={24} />
            Verify Your Kesar
          </button>
        </div>
        {/* <div className="absolute top-4 bottom-0 left-0 right-0">
          <Mountains />
        </div> */}
      </div>
    </div>
  );
};

export default HeroPage;
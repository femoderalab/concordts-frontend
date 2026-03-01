/**
 * Concord Tutors School - Premium Landing Page
 * Redesigned with Modern Aesthetic & Enhanced Animations
 * Royal Blue Theme (#2b2f83) - Mobile-First Responsive Design
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  // Handle navbar scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for scroll animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('section[id]').forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  // Carousel images - All images including the previous hero image
  const carouselImages = [
    '/school_girl.png',
    '/CORSEL1.png',
    '/CORSEL2.png',
    '/CORSEL3.png',
    '/CORSEL4.png',
    '/students.png',
    '/IMG-20260120-WA0014.jpg',
    '/IMG-20260120-WA0015.jpg',
    '/IMG-20260120-WA0016.jpg',
    '/IMG-20260120-WA0019.jpg',
    '/IMG-20260120-WA0022.jpg',
    '/IMG-20260120-WA0020.jpg',
    '/build.JPG',
    '/hose.JPG',
    '/house.JPG',
    '/group.JPG',
  ];

  // Auto-rotate carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  // Smooth scroll to section
  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      });
      setMobileMenuOpen(false);
    }
  };

  // WhatsApp function
  const openWhatsApp = () => {
    window.open('https://wa.me/2348035312904', '_blank');
  };

  // Email function
  const openEmail = () => {
    window.location.href = 'mailto:concordtutorsnurprysch@gmail.com';
  };

  // Navigation items
  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Programs', id: 'programs' },
    { label: 'Activities', id: 'activities' },
    { label: 'Admissions', id: 'admissions' },
    { label: 'Contact', id: 'contact' },
  ];

  // Our strengths
  const strengths = [
    {
      title: 'Conducive Learning Environment',
      description: 'Our state-of-the-art facilities provide a serene, secure, and stimulating atmosphere where students can focus on learning and personal growth.',
      icon: '🏫',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Qualified & Experienced Teachers',
      description: 'Our team comprises highly trained educators with years of experience in nurturing young minds with passion and dedication.',
      icon: '👨‍🏫',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Montessori Method of Teaching',
      description: 'We implement the renowned Montessori approach that encourages self-directed learning, hands-on activities, and collaborative play.',
      icon: '📖',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Excellent Interpersonal Relationships',
      description: 'We maintain strong, supportive relationships among parents, students, and teachers through open communication and mutual respect.',
      icon: '🤝',
      color: 'from-amber-500 to-amber-600'
    },
  ];

  // Education levels
  const educationLevels = [
    { title: 'Creche', color: 'bg-blue-50 text-blue-700 border-blue-300' },
    { title: 'Pre-Nursery', color: 'bg-purple-50 text-purple-700 border-purple-300' },
    { title: 'Nursery', color: 'bg-green-50 text-green-700 border-green-300' },
    { title: 'Primary', color: 'bg-amber-50 text-amber-700 border-amber-300' },
    { title: 'Secondary', color: 'bg-rose-50 text-rose-700 border-rose-300' },
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">
      {/* ===== FIXED TOP BAR WITH CONTACT INFO ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#2b2f83] py-2.5 sm:py-3 px-3 sm:px-6 shadow-md">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] sm:text-xs md:text-sm">
            {/* Email and Socials */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap justify-center sm:justify-start">
              <a href="mailto:concordtutorsnurprysch@gmail.com" className="flex items-center gap-1 sm:gap-1.5 text-white hover:text-blue-200 transition-colors">
                <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="hidden lg:inline font-medium">concordtutorsnurprysch@gmail.com</span>
                <span className="lg:hidden font-medium">Email</span>
              </a>
              <a href="https://web.facebook.com/people/Concord-Tutors-School/61566890415370/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Facebook">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </a>
              <a href="https://www.instagram.com/concordtutorsschool" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Instagram">
                <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
            </div>

            {/* Address */}
            <div className="flex items-center gap-1 sm:gap-1.5 text-white text-center sm:text-left">
              <svg className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium leading-tight">NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Nigeria</span>
            </div>
          </div>
        </div>
      </div>

{/* ===== FIXED NAVBAR ===== */}
      <nav className={`fixed top-[44px] sm:top-[48px] left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-xl' : 'bg-white/98 backdrop-blur-sm shadow-md'
      } border-b border-gray-100`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 sm:space-x-3 cursor-pointer flex-shrink-0" onClick={() => scrollToSection('home')}>
              <img src="/logo.png" alt="Concord Tutors School" className="h-10 w-10 sm:h-14 sm:w-14 object-contain" />
              <div className="hidden sm:block">
                <span className="text-base sm:text-xl font-bold text-gray-900 block leading-tight font-heading">Concord Tutors School</span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 xl:space-x-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-gray-700 hover:text-[#2b2f83] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2b2f83] transition-all group-hover:w-full"></span>
                </button>
              ))}
              <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-1.5 rounded-full font-semibold border border-green-200">
                Portal Available
              </span>
              <button
                onClick={openWhatsApp}
                className="bg-[#2b2f83] text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1f2361] transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
              >
                Apply Now
              </button>
              <button
  onClick={() => navigate('/login')}
  className="bg-white text-[#2b2f83] border-2 border-[#2b2f83] px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2b2f83] hover:text-white transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-105"
>
  Login
</button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-gray-200 shadow-2xl animate-slideDown">
            <div className="px-3 sm:px-4 py-4 sm:py-6 space-y-2 sm:space-y-3 max-h-[calc(100vh-120px)] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 sm:px-4 py-2.5 sm:py-3 text-sm sm:text-base text-gray-700 hover:bg-gray-50 rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="text-xs bg-green-50 text-green-700 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg font-semibold text-center border border-green-200">
                School Portal Available
              </div>
              <button
                onClick={openWhatsApp}
                className="w-full bg-[#2b2f83] text-white px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#1f2361] transition-all shadow-md"
              >
                Apply Now
              </button>
              <button
  onClick={() => navigate('/login')}
  className="w-full bg-white text-[#2b2f83] border-2 border-[#2b2f83] px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#2b2f83] hover:text-white transition-all shadow-md"
>
  Login
</button>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION ===== */}
      <section
        id="home"
        className={`relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 pt-32 sm:pt-36 pb-8 sm:pb-12 px-3 sm:px-4 transition-all duration-1000 ${
          visibleSections.has('home') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        {/* Enhanced Educational Icons Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-[0.05]">
          {/* Top Row */}
          <div className="absolute top-10 left-8 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '0s' }}>🎓</div>
          <div className="absolute top-16 right-12 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '0.5s' }}>📚</div>
          <div className="absolute top-24 left-1/4 text-5xl sm:text-6xl lg:text-7xl animate-float" style={{ animationDelay: '1s' }}>✏️</div>
          <div className="absolute top-12 right-1/3 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '1.5s' }}>🔬</div>
          
          {/* Middle Section */}
          <div className="absolute top-1/3 left-8 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '2s' }}>🎨</div>
          <div className="absolute top-1/2 right-16 text-5xl sm:text-6xl lg:text-7xl animate-float" style={{ animationDelay: '2.5s' }}>📐</div>
          <div className="absolute top-1/3 right-1/4 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '3s' }}>🌍</div>
          <div className="absolute top-2/5 left-1/3 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '0.8s' }}>🧪</div>
          <div className="absolute top-1/2 left-12 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '1.8s' }}>📖</div>
          <div className="absolute top-3/5 right-1/3 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '3.5s' }}>🎭</div>
          
          {/* Bottom Section */}
          <div className="absolute bottom-28 left-1/4 text-5xl sm:text-6xl lg:text-7xl animate-float" style={{ animationDelay: '2.2s' }}>🎵</div>
          <div className="absolute bottom-36 right-1/3 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '2.8s' }}>🏆</div>
          <div className="absolute bottom-20 left-10 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '3.2s' }}>💡</div>
          <div className="absolute bottom-32 right-12 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '1.2s' }}>🧬</div>
          <div className="absolute bottom-1/3 left-1/3 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '3.5s' }}>⚗️</div>
          <div className="absolute bottom-1/4 right-1/4 text-5xl sm:text-6xl lg:text-7xl animate-float" style={{ animationDelay: '0.3s' }}>🔭</div>
          
          {/* Additional Educational Icons */}
          <div className="absolute top-1/4 left-1/2 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '1.3s' }}>🌟</div>
          <div className="absolute top-3/4 left-16 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '2.6s' }}>🎪</div>
          <div className="absolute top-3/5 right-10 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '3.8s' }}>🏅</div>
          <div className="absolute bottom-1/2 left-1/4 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '4s' }}>🎯</div>
          <div className="absolute top-1/5 right-1/5 text-4xl sm:text-5xl lg:text-6xl animate-float" style={{ animationDelay: '0.7s' }}>🧮</div>
          <div className="absolute bottom-2/5 right-1/5 text-3xl sm:text-4xl lg:text-5xl animate-float" style={{ animationDelay: '4.2s' }}>🎺</div>
          
          {/* Geometric Shapes */}
          <div className="absolute top-1/4 right-8 w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 border-4 border-blue-200 rounded-full animate-spin-slow opacity-30"></div>
          <div className="absolute bottom-1/3 left-8 w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 border-4 border-purple-200 rotate-45 animate-pulse-slow opacity-30"></div>
          <div className="absolute top-1/2 right-1/3 w-14 h-14 sm:w-18 sm:h-18 lg:w-24 lg:h-24 border-4 border-green-200 rounded-lg animate-bounce-slow opacity-30"></div>
          <div className="absolute bottom-1/4 right-16 w-8 h-8 sm:w-10 sm:h-10 lg:w-14 lg:h-14 bg-amber-100 rounded-full animate-float opacity-30" style={{ animationDelay: '2.5s' }}></div>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-7xl mx-auto w-full">
          <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left space-y-4 sm:space-y-6 animate-fadeInLeft">
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 leading-tight font-heading">
                We Provide Quality Education For Your Ward
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-700 leading-relaxed">
                Excellence in Academic Development, Emotional Growth, Moral & Religious Values, Socio-Cultural Understanding, and a Serene Learning Environment
              </p>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start pt-2 sm:pt-4">
                <button
                  onClick={openWhatsApp}
                  className="bg-[#2b2f83] text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-[#1f2361] transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  Enroll Your Child
                </button>
                <button
                  onClick={() => scrollToSection('about')}
                  className="bg-white border-2 border-[#2b2f83] text-[#2b2f83] px-6 sm:px-8 py-3 sm:py-4 rounded-lg text-base sm:text-lg font-bold hover:bg-blue-50 transition-all shadow-lg transform hover:scale-105"
                >
                  Explore Our School
                </button>
              </div>

              {/* Education Levels Tags */}
              <div className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start pt-2 sm:pt-4">
                {educationLevels.map((level, index) => (
                  <span
                    key={index}
                    className={`${level.color} px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium border animate-fadeIn`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    {level.title}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Side - Carousel with improved dimensions */}
            <div className="flex justify-center lg:justify-end animate-fadeInRight">
              <div className="relative w-full max-w-[85%] sm:max-w-md md:max-w-lg lg:max-w-xl mx-auto">
                <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-gray-100" 
                     style={{ 
                       height: '450px',
                       width: '100%',
                       maxWidth: '500px',
                       margin: '0 auto'
                     }}>
                  {carouselImages.map((image, index) => (
                    <div
                      key={index}
                      className={`absolute inset-0 transition-all duration-1000 ${
                        index === currentSlide ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`School Life ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                    </div>
                  ))}
                  
                  {/* Carousel Indicators */}
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-1.5 sm:gap-2 bg-white/20 backdrop-blur-md px-2.5 sm:px-3 py-1.5 rounded-full">
                    {carouselImages.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentSlide(index)}
                        className={`transition-all duration-300 rounded-full ${
                          index === currentSlide 
                            ? 'bg-[#2b2f83] w-5 sm:w-6 h-1.5 sm:h-2' 
                            : 'bg-white/70 w-1.5 sm:w-2 h-1.5 sm:h-2 hover:bg-white'
                        }`}
                        aria-label={`Go to slide ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Navigation Arrows */}
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                    aria-label="Previous slide"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2b2f83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % carouselImages.length)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 sm:p-2.5 rounded-full shadow-lg transition-all transform hover:scale-110"
                    aria-label="Next slide"
                  >
                    <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#2b2f83]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section 
        id="about" 
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading px-3">
              Welcome to <span className="text-[#2b2f83]">Concord Tutors School</span>
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-4xl mx-auto leading-relaxed px-3">
              A government-approved institution dedicated to nurturing young minds through excellence in education, 
              character development, and holistic growth. We provide a comprehensive school portal where students 
              and parents can access results, assignments, attendance records, and all essential academic information in real-time.
            </p>
          </div>

          {/* Our Strengths */}
          <div className="mb-12">
            <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-center text-gray-900 mb-8 sm:mb-12 font-heading">Our Strengths</h3>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {strengths.map((strength, index) => (
                <div
                  key={index}
                  className={`bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 group transform ${
                    visibleSections.has('about') ? 'animate-fadeInUp' : 'opacity-0'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className={`w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br ${strength.color} rounded-xl flex items-center justify-center mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    <span className="text-2xl sm:text-3xl">{strength.icon}</span>
                  </div>
                  <h4 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-heading">{strength.title}</h4>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{strength.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== EDUCATION PROGRAMS ===== */}
      <section 
        id="programs" 
        className={`py-16 sm:py-20 lg:py-24 bg-white transition-all duration-1000 ${
          visibleSections.has('programs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading px-3">
              Our Educational Programs
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-3">
              Comprehensive education from early childhood through secondary school
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
            {[
              {
                title: 'Creche',
                description: 'Warm, caring environment for our youngest learners with age-appropriate activities and gentle guidance.',
                gradient: 'from-blue-500 via-blue-600 to-blue-700',
                icon: '🎨',
              },
              {
                title: 'Pre-Nursery',
                description: 'Foundation building through play-based learning, exploration, and early social development.',
                gradient: 'from-purple-500 via-purple-600 to-purple-700',
                icon: '🌱',
              },
              {
                title: 'Nursery',
                description: 'Developing essential skills through interactive, engaging activities and creative expression.',
                gradient: 'from-green-500 via-green-600 to-green-700',
                icon: '🎭',
              },
              {
                title: 'Primary',
                description: 'Comprehensive curriculum focusing on academic excellence, character, and critical thinking.',
                gradient: 'from-amber-500 via-amber-600 to-amber-700',
                icon: '📚',
              },
              {
                title: 'Secondary',
                description: 'Advanced academics and leadership training preparing students for future success.',
                gradient: 'from-rose-500 via-rose-600 to-rose-700',
                icon: '🎓',
              },
            ].map((program, index) => (
              <div
                key={index}
                className={`relative overflow-hidden bg-gradient-to-br ${program.gradient} p-5 sm:p-6 rounded-2xl text-white shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 group transform ${
                  visibleSections.has('programs') ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute top-0 right-0 text-6xl sm:text-7xl opacity-10 transform translate-x-4 -translate-y-4 group-hover:scale-110 transition-transform duration-500">
                  {program.icon}
                </div>
                <div className="relative z-10">
                  <div className="text-3xl sm:text-4xl mb-3 sm:mb-4 group-hover:scale-110 transition-transform duration-300">
                    {program.icon}
                  </div>
                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3 font-heading">
                    {program.title}
                  </h3>
                  <p className="text-xs sm:text-sm opacity-95 leading-relaxed">{program.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACADEMIC PROGRAMS AND ACTIVITIES ===== */}
      <section 
        id="activities" 
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
          visibleSections.has('activities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading px-3">
              Academic Programs & Activities
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-3">
              Comprehensive curriculum and enriching extracurricular experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 sm:gap-8">
            {/* Curriculum */}
            <div className={`bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-blue-100 transform ${
              visibleSections.has('activities') ? 'animate-fadeInUp' : 'opacity-0'
            }`}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                <span className="text-4xl sm:text-5xl">📚</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center font-heading">Curriculum</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>English Language & Literature</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Mathematics & Numeracy</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Music & Performing Arts</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Visual Arts & Creativity</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></span>
                  <span>Drama & Expression</span>
                </li>
              </ul>
            </div>

            {/* Extracurriculars */}
            <div className={`bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-green-100 transform ${
              visibleSections.has('activities') ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{ animationDelay: '0.1s' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-green-500 to-green-700 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                <span className="text-4xl sm:text-5xl">🥋</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center font-heading">Extracurriculars</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Taekwondo Training</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Educational Field Trips</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Cultural Excursions</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Sports & Physical Education</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0"></span>
                  <span>Leadership Development</span>
                </li>
              </ul>
            </div>

            {/* Facilities */}
            <div className={`bg-white p-6 sm:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-2 border-purple-100 transform ${
              visibleSections.has('activities') ? 'animate-fadeInUp' : 'opacity-0'
            }`} style={{ animationDelay: '0.2s' }}>
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center mb-4 sm:mb-6 mx-auto shadow-lg">
                <span className="text-4xl sm:text-5xl">🏫</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-3 sm:mb-4 text-center font-heading">Facilities</h3>
              <ul className="space-y-2 sm:space-y-3 text-sm sm:text-base text-gray-700">
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  <span>Secure Outdoor Play Area</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  <span>Purpose-Built Nursery</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  <span>Modern Classrooms</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  <span>Safe & Spacious Grounds</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3">
                  <span className="w-2 h-2 bg-purple-500 rounded-full flex-shrink-0"></span>
                  <span>Child-Friendly Environment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADMISSIONS PROCESS ===== */}
      <section 
        id="admissions" 
        className={`py-16 sm:py-20 lg:py-24 bg-white transition-all duration-1000 ${
          visibleSections.has('admissions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 sm:mb-6 font-heading px-3">
              Simple Admission Process
            </h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-600 max-w-3xl mx-auto px-3">
              Join our community in four easy steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {[
              { 
                title: 'Apply', 
                description: 'Contact us via WhatsApp or email to begin your admission journey and receive guidance.', 
                icon: '📝',
                gradient: 'from-blue-500 to-blue-600'
              },
              { 
                title: 'Submit Documents', 
                description: 'Provide necessary documents and previous academic records for review and verification.', 
                icon: '📄',
                gradient: 'from-purple-500 to-purple-600'
              },
              { 
                title: 'Assessment', 
                description: 'Friendly entrance assessment for age-appropriate placement and skill evaluation.', 
                icon: '✅',
                gradient: 'from-green-500 to-green-600'
              },
              { 
                title: 'Enrollment', 
                description: 'Receive admission letter and complete enrollment process to join our school family.', 
                icon: '🎉',
                gradient: 'from-[#2b2f83] to-[#1f2361]'
              },
            ].map((step, index) => (
              <div
                key={index}
                className={`relative group transform ${
                  visibleSections.has('admissions') ? 'animate-fadeInUp' : 'opacity-0'
                }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div className="bg-white p-5 sm:p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 text-center group-hover:-translate-y-3 border border-gray-100">
                  <div className={`w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br ${step.gradient} rounded-2xl flex items-center justify-center text-3xl sm:text-4xl mx-auto mb-3 sm:mb-4 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-xl`}>
                    {step.icon}
                  </div>
                  <div className="absolute -top-2 sm:-top-3 -right-2 sm:-right-3 w-8 h-8 sm:w-10 sm:h-10 bg-[#2b2f83] text-white rounded-full flex items-center justify-center text-base sm:text-lg font-bold shadow-lg group-hover:scale-125 transition-transform duration-300">
                    {index + 1}
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3 font-heading">{step.title}</h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={openWhatsApp}
              className="bg-[#2b2f83] text-white px-8 sm:px-12 py-4 sm:py-5 rounded-xl text-base sm:text-xl font-bold hover:bg-[#1f2361] transition-all shadow-xl inline-flex items-center space-x-2 sm:space-x-3 group hover:scale-105 transform duration-300"
            >
              <span>Start Your Application</span>
              <svg className="w-5 h-5 sm:w-6 sm:h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== PROPRIETRESS SECTION ===== */}
      <section 
        className={`py-16 sm:py-20 lg:py-24 bg-gradient-to-b from-gray-50 to-white transition-all duration-1000 ${
          visibleSections.has('admissions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}
      >
        <div className="max-w-6xl mx-auto px-3 sm:px-4 lg:px-8">
          <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 rounded-2xl sm:rounded-3xl shadow-2xl overflow-hidden border border-purple-100">
            <div className="grid md:grid-cols-2 gap-6 sm:gap-8 items-center p-6 sm:p-8 lg:p-12">
              <div className="relative group order-2 md:order-1">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 via-pink-200 to-blue-200 rounded-2xl sm:rounded-3xl transform rotate-3 group-hover:rotate-6 transition-transform duration-500"></div>
                <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl">
                  <img 
                    src="shool_head.png" 
                    alt="School Proprietress" 
                    className="w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-transparent"></div>
                </div>
              </div>
              
              <div className="space-y-4 sm:space-y-5 order-1 md:order-2">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 font-heading">
                  Meet Our <span className="text-[#2b2f83]">Proprietress</span>
                </h2>
                <div className="space-y-3 sm:space-y-4 text-gray-700 leading-relaxed text-sm sm:text-base">
                  <p>
                    at concord tutors school, we are dedicated to shaping students who stand out - young minds who take responsibility
                    for their growth, think independently, and uphold discipline with pride.
                  </p>
                  <p>
                    we strive to build culturally aware and globally confident learners, grounded in the values of integrity, loyality
                    , and steady perserverance.
                  </p>
                  <div className="bg-white p-4 sm:p-5 rounded-xl sm:rounded-2xl shadow-lg border-l-4 border-[#2b2f83]">
                    {/* <p className="font-bold text-[#2b2f83] text-base sm:text-lg italic">
                      "Excellence is not just our standard—it's our promise to every family that entrusts us with their children's future and dreams."
                    </p> */}
                    <p className="font-bold text-[#2b2f83] text-base sm:text-lg italic">
                      folake lizzy oyedokun.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-16 sm:py-20 bg-gradient-to-br from-[#2b2f83] via-[#1f2361] to-[#2b2f83] text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-16 left-16 text-6xl sm:text-8xl animate-float">📚</div>
          <div className="absolute bottom-16 right-16 text-6xl sm:text-8xl animate-float" style={{ animationDelay: '1s' }}>🎓</div>
          <div className="absolute top-32 right-32 text-4xl sm:text-6xl animate-float" style={{ animationDelay: '2s' }}>✏️</div>
        </div>
        <div className="relative z-10 max-w-5xl mx-auto px-3 sm:px-4 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6 font-heading px-3">
            Give Your Child the Best Start
          </h2>
          <p className="text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 text-blue-100 max-w-3xl mx-auto px-3">
            Join our community of happy learners and caring families today
          </p>
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 justify-center px-3">
            <button
              onClick={openWhatsApp}
              className="bg-white text-[#2b2f83] px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform duration-300 inline-flex items-center justify-center space-x-2 sm:space-x-3 group"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Contact via WhatsApp</span>
            </button>
            <button
              onClick={openEmail}
              className="bg-transparent border-2 border-white text-white px-8 sm:px-10 py-3 sm:py-4 rounded-xl text-base sm:text-lg font-bold hover:bg-white hover:text-[#2b2f83] transition-all shadow-2xl hover:scale-105 transform duration-300"
            >
              Send Email
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className="bg-[#2b2f83] text-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8">
          {/* Logo and School Name */}
          <div className="text-center mb-10 sm:mb-12">
            <div className="flex items-center justify-center space-x-3 sm:space-x-4 mb-4 sm:mb-6">
              <img src="/logo.png" alt="Concord Tutors School" className="h-16 w-16 sm:h-20 sm:w-20 object-contain" />
              <div className="text-left">
                <h3 className="text-2xl sm:text-3xl font-bold font-heading text-white">Concord Tutors School</h3>
                <p className="text-xs sm:text-sm text-white mt-1 opacity-90">Excellence in Education Since Inception</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-12 mb-10 sm:mb-12">
            {/* About */}
            <div>
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 font-heading border-b-2 border-blue-400 pb-2 inline-block text-white">About Us</h4>
              <p className="text-xs sm:text-sm text-white leading-relaxed opacity-95">
                A government-approved school in Osogbo, Osun State, Nigeria, dedicated to nurturing excellence, 
                building character, and shaping bright futures through quality education and holistic development.
              </p>
            </div>

            {/* Contact Information */}
            <div>
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 font-heading border-b-2 border-blue-400 pb-2 inline-block text-white">Contact Us</h4>
              <ul className="space-y-3 sm:space-y-4 text-xs sm:text-sm text-white">
                <li className="flex items-start gap-2 sm:gap-3 opacity-95">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Osun State, Nigeria</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 opacity-95">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+234 803 531 2904</span>
                </li>
                <li className="flex items-center gap-2 sm:gap-3 opacity-95">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="break-all">concordtutorsnurprysch@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-lg sm:text-xl mb-4 sm:mb-6 font-heading border-b-2 border-blue-400 pb-2 inline-block text-white">Connect With Us</h4>
              <div className="flex gap-3 sm:gap-4 mb-6 sm:mb-8">
                <a href="https://web.facebook.com/people/Concord-Tutors-School/61566890415370/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-800 hover:bg-blue-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg" aria-label="Facebook">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/concordtutorsschool" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-pink-600 hover:bg-pink-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg" aria-label="Instagram">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://wa.me/2348035312904" target="_blank" rel="noopener noreferrer" className="w-10 h-10 sm:w-12 sm:h-12 bg-green-600 hover:bg-green-700 rounded-full flex items-center justify-center transition-all transform hover:scale-110 shadow-lg" aria-label="WhatsApp">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-2 sm:space-y-3 text-white">
                <button
                  onClick={openEmail}
                  className="block w-full text-left text-xs sm:text-sm hover:text-blue-200 transition-colors hover:translate-x-1 transform duration-200 opacity-95"
                >
                  → Contact via Email
                </button>
                <button
                  onClick={openWhatsApp}
                  className="block w-full text-left text-xs sm:text-sm hover:text-blue-200 transition-colors hover:translate-x-1 transform duration-200 opacity-95"
                >
                  → Apply via WhatsApp
                </button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-blue-700 pt-6 sm:pt-8 text-center">
            <p className="text-xs sm:text-sm text-white mb-2 sm:mb-3 opacity-95">
              © {new Date().getFullYear()} Concord Tutors School. All Rights Reserved.
            </p>
            <p className="text-[10px] sm:text-xs text-white opacity-90">
              Government Approved Institution | Osogbo, Osun State, Nigeria
            </p>
            <p className="text-[10px] sm:text-xs text-white mt-2 italic opacity-90">
              Designed with excellence and passion for education
            </p>
          </div>
        </div>
      </footer>

      {/* Animations CSS */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-out forwards;
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(40px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeInLeft {
          animation: fadeInLeft 0.8s ease-out forwards;
        }
        
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(40px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeInRight {
          animation: fadeInRight 0.8s ease-out forwards;
        }
        
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out forwards;
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }

        @keyframes pulse-slow {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }

        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }

        /* Smooth scroll behavior */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 10px;
        }

        ::-webkit-scrollbar-track {
          background: #f1f1f1;
        }

        ::-webkit-scrollbar-thumb {
          background: #2b2f83;
          border-radius: 5px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: #1f2361;
        }

        /* Prevent horizontal scroll */
        body {
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
};

export default Landing;
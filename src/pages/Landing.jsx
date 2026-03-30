import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    document.querySelectorAll('section[id]').forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - offset, behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const openWhatsApp = () => window.open('https://wa.me/2348035312904', '_blank');
  const openEmail = () => { window.location.href = 'mailto:concordtutorsnurprysch@gmail.com'; };

  const navItems = [
    { label: 'Home', id: 'home' },
    { label: 'About', id: 'about' },
    { label: 'Programs', id: 'programs' },
    { label: 'Activities', id: 'activities' },
    { label: 'Admissions', id: 'admissions' },
    { label: 'Contact', id: 'contact' },
  ];

  const strengths = [
    {
      title: 'Conducive Learning Environment',
      description: 'Our state-of-the-art facilities provide a serene, secure, and stimulating atmosphere where students can focus on learning and personal growth.',
      icon: '🏫',
    },
    {
      title: 'Qualified & Experienced Teachers',
      description: 'Our team comprises highly trained educators with years of experience in nurturing young minds with passion and dedication.',
      icon: '👨‍🏫',
    },
    {
      title: 'Montessori Method of Teaching',
      description: 'We implement the renowned Montessori approach that encourages self-directed learning, hands-on activities, and collaborative play.',
      icon: '📖',
    },
    {
      title: 'Excellent Interpersonal Relationships',
      description: 'We maintain strong, supportive relationships among parents, students, and teachers through open communication and mutual respect.',
      icon: '🤝',
    },
  ];

  const educationLevels = [
    'Creche', 'Pre-Nursery', 'Nursery', 'Primary', 'Secondary',
  ];

  return (
    <div className="min-h-screen bg-white font-sans overflow-x-hidden">

      {/* ===== FIXED TOP BAR ===== */}
      <div className="fixed top-0 left-0 right-0 z-[60] bg-[#2b2f83]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-1.5 sm:py-2 gap-2">
            {/* Left: Email + Socials */}
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <a
                href="mailto:concordtutorsnurprysch@gmail.com"
                className="flex items-center gap-1.5 text-white hover:text-blue-200 transition-colors"
              >
                <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
                <span className="text-[10px] sm:text-xs hidden sm:inline">concordtutorsnurprysch@gmail.com</span>
                <span className="text-[10px] sm:hidden">Email</span>
              </a>
              <div className="flex items-center gap-2">
                <a href="https://web.facebook.com/people/Concord-Tutors-School/61566890415370/" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Facebook">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/concordtutorsschool" target="_blank" rel="noopener noreferrer" className="text-white hover:text-blue-200 transition-colors" aria-label="Instagram">
                  <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right: Address — compact on mobile */}
            <div className="flex items-start gap-1 text-white min-w-0">
              <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              <span className="text-[9px] sm:text-[11px] leading-tight text-right sm:text-left">
                <span className="hidden sm:inline">NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Osun State</span>
                <span className="sm:hidden">Osogbo, Osun State, Nigeria</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ===== FIXED NAVBAR ===== */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 border-b border-gray-100 ${
          scrolled ? 'bg-white shadow-lg' : 'bg-white shadow-md'
        }`}
        style={{ top: '32px' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            {/* Logo */}
            <div
              className="flex items-center gap-2 sm:gap-3 cursor-pointer flex-shrink-0"
              onClick={() => scrollToSection('home')}
            >
              <img src="/logo.png" alt="Concord Tutors School" className="h-9 w-9 sm:h-11 sm:w-11 object-contain" />
              <div>
                <span className="text-sm sm:text-base font-bold text-gray-900 block leading-tight">Concord Tutors School</span>
                <span className="text-[10px] text-gray-500 hidden sm:block">Osogbo, Osun State</span>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-5 xl:gap-6">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-sm font-medium text-gray-600 hover:text-[#2b2f83] transition-colors relative group"
                >
                  {item.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-[#2b2f83] transition-all group-hover:w-full rounded-full"></span>
                </button>
              ))}
              <span className="text-[10px] bg-green-50 text-green-700 px-2.5 py-1 rounded-full font-semibold border border-green-200 flex-shrink-0">
                Portal Available
              </span>
              <button
                onClick={openWhatsApp}
                className="bg-[#2b2f83] text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#1f2361] transition-all shadow-sm hover:shadow-md"
              >
                Apply Now
              </button>
              <button
                onClick={() => navigate('/login')}
                className="bg-white text-[#2b2f83] border-2 border-[#2b2f83] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-[#2b2f83] hover:text-white transition-all"
              >
                Login
              </button>
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
          <div className="lg:hidden bg-white border-t border-gray-100 shadow-xl">
            <div className="max-w-7xl mx-auto px-4 py-4 space-y-1 max-h-[60vh] overflow-y-auto">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#2b2f83] rounded-lg transition-colors font-medium"
                >
                  {item.label}
                </button>
              ))}
              <div className="text-[11px] bg-green-50 text-green-700 px-3 py-2 rounded-lg font-semibold text-center border border-green-200 mt-2">
                School Portal Available
              </div>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={openWhatsApp}
                  className="flex-1 bg-[#2b2f83] text-white px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#1f2361] transition-all"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="flex-1 bg-white text-[#2b2f83] border-2 border-[#2b2f83] px-3 py-2.5 rounded-lg text-sm font-semibold hover:bg-[#2b2f83] hover:text-white transition-all"
                >
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ===== HERO SECTION — Full-screen background carousel ===== */}
      <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden" style={{ paddingTop: '78px' }}>
        {/* Background Carousel Images */}
        {carouselImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
          >
            <img
              src={image}
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
        ))}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/55"></div>

        {/* Hero Content — centered */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 sm:py-20">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4 sm:mb-6">
              We Provide Quality Education <br className="hidden sm:block" /> For Your Ward
            </h1>
            <p className="text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto">
              Excellence in Academic Development, Emotional Growth, Moral &amp; Religious Values,
              Socio-Cultural Understanding, and a Serene Learning Environment
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8 sm:mb-10">
              <button
                onClick={openWhatsApp}
                className="bg-[#2b2f83] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-[#1f2361] transition-all shadow-lg"
              >
                Enroll Your Child
              </button>
              <button
                onClick={() => scrollToSection('about')}
                className="bg-white/15 backdrop-blur-sm border border-white/60 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-sm sm:text-base font-semibold hover:bg-white/25 transition-all"
              >
                Explore Our School
              </button>
            </div>

            {/* Education Level Tags */}
            <div className="flex flex-wrap gap-2 justify-center">
              {educationLevels.map((level, index) => (
                <span
                  key={index}
                  className="bg-white/15 backdrop-blur-sm border border-white/30 text-white px-3 py-1 rounded-full text-xs sm:text-sm font-medium"
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ABOUT SECTION ===== */}
      <section
        id="about"
        className={`py-14 sm:py-20 lg:py-24 bg-gray-50 transition-all duration-700 ${
          visibleSections.has('about') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Welcome to <span className="text-[#2b2f83]">Concord Tutors School</span>
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A government-approved institution dedicated to nurturing young minds through excellence in education,
              character development, and holistic growth. We provide a comprehensive school portal where students
              and parents can access results, assignments, attendance records, and all essential academic information in real-time.
            </p>
          </div>

          <h3 className="text-xl sm:text-2xl font-bold text-center text-gray-900 mb-8">Our Strengths</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
            {strengths.map((strength, index) => (
              <div
                key={index}
                className="bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 border border-gray-100"
              >
                <div className="w-12 h-12 bg-[#2b2f83]/10 rounded-xl flex items-center justify-center mb-4">
                  <span className="text-2xl">{strength.icon}</span>
                </div>
                <h4 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{strength.title}</h4>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{strength.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROGRAMS ===== */}
      <section
        id="programs"
        className={`py-14 sm:py-20 lg:py-24 bg-white transition-all duration-700 ${
          visibleSections.has('programs') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Educational Programs
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Comprehensive education from early childhood through secondary school
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-5">
            {[
              { title: 'Creche', description: 'Warm, caring environment for our youngest learners with age-appropriate activities and gentle guidance.', icon: '🎨' },
              { title: 'Pre-Nursery', description: 'Foundation building through play-based learning, exploration, and early social development.', icon: '🌱' },
              { title: 'Nursery', description: 'Developing essential skills through interactive, engaging activities and creative expression.', icon: '🎭' },
              { title: 'Primary', description: 'Comprehensive curriculum focusing on academic excellence, character, and critical thinking.', icon: '📚' },
              { title: 'Secondary', description: 'Advanced academics and leadership training preparing students for future success.', icon: '🎓' },
            ].map((program, index) => (
              <div
                key={index}
                className="bg-[#2b2f83] p-5 sm:p-6 rounded-xl text-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-[#1f2361]"
              >
                <div className="text-2xl sm:text-3xl mb-3">{program.icon}</div>
                <h3 className="text-base sm:text-lg font-bold mb-2">{program.title}</h3>
                <p className="text-xs sm:text-sm text-white/80 leading-relaxed">{program.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ACTIVITIES ===== */}
      <section
        id="activities"
        className={`py-14 sm:py-20 lg:py-24 bg-gray-50 transition-all duration-700 ${
          visibleSections.has('activities') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Academic Programs &amp; Activities
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Comprehensive curriculum and enriching extracurricular experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5 sm:gap-6">
            {[
              {
                title: 'Curriculum',
                icon: '📚',
                color: 'border-[#2b2f83]',
                dot: 'bg-[#2b2f83]',
                items: ['English Language & Literature', 'Mathematics & Numeracy', 'Music & Performing Arts', 'Visual Arts & Creativity', 'Drama & Expression'],
              },
              {
                title: 'Extracurriculars',
                icon: '🥋',
                color: 'border-gray-300',
                dot: 'bg-gray-500',
                items: ['Taekwondo Training', 'Educational Field Trips', 'Cultural Excursions', 'Sports & Physical Education', 'Leadership Development'],
              },
              {
                title: 'Facilities',
                icon: '🏫',
                color: 'border-gray-300',
                dot: 'bg-gray-500',
                items: ['Secure Outdoor Play Area', 'Purpose-Built Nursery', 'Modern Classrooms', 'Safe & Spacious Grounds', 'Child-Friendly Environment'],
              },
            ].map((card, index) => (
              <div key={index} className={`bg-white p-6 sm:p-7 rounded-xl shadow-sm hover:shadow-md transition-all border-t-4 ${card.color}`}>
                <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">{card.icon}</span>
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-4 text-center">{card.title}</h3>
                <ul className="space-y-2.5">
                  {card.items.map((item, i) => (
                    <li key={i} className="flex items-center gap-2.5 text-sm text-gray-700">
                      <span className={`w-1.5 h-1.5 ${card.dot} rounded-full flex-shrink-0`}></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== ADMISSIONS ===== */}
      <section
        id="admissions"
        className={`py-14 sm:py-20 lg:py-24 bg-white transition-all duration-700 ${
          visibleSections.has('admissions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Simple Admission Process
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-2xl mx-auto">
              Join our community in four easy steps
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-10 sm:mb-12">
            {[
              { title: 'Apply', description: 'Contact us via WhatsApp or email to begin your admission journey and receive guidance.', icon: '📝' },
              { title: 'Submit Documents', description: 'Provide necessary documents and previous academic records for review and verification.', icon: '📄' },
              { title: 'Assessment', description: 'Friendly entrance assessment for age-appropriate placement and skill evaluation.', icon: '✅' },
              { title: 'Enrollment', description: 'Receive admission letter and complete enrollment process to join our school family.', icon: '🎉' },
            ].map((step, index) => (
              <div key={index} className="relative bg-white p-5 sm:p-6 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 text-center">
                <div className="absolute -top-3 -right-3 w-7 h-7 bg-[#2b2f83] text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                  {index + 1}
                </div>
                <div className="w-12 h-12 bg-[#2b2f83]/8 rounded-xl flex items-center justify-center text-2xl mx-auto mb-3">
                  {step.icon}
                </div>
                <h3 className="text-sm sm:text-base font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={openWhatsApp}
              className="bg-[#2b2f83] text-white px-8 sm:px-10 py-3 sm:py-3.5 rounded-xl text-sm sm:text-base font-bold hover:bg-[#1f2361] transition-all shadow-lg inline-flex items-center gap-2"
            >
              <span>Start Your Application</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      {/* ===== PROPRIETRESS SECTION ===== */}
      <section
        className={`py-14 sm:py-20 lg:py-24 bg-gray-50 transition-all duration-700 ${
          visibleSections.has('admissions') ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100">
            <div className="grid md:grid-cols-2 gap-0">
              {/* Image side */}
              <div className="relative bg-gray-100 min-h-[280px] sm:min-h-[360px] md:min-h-0">
                <img
                  src="shool_head.png"
                  alt="School Proprietress"
                  className="w-full h-full object-cover object-top"
                  style={{ minHeight: '280px' }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent"></div>
              </div>

              {/* Text side */}
              <div className="p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
                <p className="text-xs font-semibold text-[#2b2f83] uppercase tracking-wider mb-2">Leadership</p>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-4 sm:mb-5">
                  Meet Our <span className="text-[#2b2f83]">Proprietress</span>
                </h2>
                <div className="space-y-3 text-gray-600 text-sm sm:text-base leading-relaxed">
                  <p>
                    At Concord Tutors School, we are dedicated to shaping students who stand out — young minds who take responsibility
                    for their growth, think independently, and uphold discipline with pride.
                  </p>
                  <p>
                    We strive to build culturally aware and globally confident learners, grounded in the values of integrity, loyalty,
                    and steady perseverance.
                  </p>
                </div>
                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="font-bold text-[#2b2f83] text-sm sm:text-base italic">Folake Lizzy Oyedokun</p>
                  <p className="text-xs text-gray-500 mt-0.5">Proprietress, Concord Tutors School</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="py-14 sm:py-20 bg-[#2b2f83] text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-4">
            Give Your Child the Best Start
          </h2>
          <p className="text-sm sm:text-base text-white/80 mb-8 max-w-2xl mx-auto">
            Join our community of happy learners and caring families today
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={openWhatsApp}
              className="bg-white text-[#2b2f83] px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-gray-100 transition-all shadow-lg inline-flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              <span>Contact via WhatsApp</span>
            </button>
            <button
              onClick={openEmail}
              className="bg-transparent border-2 border-white/70 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-xl text-sm sm:text-base font-bold hover:bg-white hover:text-[#2b2f83] transition-all"
            >
              Send Email
            </button>
          </div>
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer id="contact" className="bg-[#1a1e5e] text-white py-12 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo */}
          <div className="text-center mb-8 sm:mb-10">
            <div className="flex items-center justify-center gap-3 mb-3">
              <img src="/logo.png" alt="Concord Tutors School" className="h-12 w-12 sm:h-14 sm:w-14 object-contain" />
              <div className="text-left">
                <h3 className="text-lg sm:text-xl font-bold text-white">Concord Tutors School</h3>
                <p className="text-xs text-white/60">Excellence in Education Since Inception</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-10">
            {/* About */}
            <div>
              <h4 className="font-bold text-sm sm:text-base mb-4 text-white border-b border-white/20 pb-2">About Us</h4>
              <p className="text-xs sm:text-sm text-white/70 leading-relaxed">
                A government-approved school in Osogbo, Osun State, Nigeria, dedicated to nurturing excellence,
                building character, and shaping bright futures through quality education and holistic development.
              </p>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-sm sm:text-base mb-4 text-white border-b border-white/20 pb-2">Contact Us</h4>
              <ul className="space-y-3 text-xs sm:text-sm text-white/70">
                <li className="flex items-start gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  <span>NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Osun State, Nigeria</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                  <span>+234 803 531 2904</span>
                </li>
                <li className="flex items-center gap-2">
                  <svg className="w-3.5 h-3.5 flex-shrink-0 text-white/50" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                  <span className="break-all">concordtutorsnurprysch@gmail.com</span>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h4 className="font-bold text-sm sm:text-base mb-4 text-white border-b border-white/20 pb-2">Connect With Us</h4>
              <div className="flex gap-2.5 mb-5">
                <a href="https://web.facebook.com/people/Concord-Tutors-School/61566890415370/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Facebook">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="https://www.instagram.com/concordtutorsschool" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="Instagram">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
                <a href="https://wa.me/2348035312904" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-colors" aria-label="WhatsApp">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
              <div className="space-y-2 text-white/70 text-xs sm:text-sm">
                <button onClick={openEmail} className="block hover:text-white transition-colors">→ Contact via Email</button>
                <button onClick={openWhatsApp} className="block hover:text-white transition-colors">→ Apply via WhatsApp</button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="border-t border-white/10 pt-6 text-center">
            <p className="text-xs text-white/50 mb-1">© {new Date().getFullYear()} Concord Tutors School. All Rights Reserved.</p>
            <p className="text-[10px] text-white/40">Government Approved Institution | Osogbo, Osun State, Nigeria</p>
          </div>
        </div>
      </footer>

      <style>{`
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #2b2f83; border-radius: 4px; }
        ::-webkit-scrollbar-thumb:hover { background: #1f2361; }
      `}</style>
    </div>
  );
};

export default Landing;


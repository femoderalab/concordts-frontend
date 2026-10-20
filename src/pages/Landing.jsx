import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/* ---------- Constants ---------- */
const WHATSAPP_URL = 'https://wa.me/2348035312904';
const EMAIL = 'concordtutorsnurprysch@gmail.com';
const FACEBOOK_URL = 'https://web.facebook.com/people/Concord-Tutors-School/61566890415370/';
const INSTAGRAM_URL = 'https://www.instagram.com/concordtutorsschool';

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

const navItems = [
  { label: 'Home', id: 'home' },
  { label: 'About', id: 'about' },
  { label: 'Programs', id: 'programs' },
  { label: 'Activities', id: 'activities' },
  { label: 'Admissions', id: 'admissions' },
  { label: 'Contact', id: 'contact' },
];

/* Mobile menu excludes Home */
const mobileNavItems = navItems.filter((item) => item.id !== 'home');

const educationLevels = ['Creche', 'Pre-Nursery', 'Nursery', 'Primary', 'Secondary'];

const strengths = [
  {
    title: 'Conducive Learning Environment',
    description:
      'Our state-of-the-art facilities provide a serene, secure, and stimulating atmosphere where students can focus on learning and personal growth.',
  },
  {
    title: 'Qualified & Experienced Teachers',
    description:
      'Our team comprises highly trained educators with years of experience in nurturing young minds with passion and dedication.',
  },
  {
    title: 'Montessori Method of Teaching',
    description:
      'We implement the renowned Montessori approach that encourages self-directed learning, hands-on activities, and collaborative play.',
  },
  {
    title: 'Excellent Interpersonal Relationships',
    description:
      'We maintain strong, supportive relationships among parents, students, and teachers through open communication and mutual respect.',
  },
];

const portalFeatures = ['Results', 'Assignments', 'Attendance records', 'Essential academic information'];

const programs = [
  { title: 'Creche', description: 'Warm, caring environment for our youngest learners with age-appropriate activities and gentle guidance.' },
  { title: 'Pre-Nursery', description: 'Foundation building through play-based learning, exploration, and early social development.' },
  { title: 'Nursery', description: 'Developing essential skills through interactive, engaging activities and creative expression.' },
  { title: 'Primary', description: 'Comprehensive curriculum focusing on academic excellence, character, and critical thinking.' },
  { title: 'Secondary', description: 'Advanced academics and leadership training preparing students for future success.' },
];

const activityColumns = [
  {
    title: 'Curriculum',
    items: ['English Language & Literature', 'Mathematics & Numeracy', 'Music & Performing Arts', 'Visual Arts & Creativity', 'Drama & Expression'],
  },
  {
    title: 'Extracurriculars',
    items: ['Taekwondo Training', 'Educational Field Trips', 'Cultural Excursions', 'Sports & Physical Education', 'Leadership Development'],
  },
  {
    title: 'Facilities',
    items: ['Secure Outdoor Play Area', 'Purpose-Built Nursery', 'Modern Classrooms', 'Safe & Spacious Grounds', 'Child-Friendly Environment'],
  },
];

const admissionSteps = [
  { title: 'Apply', description: 'Contact us via WhatsApp or email to begin your admission journey and receive guidance.' },
  { title: 'Submit Documents', description: 'Provide necessary documents and previous academic records for review and verification.' },
  { title: 'Assessment', description: 'Friendly entrance assessment for age-appropriate placement and skill evaluation.' },
  { title: 'Enrollment', description: 'Receive admission letter and complete enrollment process to join our school family.' },
];

const keyFacts = [
  { value: 'Government Approved', label: 'Institution in Osogbo' },
  { value: 'Creche to Secondary', label: 'Five levels of learning' },
  { value: 'Montessori Method', label: 'Hands-on, self-directed' },
  { value: 'School Portal', label: 'Results and records online' },
];

/* ---------- Small icon components ---------- */
const MailIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
  </svg>
);

const PinIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
  </svg>
);

const PhoneIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
  </svg>
);

const FacebookIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

const InstagramIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
  </svg>
);

const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
  </svg>
);

const ArrowIcon = ({ className = 'w-4 h-4', dir = 'right' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d={dir === 'right' ? 'M13 7l5 5m0 0l-5 5m5-5H6' : 'M11 17l-5-5m0 0l5-5m-5 5h12'}
    />
  </svg>
);

/* ---------- Page ---------- */
const Landing = () => {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [visibleSections, setVisibleSections] = useState(new Set());

  /* Scroll state */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  /* Fade sections in as they enter the screen */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set([...prev, entry.target.id]));
          }
        });
      },
      { threshold: 0.08, rootMargin: '0px 0px -80px 0px' }
    );
    document.querySelectorAll('section[id]').forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  /* Hero carousel */
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselImages.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  /* Mobile menu: lock scroll, close with Escape */
  useEffect(() => {
    document.body.style.overflow = mobileMenuOpen ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setMobileMenuOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setMobileMenuOpen(false);
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', onResize);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
    };
  }, [mobileMenuOpen]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 76;
      const top = element.getBoundingClientRect().top + window.pageYOffset - (id === 'home' ? 0 : offset);
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  const openWhatsApp = () => window.open(WHATSAPP_URL, '_blank', 'noopener,noreferrer');
  const openEmail = () => {
    window.location.href = `mailto:${EMAIL}`;
  };
  const goLogin = () => {
    setMobileMenuOpen(false);
    navigate('/login');
  };

  const fade = (id) => (visibleSections.has(id) ? 'opacity-100' : 'opacity-0');

  return (
    <div className="min-h-screen overflow-x-hidden bg-white font-sans text-gray-800">
      {/* =====================================================
          HEADER: slim info bar + main navigation
      ====================================================== */}
      <header className="fixed inset-x-0 top-0 z-50">
        {/* Info bar: slides away once you scroll */}
        <div
          className={`overflow-hidden bg-[#1a1e5e] text-white transition-all duration-300 ${
            scrolled ? 'max-h-0' : 'max-h-10'
          }`}
        >
          <div className="mx-auto flex h-9 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                className="flex items-center gap-2 text-[11px] text-white/80 transition-colors hover:text-white sm:text-xs"
              >
                <MailIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden sm:inline">{EMAIL}</span>
                <span className="sm:hidden">Email us</span>
              </a>
              <span className="hidden h-3 w-px bg-white/25 md:block" />
              <div className="hidden items-center gap-2 text-xs text-white/80 md:flex">
                <PhoneIcon className="h-3.5 w-3.5" />
                +234 803 531 2904
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-4">
              <div className="flex min-w-0 items-center gap-2 text-[11px] text-white/80 sm:text-xs">
                <PinIcon className="h-3.5 w-3.5 shrink-0" />
                <span className="hidden truncate lg:inline">
                  NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Osun State
                </span>
                <span className="truncate lg:hidden">Osogbo, Osun State</span>
              </div>
              <span className="hidden h-3 w-px bg-white/25 sm:block" />
              <div className="hidden items-center gap-3 sm:flex">
                <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-white/80 transition-colors hover:text-white">
                  <FacebookIcon className="h-3.5 w-3.5" />
                </a>
                <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/80 transition-colors hover:text-white">
                  <InstagramIcon className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Main bar */}
        <nav
          aria-label="Main"
          className={`border-b bg-white transition-colors duration-300 ${
            scrolled ? 'border-gray-200' : 'border-gray-100'
          }`}
        >
          <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
            {/* Brand */}
            <button
              type="button"
              onClick={() => scrollToSection('home')}
              className="flex items-center gap-3 text-left"
              aria-label="Concord Tutors School, back to top"
            >
              <img src="/logo.png" alt="" className="h-10 w-10 object-contain sm:h-11 sm:w-11" />
              <span className="leading-tight">
                <span className="font-display block text-[15px] font-bold text-[#2b2f83] sm:text-base">
                  Concord Tutors School
                </span>
              </span>
            </button>

            {/* Desktop links — simple hover only, no scroll indicator */}
            <div className="hidden h-full items-stretch gap-8 lg:flex">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="relative flex items-center text-[13px] font-medium text-gray-600 transition-colors hover:text-[#2b2f83]"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Desktop actions */}
            <div className="hidden items-center gap-3 lg:flex">
              <button
                type="button"
                onClick={goLogin}
                className="h-10 border border-[#2b2f83] px-5 text-[13px] font-semibold text-[#2b2f83] transition-colors hover:bg-[#2b2f83]/10"
              >
                Login
              </button>
              <button
                type="button"
                onClick={openWhatsApp}
                className="h-10 bg-[#2b2f83] px-5 text-[13px] font-semibold text-white transition-colors hover:bg-[#1f2361]"
              >
                Apply Now
              </button>
            </div>

            {/* Mobile toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              className="-mr-2 flex h-11 w-11 items-center justify-center text-[#2b2f83] transition-colors hover:bg-gray-100 lg:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 7h16M4 12h16M4 17h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile panel */}
          {mobileMenuOpen && (
            <div className="max-h-[calc(100dvh-68px)] overflow-y-auto border-t border-gray-200 bg-white lg:hidden">
              <div className="mx-auto max-w-7xl px-4 pb-6 pt-2 sm:px-6">
                <ul>
                  {mobileNavItems.map((item) => (
                    <li key={item.id} className="border-b border-gray-100">
                      <button
                        type="button"
                        onClick={() => scrollToSection(item.id)}
                        className="flex min-h-[54px] w-full items-center text-left text-[15px] font-medium text-gray-700 transition-colors hover:text-[#2b2f83]"
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={goLogin}
                    className="h-12 border border-[#2b2f83] text-sm font-semibold text-[#2b2f83] transition-colors hover:bg-[#2b2f83]/10"
                  >
                    Login
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      openWhatsApp();
                    }}
                    className="h-12 bg-[#2b2f83] text-sm font-semibold text-white transition-colors hover:bg-[#1f2361]"
                  >
                    Apply Now
                  </button>
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      {/* =====================================================
          HERO: full-screen background carousel (kept)
      ====================================================== */}
      <section id="home" className="relative flex min-h-screen flex-col overflow-hidden">
        {/* Background carousel */}
        {carouselImages.map((image, index) => (
          <div
            key={image}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: index === currentSlide ? 1 : 0 }}
            aria-hidden="true"
          >
            <img src={image} alt="" className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/55" />

        {/* Content, left-aligned */}
        <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-1 items-center px-4 pb-16 pt-[150px] sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h1 className="font-display text-[32px] font-bold leading-[1.2] text-white sm:text-5xl lg:text-[56px] lg:leading-[1.15]">
              We Provide Quality Education <br className="hidden sm:block" /> For Your Ward
            </h1>
            <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-white/90 sm:text-lg">
              Excellence in Academic Development, Emotional Growth, Moral &amp; Religious Values,
              Socio-Cultural Understanding, and a Serene Learning Environment
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <button
                type="button"
                onClick={openWhatsApp}
                className="h-12 bg-[#2b2f83] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#1f2361] sm:text-[15px]"
              >
                Enroll Your Child
              </button>
              <button
                type="button"
                onClick={() => scrollToSection('about')}
                className="h-12 border border-white/70 px-8 text-sm font-semibold text-white transition-colors hover:bg-white/15 sm:text-[15px]"
              >
                Explore Our School
              </button>
            </div>
          </div>
        </div>

        {/* Bottom strip: school levels only */}
        <div className="relative z-10 border-t border-white/25 bg-black/30">
          <div className="mx-auto flex max-w-7xl items-center px-4 py-4 sm:px-6 lg:px-8">
            <ul className="flex flex-wrap items-center gap-x-6 gap-y-2">
              {educationLevels.map((level) => (
                <li key={level} className="text-xs font-medium text-white/90 sm:text-sm">
                  {level}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* =====================================================
          KEY FACTS BAND
      ====================================================== */}
      <div className="bg-[#2b2f83] text-white">
        <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
          {keyFacts.map((fact, i) => (
            <div
              key={fact.value}
              className={`px-4 py-6 sm:px-6 lg:px-8 lg:py-8 ${
                i % 2 === 1 ? 'border-l border-white/15' : ''
              } ${i > 1 ? 'border-t border-white/15 lg:border-t-0' : ''} ${
                i > 0 ? 'lg:border-l lg:border-white/15' : ''
              }`}
            >
              <p className="font-display text-sm font-bold sm:text-base">{fact.value}</p>
              <p className="mt-1 text-xs text-white/70 sm:text-[13px]">{fact.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* =====================================================
          ABOUT
      ====================================================== */}
      <section
        id="about"
        className={`bg-white py-16 transition-opacity duration-700 sm:py-20 lg:py-28 ${fade('about')}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left column: heading + image */}
            <div className="lg:col-span-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2f83]">About the School</p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Welcome to <span className="text-[#2b2f83]">Concord Tutors School</span>
              </h2>
              <div className="mt-6 h-[3px] w-12 bg-[#2b2f83]" />

              {/* Image under the heading */}
              <div className="mt-8 overflow-hidden">
                <img
                  src="/IMG-20260120-WA0022.jpg"
                  alt="Students of Concord Tutors School"
                  className="aspect-[4/3] w-full object-cover"
                />
              </div>
            </div>

            {/* Right column: text + portal card */}
            <div className="lg:col-span-7 lg:pt-4">
              <p className="text-base leading-8 text-gray-600 sm:text-[17px]">
                A government-approved institution dedicated to nurturing young minds through excellence in education,
                character development, and holistic growth. We provide a comprehensive school portal where students
                and parents can access results, assignments, attendance records, and all essential academic information in real-time.
              </p>

              <div className="mt-8 border border-gray-200 bg-gray-50 p-6 sm:p-7">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="font-display text-lg font-bold text-gray-900">The School Portal</p>
                    <ul className="mt-3 grid gap-x-8 gap-y-2 text-sm text-gray-700 sm:grid-cols-2">
                      {portalFeatures.map((f) => (
                        <li key={f} className="flex items-center gap-2.5">
                          <span className="h-px w-3 bg-[#2b2f83]" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button
                    type="button"
                    onClick={goLogin}
                    className="h-11 shrink-0 bg-[#2b2f83] px-6 text-sm font-semibold text-white transition-colors hover:bg-[#1f2361]"
                  >
                    Portal Login
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Strengths */}
          <div className="mt-16 sm:mt-20">
            <h3 className="font-display text-2xl font-bold text-gray-900">Our Strengths</h3>
            <div className="mt-8 grid gap-x-12 border-t border-gray-300 sm:grid-cols-2">
              {strengths.map((s, i) => (
                <div key={s.title} className="flex gap-5 border-b border-gray-200 py-7 sm:py-8">
                  <span className="font-display text-2xl font-bold text-[#2b2f83]/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h4 className="font-display text-base font-bold text-gray-900 sm:text-lg">{s.title}</h4>
                    <p className="mt-2 text-sm leading-7 text-gray-600">{s.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROGRAMS
      ====================================================== */}
      <section
        id="programs"
        className={`bg-gray-50 py-16 transition-opacity duration-700 sm:py-20 lg:py-28 ${fade('programs')}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            {/* Left column: heading + image */}
            <div className="lg:col-span-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2f83]">Programs</p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Our Educational Programs
              </h2>
              <p className="mt-5 text-base leading-7 text-gray-600">
                Comprehensive education from early childhood through secondary school
              </p>

              {/* Image under the intro text */}
              <div className="mt-8 overflow-hidden">
                <img
                  src="/school_girl.png"
                  alt="A student of Concord Tutors School"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
              </div>
            </div>

            <div className="lg:col-span-8">
              <ul className="border-t border-gray-300">
                {programs.map((p, i) => (
                  <li
                    key={p.title}
                    className="grid gap-2 border-b border-gray-200 px-2 py-6 transition-colors hover:bg-white sm:grid-cols-[56px_200px_1fr] sm:items-baseline sm:gap-6 sm:px-4 sm:py-7"
                  >
                    <span className="font-display text-sm font-bold text-[#2b2f83]/50">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-display text-xl font-bold text-[#2b2f83]">{p.title}</h3>
                    <p className="text-sm leading-7 text-gray-600 sm:text-[15px]">{p.description}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          ACTIVITIES
      ====================================================== */}
      <section
        id="activities"
        className={`bg-white py-16 transition-opacity duration-700 sm:py-20 lg:py-28 ${fade('activities')}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2f83]">School Life</p>
            <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
              Academic Programs &amp; Activities
            </h2>
            <p className="mt-5 text-base leading-7 text-gray-600">
              Comprehensive curriculum and enriching extracurricular experiences
            </p>
          </div>

          <div className="mt-12 grid gap-10 md:grid-cols-3 md:gap-0">
            {activityColumns.map((col, i) => (
              <div
                key={col.title}
                className={`md:px-8 ${i === 0 ? 'md:pl-0' : 'md:border-l md:border-gray-200'} ${
                  i === activityColumns.length - 1 ? 'md:pr-0' : ''
                }`}
              >
                <div className="border-t-[3px] border-[#2b2f83] pt-5">
                  <h3 className="font-display text-xl font-bold text-gray-900">{col.title}</h3>
                  <ul className="mt-5 divide-y divide-gray-100">
                    {col.items.map((item) => (
                      <li key={item} className="flex items-center gap-3 py-3 text-sm text-gray-700">
                        <span className="h-px w-3 shrink-0 bg-[#2b2f83]" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          ADMISSIONS  (all text white)
      ====================================================== */}
      <section
        id="admissions"
        className={`bg-[#2b2f83] py-16 text-white transition-opacity duration-700 sm:py-20 lg:py-28 ${fade('admissions')}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/80">Admissions</p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
                Simple Admission Process
              </h2>
              <p className="mt-5 text-base leading-7 text-white/85">Join our community in four easy steps</p>
            </div>
            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex h-12 shrink-0 items-center justify-center gap-3 bg-white px-8 text-sm font-semibold text-[#2b2f83] transition-colors hover:bg-gray-200"
            >
              Start Your Application
              <ArrowIcon />
            </button>
          </div>

          <ol className="mt-14 grid gap-0 border-t border-white/30 sm:grid-cols-2 lg:grid-cols-4">
            {admissionSteps.map((step, i) => (
              <li
                key={step.title}
                className={`border-b border-white/15 py-8 sm:px-6 lg:border-b-0 lg:py-8 ${
                  i === 0 ? 'sm:pl-0' : ''
                } ${i % 2 === 1 ? 'sm:border-l sm:border-white/15' : ''} lg:border-l lg:border-white/15 ${
                  i === 0 ? 'lg:border-l-0' : ''
                }`}
              >
                <span className="font-display text-4xl font-bold text-white/30">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <h3 className="font-display mt-4 text-lg font-bold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/85">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* =====================================================
          PROPRIETRESS
      ====================================================== */}
      <section
        id="leadership"
        className={`bg-white py-16 transition-opacity duration-700 sm:py-20 lg:py-28 ${fade('leadership')}`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <div className="relative">
                <img
                  src="/shool_head.png"
                  alt="Folake Lizzy Oyedokun, Proprietress of Concord Tutors School"
                  className="aspect-[4/5] w-full object-cover object-top"
                />
                <div className="absolute -bottom-3 -right-3 -z-10 hidden h-full w-full border border-[#2b2f83]/40 sm:block" />
              </div>
            </div>

            <div className="lg:col-span-7">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2b2f83]">Leadership</p>
              <h2 className="font-display mt-4 text-3xl font-bold leading-tight text-gray-900 sm:text-4xl">
                Meet Our <span className="text-[#2b2f83]">Proprietress</span>
              </h2>
              <div className="mt-6 h-[3px] w-12 bg-[#2b2f83]" />

              <div className="mt-8 space-y-5 text-base leading-8 text-gray-600 sm:text-[17px]">
                <p>
                  At Concord Tutors School, we are dedicated to shaping students who stand out — young minds who take
                  responsibility for their growth, think independently, and uphold discipline with pride.
                </p>
                <p>
                  We strive to build culturally aware and globally confident learners, grounded in the values of
                  integrity, loyalty, and steady perseverance.
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-6">
                <p className="font-display text-lg font-bold italic text-[#2b2f83]">Folake Lizzy Oyedokun</p>
                <p className="mt-1 text-sm text-gray-500">Proprietress, Concord Tutors School</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CALL TO ACTION
      ====================================================== */}
      <section className="border-y border-gray-200 bg-gray-50 py-14 sm:py-16">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div className="max-w-2xl">
            <h2 className="font-display text-2xl font-bold leading-tight text-gray-900 sm:text-3xl">
              Give Your Child the Best Start
            </h2>
            <p className="mt-3 text-base leading-7 text-gray-600">
              Join our community of happy learners and caring families today
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={openWhatsApp}
              className="inline-flex h-12 items-center justify-center gap-2.5 bg-[#2b2f83] px-7 text-sm font-semibold text-white transition-colors hover:bg-[#1f2361]"
            >
              <WhatsAppIcon className="h-4 w-4" />
              Contact via WhatsApp
            </button>
            <button
              type="button"
              onClick={openEmail}
              className="inline-flex h-12 items-center justify-center border border-[#2b2f83] px-7 text-sm font-semibold text-[#2b2f83] transition-colors hover:bg-[#2b2f83]/10"
            >
              Send Email
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}
      <footer id="contact" className="bg-[#1a1e5e] text-white">
        <div className="mx-auto max-w-7xl px-4 pb-8 pt-14 sm:px-6 sm:pt-16 lg:px-8">
          <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-12 lg:gap-10">
            {/* Brand */}
            <div className="lg:col-span-5">
              <div className="flex items-center gap-3">
                <img src="/logo.png" alt="" className="h-12 w-12 object-contain" />
                <div className="leading-tight">
                  <p className="font-display text-lg font-bold">Concord Tutors School</p>
                  <p className="mt-1 text-xs text-white/60">Excellence in Education Since Inception</p>
                </div>
              </div>
              <p className="mt-6 max-w-sm text-sm leading-7 text-white/70">
                A government-approved school in Osogbo, Osun State, Nigeria, dedicated to nurturing excellence,
                building character, and shaping bright futures through quality education and holistic development.
              </p>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h4 className="font-display border-b border-white/20 pb-3 text-sm font-bold">Contact Us</h4>
              <ul className="mt-4 space-y-4 text-sm text-white/70">
                <li className="flex items-start gap-3">
                  <PinIcon className="mt-1 h-4 w-4 shrink-0 text-white/50" />
                  <span>NO 31, Adeagbo Yayi Street, Zone 4, Behind Capital Hotel, Osogbo, Osun State, Nigeria</span>
                </li>
                <li className="flex items-center gap-3">
                  <PhoneIcon className="h-4 w-4 shrink-0 text-white/50" />
                  <a href="tel:+2348035312904" className="transition-colors hover:text-white">
                    +234 803 531 2904
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <MailIcon className="h-4 w-4 shrink-0 text-white/50" />
                  <a href={`mailto:${EMAIL}`} className="break-all transition-colors hover:text-white">
                    {EMAIL}
                  </a>
                </li>
              </ul>
            </div>

            {/* Connect */}
            <div className="lg:col-span-3">
              <h4 className="font-display border-b border-white/20 pb-3 text-sm font-bold">Connect With Us</h4>
              <div className="mt-4 flex gap-2.5">
                <a
                  href={FACEBOOK_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <FacebookIcon />
                </a>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <InstagramIcon />
                </a>
                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-10 w-10 items-center justify-center border border-white/25 text-white/80 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <WhatsAppIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-12 flex flex-col gap-3 border-t border-white/15 pt-6 text-center text-xs text-white/55 md:flex-row md:items-center md:justify-between md:text-left">
            <p>© {new Date().getFullYear()} Concord Tutors School. All Rights Reserved.</p>
            <p>Government Approved Institution | Osogbo, Osun State, Nigeria</p>
          </div>
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400;1,700&display=swap');
        html { scroll-behavior: smooth; }
        body { overflow-x: hidden; }
        .font-display { font-family: 'Libre Baskerville', Georgia, 'Times New Roman', serif; }
        ::-webkit-scrollbar { width: 8px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; }
        ::-webkit-scrollbar-thumb { background: #2b2f83; }
        ::-webkit-scrollbar-thumb:hover { background: #1f2361; }
        @media (prefers-reduced-motion: reduce) {
          html { scroll-behavior: auto; }
        }
      `}</style>
    </div>
  );
};

export default Landing;
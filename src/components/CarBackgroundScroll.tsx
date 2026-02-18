import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const carImages = {
  exterior: '/images/car-exterior.png',
  hood: '/images/car-hood-open.png',
  engine: '/images/car-engine.png',
  interior: '/images/car-interior.png',
  brakes: '/images/car-brakes.png',
};

export function CarBackgroundScroll() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRefs = useRef<Record<string, HTMLImageElement | null>>({});

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const triggers: ScrollTrigger[] = [];

    // Get all sections
    const heroSection = document.getElementById('hero-section');
    const categoriesSection = document.getElementById('categorias');
    const featuredSection = document.getElementById('featured-section');
    const howItWorksSection = document.getElementById('how-it-works');
    const ctaSection = document.getElementById('cta-section');

    // Helper to set active image
    const setActiveImage = (activeKey: string) => {
      Object.keys(imageRefs.current).forEach((key) => {
        const img = imageRefs.current[key];
        if (img) {
          gsap.to(img, {
            opacity: key === activeKey ? 1 : 0,
            scale: key === activeKey ? 1 : 1.1,
            duration: 0.8,
            ease: 'power2.inOut',
          });
        }
      });
    };

    // Hero section - exterior
    if (heroSection) {
      const trigger = ScrollTrigger.create({
        trigger: heroSection,
        start: 'top top',
        end: 'bottom top',
        onEnter: () => setActiveImage('exterior'),
        onEnterBack: () => setActiveImage('exterior'),
      });
      triggers.push(trigger);
    }

    // Categories section - hood open
    if (categoriesSection) {
      const trigger = ScrollTrigger.create({
        trigger: categoriesSection,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => setActiveImage('hood'),
        onEnterBack: () => setActiveImage('hood'),
      });
      triggers.push(trigger);
    }

    // Featured section - engine
    if (featuredSection) {
      const trigger = ScrollTrigger.create({
        trigger: featuredSection,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => setActiveImage('engine'),
        onEnterBack: () => setActiveImage('engine'),
      });
      triggers.push(trigger);
    }

    // How it works section - interior
    if (howItWorksSection) {
      const trigger = ScrollTrigger.create({
        trigger: howItWorksSection,
        start: 'top 80%',
        end: 'bottom top',
        onEnter: () => setActiveImage('interior'),
        onEnterBack: () => setActiveImage('interior'),
      });
      triggers.push(trigger);
    }

    // CTA section - brakes
    if (ctaSection) {
      const trigger = ScrollTrigger.create({
        trigger: ctaSection,
        start: 'top 80%',
        end: 'bottom bottom',
        onEnter: () => setActiveImage('brakes'),
        onEnterBack: () => setActiveImage('brakes'),
      });
      triggers.push(trigger);
    }

    // Set initial image
    setActiveImage('exterior');

    return () => {
      triggers.forEach((trigger) => trigger.kill());
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-0 pointer-events-none"
      style={{ willChange: 'transform' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 bg-[#0a0a0a]" />
      <div className="absolute inset-0 bg-grid opacity-30" />
      <div className="absolute inset-0 radial-glow" />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-[120px] animate-pulse" />
      <div
        className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-red-800/10 rounded-full blur-[100px] animate-pulse"
        style={{ animationDelay: '1s' }}
      />

      {/* Car images stack */}
      <div className="absolute inset-0 flex items-center justify-center">
        {Object.entries(carImages).map(([key, src]) => (
          <img
            key={key}
            ref={(el) => {
              imageRefs.current[key] = el;
            }}
            src={src}
            alt={`Car ${key}`}
            className="absolute max-w-[90%] max-h-[80vh] object-contain transition-all duration-700"
            style={{
              opacity: key === 'exterior' ? 1 : 0,
              transform: `scale(${key === 'exterior' ? 1 : 1.1})`,
              filter: 'drop-shadow(0 0 60px rgba(255, 0, 0, 0.25))',
            }}
          />
        ))}
      </div>

      {/* Vignette overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.4) 100%)',
        }}
      />
    </div>
  );
}

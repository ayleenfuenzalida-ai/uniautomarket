import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

gsap.registerPlugin(ScrollTrigger);

const scrollImages = [
  { src: '/images/scroll/car-front.jpg', label: 'FRONTAL' },
  { src: '/images/scroll/car-hood-open.jpg', label: 'CAPOT' },
  { src: '/images/scroll/car-engine.jpg', label: 'MOTOR' },
  { src: '/images/scroll/car-interior.jpg', label: 'INTERIOR' },
  { src: '/images/scroll/car-wheel.jpg', label: 'RUEDA' },
];

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imagesRef = useRef<(HTMLDivElement | null)[]>([]);
  const progressRef = useRef<HTMLDivElement>(null);
  const labelsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Progress bar animation
      gsap.to(progressRef.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.5,
        },
      });

      // Image reveal sequence
      imagesRef.current.forEach((img, index) => {
        if (!img) return;

        // Initial state - hidden and scaled down
        gsap.set(img, {
          opacity: index === 0 ? 1 : 0,
          scale: index === 0 ? 1 : 0.8,
          y: index === 0 ? 0 : 100,
        });

        // Reveal animation
        if (index > 0) {
          gsap.to(img, {
            opacity: 1,
            scale: 1,
            y: 0,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${(index / scrollImages.length) * 80}% top`,
              end: `${((index + 0.5) / scrollImages.length) * 80}% top`,
              scrub: 0.5,
            },
          });
        }

        // Fade out previous image
        if (index < scrollImages.length - 1) {
          gsap.to(img, {
            opacity: 0,
            scale: 1.1,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${((index + 0.5) / scrollImages.length) * 80}% top`,
              end: `${((index + 1) / scrollImages.length) * 80}% top`,
              scrub: 0.5,
            },
          });
        }
      });

      // Labels animation
      labelsRef.current.forEach((label, index) => {
        if (!label) return;

        gsap.set(label, { opacity: 0.3, scale: 0.9 });

        gsap.to(label, {
          opacity: 1,
          scale: 1,
          color: '#ef4444',
          scrollTrigger: {
            trigger: containerRef.current,
            start: `${(index / scrollImages.length) * 80}% top`,
            end: `${((index + 0.5) / scrollImages.length) * 80}% top`,
            scrub: 0.5,
          },
        });

        if (index < scrollImages.length - 1) {
          gsap.to(label, {
            opacity: 0.3,
            scale: 0.9,
            color: '#6b7280',
            scrollTrigger: {
              trigger: containerRef.current,
              start: `${((index + 0.5) / scrollImages.length) * 80}% top`,
              end: `${((index + 1) / scrollImages.length) * 80}% top`,
              scrub: 0.5,
            },
          });
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={containerRef} className="relative" style={{ height: '500vh' }}>
      {/* Fixed container for images */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gray-900 z-50">
          <div
            ref={progressRef}
            className="h-full bg-red-600 origin-left"
            style={{ transform: 'scaleX(0)' }}
          />
        </div>

        {/* Images stack */}
        <div className="absolute inset-0 flex items-center justify-center">
          {scrollImages.map((image, index) => (
            <div
              key={index}
              ref={(el) => { imagesRef.current[index] = el; }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <img
                src={image.src}
                alt={image.label}
                className="w-full h-full object-contain max-w-[90%] max-h-[80%]"
              />
            </div>
          ))}
        </div>

        {/* Section labels */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
          {scrollImages.map((image, index) => (
            <div
              key={index}
              ref={(el) => { labelsRef.current[index] = el; }}
              className="flex items-center gap-3 text-gray-500 font-bold text-sm tracking-widest transition-colors"
            >
              <span className="w-8 h-[2px] bg-current" />
              <span>{image.label}</span>
            </div>
          ))}
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-40">
          <div className="w-6 h-10 border-2 border-red-600 rounded-full flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-red-600 rounded-full animate-bounce" />
          </div>
          <span className="text-red-600 text-xs tracking-widest">SCROLL</span>
        </div>

        {/* Red glow effects */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-red-900/30 to-transparent pointer-events-none" />
        <div className="absolute top-0 left-0 w-64 h-full bg-gradient-to-r from-red-900/20 to-transparent pointer-events-none" />
      </div>

      {/* Content section after scroll */}
      <div className="absolute bottom-0 left-0 right-0 h-screen flex items-center justify-center bg-gradient-to-b from-black via-black to-[#0a0a0a]">
        <div className="text-center px-4 max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-600/40 rounded-full mb-8">
            <span className="w-2 h-2 bg-red-600 rounded-full animate-pulse" />
            <span className="text-red-500 text-sm font-bold tracking-widest">MARKETPLACE AUTOMOTRIZ #1</span>
          </div>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-4 leading-none">
            ENCUENTRA TODO
          </h1>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-red-600 mb-8 leading-none">
            PARA TU AUTO
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Repuestos, talleres, herramientas y servicios automotrices. 
            Conectamos dueños de vehículos con los mejores proveedores de Chile.
          </p>

          {/* Buttons */}
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              onClick={() => document.getElementById('categorias')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-red-600 hover:bg-red-700 text-white px-8 py-6 text-lg font-bold rounded-none border-2 border-red-600 hover:border-red-700 transition-all"
            >
              EXPLORAR <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button 
              variant="outline"
              className="border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white px-8 py-6 text-lg font-bold rounded-none transition-all"
            >
              VENDER
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
            {[
              { value: '500+', label: 'NEGOCIOS' },
              { value: '50K+', label: 'PRODUCTOS' },
              { value: '100K+', label: 'USUARIOS' },
              { value: '4.8', label: 'RATING' },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-red-600 mb-1">{stat.value}</div>
                <div className="text-gray-500 text-xs tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

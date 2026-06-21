import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import './MouseFollower.css';

export default function MouseFollower() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  useEffect(() => {
    // Check if device supports hover/fine pointer (ignore mobile)
    const isTouch = window.matchMedia('(pointer: coarse)').matches;
    if (isTouch) return;

    const dot = dotRef.current;
    const ring = ringRef.current;

    // Center starting positions
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(ring, { xPercent: -50, yPercent: -50 });

    const onMouseMove = (e) => {
      const { clientX, clientY } = e;

      // Small dot follows mouse instantly
      gsap.to(dot, {
        x: clientX,
        y: clientY,
        duration: 0.1,
        ease: 'power2.out',
        overwrite: 'auto'
      });

      // Larger ring follows with a smooth delay
      gsap.to(ring, {
        x: clientX,
        y: clientY,
        duration: 0.45,
        ease: 'power3.out',
        overwrite: 'auto'
      });
    };

    const onMouseLeave = () => {
      gsap.to([dot, ring], { opacity: 0, duration: 0.3 });
    };

    const onMouseEnter = () => {
      gsap.to([dot, ring], { opacity: 1, duration: 0.3 });
    };

    window.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Event delegation to capture hovering on links, buttons, and card elements
    const handleMouseOver = (e) => {
      const interactive = e.target.closest('a, button, .glass-card, .project-card, .social-icon, .mobile-toggle, input, textarea');
      
      if (interactive) {
        // Expand ring and morph color to a neon pink gradient look
        gsap.to(ring, {
          scale: 1.6,
          borderColor: 'rgba(255, 0, 127, 0.8)',
          backgroundColor: 'rgba(255, 0, 127, 0.08)',
          boxShadow: '0 0 20px rgba(255, 0, 127, 0.3)',
          duration: 0.3
        });
        
        // Scale down dot
        gsap.to(dot, {
          scale: 0.2,
          backgroundColor: '#ff007f',
          duration: 0.2
        });
      } else {
        // Reset to initial styling
        gsap.to(ring, {
          scale: 1,
          borderColor: 'var(--color-accent)',
          backgroundColor: 'transparent',
          boxShadow: '0 0 15px rgba(0, 242, 254, 0.1)',
          duration: 0.3
        });
        
        gsap.to(dot, {
          scale: 1,
          backgroundColor: 'var(--color-accent)',
          duration: 0.2
        });
      }
    };

    window.addEventListener('mouseover', handleMouseOver);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={dotRef}></div>
      <div className="cursor-ring" ref={ringRef}></div>
    </>
  );
}

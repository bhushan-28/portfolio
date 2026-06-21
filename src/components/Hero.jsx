import React, { useEffect, useRef } from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import Scene3D from './Scene3D';
import gsap from 'gsap';
import './Hero.css';

export default function Hero() {
  const containerRef = useRef(null);
  const subtitleRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const btnsRef = useRef(null);

  useEffect(() => {
    // GSAP Entrance Animation
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.to(containerRef.current, { opacity: 1, duration: 0.5 })
      .fromTo(subtitleRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.2')
      .fromTo(titleRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1.0 }, '-=0.6')
      .fromTo(descRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6')
      .fromTo(btnsRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8 }, '-=0.6');
  }, []);

  return (
    <section id="home" className="hero-section" ref={containerRef} style={{ opacity: 0 }}>
      <div className="container hero-grid">
        <div className="hero-content">
          <div className="hero-badge" ref={subtitleRef}>
            <Sparkles size={14} className="badge-icon" />
            <span>Creative Developer & Designer</span>
          </div>

          <h1 className="hero-title" ref={titleRef}>
            Crafting Digital <span className="text-gradient">Dimensions</span>
          </h1>

          <p className="hero-desc" ref={descRef}>
            Hi, I'm <strong className="highlight">Bhushan</strong>. I design and build highly interactive, 3D-infused web applications that capture attention and deliver flawless performance.
          </p>

          <div className="hero-btns" ref={btnsRef}>
            <a href="#projects" className="btn btn-primary">
              View Work <ArrowRight size={16} />
            </a>
            <a href="#contact" className="btn btn-secondary">
              Let's Talk
            </a>
          </div>
        </div>

        <div className="hero-visual">
          <div className="canvas-wrapper">
            <Scene3D />
          </div>
        </div>
      </div>
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <span>Scroll to Explore</span>
      </div>
    </section>
  );
}

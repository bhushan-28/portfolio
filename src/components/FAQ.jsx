import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './FAQ.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function FAQ() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const listRef = useRef(null);

  const [activeIndex, setActiveIndex] = useState(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Title Animation (Y-axis from top)
      gsap.fromTo(titleRef.current,
        { y: -40, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: titleRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Accordion Items Animation (Y-axis from bottom with stagger)
      const items = listRef.current.children;
      gsap.fromTo(items,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.12,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: listRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: 'What services do you offer?',
      answer: 'I specialize in frontend web development, interactive 3D web design (using Three.js and React Three Fiber), custom GSAP animations, responsive layouts, and modern database integration. I bridge the gap between aesthetics and function.'
    },
    {
      question: 'What is your typical workflow for 3D web projects?',
      answer: 'My workflow begins with asset modeling/preparation in Blender, followed by scene staging and lighting setup in React Three Fiber. I then write custom shaders and GSAP animations, optimize geometry for performance, and tie the visual layer into the application logic.'
    },
    {
      question: 'Can you integrate 3D models with CMS or e-commerce platforms?',
      answer: 'Yes! I can load custom 3D configurators, viewers, or interactive animations into standard CMS databases (like Sanity, headless WordPress) or custom e-commerce stores, adding a premium 3D shopping or presentation layer to your product catalogs.'
    },
    {
      question: 'How do you ensure 3D scenes perform well on mobile devices?',
      answer: 'I implement strict optimizations including: mesh/poly reduction, texture baking, custom lightweight GLSL shaders, dynamic camera scaling (zooming out further to prevent screen clipping), disabling OrbitControls on touchscreens, and dynamically switching blending modes based on themes.'
    },
    {
      question: 'Are you open to freelance projects or full-time roles?',
      answer: 'Yes! I am open to freelance collaborations, contract work, and full-time creative engineering opportunities. Please reach out through the Contact form below or click the WhatsApp widget to chat directly!'
    }
  ];

  return (
    <section id="faq" className="faq-section" ref={sectionRef}>
      <div className="container">
        <div className="section-title-wrapper" ref={titleRef}>
          <p className="section-subtitle">Questions</p>
          <h2 className="section-title">Common Queries</h2>
        </div>

        <div className="faq-list" ref={listRef}>
          {faqData.map((item, idx) => {
            const isOpen = activeIndex === idx;
            return (
              <div 
                key={idx} 
                className={`faq-item glass-card ${isOpen ? 'faq-item-open' : ''}`}
                onClick={() => toggleFAQ(idx)}
              >
                <div className="faq-question-header">
                  <div className="faq-question-title-wrapper">
                    <HelpCircle size={18} className="faq-question-icon" />
                    <h3>{item.question}</h3>
                  </div>
                  <ChevronDown size={18} className="faq-chevron" />
                </div>
                
                <div className="faq-answer-wrapper">
                  <div className="faq-answer-inner">
                    <p>{item.answer}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

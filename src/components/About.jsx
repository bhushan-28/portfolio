import React, { useEffect, useRef } from 'react';
import { Code, Cpu, Paintbrush, ShieldCheck } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './About.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const contentRef = useRef(null);
  const cardContainerRef = useRef(null);

  useEffect(() => {
    // GSAP ScrollTrigger Animations
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

      // Bio Text Animation (X-axis from left)
      gsap.fromTo(contentRef.current,
        { x: -80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          scrollTrigger: {
            trigger: contentRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );

      // Skill Cards Stagger Animation (X-axis from right)
      const cards = cardContainerRef.current.children;
      gsap.fromTo(cards,
        { x: 80, opacity: 0 },
        {
          x: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: cardContainerRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const skillCategories = [
    {
      title: 'Frontend Development',
      icon: <Code className="skill-icon color-blue" />,
      skills: ['React / Next.js', 'JavaScript (ES6+)', 'TypeScript', 'HTML5 / CSS3', 'Tailwind CSS']
    },
    {
      title: '3D & Animations',
      icon: <Paintbrush className="skill-icon color-cyan" />,
      skills: ['Three.js', 'React Three Fiber', 'GSAP Animations', 'WebGL / Shaders', 'Blender / 3D Modeling']
    },
    {
      title: 'Backend & Tools',
      icon: <Cpu className="skill-icon color-purple" />,
      skills: ['Node.js / Express', 'Git / GitHub', 'REST APIs', 'MySQL / MongoDB', 'Vercel / Netlify']
    }
  ];

  return (
    <section id="about" className="about-section" ref={sectionRef}>
      <div className="container">
        <div className="section-title-wrapper" ref={titleRef}>
          <p className="section-subtitle">Introduction</p>
          <h2 className="section-title">About Me</h2>
        </div>

        <div className="about-grid">
          <div className="about-bio" ref={contentRef}>
            <p className="bio-lead">
              I am a web developer with a passion for designing unique 3D visual environments and responsive, modern layouts.
            </p>
            <p className="bio-body">
              My journey in coding started with a desire to make web applications that feel more like interactive art installations than simple static grids. I bridging the gap between design and functionality by incorporating tools like **GSAP** and **Three.js** to build fluid, immersive web interfaces.
            </p>
            <p className="bio-body">
              When I'm not writing code, I'm usually experimenting with shaders, refining 3D assets in Blender, or learning about advanced animation design frameworks.
            </p>
          </div>

          <div className="skills-container grid-3" ref={cardContainerRef}>
            {skillCategories.map((cat, idx) => (
              <div key={idx} className="glass-card skill-card">
                <div className="skill-card-header">
                  {cat.icon}
                  <h3>{cat.title}</h3>
                </div>
                <ul className="skill-list">
                  {cat.skills.map((skill, sIdx) => (
                    <li key={sIdx} className="skill-item">
                      <span className="skill-dot"></span>
                      {skill}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

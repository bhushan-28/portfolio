import React, { useEffect, useRef } from 'react';
import { ExternalLink, FolderOpen } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Projects.css';

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const GithubIcon = ({ size = 18, ...props }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Projects() {
  const sectionRef = useRef(null);
  const titleRef = useRef(null);
  const gridRef = useRef(null);

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

      // Grid items stagger (Y-axis from bottom)
      const cards = gridRef.current.children;
      gsap.fromTo(cards,
        { y: 80, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: gridRef.current,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const projectsData = [
    {
      title: 'OwlNestMedia',
      desc: 'Interactive web-based 3D workspace showcasing custom shaders, physics particle systems, and customizable directional lighting.',
      tags: ['React', 'Three.js', 'GSAP', 'WebGL'],
      github: 'https://github.com/bhushan-28',
      demo: 'https://owlnestmedia.com'
    },
    {
      title: 'ArtistKhojo',
      desc: 'A decentralized finance transaction tracker dashboard delivering live market data visualizations and smooth motion layout animations.',
      tags: ['React', 'Chart.js', 'Framer Motion', 'API'],
      github: 'https://github.com/bhushan-28',
      demo: 'https://artistkhojo.in/'
    },
    {
      title: 'Jmtutorial',
      desc: 'A customizable library of reusable React components engineered around a neon futuristic design framework and complete accessibility standards.',
      tags: ['Html5', 'CSS3', 'Javascript', 'Bootstrap'],
      github: 'https://github.com/bhushan-28',
      demo: 'https://jmtutorial.in/'
    }
  ];

  return (
    <section id="projects" className="projects-section" ref={sectionRef}>
      <div className="container">
        <div className="section-title-wrapper" ref={titleRef}>
          <p className="section-subtitle">Portfolio</p>
          <h2 className="section-title">Featured Work</h2>
        </div>

        <div className="projects-grid grid-3" ref={gridRef}>
          {projectsData.map((project, idx) => (
            <div key={idx} className="glass-card project-card">
              <div className="project-header">
                <FolderOpen className="folder-icon" />
                <div className="project-links">
                  <a href={project.github} target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label="GitHub Source">
                    <GithubIcon size={18} />
                  </a>
                  <a href={project.demo} target="_blank" rel="noopener noreferrer" className="project-link-icon" aria-label="Live Demo">
                    <ExternalLink size={18} />
                  </a>
                </div>
              </div>

              <div className="project-body">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-desc">{project.desc}</p>
              </div>

              <div className="project-footer">
                <div className="project-tags">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="project-tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import React, { useState } from 'react';
import Header from './components/Header';
import Hero from './components/Hero';
import About from './components/About';
import Projects from './components/Projects';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import Footer from './components/Footer';
import MouseFollower from './components/MouseFollower';
import WhatsAppBot from './components/WhatsAppBot';
import Preloader from './components/Preloader';
import './App.css';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="app">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      {!isLoading && <MouseFollower />}
      <WhatsAppBot />
      {/* Premium Ambient Background Glows */}
      <div className="bg-glow-container">
        <div className="bg-glow-1"></div>
        <div className="bg-glow-2"></div>
        <div className="bg-glow-3"></div>
      </div>

      <Header />
      
      <main>
        <Hero />
        <About />
        <Projects />
        <FAQ />
        <Contact />
      </main>

      <Footer />
    </div>
  );
}

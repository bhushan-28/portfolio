import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, User } from 'lucide-react';
import './WhatsAppBot.css';

// Custom WhatsApp Icon SVG to keep dependencies clean and look highly professional
const WhatsAppIcon = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={size}
    height={size}
    viewBox="0 0 448 512"
    fill="currentColor"
    style={{ display: 'block' }}
  >
    <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z" />
  </svg>
);

export default function WhatsAppBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'bot',
      text: "Hi there! 👋 I am Bhushan's digital assistant. How can I help you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [showBadge, setShowBadge] = useState(true);
  const chatEndRef = useRef(null);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isTyping]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (showBadge) setShowBadge(false);
  };

  const directWhatsAppLink = "https://wa.me/918169922898?text=Hi%20Bhushan,%20I%20visited%20your%20portfolio%20and%20would%20like%20to%20connect!";

  const getBotResponse = (input) => {
    const text = input.toLowerCase();

    if (text.includes('hello') || text.includes('hi') || text.includes('hey') || text.includes('greetings')) {
      return "Hello! Hope you are having a great day. Feel free to ask about Bhushan's projects, skills, education, resume, or click 'Chat on WhatsApp' to talk to him directly! 😊";
    }
    if (text.includes('project') || text.includes('work') || text.includes('portfolio') || text.includes('built') || text.includes('websites')) {
      return "Bhushan has built some amazing projects like OwlNestMedia (a 3D visual marketing website), ArtistKhojo (an artist hiring dashboard), and Jmtutorial. You can check them out in the Projects section above!";
    }
    if (text.includes('skill') || text.includes('tech') || text.includes('code') || text.includes('developer')) {
      return "Bhushan specializes in React, Next.js, Three.js, React Three Fiber, GSAP animations, HTML5, CSS3, JavaScript (ES6+), Node.js, Express, and databases like MySQL/MongoDB.";
    }
    if (text.includes('contact') || text.includes('hire') || text.includes('number') || text.includes('phone') || text.includes('call') || text.includes('email') || text.includes('reach')) {
      return "You can reach Bhushan via email at bhushankudkar2006@gmail.com, or directly call/message him on WhatsApp at +91 8169922898!";
    }
    if (text.includes('resume') || text.includes('cv') || text.includes('pdf')) {
      return "Bhushan's resume is available upon request! Feel free to email him at bhushankudkar2006@gmail.com or tap the WhatsApp button below to request it directly.";
    }
    if (text.includes('education') || text.includes('study') || text.includes('college') || text.includes('degree') || text.includes('background')) {
      return "Bhushan is a passionate self-taught developer who has built a strong background in computer science and immersive interactive frontend design. He is always refining his skill set with cutting-edge tools!";
    }

    return "I'm not sure about that, but you can chat directly with Bhushan on WhatsApp! Just click the 'Chat on WhatsApp' button below to message him on +91 8169922898.";
  };

  const handleSend = (textToSend) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessage = {
      id: Date.now(),
      sender: 'user',
      text: text,
      time: userTime
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate bot thinking/typing
    setTimeout(() => {
      setIsTyping(false);
      const botTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      const botReply = {
        id: Date.now() + 1,
        sender: 'bot',
        text: getBotResponse(text),
        time: botTime
      };
      setMessages((prev) => [...prev, botReply]);
    }, 1200);
  };

  const quickReplies = [
    "Tell me about his skills",
    "What projects has he built?",
    "How can I contact Bhushan?"
  ];

  return (
    <div className="whatsapp-bot-container">
      {/* Floating Button */}
      <button
        className={`whatsapp-float-btn ${isOpen ? 'active' : ''}`}
        onClick={handleToggle}
        aria-label="Chat with Bhushan"
      >
        {isOpen ? <X size={26} /> : <WhatsAppIcon size={26} />}
        {showBadge && !isOpen && <span className="notification-badge">1</span>}
      </button>

      {/* Chat Window */}
      <div className={`whatsapp-chat-window ${isOpen ? 'open' : ''}`}>
        {/* Header */}
        <div className="chat-header">
          <div className="chat-avatar">
            <WhatsAppIcon size={20} />
            <span className="online-indicator"></span>
          </div>
          <div className="chat-header-info">
            <h3>Bhushan</h3>
            <p>Typically replies instantly</p>
          </div>
        </div>

        {/* Message Area */}
        <div className="chat-messages">
          {messages.map((msg) => (
            <div key={msg.id} className={`chat-message-wrapper ${msg.sender}`}>
              <div className="chat-message">
                <p>{msg.text}</p>
                <span className="message-time">{msg.time}</span>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="chat-message-wrapper bot">
              <div className="chat-message typing-bubble">
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Quick Replies */}
        <div className="quick-replies">
          {quickReplies.map((reply, idx) => (
            <button
              key={idx}
              className="quick-reply-btn"
              onClick={() => handleSend(reply)}
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Direct WhatsApp Call-to-Action */}
        <div className="direct-wa-cta">
          <a
            href={directWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="wa-cta-link"
          >
            <WhatsAppIcon size={16} />
            <span>Chat directly on WhatsApp</span>
          </a>
        </div>

        {/* Input Form */}
        <form
          className="chat-input-area"
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
        >
          <input
            type="text"
            placeholder="Type your message..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="chat-input-field"
          />
          <button type="submit" className="chat-send-btn" aria-label="Send message">
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}

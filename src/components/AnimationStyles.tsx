import { useEffect } from "react";

export const AnimationStyles = () => {
  useEffect(() => {
    const styleEl = document.createElement('style');
    styleEl.innerHTML = `
      /* Animation Keyframes */
      @keyframes float {
        0%, 100% { transform: translateY(0px); }
        50% { transform: translateY(-10px); }
      }
      
      @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.05); opacity: 1; }
      }
      
      @keyframes shimmer {
        0% { background-position: -100% 0; }
        100% { background-position: 200% 0; }
      }
      
      @keyframes rotate {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes blob {
        0% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
        50% { border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%; }
        100% { border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%; }
      }
      
      @keyframes fadeInUp {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInDown {
        from { opacity: 0; transform: translateY(-20px); }
        to { opacity: 1; transform: translateY(0); }
      }
      
      @keyframes fadeInLeft {
        from { opacity: 0; transform: translateX(-20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes fadeInRight {
        from { opacity: 0; transform: translateX(20px); }
        to { opacity: 1; transform: translateX(0); }
      }
      
      @keyframes zoomIn {
        from { opacity: 0; transform: scale(0.9); }
        to { opacity: 1; transform: scale(1); }
      }
      
      @keyframes ripple {
        0% { transform: scale(0.8); opacity: 1; }
        100% { transform: scale(2); opacity: 0; }
      }
      
      @keyframes bounce {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-15px); }
      }
      
      @keyframes typewriter {
        from { width: 0; }
        to { width: 100%; }
      }
      
      @keyframes cursorBlink {
        from, to { border-color: transparent; }
        50% { border-color: #D4AF37; }
      }
      
      @keyframes backgroundGradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      
      /* Utility Animation Classes */
      .animate-float {
        animation: float 4s ease-in-out infinite;
      }
      
      .animate-pulse-subtle {
        animation: pulse 3s ease-in-out infinite;
      }
      
      .animate-shimmer {
        background: linear-gradient(90deg, transparent, rgba(212, 175, 55, 0.2), transparent);
        background-size: 200% 100%;
        animation: shimmer 3s infinite;
      }
      
      .animate-rotate {
        animation: rotate 10s linear infinite;
      }
      
      .animate-blob {
        animation: blob 8s ease-in-out infinite;
      }
      
      .animate-fade-in-up {
        animation: fadeInUp 0.8s ease-out forwards;
      }
      
      .animate-fade-in-down {
        animation: fadeInDown 0.8s ease-out forwards;
      }
      
      .animate-fade-in-left {
        animation: fadeInLeft 0.8s ease-out forwards;
      }
      
      .animate-fade-in-right {
        animation: fadeInRight 0.8s ease-out forwards;
      }
      
      .animate-zoom-in {
        animation: zoomIn 0.8s ease-out forwards;
      }
      
      .animate-ripple {
        animation: ripple 2s linear infinite;
      }
      
      .animate-bounce-subtle {
        animation: bounce 4s ease-in-out infinite;
      }
      
      .animate-typewriter {
        overflow: hidden;
        white-space: nowrap;
        border-right: 3px solid;
        animation: typewriter 3s steps(40) forwards, cursorBlink 0.7s step-end infinite;
      }
      
      .animate-bg-gradient {
        background-size: 200% 200%;
        animation: backgroundGradient 10s ease infinite;
      }
      
      /* Animation Delays */
      .animation-delay-100 { animation-delay: 100ms; }
      .animation-delay-200 { animation-delay: 200ms; }
      .animation-delay-300 { animation-delay: 300ms; }
      .animation-delay-400 { animation-delay: 400ms; }
      .animation-delay-500 { animation-delay: 500ms; }
      .animation-delay-700 { animation-delay: 700ms; }
      .animation-delay-1000 { animation-delay: 1000ms; }
      .animation-delay-1500 { animation-delay: 1500ms; }
      .animation-delay-2000 { animation-delay: 2000ms; }
      .animation-delay-3000 { animation-delay: 3000ms; }
      
      /* Scroll-triggered animations */
      .reveal-on-scroll {
        opacity: 0;
        transform: translateY(30px);
        transition: opacity 0.8s ease, transform 0.8s ease;
      }
      
      .reveal-on-scroll.is-visible {
        opacity: 1;
        transform: translateY(0);
      }
      
      .stagger-children > * {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.5s ease, transform 0.5s ease;
      }
      
      .stagger-children.is-visible > *:nth-child(1) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 0ms; 
      }
      .stagger-children.is-visible > *:nth-child(2) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 100ms; 
      }
      .stagger-children.is-visible > *:nth-child(3) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 200ms; 
      }
      .stagger-children.is-visible > *:nth-child(4) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 300ms; 
      }
      .stagger-children.is-visible > *:nth-child(5) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 400ms; 
      }
      .stagger-children.is-visible > *:nth-child(6) { 
        opacity: 1; 
        transform: translateY(0); 
        transition-delay: 500ms; 
      }
      
      /* Hover animation effects */
      .hover-lift {
        transition: transform 0.3s ease, box-shadow 0.3s ease;
      }
      
      .hover-lift:hover {
        transform: translateY(-5px);
        box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1);
      }
      
      .hover-glow {
        transition: box-shadow 0.3s ease;
      }
      
      .hover-glow:hover {
        box-shadow: 0 0 20px rgba(212, 175, 55, 0.4);
      }
      
      .hover-rotate {
        transition: transform 0.3s ease;
      }
      
      .hover-rotate:hover {
        transform: rotate(3deg);
      }
      
      .hover-scale {
        transition: transform 0.3s ease;
      }
      
      .hover-scale:hover {
        transform: scale(1.05);
      }
      
      /* Enhanced gold shimmer animation for titles */
      .gold-shimmer {
        background: linear-gradient(
          90deg, 
          rgba(212, 175, 55, 1) 0%, 
          rgba(184, 134, 11, 1) 15%, 
          rgba(212, 175, 55, 1) 30%, 
          rgba(184, 134, 11, 1) 45%, 
          rgba(212, 175, 55, 1) 60%, 
          rgba(184, 134, 11, 1) 75%,
          rgba(212, 175, 55, 1) 90%
        );
        background-size: 200% auto;
        background-clip: text;
        -webkit-background-clip: text;
        color: transparent;
        animation: shimmer 10s linear infinite;
      }

      /* Floating elements - blobs, patterns, particles */
      .animated-blob {
        position: absolute;
        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
        background: radial-gradient(circle at center, rgba(212, 175, 55, 0.15), rgba(184, 134, 11, 0.05));
        animation: blob 12s ease-in-out infinite;
      }
    `;
    document.head.appendChild(styleEl);
    
    // Setup scroll reveal animations
    const setupScrollReveal = () => {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      }, { threshold: 0.1 });
      
      // Observe all elements with the reveal-on-scroll class
      document.querySelectorAll('.reveal-on-scroll, .stagger-children').forEach(el => {
        observer.observe(el);
      });
    };
    
    // Run after a short delay to ensure DOM is ready
    setTimeout(setupScrollReveal, 100);
    
    return () => {
      document.head.removeChild(styleEl);
    };
  }, []);
  
  return null;
};

export default AnimationStyles; 
import React from 'react';

// Common class combinations for reuse
export const themeClasses = {
  // Layout
  page: "min-h-screen bg-background-dark p-4 sm:p-6 md:p-8 font-['Inter']",
  container: "max-w-4xl mx-auto",
  
  // Text styles
  heading: "text-4xl font-bold bg-gradient-to-r from-gradient-purple-start to-gradient-purple-end bg-clip-text text-transparent",
  subheading: "text-xl font-semibold text-text-secondary",
  
  // Card styles
  card: "bg-gradient-card backdrop-blur-xl border border-border-light rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300",
  cardHeader: "text-2xl font-bold text-text-purple-light mb-4",
  
  // Form elements
  input: "w-full bg-background-card border border-border-light rounded-xl p-3 text-text-primary focus:outline-none focus:border-primary-purple/50",
  label: "block text-text-secondary mb-2",
  
  // Buttons
  buttonPrimary: "px-4 py-2 bg-gradient-to-r from-gradient-purple-start to-gradient-purple-end rounded-xl text-text-primary font-medium hover:shadow-lg transition-all duration-300",
  buttonSecondary: "px-4 py-2 border border-border-purple rounded-xl text-text-purple-light hover:bg-background-cardHover transition-all duration-300",
  
  // Status messages
  error: "text-red-400 text-lg text-center mb-6",
  success: "text-green-400 text-lg text-center mb-6",
  
  // Loading spinner
  spinner: "animate-spin rounded-full h-12 w-12 border-b-2 border-primary-purple",
};

// Animation variants for Framer Motion
export const animations = {
  pageTransition: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideIn: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  scaleIn: {
    initial: { scale: 0.95, opacity: 0 },
    animate: { scale: 1, opacity: 1 },
    exit: { scale: 0.95, opacity: 0 },
  },
};

// Button hover animations
export const buttonHoverAnimations = {
  whileHover: { scale: 1.02 },
  whileTap: { scale: 0.98 },
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return (
    <div className={themeClasses.page}>
      {children}
    </div>
  );
};

export default ThemeProvider; 
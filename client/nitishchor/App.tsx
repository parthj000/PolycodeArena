import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styled from 'styled-components';

// Styled components
const AppContainer = styled.div`
  background: #0a0a0a;
  color: #e0e0e0;
  min-height: 100vh;
  font-family: 'Rajdhani', sans-serif;
`;

const Header = styled(motion.header)`
  padding: 2rem;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(10px);
  position: fixed;
  width: 100%;
  z-index: 100;
`;

const Nav = styled.nav`
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
`;

const Logo = styled(motion.div)`
  font-size: 2rem;
  font-weight: bold;
  background: linear-gradient(45deg, #ff00ff, #00ffff);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
`;

const HeroSection = styled(motion.section)`
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255, 0, 255, 0.1), rgba(0, 255, 255, 0.1));
    z-index: -1;
  }
`;

const HeroContent = styled(motion.div)`
  text-align: center;
  max-width: 800px;
  padding: 2rem;
`;

const GlitchText = styled(motion.h1)`
  font-size: 4rem;
  margin-bottom: 1rem;
  position: relative;
  
  &::after {
    content: attr(data-text);
    position: absolute;
    left: 2px;
    text-shadow: -2px 0 #ff00ff;
    top: 0;
    color: #fff;
    overflow: hidden;
    clip: rect(0, 900px, 0, 0);
    animation: glitch-anim 2s infinite linear alternate-reverse;
  }
  
  @keyframes glitch-anim {
    0% {
      clip: rect(44px, 9999px, 56px, 0);
    }
    100% {
      clip: rect(26px, 9999px, 77px, 0);
    }
  }
`;

const Button = styled(motion.button)`
  background: transparent;
  border: 2px solid #00ffff;
  color: #00ffff;
  padding: 1rem 2rem;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(0, 255, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const App: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <AppContainer>
      <Header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        <Nav>
          <Logo
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            DUNE
          </Logo>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Contact Us
          </Button>
        </Nav>
      </Header>

      <HeroSection
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
      >
        <HeroContent>
          <GlitchText data-text="Creative Agency">
            Creative Agency
          </GlitchText>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            style={{ fontSize: '1.5rem', marginBottom: '2rem' }}
          >
            Welcome to the future of digital design. Where cyberpunk meets creativity.
          </motion.p>
          <Button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Explore Our Work
          </Button>
        </HeroContent>
      </HeroSection>

      {/* Add more sections as needed */}
    </AppContainer>
  );
};

export default App; 
import React, { useState, useEffect } from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import "./App.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function App() {
  const location = useLocation();
  const [navbarState, setNavbarState] = useState('default'); // 'default', 'floating', 'hidden'
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const scrollDifference = currentScrollY - lastScrollY;

      if (currentScrollY < 20) {
        // Near top - default floating state
        setNavbarState('default');
      } else if (scrollDifference > 5 && currentScrollY > 100) {
        // Scrolling down - hide navbar
        setNavbarState('hidden');
      } else if (scrollDifference < -5) {
        // Scrolling up - show floating navbar
        setNavbarState('floating');
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', throttledScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', throttledScroll);
    };
  }, [lastScrollY]);

  const getNavbarClasses = () => {
    let classes = 'navbar';
    if (navbarState === 'floating') classes += ' floating';
    if (navbarState === 'hidden') classes += ' hidden';
    return classes;
  };

  return (
    <div className="site-shell">
      <nav className={getNavbarClasses()}>
        <div className="nav-left">
          <span className="brand">AI Image Enhancer</span>
        </div>
        <div className="nav-right">
          <NavLink to="/" end className="nav-link">
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </div>
      </nav>

      <main className="main">
        
        <Routes location={location}>
          <Route
            path="/"
            element={
              <CSSTransition
                key={location.pathname}
                classNames="page"
                timeout={400}
                appear
              >
                <Home />
              </CSSTransition>
            }
          />
          <Route
            path="/about"
            element={
              <CSSTransition
                key={location.pathname}
                classNames="page"
                timeout={400}
                appear
              >
                <About />
              </CSSTransition>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

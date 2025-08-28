import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import About from "./pages/About.jsx";
import "./App.css";
import { CSSTransition, TransitionGroup } from "react-transition-group";

export default function App() {
  const location = useLocatisvvswedvon();

  return (
    <div className="site-shell">
      <nav className="navbar">
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
        {/* Routes are outside TransitionGroup */}
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

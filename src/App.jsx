
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Play,
  Menu,
  Clapperboard,
  Film,
  Sparkles,
} from "lucide-react";
import "./styles/index.css";

function App() {
  return (
    <main>
      <nav className="navbar">
        <a className="logo" href="#">
          <span>PRIM</span>EDIT
          <small>PRODUCTIONS</small>
        </a>

        <div className="nav-links">
          <a href="#work">Work</a>
          <a href="#services">Services</a>
          <a href="#process">Process</a>
          <a href="#about">About</a>
        </div>

        <a href="#contact" className="nav-cta">
          Let's Talk <ArrowUpRight size={17} />
        </a>

        <button className="menu-btn" aria-label="Open menu">
          <Menu />
        </button>
      </nav>

      <section className="hero">
        <div className="hero-glow" />

        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
        >
          <div className="eyebrow">
            <span className="status-dot" />
            CREATIVE VIDEO PRODUCTION STUDIO
          </div>

          <h1>
            WE MAKE
            <br />
            CONTENT
            <br />
            <span>UNFORGETTABLE.</span>
          </h1>

          <p className="hero-description">
            From raw footage to remarkable stories.
            We create powerful edits that capture attention,
            build connections and move brands forward.
          </p>

          <div className="hero-actions">
            <a href="#contact" className="primary-btn">
              Start a Project <ArrowUpRight size={19} />
            </a>

            <a href="#work" className="secondary-btn">
              <Play size={17} /> Explore Our Work
            </a>
          </div>
        </motion.div>

        <motion.div
          className="hero-visual"
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1 }}
        >
          <div className="visual-frame">
            <div className="visual-top">
              <span>PEP / VISUAL STUDIO</span>
              <span>001 — 2026</span>
            </div>

            <div className="visual-center">
              <div className="visual-symbol">
                <Clapperboard size={48} strokeWidth={1.2} />
              </div>
              <span>THE ART OF STORYTELLING</span>
              <h2>CREATE.</h2>
              <h2 className="outline-text">CAPTIVATE.</h2>
              <div className="visual-bottom">
                <Film size={15} />
                <span>FRAME BY FRAME</span>
                <Sparkles size={15} />
              </div>
            </div>
          </div>

          <div className="floating-tag">
            <span>✳</span> MADE TO STAND OUT
          </div>
        </motion.div>

        <div className="hero-footer">
          <span>VIDEO EDITING · MOTION · DESIGN</span>
          <span>SCROLL TO EXPLORE ↓</span>
          <span>INDIA · WORLDWIDE</span>
        </div>
      </section>

      <section className="intro-strip">
        <span>MORE THAN JUST EDITING.</span>
        <p>WE TURN VISIONS INTO VISUAL EXPERIENCES.</p>
      </section>

      <section className="placeholder-section" id="work">
        <span>01 / SELECTED WORK</span>
        <h2>OUR WORK SPEAKS.</h2>
        <p>Our creative portfolio is coming next.</p>
      </section>

      <section className="placeholder-section" id="services">
        <span>02 / WHAT WE DO</span>
        <h2>BUILT TO MAKE AN IMPACT.</h2>
      </section>

      <section className="placeholder-section" id="process">
        <span>03 / OUR PROCESS</span>
        <h2>IDEA TO FINAL FRAME.</h2>
      </section>

      <section className="placeholder-section" id="about">
        <span>04 / ABOUT US</span>
        <h2>CREATIVITY WITH PURPOSE.</h2>
      </section>

      <section className="contact-section" id="contact">
        <span>HAVE A PROJECT IN MIND?</span>
        <h2>LET'S CREATE<br />SOMETHING GREAT.</h2>
        <a href="mailto:hello@primeditproductions.com">
          GET IN TOUCH <ArrowUpRight size={18} />
        </a>
      </section>

      <footer>
        <a className="logo" href="#">
          <span>PRIM</span>EDIT
          <small>PRODUCTIONS</small>
        </a>
        <p>© 2026 PrimEditProductions. All rights reserved.</p>
      </footer>
    </main>
  );
}

export default App;

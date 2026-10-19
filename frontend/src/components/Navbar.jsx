import { useState } from 'react'
import { Link } from 'react-router-dom'

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)
  const linkClass = 'nav-link'

  return (
    <header className="site-header">
      <nav className="navbar" aria-label="Main navigation">
        <Link to="/" className="brand" onClick={closeMenu} aria-label="LeaveFlow home">
          <span className="brand-symbol"><i /><i /><i /></span><span>leaveflow<span className="brand-period">.</span></span>
        </Link>
        <div className="nav-links">
          <a href="#home" className={linkClass}>Home</a>
          <a href="#features" className={linkClass}>Features</a>
          <a href="#how-it-works" className={linkClass}>How it works</a>
          <a href="#about" className={linkClass}>About</a>
        </div>
        <div className="nav-actions"><Link to="/login" className="login-link">Log in</Link><Link to="/signup" className="nav-cta">Sign up <span>↗</span></Link></div>
        <button className="menu-toggle" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation menu" aria-expanded={menuOpen}>{menuOpen ? '×' : '☰'}</button>
      </nav>
      {menuOpen && <div className="mobile-nav"><a href="#home" className={linkClass} onClick={closeMenu}>Home</a><a href="#features" className={linkClass} onClick={closeMenu}>Features</a><a href="#how-it-works" className={linkClass} onClick={closeMenu}>How it works</a><a href="#about" className={linkClass} onClick={closeMenu}>About</a><Link to="/login" className="mobile-login" onClick={closeMenu}>Log in</Link><Link to="/signup" className="nav-cta" onClick={closeMenu}>Sign up <span>↗</span></Link></div>}
    </header>
  )
}

export default Navbar

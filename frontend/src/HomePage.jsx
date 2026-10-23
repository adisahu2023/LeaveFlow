import { Link, useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

const requests = [
  {
    initials: "EC",
    name: "Ethan Chen",
    team: "Product",
    type: "Annual leave",
    dates: "18–19 Jun",
    tone: "mint",
  },
  {
    initials: "MJ",
    name: "Mia Jordan",
    team: "Engineering",
    type: "Personal",
    dates: "21 Jun",
    tone: "peach",
  },
  {
    initials: "PN",
    name: "Priya Nair",
    team: "Design",
    type: "Annual leave",
    dates: "24–26 Jun",
    tone: "lilac",
  },
];

function DashboardPreview() {
  const navigate=useNavigate()
  
  useEffect(()=>{

    const token=localStorage.getItem("token")
    if(token){
      const decodedToken=jwtDecode(token)
      if(decodedToken.role=="ROLE_EMPLOYEE")
      navigate("/employee/dashboard")

      else if(decodedToken.role=="ROLE_MANAGER")
      navigate("/manager/dashboard")
    
     else if(decodedToken.role=="ROLE_ADMIN")
      navigate("/admin/dashboard")
    }
  },[])
  
  return (
    <div
      className="preview-wrap"
      aria-label="Preview of the LeaveFlow leave dashboard"
    >
      <div className="preview-orbit orbit-one" />
      <div className="preview-orbit orbit-two" />
      <div className="float-note note-top">
        <span className="note-icon">♧</span>
        <span>
          <b>Team coverage</b>
          <small>Looking good this week</small>
        </span>
        <span className="note-check">✓</span>
      </div>
      <div className="float-note note-side">
        <span className="avatar avatar-purple">PN</span>
        <span>
          <b>Priya is away</b>
          <small>Back on Monday</small>
        </span>
      </div>
      <div className="dashboard-card">
        <div className="dashboard-head">
          <div className="mini-brand">
            <span className="brand-mark">↗</span> LeaveFlow
          </div>
          <div className="mini-controls">
            <span>⌕</span>
            <span className="avatar avatar-green">AM</span>
          </div>
        </div>
        <div className="dashboard-content">
          <aside className="mini-sidebar">
            <span className="mini-active">▦</span>
            <span>▣</span>
            <span>♧</span>
            <span>⚙</span>
          </aside>
          <div className="dashboard-main">
            <div className="dash-title">
              <div>
                <small>MONDAY, JUNE 16</small>
                <h3>
                  Good morning, Alex <span>✦</span>
                </h3>
                <p>Here’s what’s happening with your team.</p>
              </div>
              <button>
                ＋ <span>New request</span>
              </button>
            </div>
            <div className="stat-grid">
              <div className="stat-card">
                <span>Available balance</span>
                <strong>
                  18 <small>days</small>
                </strong>
                <em>↗ 2 days added this year</em>
              </div>
              <div className="stat-card">
                <span>On leave today</span>
                <strong>
                  04 <small>people</small>
                </strong>
                <em className="quiet-em">Across 3 departments</em>
              </div>
              <div className="stat-card">
                <span>Awaiting approval</span>
                <strong>
                  03 <small>requests</small>
                </strong>
                <em className="amber-em">Needs your attention</em>
              </div>
            </div>
            <div className="requests-card">
              <div className="requests-heading">
                <div>
                  <b>Recent requests</b>
                  <small>Stay up to date with your team</small>
                </div>
                <span>This week⌄</span>
              </div>
              <div className="request-labels">
                <span>EMPLOYEE</span>
                <span>TYPE</span>
                <span>DATES</span>
                <span>STATUS</span>
              </div>
              {requests.map((request) => (
                <div className="request-row" key={request.initials}>
                  <div className="person">
                    <span className={`avatar avatar-${request.tone}`}>
                      {request.initials}
                    </span>
                    <span>
                      <b>{request.name}</b>
                      <small>{request.team}</small>
                    </span>
                  </div>
                  <span className="request-type">{request.type}</span>
                  <span className="request-date">{request.dates}</span>
                  <span className="status-pill">Approved</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="preview-caption">
        <span className="caption-dot" /> A little less admin. A lot more
        clarity.
      </div>
    </div>
  );
}

function HomePage() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <section className="hero-section" id="home">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="eyebrow-spark">✳</span> LEAVE MANAGEMENT, MADE
              SIMPLE
            </div>
            <h1>
              Time off, <span>without</span>
              <br className="desktop-break" /> the back and forth.
            </h1>
            <p className="hero-description">
              Give your team one calm place to request leave, track balances,
              and keep everyone in the loop.
            </p>
            <div className="hero-actions">
              <Link to="/signup" className="primary-cta">
                Get started for free <span>↗</span>
              </Link>
              <Link to="/features" className="secondary-cta">
                See how it works <span>→</span>
              </Link>
            </div>
            <div className="reassurance">
              <span className="check-mark">✓</span> Free to start <i /> No setup
              required <i /> Ready in minutes
            </div>
            <div className="social-proof">
              <div className="avatar-stack">
                <span className="avatar avatar-peach">AM</span>
                <span className="avatar avatar-purple">JK</span>
                <span className="avatar avatar-green">SR</span>
                <span className="avatar avatar-blue">+</span>
              </div>
              <span>
                <b>Made for teams that care</b>
                <small>Simple for everyone, from day one.</small>
              </span>
            </div>
          </div>
          <DashboardPreview />
        </section>
        <section className="benefit-strip" aria-label="LeaveFlow benefits">
          <span>Everything your team needs to take time off</span>
          <div>
            <span>✦ Clear leave balances</span>
            <span>✦ Faster approvals</span>
            <span>✦ Happier handovers</span>
          </div>
        </section>
        <section className="content-section features-section" id="features">
          <div className="section-heading">
            <span className="section-kicker">LESS ADMIN, MORE PEOPLE TIME</span>
            <h2>
              Everything leave management <span>should be.</span>
            </h2>
            <p>
              Simple tools that keep requests moving and your team in the know.
            </p>
          </div>
          <div className="feature-grid">
            <article className="feature-card">
              <div className="feature-icon icon-leaf">◷</div>
              <h3>Clear leave balances</h3>
              <p>
                Everyone can see their available days and past time off without
                asking HR.
              </p>
              <span className="feature-foot">
                Balances, always up to date <b>↗</b>
              </span>
            </article>
            <article className="feature-card">
              <div className="feature-icon icon-sun">✓</div>
              <h3>Approvals that flow</h3>
              <p>
                Review requests in one place, with the dates and team context
                you need.
              </p>
              <span className="feature-foot">
                Fewer inbox follow-ups <b>↗</b>
              </span>
            </article>
            <article className="feature-card">
              <div className="feature-icon icon-sky">▦</div>
              <h3>Know who’s around</h3>
              <p>
                A shared team view makes it easier to plan coverage and
                handovers.
              </p>
              <span className="feature-foot">
                A clearer view for everyone <b>↗</b>
              </span>
            </article>
          </div>
        </section>
        <section className="content-section process-section" id="how-it-works">
          <div className="process-copy">
            <span className="section-kicker">THREE EASY STEPS</span>
            <h2>
              From request to <span>approved.</span>
            </h2>
            <p>
              No complicated setup. Your team can get going in a few simple
              steps.
            </p>
            <Link to="/login" className="text-link">
              Try LeaveFlow for free <span>→</span>
            </Link>
          </div>
          <div className="steps-list">
            <article className="step-item">
              <span className="step-number">01</span>
              <div>
                <h3>Make a request</h3>
                <p>
                  Choose your dates and leave type. Your balance is right there
                  when you need it.
                </p>
              </div>
              <span className="step-symbol">↗</span>
            </article>
            <article className="step-item">
              <span className="step-number">02</span>
              <div>
                <h3>Get a clear decision</h3>
                <p>
                  Your manager gets the details and can approve with a single
                  click.
                </p>
              </div>
              <span className="step-symbol">✓</span>
            </article>
            <article className="step-item">
              <span className="step-number">03</span>
              <div>
                <h3>Keep the team in sync</h3>
                <p>
                  Approved days show up in the team view, so everyone can plan
                  ahead.
                </p>
              </div>
              <span className="step-symbol">▦</span>
            </article>
          </div>
        </section>
        <section className="about-section" id="about">
          <div className="about-mark">
            <span className="brand-symbol">
              <i />
              <i />
              <i />
            </span>
          </div>
          <div className="about-copy">
            <span className="section-kicker">A LITTLE ABOUT US</span>
            <h2>
              Time off should feel <span>easy.</span>
            </h2>
            <p>
              LeaveFlow helps small teams spend less time untangling
              spreadsheets and chasing email, and more time doing their best
              work. We believe taking a break should be simple for the person
              asking and clear for the people planning.
            </p>
            <div className="about-values">
              <span>
                <b>People first</b>
                <small>Built around real teams</small>
              </span>
              <span>
                <b>Simple by design</b>
                <small>Only what you need</small>
              </span>
              <span>
                <b>Clarity for all</b>
                <small>No more guesswork</small>
              </span>
            </div>
          </div>
          <div className="about-decoration">
            <span>
              Make room
              <br />
              for a little
              <br />
              <b>breathing space.</b>
            </span>
            <i>✳</i>
          </div>
        </section>
        <section className="bottom-cta">
          <div>
            <span className="section-kicker">READY WHEN YOU ARE</span>
            <h2>Make time off the easy part.</h2>
            <p>Give your team a calmer way to plan their next day away.</p>
          </div>
          <Link to="/signup" className="primary-cta">
            Get started for free <span>↗</span>
          </Link>
        </section>
      </main>
      <footer className="site-footer">
        <Link to="/" className="brand">
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <span>
            leaveflow<span className="brand-period">.</span>
          </span>
        </Link>
        <span>Less admin. More room to breathe.</span>
        <span>© {new Date().getFullYear()} LeaveFlow</span>
      </footer>
    </div>
  );
}

export default HomePage;

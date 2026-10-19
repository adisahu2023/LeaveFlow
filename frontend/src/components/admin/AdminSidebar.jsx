import { Link } from "react-router-dom";

const links = [
  ["Dashboard", "▦"],
  ["People", "♙"],
  ["Leave Overview", "☷"],
  ["My Profile", "⚙"],
];

function AdminSidebar({ activePage, onNavigate, profile }) {
  const name = profile.name || profile.username || "Administrator";
  const initials = name.split(/[\s._-]+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase() || "AD";

  return (
    <aside className="employee-sidebar admin-sidebar">
      <Link to="/" className="brand dashboard-brand" aria-label="LeaveFlow home">
        <span className="brand-symbol"><i /><i /><i /></span>
        <span>leaveflow<span className="brand-period">.</span></span>
      </Link>
      <div className="sidebar-caption">ADMIN WORKSPACE</div>
      <nav className="dashboard-nav" aria-label="Admin navigation">
        {links.map(([page, icon]) => (
          <button key={page} type="button" onClick={() => onNavigate(page)}
            className={`dashboard-nav-item ${activePage === page ? "is-active" : ""}`}>
            <span className="dashboard-nav-icon">{icon}</span><span>{page}</span>
          </button>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-help"><span className="help-icon">?</span><div><b>Need a hand?</b><small>Contact your HR team</small></div><span className="help-arrow">↗</span></div>
        <Link to="/" className="logout-button" onClick={() => localStorage.removeItem("token")}><span>⇥</span> Logout</Link>
        <div className="sidebar-user"><span className="user-avatar">{initials}</span><span><b>{name}</b><small>Administrator</small></span><span className="user-menu">···</span></div>
      </div>
    </aside>
  );
}

export default AdminSidebar;

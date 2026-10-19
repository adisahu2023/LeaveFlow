function AdminOverview({ users, leaves, onNavigate, loading }) {
  const totalEmployees = users.filter(
    (user) => user.role === "EMPLOYEE",
  ).length;
  const totalManagers = users.filter((user) => user.role === "MANAGER").length;
  const pending = leaves.filter((leave) => leave.status === "PENDING").length;
  const approved = leaves.filter((leave) => leave.status === "APPROVED").length;
  const rejected = leaves.filter((leave) => leave.status === "REJECTED").length;
  const recent = [...leaves]
    .sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""))
    .slice(0, 6);

  return (
    <div className="dashboard-inner admin-overview">
      <div className="dashboard-welcome">
        <div>
          <span className="dashboard-date">ADMIN WORKSPACE</span>
          <h1>
            Organization overview <span>✦</span>
          </h1>
          <p>Manage your people and monitor leave activity.</p>
        </div>
        <button
          className="apply-leave-shortcut"
          type="button"
          onClick={() => onNavigate("People")}
        >
          Manage people <span>→</span>
        </button>
      </div>
      <div className="leave-stats">
        {[
          [
            "Total employees",
            totalEmployees,
            "Employee accounts",
            "stat-icon-blue",
            "♙",
          ],
          [
            "Managers",
            totalManagers,
            "Manager accounts",
            "stat-icon-green",
            "♧",
          ],
          [
            "Pending requests",
            pending,
            "Awaiting manager review",
            "stat-icon-amber",
            "◷",
          ],
          [
            "Reviewed requests",
            approved + rejected,
            `${approved} approved · ${rejected} rejected`,
            "stat-icon-red",
            "✓",
          ],
        ].map(([label, count, caption, iconClass, icon]) => (
          <article className="leave-stat-card" key={label}>
            <div className="leave-stat-top">
              <span className={`stat-icon ${iconClass}`}>{icon}</span>
            </div>
            <span className="leave-stat-label">{label}</span>
            <strong>{count}</strong>
            <small>{caption}</small>
          </article>
        ))}
      </div>
      <section className="recent-leaves-card admin-recent-card">
        <div className="recent-leaves-heading">
          <div>
            <h2>Recent leave requests</h2>
            <p>System-wide request activity.</p>
          </div>
          <button
            type="button"
            className="view-all-button"
            onClick={() => onNavigate("Leave Overview")}
          >
            View leave overview <span>→</span>
          </button>
        </div>
        {loading ? (
          <div className="admin-loading">Loading organization data…</div>
        ) : recent.length ? (
          <div className="admin-recent-list">
            {recent.map((leave) => (
              <article key={leave.id}>
                <div className="admin-recent-person">
                  <span>
                    {(leave.employeeName || "E")
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </span>
                  <div>
                    <b>{leave.employeeName || "Employee"}</b>
                    <small>
                      {leave.leaveType} · {leave.startDate} – {leave.endDate}
                    </small>
                  </div>
                </div>
                <span
                  className={`leave-status status-${String(leave.status || "pending").toLowerCase()}`}
                >
                  <i />
                  {leave.status}
                </span>
              </article>
            ))}
          </div>
        ) : (
          <div className="admin-empty">
            No leave requests have been submitted.
          </div>
        )}
      </section>
    </div>
  );
}

export default AdminOverview;

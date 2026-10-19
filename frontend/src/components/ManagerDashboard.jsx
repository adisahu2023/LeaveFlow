import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

const API = "/manager";
const emptyProfile = { name: "", username: "", mobile: "", role: "MANAGER" };

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : date.toLocaleDateString("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
}

function ManagerDashboard() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(() => {
    try {
      const claims = token ? jwtDecode(token) : {};
      return {
        ...emptyProfile,
        name: claims.name || "",
        username: claims.username || claims.sub || "",
        role: claims.role || "ROLE_MANAGER",
      };
    } catch {
      return emptyProfile;
    }
  });
  const [leaves, setLeaves] = useState([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewBusy, setReviewBusy] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const managerName = profile.name || profile.username || "Manager";
  const initials =
    managerName
      .split(/[\s._-]+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "MG";
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  async function refreshLeaves() {
    const response = await axios.get(`${API}/leaves`, { headers });
    setLeaves(Array.isArray(response.data) ? response.data : []);
  }

  useEffect(() => {
    let cancelled = false;
    async function loadManagerWorkspace() {
      setLoading(true);
      try {
        const [leaveResult, profileResult] = await Promise.allSettled([
          axios.get(`${API}/leaves`, { headers }),
          axios.get(`${API}/profile`, { headers }),
        ]);
        if (cancelled) return;
        if (leaveResult.status === "fulfilled") {
          setLeaves(
            Array.isArray(leaveResult.value.data) ? leaveResult.value.data : [],
          );
          setError("");
        } else {
          throw leaveResult.reason;
        }
        if (profileResult.status === "fulfilled") {
          setProfile((current) => ({
            ...current,
            ...(profileResult.value.data || {}),
          }));
        } else {
          console.error(
            "Could not load manager profile:",
            profileResult.reason,
          );
          setError("Requests loaded, but profile details could not be loaded.");
        }
      } catch (requestError) {
        if (!cancelled) {
          console.error("Could not load manager workspace:", requestError);
          setError(
            "Could not load manager data. Check that the backend is running and your account has manager access.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadManagerWorkspace();
    return () => {
      cancelled = true;
    };
  }, [headers]);

  const counts = {
    total: leaves.length,
    pending: leaves.filter((leave) => leave.status === "PENDING").length,
    approved: leaves.filter((leave) => leave.status === "APPROVED").length,
    rejected: leaves.filter((leave) => leave.status === "REJECTED").length,
  };

  const visibleLeaves = leaves.filter((leave) => {
    if (
      activePage === "Leave History" &&
      !["APPROVED", "REJECTED"].includes(leave.status)
    )
      return false;
    if (
      activePage !== "Leave History" &&
      statusFilter !== "ALL" &&
      leave.status !== statusFilter
    )
      return false;
    const employeeText =
      `${leave.employeeName || ""} ${leave.employeeUsername || ""}`.toLowerCase();
    if (
      (activePage === "Leave History" || employeeFilter) &&
      !employeeText.includes(employeeFilter.trim().toLowerCase())
    )
      return false;
    const start = leave.startDate?.slice(0, 10) || "";
    if (activePage === "Leave History" && dateFrom && start < dateFrom)
      return false;
    if (activePage === "Leave History" && dateTo && start > dateTo)
      return false;
    return true;
  });

  function beginReview(leave) {
    setSelectedLeave(leave);
    setReviewComment("");
  }

  async function submitReview(status) {
    if (!selectedLeave || reviewBusy) return;
    setReviewBusy(true);
    setError("");
    try {
      const action = status === "APPROVED" ? "approve" : "reject";
      await axios.put(
        `${API}/${action}/${selectedLeave.id}`,
        { adminComment: reviewComment.trim() || null },
        { headers },
      );
      await refreshLeaves();
      setNotice(`Request ${status === "APPROVED" ? "approved" : "rejected"}.`);
      setSelectedLeave(null);
      setReviewComment("");
    } catch (requestError) {
      console.error("Could not review leave request:", requestError);
      setError(
        requestError.response?.data ||
          "Could not update this request. Refresh and try again.",
      );
    } finally {
      setReviewBusy(false);
    }
  }

  async function saveProfile(event) {
    event.preventDefault();
    setProfileBusy(true);
    setError("");
    try {
      const response = await axios.put(
        `${API}/profile`,
        { name: profile.name.trim(), mobile: Number(profile.mobile) },
        { headers },
      );
      setProfile((current) => ({ ...current, ...(response.data || {}) }));
      setNotice("Profile updated.");
    } catch (requestError) {
      console.error("Could not update manager profile:", requestError);
      setError(
        requestError.response?.data ||
          "Could not save your profile. Try again.",
      );
    } finally {
      setProfileBusy(false);
    }
  }

  function renderLeaveRows(rows) {
    if (!rows.length)
      return (
        <div className="manager-empty">
          <span>✓</span>
          <b>No leave requests here</b>
          <p>Requests matching these filters will appear here.</p>
        </div>
      );
    return (
      <div className="manager-table-wrap">
        <table className="manager-table">
          <thead>
            <tr>
              <th>EMPLOYEE</th>
              <th>LEAVE TYPE</th>
              <th>DATES</th>
              <th>REASON</th>
              <th>STATUS</th>
              <th>
                {activePage === "Leave History" ? "REVIEWED BY" : "ACTION"}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((leave) => (
              <tr key={leave.id}>
                <td>
                  <div className="manager-employee-cell">
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
                      <small>{leave.employeeUsername || ""}</small>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="manager-leave-type">
                    {String(leave.leaveType || "—").replaceAll("_", " ")}
                  </span>
                </td>
                <td>
                  <div className="manager-date-cell">
                    <b>{formatDate(leave.startDate)}</b>
                    <small>to {formatDate(leave.endDate)}</small>
                  </div>
                </td>
                <td>
                  <span className="manager-reason" title={leave.reason}>
                    {leave.reason || "—"}
                  </span>
                  {leave.adminComment && (
                    <small className="manager-comment-preview">
                      Review note: {leave.adminComment}
                    </small>
                  )}
                </td>
                <td>
                  <span
                    className={`leave-status status-${String(leave.status || "pending").toLowerCase()}`}
                  >
                    <i />
                    {leave.status}
                  </span>
                </td>
                <td>
                  {activePage === "Leave History" ? (
                    <span className="manager-reviewed-by">
                      {leave.reviewedBy || "—"}
                    </span>
                  ) : leave.status === "PENDING" ? (
                    <button
                      type="button"
                      className="manager-review-button"
                      onClick={() => beginReview(leave)}
                    >
                      Review <span>→</span>
                    </button>
                  ) : (
                    <span className="manager-reviewed-by">
                      {leave.reviewedBy || "Reviewed"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <main className="employee-dashboard manager-dashboard">
      <aside className="employee-sidebar">
        <Link
          to="/"
          className="brand dashboard-brand"
          aria-label="LeaveFlow home"
        >
          <span className="brand-symbol">
            <i />
            <i />
            <i />
          </span>
          <span>
            leaveflow<span className="brand-period">.</span>
          </span>
        </Link>
        <div className="sidebar-caption">MANAGER WORKSPACE</div>
        <nav className="dashboard-nav" aria-label="Manager navigation">
          {[
            ["Dashboard", "▦"],
            ["Manage Requests", "☷"],
            ["Leave History", "◷"],
            ["My Profile", "♙"],
          ].map(([page, icon]) => (
            <button
              type="button"
              key={page}
              onClick={() => {
                setActivePage(page);
                setNotice("");
              }}
              className={`dashboard-nav-item ${activePage === page ? "is-active" : ""}`}
            >
              <span className="dashboard-nav-icon">{icon}</span>
              <span>{page}</span>
            </button>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-help">
            <span className="help-icon">?</span>
            <div>
              <b>Need a hand?</b>
              <small>Contact your HR team</small>
            </div>
            <span className="help-arrow">↗</span>
          </div>
          <Link
            to="/"
            className="logout-button"
            onClick={() => localStorage.removeItem("token")}
          >
            <span>⇥</span> Logout
          </Link>
          <div className="sidebar-user">
            <span className="user-avatar">{initials}</span>
            <span>
              <b>{managerName}</b>
              <small>Manager account</small>
            </span>
            <span className="user-menu">···</span>
          </div>
        </div>
      </aside>

      <section className="dashboard-main-content">
        <header className="dashboard-topbar">
          <div className="breadcrumbs">
            Workspace <span>/</span> <b>{activePage}</b>
          </div>
          <div className="topbar-actions">
            <span className="manager-topbar-label">Manager workspace</span>
            <span className="topbar-avatar">{initials}</span>
          </div>
        </header>
        {error && (
          <div className="manager-alert manager-alert-error" role="alert">
            {String(error)}
          </div>
        )}
        {notice && (
          <div className="manager-alert manager-alert-success" role="status">
            {notice}
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss"
            >
              ×
            </button>
          </div>
        )}

        {activePage === "Dashboard" && (
          <div className="dashboard-inner manager-inner">
            <div className="dashboard-welcome">
              <div>
                <span className="dashboard-date">MANAGER WORKSPACE</span>
                <h1>
                  Good day, {managerName.split(" ")[0]} <span>✦</span>
                </h1>
                <p>Review your team’s leave activity and requests.</p>
              </div>
              <button
                className="apply-leave-shortcut"
                type="button"
                onClick={() => {
                  setActivePage("Manage Requests");
                  setStatusFilter("PENDING");
                }}
              >
                Review pending <span>→</span>
              </button>
            </div>
            <div className="leave-stats">
              {[
                [
                  "Total requests",
                  counts.total,
                  "All team requests",
                  "stat-icon-blue",
                  "☷",
                ],
                [
                  "Pending review",
                  counts.pending,
                  "Awaiting your decision",
                  "stat-icon-amber",
                  "◷",
                ],
                [
                  "Approved",
                  counts.approved,
                  "Approved requests",
                  "stat-icon-green",
                  "✓",
                ],
                [
                  "Rejected",
                  counts.rejected,
                  "Rejected requests",
                  "stat-icon-red",
                  "×",
                ],
              ].map(([label, value, caption, iconClass, icon]) => (
                <article className="leave-stat-card" key={label}>
                  <div className="leave-stat-top">
                    <span className={`stat-icon ${iconClass}`}>{icon}</span>
                  </div>
                  <span className="leave-stat-label">{label}</span>
                  <strong>{value}</strong>
                  <small>{caption}</small>
                </article>
              ))}
            </div>
            <section className="recent-leaves-card manager-recent-card">
              <div className="recent-leaves-heading">
                <div>
                  <h2>Needs your review</h2>
                  <p>Pending requests from employees assigned to you.</p>
                </div>
                <button
                  type="button"
                  className="view-all-button"
                  onClick={() => {
                    setActivePage("Manage Requests");
                    setStatusFilter("PENDING");
                  }}
                >
                  View requests <span>→</span>
                </button>
              </div>
              {loading ? (
                <div className="manager-loading">Loading team requests…</div>
              ) : (
                renderLeaveRows(
                  leaves
                    .filter((leave) => leave.status === "PENDING")
                    .slice(0, 6),
                )
              )}
            </section>
          </div>
        )}

        {activePage === "Manage Requests" && (
          <div className="manager-page-content">
            <div className="manager-page-heading">
              <div>
                <span className="dashboard-date">TEAM LEAVE</span>
                <h1>Manage Requests</h1>
                <p>Review and respond to leave requests from your team.</p>
              </div>
              <span className="manager-count-pill">
                {counts.pending} pending
              </span>
            </div>
            <section className="manager-list-card">
              <div className="manager-filter-bar">
                <div
                  className="manager-filter-tabs"
                  role="group"
                  aria-label="Filter requests by status"
                >
                  {[
                    ["ALL", "All requests"],
                    ["PENDING", "Pending"],
                    ["APPROVED", "Approved"],
                    ["REJECTED", "Rejected"],
                  ].map(([value, label]) => (
                    <button
                      type="button"
                      key={value}
                      className={statusFilter === value ? "selected" : ""}
                      onClick={() => setStatusFilter(value)}
                    >
                      {label}
                      <span>
                        {value === "ALL"
                          ? counts.total
                          : counts[value.toLowerCase()]}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
              {loading ? (
                <div className="manager-loading">Loading requests…</div>
              ) : (
                renderLeaveRows(visibleLeaves)
              )}
            </section>
          </div>
        )}

        {activePage === "Leave History" && (
          <div className="manager-page-content">
            <div className="manager-page-heading">
              <div>
                <span className="dashboard-date">TEAM RECORDS</span>
                <h1>Leave History</h1>
                <p>Previously reviewed requests and their decisions.</p>
              </div>
            </div>
            <section className="manager-list-card">
              <div className="manager-history-filters">
                <label>
                  Employee
                  <input
                    type="search"
                    placeholder="Name or username"
                    value={employeeFilter}
                    onChange={(event) => setEmployeeFilter(event.target.value)}
                  />
                </label>
                <label>
                  From
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(event) => setDateFrom(event.target.value)}
                  />
                </label>
                <label>
                  To
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(event) => setDateTo(event.target.value)}
                  />
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setEmployeeFilter("");
                    setDateFrom("");
                    setDateTo("");
                  }}
                >
                  Clear filters
                </button>
              </div>
              {loading ? (
                <div className="manager-loading">Loading history…</div>
              ) : (
                renderLeaveRows(visibleLeaves)
              )}
            </section>
          </div>
        )}

        {activePage === "My Profile" && (
          <div className="manager-page-content">
            <div className="manager-page-heading">
              <div>
                <span className="dashboard-date">YOUR ACCOUNT</span>
                <h1>My Profile</h1>
                <p>
                  View your manager account and update your contact details.
                </p>
              </div>
            </div>
            <div className="manager-profile-layout">
              <section className="manager-profile-hero">
                <span className="manager-profile-avatar">{initials}</span>
                <div>
                  <span className="profile-eyebrow">MANAGER ACCOUNT</span>
                  <h2>{managerName}</h2>
                  <p>{profile.username || "Username unavailable"}</p>
                </div>
                <span className="profile-role-pill">
                  <i /> Manager
                </span>
              </section>
              <form className="manager-profile-form" onSubmit={saveProfile}>
                <div className="profile-card-heading">
                  <div>
                    <span className="profile-card-icon">♙</span>
                    <div>
                      <h3>Personal details</h3>
                      <p>
                        Username and role are managed by your administrator.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="manager-profile-fields">
                  <label>
                    Full name
                    <input
                      value={profile.name || ""}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          name: event.target.value,
                        }))
                      }
                      required
                      maxLength={100}
                    />
                  </label>
                  <label>
                    Mobile number
                    <input
                      type="tel"
                      inputMode="numeric"
                      value={profile.mobile ?? ""}
                      onChange={(event) =>
                        setProfile((current) => ({
                          ...current,
                          mobile: event.target.value
                            .replace(/\D/g, "")
                            .slice(0, 18),
                        }))
                      }
                      required
                    />
                  </label>
                  <label>
                    Username
                    <input value={profile.username || ""} readOnly />
                  </label>
                  <label>
                    Role
                    <input
                      value={String(profile.role || "MANAGER").replace(
                        /^ROLE_/,
                        "",
                      )}
                      readOnly
                    />
                  </label>
                </div>
                <div className="manager-profile-actions">
                  <span>
                    Only your name and mobile number can be changed here.
                  </span>
                  <button
                    className="apply-leave-shortcut"
                    type="submit"
                    disabled={profileBusy}
                  >
                    {profileBusy ? "Saving…" : "Save changes"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </section>

      {selectedLeave && (
        <div
          className="manager-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !reviewBusy)
              setSelectedLeave(null);
          }}
        >
          <section
            className="manager-review-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
          >
            <button
              className="manager-modal-close"
              type="button"
              onClick={() => setSelectedLeave(null)}
              disabled={reviewBusy}
              aria-label="Close review"
            >
              ×
            </button>
            <span className="dashboard-date">PENDING REQUEST</span>
            <h2 id="review-title">Review leave request</h2>
            <p className="manager-modal-subtitle">
              Check the request details before recording your decision.
            </p>
            <div className="manager-review-employee">
              <span>
                {(selectedLeave.employeeName || "E")
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </span>
              <div>
                <b>{selectedLeave.employeeName || "Employee"}</b>
                <small>{selectedLeave.employeeUsername || ""}</small>
              </div>
            </div>
            <div className="manager-review-grid">
              <div>
                <small>Leave type</small>
                <b>
                  {String(selectedLeave.leaveType || "—").replaceAll("_", " ")}
                </b>
              </div>
              <div>
                <small>Duration</small>
                <b>
                  {formatDate(selectedLeave.startDate)} –{" "}
                  {formatDate(selectedLeave.endDate)}
                </b>
              </div>
              <div className="manager-review-reason">
                <small>Reason</small>
                <p>{selectedLeave.reason || "No reason provided."}</p>
              </div>
            </div>
            <label className="manager-comment-label">
              Review note <span>Optional</span>
              <textarea
                rows="3"
                maxLength={500}
                value={reviewComment}
                onChange={(event) => setReviewComment(event.target.value)}
                placeholder="Add a note for the employee, if needed"
              />
            </label>
            <div className="manager-review-actions">
              <button
                type="button"
                className="manager-reject-button"
                onClick={() => submitReview("REJECTED")}
                disabled={reviewBusy}
              >
                Reject
              </button>
              <button
                type="button"
                className="manager-approve-button"
                onClick={() => submitReview("APPROVED")}
                disabled={reviewBusy}
              >
                {reviewBusy ? "Saving…" : "Approve request"}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default ManagerDashboard;

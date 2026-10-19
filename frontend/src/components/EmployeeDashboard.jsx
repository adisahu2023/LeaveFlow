import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function EmployeeDashboard() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [profile, setProfile] = useState(() => {
    try {
      const claims = token ? jwtDecode(token) : {};
      return {
        manager: claims.manager || "",
        mobile: claims.mobile || "",
        name: claims.name || "",
        role: claims.role || "ROLE_EMPLOYEE",
        username: claims.username || claims.sub || "",
      };
    } catch {
      return { manager: "", mobile: "", name: "", role: "ROLE_EMPLOYEE", username: "" };
    }
  });
  const [profileLoading, setProfileLoading] = useState(true);
  const [profileError, setProfileError] = useState("");
  const [leaves, setLeaves] = useState([]);
  const [applyLeaves, setApplyLeaves] = useState({
    startDate: "",
    endDate: "",
    leaveType: "",
    reason: "",
  });
  const [editingLeaveId, setEditingLeaveId] = useState(null);

  const [activePage, setActivePage] = useState("Dashboard");
  const [message, setMessage] = useState("");
  const [requestDraft, setRequestDraft] = useState("");

  const profileName = profile.name || profile.username || "Employee";
  const profileInitials = profileName.split(/[\s._-]+/).filter(Boolean).slice(0, 2)
    .map((part) => part[0]).join("").toUpperCase() || "EM";

  useEffect(() => {
    async function loadProfile() {
      if (!token) {
        setProfileLoading(false);
        setProfileError("Sign in again to load your employee profile.");
        return;
      }

      try {
        const response = await axios.get("/employee/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = response.data?.data || response.data || {};
        setProfile((current) => ({
          manager: data.manager ?? current.manager ?? "",
          mobile: data.mobile ?? current.mobile ?? "",
          name: data.name ?? current.name ?? "",
          role: data.role ?? current.role ?? "ROLE_EMPLOYEE",
          username: data.username ?? current.username ?? "",
        }));
        setProfileError("");
      } catch (error) {
        console.error("Could not load employee profile:", error);
        setProfileError("Profile details could not be loaded. Showing available sign-in details.");
      } finally {
        setProfileLoading(false);
      }
    }

    loadProfile();
  }, [token]);

  useEffect(() => {
    async function temp() {
      try {

        const response = await axios.get(
          "/employee/leaves",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );

        setLeaves(response.data);
      } catch (error) {
        console.log("Could not load leaves:", error);
        setMessage("Could not load leaves. Check that the backend is running.");
      }
    }

    temp();
  }, []);

  const totalRequests = leaves.length;
  const pendingRequests = leaves.filter(
    (leave) => leave.status === "PENDING",
  ).length;
  const approvedRequests = leaves.filter(
    (leave) => leave.status === "APPROVED",
  ).length;
  const rejectedRequests = leaves.filter(
    (leave) => leave.status === "REJECTED",
  ).length;

  async function handleLeaveSubmit(event) {
    event.preventDefault();

    try {
      if (editingLeaveId) {
        await axios.put(
          `/employee/leaves/${editingLeaveId}`,
          applyLeaves,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          },
        );
      } else {
        await axios.post("/employee", applyLeaves, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      const response = await axios.get(
        "/employee/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLeaves(response.data);
      if (editingLeaveId) {
        setMessage("Leave request updated.");
      } else {
        setMessage("Leave request submitted.");
      }
      setActivePage("My Requests");
      setEditingLeaveId(null);
      setApplyLeaves({
        startDate: "",
        endDate: "",
        leaveType: "",
        reason: "",
      });
    } catch (error) {
      console.log("Could not submit leave request:", error);
      setMessage("Could not submit request. Check the backend and try again.");
    }

  }

  function handleEdit(leave) {
    setApplyLeaves({
      startDate: leave.startDate,
      endDate: leave.endDate,
      leaveType: leave.leaveType ,
      reason: leave.reason,
    });
    console.log(leave.leaveType)
    setEditingLeaveId(leave.id);
    setMessage("");
    setActivePage("Apply Leave Manually");
  }

  function handleLeaves(e) {
    const { name, value } = e.target;
    setApplyLeaves({
      ...applyLeaves,
      [name]: value,
    });
  }

  function handleGenerateDraft(event) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const draft = `Hello, I would like to request leave from ${formData.get("startDate")} to ${formData.get("endDate")}. ${formData.get("reason")}`;

    setRequestDraft(draft);
  }

 async  function handleDelete(id){
    try {
      await axios.delete(`/employee/leave/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const response = await axios.get(
        "/employee/leaves",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      setLeaves(response.data);
      setMessage("Leave request submitted.");
      setActivePage("My Requests");
    } catch (error) {
      console.log("Could not delete leave request:", error);
      setMessage("Could not delete request. Check the backend and try again.");
    }
  }

  return (
    <main className="employee-dashboard">
      <aside className="employee-sidebar">
        <Link
          to="/dashboard"
          className="brand dashboard-brand"
          aria-label="LeaveFlow dashboard"
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
        <div className="sidebar-caption">WORKSPACE</div>
        <nav
          className="dashboard-nav"
          aria-label="Employee dashboard navigation"
        >
          <button
            onClick={() => setActivePage("Dashboard")}
            className={`dashboard-nav-item ${activePage === "Dashboard" ? "is-active" : ""}`}
          >
            <span className="dashboard-nav-icon">▦</span>
            <span>Dashboard</span>
          </button>
          <button
            onClick={() => setActivePage("Generate Request with AI")}
            className={`dashboard-nav-item ${activePage === "Generate Request with AI" ? "is-active" : ""}`}
          >
            <span className="dashboard-nav-icon">✦</span>
            <span>Generate Request with AI</span>
          </button>
          <button
            onClick={() => setActivePage("Apply Leave Manually")}
            className={`dashboard-nav-item ${activePage === "Apply Leave Manually" ? "is-active" : ""}`}
          >
            <span className="dashboard-nav-icon">＋</span>
            <span>Apply Leave Manually</span>
          </button>
          <button
            onClick={() => setActivePage("My Requests")}
            className={`dashboard-nav-item ${activePage === "My Requests" ? "is-active" : ""}`}
          >
            <span className="dashboard-nav-icon">☷</span>
            <span>My Requests</span>
          </button>
          <button
            onClick={() => setActivePage("My Profile")}
            className={`dashboard-nav-item ${activePage === "My Profile" ? "is-active" : ""}`}
          >
            <span className="dashboard-nav-icon">♙</span>
            <span>My Profile</span>
          </button>
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
            <span className="user-avatar">{profileInitials}</span>
            <span>
              <b>{profileName}</b>
              <small>Employee account</small>
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
            <button className="topbar-icon" aria-label="Notifications">
              ♧<i />
            </button>
            <span className="topbar-avatar">{profileInitials}</span>
          </div>
        </header>

        {activePage === "Dashboard" && (
          <div className="dashboard-inner">
            <div className="dashboard-welcome">
              <div>
                <span className="dashboard-date">EMPLOYEE WORKSPACE</span>
                <h1>
                  Welcome back <span>✦</span>
                </h1>
                <p>Here’s a quick look at your leave activity.</p>
              </div>
              <button
                className="apply-leave-shortcut"
                type="button"
                onClick={() => setActivePage("Apply Leave Manually")}
              >
                <span>＋</span> Apply for leave
              </button>
            </div>
            <div className="leave-stats">
              <article className="leave-stat-card">
                <div className="leave-stat-top">
                  <span className="stat-icon stat-icon-blue">☷</span>
                </div>
                <span className="leave-stat-label">Total Requests</span>
                <strong>{totalRequests}</strong>
                <small>All leave requests</small>
              </article>
              <article className="leave-stat-card">
                <div className="leave-stat-top">
                  <span className="stat-icon stat-icon-amber">◷</span>
                </div>
                <span className="leave-stat-label">Pending</span>
                <strong>{pendingRequests}</strong>
                <small>Awaiting Review</small>
              </article>
              <article className="leave-stat-card">
                <div className="leave-stat-top">
                  <span className="stat-icon stat-icon-green">✓</span>
                </div>
                <span className="leave-stat-label">Approved</span>
                <strong>{approvedRequests}</strong>
                <small>Approved Requests</small>
              </article>
              <article className="leave-stat-card">
                <div className="leave-stat-top">
                  <span className="stat-icon stat-icon-red">×</span>
                </div>
                <span className="leave-stat-label">Rejected</span>
                <strong>{rejectedRequests}</strong>
                <small>Rejected Requests</small>
              </article>
            </div>
            <section className="recent-leaves-card" id="recent-leaves">
              <div className="recent-leaves-heading">
                <div>
                  <h2>Recent leaves</h2>
                  <p>Your latest leave requests and their status.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActivePage("My Requests")}
                  className="view-all-button"
                >
                  View all requests <span>→</span>
                </button>
              </div>
              {message && <p className="dashboard-message">{message}</p>}
              <div className="leave-table-wrap">
                <table className="leave-table">
                  <thead>
                    <tr>
                      <th>REASON</th>
                      <th>START DATE</th>
                      <th>END DATE</th>
                      <th>SUBMITTED</th>
                      <th>STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaves.map((leave) => (
                      <tr key={leave.id}>
                        <td>{leave.reason}</td>
                        <td>{leave.startDate}</td>
                        <td>{leave.endDate}</td>
                        <td>{leave.createdAt?.slice(0, 10)}</td>
                        <td>
                          <span
                            className={`leave-status status-${leave.status.toLowerCase()}`}
                          >
                            <i />
                            {leave.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mobile-leave-list">
                {leaves.map((leave) => (
                  <article className="mobile-leave-row" key={leave.id}>
                    <div>
                      <b>{leave.reason}</b>
                      <span>
                        {leave.startDate} – {leave.endDate}
                      </span>
                    </div>
                    <span
                      className={`leave-status status-${leave.status.toLowerCase()}`}
                    >
                      <i />
                      {leave.status}
                    </span>
                  </article>
                ))}
              </div>
            </section>
          </div>
        )}

        {activePage === "Apply Leave Manually" && (
          
          <div className="dashboard-page-content">
            <h1>{editingLeaveId ? "Update Leave Request" : "Apply Leave Manually"}</h1>
            <p>Fill in your leave details below.</p>
            <form className="dashboard-form" onSubmit={handleLeaveSubmit}>
              <label>
                Start date
                <input
                  name="startDate"
                  value={applyLeaves.startDate}
                  onChange={handleLeaves}
                  type="date"
                  required
                />
              </label>
              <label>
                End date
                <input
                  name="endDate"
                  type="date"
                  value={applyLeaves.endDate}
                  onChange={handleLeaves}
                  required
                />
              </label>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Leave Type
              </label>

              <select
                name="leaveType"
                value={applyLeaves.leaveType}
                onChange={handleLeaves}
                required
                className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3
    text-gray-700 outline-none transition
    focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Select Leave Type</option>
                <option value="CASUAL">Casual Leave</option>
                <option value="SICK">Sick Leave</option>
                <option value="MATERNITY">Maternity Leave</option>
              </select>
              <label>
                Reason
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Why do you need leave?"
                  onChange={handleLeaves}
                  value={applyLeaves.reason}
                  required
                />
              </label>
              <button className="apply-leave-shortcut" type="submit">
                {editingLeaveId ? "Update request" : "Submit request"}
              </button>
              {message && <span className="profile-message">{message}</span>}
            </form>
          </div>
        )}

        {activePage === "Generate Request with AI" && (
          <div className="dashboard-page-content">
            <h1>Generate Request with AI</h1>
            <p>Enter your details to create a request draft.</p>
            <form className="dashboard-form" onSubmit={handleGenerateDraft}>
              <label>
                Start date
                <input name="startDate" type="date" required />
              </label>
              <label>
                End date
                <input name="endDate" type="date" required />
              </label>
              <label>
                Reason
                <textarea
                  name="reason"
                  rows="3"
                  placeholder="Why do you need leave?"
                  required
                />
              </label>
              <button className="apply-leave-shortcut" type="submit">
                Generate draft
              </button>
            </form>
            {requestDraft && (
              <div className="request-draft">
                <h2>Your request draft</h2>
                <p>{requestDraft}</p>
              </div>
            )}
          </div>
        )}

        {activePage === "My Requests" && (
          <div className="dashboard-page-content">
            <h1>My Requests</h1>
            <p>Your leave requests from the API.</p>
            <div className="request-list">
              {leaves.map((leave) => (
                <article key={leave.id}>
                  <div>
                    <b>{leave.reason}</b>
                    <span>
                      {leave.startDate} – {leave.endDate}
                    </span>
                  </div>
                  
                  <span
                    className={`leave-status status-${leave.status.toLowerCase()}`}
                  >
                    
                     
                    <i />

                    {leave.status}
                    
                  </span>
                  {leave.status === "PENDING" && (
                    <>
                      <button type="button" className="request-action update-request" onClick={() => handleEdit(leave)}>UPDATE</button>
                      <button type="button" className="request-action delete-request" onClick={() => handleDelete(leave.id)}>DELETE</button>
                    </>
                  )}
                 
                </article>
              ))}
            </div>
            {message && <p className="dashboard-message">{message}</p>}
          </div>
        )}

        {activePage === "My Profile" && (
          <div className="profile-page">
            <div className="profile-page-heading">
              <div>
                <span className="dashboard-date">YOUR ACCOUNT</span>
                <h1>My Profile</h1>
                <p>Your employee details and reporting information.</p>
              </div>
              <span className="profile-secure-label"><i /> Secure account</span>
            </div>

            <section className="profile-hero">
              <div className="profile-hero-art" aria-hidden="true"><i /><i /><i /></div>
              <div className="profile-identity">
                <span className="profile-avatar">{profileInitials}</span>
                <div>
                  <span className="profile-eyebrow">EMPLOYEE ACCOUNT</span>
                  <h2>{profileName}</h2>
                  <p>{profile.username || "Username not provided"}</p>
                </div>
              </div>
              <span className="profile-role-pill"><i /> Active employee</span>
            </section>

            <div className="profile-content-grid">
              <section className="profile-card profile-details-card">
                <div className="profile-card-heading">
                  <div><span className="profile-card-icon">♙</span><div><h3>{profile.name}</h3><p>{profile.role}</p></div></div>
                  <span className="profile-readonly">ACCOUNT</span>
                </div>
                {profileLoading && <p className="profile-fetch-message">Loading profile details…</p>}
                {profileError && <p className="profile-fetch-message profile-fetch-error">{profileError}</p>}
                <div className="profile-details-grid">
                  <div className="profile-detail"><span>Name</span><strong>{profile.name || "Not provided"}</strong></div>
                  <div className="profile-detail"><span>Username</span><strong>{profile.username || "Not provided"}</strong></div>
                  <div className="profile-detail"><span>Mobile</span><strong>{profile.mobile || "Not provided"}</strong></div>
                  <div className="profile-detail"><span>Manager</span><strong>{ profile.manager?profile.manager : "Not provided"}</strong></div>
                  <div className="profile-detail"><span>Role</span><strong>{String(profile.role || "Not provided").replace(/^ROLE_/, "").toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</strong></div>
                </div>
                <div className="profile-info-note"><span>i</span><p>Your profile details are loaded from your employee account. Contact HR if you need to update your information.</p></div>
              </section>

              <aside className="profile-card profile-access-card">
                <div className="profile-card-heading">
                  <div><span className="profile-card-icon profile-lock-icon">⌑</span><div><h3>Account access</h3><p>Your workspace permissions</p></div></div>
                </div>
                <div className="profile-access-row"><span className="profile-access-symbol">▦</span><div><b>Employee workspace</b><small>Leave requests and activity</small></div><span className="profile-check">✓</span></div>
                <div className="profile-access-row"><span className="profile-access-symbol">♧</span><div><b>Role</b><small>{String(profile.role || "ROLE_EMPLOYEE").replace(/^ROLE_/, "").toLowerCase().replace(/^./, (letter) => letter.toUpperCase())}</small></div><span className="profile-check">✓</span></div>
                <div className="profile-access-foot"><span className="profile-shield">✓</span><p>Your session is protected with secure token authentication.</p></div>
              </aside>
            </div>
          </div>
        )}
      </section>
    </main>
  );
}

export default EmployeeDashboard;

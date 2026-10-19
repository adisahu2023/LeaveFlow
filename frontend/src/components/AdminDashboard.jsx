import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useEffect, useMemo, useState } from "react";
import AdminLeaveOverview from "./admin/AdminLeaveOverview";
import AdminOverview from "./admin/AdminOverview";
import AdminPeople from "./admin/AdminPeople";
import AdminProfile from "./admin/AdminProfile";
import AdminSidebar from "./admin/AdminSidebar";

const API = "/admin";

function AdminDashboard() {
  const token = localStorage.getItem("token");
  const [profile, setProfile] = useState(() => {
    try {
      const claims = token ? jwtDecode(token) : {};
      return {
        name: claims.name || "",
        username: claims.username || claims.sub || "",
        mobile: "",
        role: claims.role || "ROLE_ADMIN",
      };
    } catch {
      return { name: "", username: "", mobile: "", role: "ROLE_ADMIN" };
    }
  });
  const [users, setUsers] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [activePage, setActivePage] = useState("Dashboard");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const headers = useMemo(
    () => ({ Authorization: `Bearer ${token}` }),
    [token],
  );

  async function loadData() {
    const [usersResult, leavesResult, profileResult] = await Promise.allSettled(
      [
        axios.get(`${API}/users`, { headers }),
        axios.get(`${API}/leaves`, { headers }),
        axios.get(`${API}/profile`, { headers }),
      ],
    );
    if (usersResult.status === "rejected") throw usersResult.reason;
    if (leavesResult.status === "rejected") throw leavesResult.reason;
    setUsers(
      Array.isArray(usersResult.value.data) ? usersResult.value.data : [],
    );
    setLeaves(
      Array.isArray(leavesResult.value.data) ? leavesResult.value.data : [],
    );
    if (profileResult.status === "fulfilled")
      setProfile((current) => ({
        ...current,
        ...(profileResult.value.data || {}),
      }));
    else console.error("Could not load admin profile:", profileResult.reason);
    setError("");
  }

  useEffect(() => {
    let cancelled = false;
    async function initialize() {
      try {
        await loadData();
      } catch (requestError) {
        if (!cancelled) {
          console.error("Could not load admin workspace:", requestError);
          setError(
            "Could not load admin data. Check the backend connection and your account role.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    initialize();
    return () => {
      cancelled = true;
    };
  }, [headers]);

  async function reload() {
    try {
      await loadData();
    } catch (requestError) {
      console.error("Could not refresh admin data:", requestError);
      setError("Could not refresh the admin data.");
    }
  }

  function showMessage(message, isError = false) {
    if (isError) {
      setError(String(message));
      setNotice("");
    } else {
      setNotice(message);
      setError("");
    }
  }

  return (
    <main className="employee-dashboard admin-dashboard">
      <AdminSidebar
        activePage={activePage}
        onNavigate={(page) => {
          setActivePage(page);
          setError("");
          setNotice("");
        }}
        profile={profile}
      />
      <section className="dashboard-main-content">
        <header className="dashboard-topbar">
          <div className="breadcrumbs">
            Workspace <span>/</span> <b>{activePage}</b>
          </div>
          <div className="topbar-actions">
            <span className="admin-topbar-label">Administrator workspace</span>
            <span className="topbar-avatar">
              {(profile.name || profile.username || "AD")
                .split(/[\s._-]+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
        </header>
        {error && (
          <div className="admin-alert admin-alert-error" role="alert">
            {error}
          </div>
        )}
        {notice && (
          <div className="admin-alert admin-alert-success" role="status">
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
          <AdminOverview
            users={users}
            leaves={leaves}
            onNavigate={setActivePage}
            loading={loading}
          />
        )}
        {activePage === "People" && (
          <AdminPeople
            users={users}
            token={token}
            currentUsername={profile.username}
            onReload={reload}
            onMessage={showMessage}
          />
        )}
        {activePage === "Leave Overview" && (
          <AdminLeaveOverview leaves={leaves} />
        )}
        {activePage === "My Profile" && (
          <AdminProfile
            key={`${profile.username}-${profile.name}-${profile.mobile}`}
            profile={profile}
            token={token}
            onProfileUpdate={setProfile}
            onMessage={showMessage}
          />
        )}
      </section>
    </main>
  );
}

export default AdminDashboard;

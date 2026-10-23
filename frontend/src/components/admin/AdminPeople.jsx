import axios from "axios";
import { useMemo, useState } from "react";

const API = "/admin";

function AdminPeople({ users, token, currentUsername, onReload, onMessage }) {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [passwordTarget, setPasswordTarget] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [busyId, setBusyId] = useState(null);
  const [assignments, setAssignments] = useState({});
  const [newUser, setNewUser] = useState({ name: "", username: "", mobile: "", password: "", role: "EMPLOYEE" });
  const [formError, setFormError] = useState("");
  const headers = useMemo(() => ({ Authorization: `Bearer ${token}` }), [token]);
  const managers = users.filter((user) => user.role === "MANAGER" && user.active !== "DEACTIVE");
  const filteredUsers = users.filter((user) => {
    if (filter !== "ALL" && user.role !== filter) return false;
    const query = search.trim().toLowerCase();
    return !query || `${user.name} ${user.username} ${user.managerName || ""}`.toLowerCase().includes(query);
  });

  async function createUser(event) {
    event.preventDefault();
    setFormError("");
    try {
      await axios.post(`${API}/user`, { ...newUser, mobile: Number(newUser.mobile), active: "ACTIVE" }, { headers });
      setNewUser({ name: "", username: "", mobile: "", password: "", role: "EMPLOYEE" });
      setShowCreate(false);
      onMessage("Account created.");
      await onReload();
    } catch (error) {
      setFormError(error.response?.data?.message || "Could not create account. Check that the username is unique.");
    }
  }

  async function setEmployeePassword(event) {
    event.preventDefault();
    setPasswordError("");
    setBusyId(passwordTarget.id);
    try {
      await axios.post(`${API}/password`, null, { headers, params: { username: passwordTarget.username, pass: newPassword } });
      onMessage(`Password updated for ${passwordTarget.name}.`);
      setPasswordTarget(null);
      setNewPassword("");
    } catch (error) {
      setPasswordError(error.response?.data?.message || "Could not update the user password.");
    } finally {
      setBusyId(null);
    }
  }

  async function updateRole(user, role) {
    if (!role || role === user.role) return;
    setBusyId(user.id);
    try {
      await axios.put(`${API}/user/${user.id}`, { role }, { headers });
      onMessage(`Role updated for ${user.name}.`);
      await onReload();
    } catch (error) {
      onMessage(error.response?.data?.message || "Could not update account role.", true);
    } finally { setBusyId(null); }
  }

  async function toggleActive(user) {
    const active = user.active === "DEACTIVE" ? "ACTIVE" : "DEACTIVE";
    setBusyId(user.id);
    try {
      await axios.put(`${API}/user/${user.id}/active`, null, { headers, params: { active } });
      onMessage(`${user.name} is now ${active === "ACTIVE" ? "active" : "deactivated"}.`);
      await onReload();
    } catch (error) {
      onMessage(error.response?.data?.message || "Could not update account status.", true);
    } finally { setBusyId(null); }
  }

  async function assignManager(employee) {
    const managerId = assignments[employee.id];
    if (!managerId || String(managerId) === String(employee.managerId ?? "")) return;
    setBusyId(employee.id);
    try {
      await axios.put(`${API}/employee/${employee.id}/manager/${managerId}`, {}, { headers });
      onMessage(`Manager assigned to ${employee.name}.`);
      await onReload();
    } catch (error) {
      onMessage(error.response?.data?.message || "Could not assign manager.", true);
    } finally { setBusyId(null); }
  }

  return <div className="admin-page-content"><div className="admin-page-heading"><div><span className="dashboard-date">ORGANIZATION</span><h1>People</h1><p>Create accounts, manage roles, and assign employees to managers.</p></div><button className="apply-leave-shortcut" type="button" onClick={() => setShowCreate(true)}>＋ Add account</button></div>
    <section className="admin-list-card"><div className="admin-people-toolbar"><div className="admin-role-tabs">{[["ALL", "All"], ["EMPLOYEE", "Employees"], ["MANAGER", "Managers"], ["ADMIN", "Admins"]].map(([role, label]) => <button type="button" key={role} className={filter === role ? "selected" : ""} onClick={() => setFilter(role)}>{label}<span>{role === "ALL" ? users.length : users.filter((user) => user.role === role).length}</span></button>)}</div><input className="admin-search" type="search" placeholder="Search people" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <div className="admin-users-wrap"><table className="admin-users-table"><thead><tr><th>PERSON</th><th>ROLE</th><th>MANAGER</th><th>STATUS</th><th>ACCOUNT ACTIONS</th></tr></thead><tbody>{filteredUsers.map((user) => <tr key={user.id}><td><div className="admin-user-cell"><span>{(user.name || "U").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><b>{user.name}</b><small>{user.username} · {user.mobile}</small></div></div></td><td><select aria-label={`Role for ${user.name}`} value={user.role} disabled={busyId === user.id || user.username === currentUsername} onChange={(event) => updateRole(user, event.target.value)}><option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option></select></td><td>{user.role === "EMPLOYEE" ? managers.length ? <div className="admin-assign-manager"><select aria-label={`Select manager for ${user.name}`} value={assignments[user.id] ?? (user.managerId ? String(user.managerId) : "")} disabled={busyId === user.id} onChange={(event) => setAssignments((current) => ({ ...current, [user.id]: event.target.value }))}><option value="">Select manager</option>{managers.map((manager) => <option key={manager.id} value={manager.id}>{manager.name}</option>)}</select><button type="button" disabled={!assignments[user.id] || String(assignments[user.id]) === String(user.managerId ?? "") || busyId === user.id} onClick={() => assignManager(user)}>{user.managerId ? "Change" : "Assign"}</button></div> : <span className="admin-muted">No managers yet</span> : <span className="admin-muted">—</span>}</td><td><span className={`admin-active-pill ${user.active === "DEACTIVE" ? "inactive" : "active"}`}><i />{user.active || "ACTIVE"}</span></td><td><div className="admin-account-actions"><button type="button" className={`admin-status-button ${user.active === "DEACTIVE" ? "reactivate" : "deactivate"}`} disabled={busyId === user.id || user.username === currentUsername} onClick={() => toggleActive(user)}>{user.active === "DEACTIVE" ? "Activate" : "Deactivate"}</button>{(user.role === "EMPLOYEE" || user.role === "MANAGER") && <button type="button" className="admin-status-button set-password" disabled={busyId === user.id} onClick={() => { setPasswordTarget(user); setNewPassword(""); setPasswordError(""); }}>Set password</button>}</div></td></tr>)}</tbody></table>{filteredUsers.length === 0 && <div className="admin-empty">No people match your filters.</div>}</div>
    </section>

    {passwordTarget && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget && !busyId) setPasswordTarget(null); }}><form className="admin-create-modal admin-password-modal" onSubmit={setEmployeePassword}><button type="button" className="admin-close-button" onClick={() => setPasswordTarget(null)} aria-label="Close" disabled={Boolean(busyId)}>×</button><span className="dashboard-date">USER ACCOUNT</span><h2>Set a password</h2><p>Choose a new password for {passwordTarget.name} ({passwordTarget.username}).</p>{passwordError && <div className="admin-form-error" role="alert">{passwordError}</div>}<div className="admin-create-fields"><label className="admin-role-select">New password<input type="password" autoComplete="new-password" required minLength={8} value={newPassword} onChange={(event) => setNewPassword(event.target.value)} /></label></div><div className="admin-create-actions"><button type="button" onClick={() => setPasswordTarget(null)} disabled={Boolean(busyId)}>Cancel</button><button type="submit" className="apply-leave-shortcut" disabled={Boolean(busyId)}>{busyId ? "Updating…" : "Update password"}</button></div></form></div>}
    {showCreate && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setShowCreate(false); }}><form className="admin-create-modal" onSubmit={createUser}><button type="button" className="admin-close-button" onClick={() => setShowCreate(false)} aria-label="Close">×</button><span className="dashboard-date">NEW ACCOUNT</span><h2>Create a user</h2><p>Add an employee, manager, or administrator account.</p>{formError && <div className="admin-form-error">{formError}</div>}<div className="admin-create-fields"><label>Full name<input required maxLength={100} value={newUser.name} onChange={(event) => setNewUser((current) => ({ ...current, name: event.target.value }))} /></label><label>Username<input required maxLength={50} value={newUser.username} onChange={(event) => setNewUser((current) => ({ ...current, username: event.target.value }))} /></label><label>Mobile<input required inputMode="numeric" value={newUser.mobile} onChange={(event) => setNewUser((current) => ({ ...current, mobile: event.target.value.replace(/\D/g, "").slice(0, 18) }))} /></label><label>Temporary password<input type="password" required minLength={8} value={newUser.password} onChange={(event) => setNewUser((current) => ({ ...current, password: event.target.value }))} /></label><label className="admin-role-select">Account role<select value={newUser.role} onChange={(event) => setNewUser((current) => ({ ...current, role: event.target.value }))}><option value="EMPLOYEE">Employee</option><option value="MANAGER">Manager</option><option value="ADMIN">Admin</option></select></label></div><div className="admin-create-actions"><button type="button" onClick={() => setShowCreate(false)}>Cancel</button><button type="submit" className="apply-leave-shortcut">Create account</button></div></form></div>}
  </div>;
}

export default AdminPeople;

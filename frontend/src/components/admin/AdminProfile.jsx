import axios from "axios";
import { useState } from "react";

function AdminProfile({ profile, token, onProfileUpdate, onMessage }) {
  const [name, setName] = useState(profile.name || "");
  const [mobile, setMobile] = useState(String(profile.mobile || ""));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const initials = (name || profile.username || "Admin").split(/[\s._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]).join("").toUpperCase();

  async function save(event) {
    event.preventDefault();
    setSaving(true);
    setError("");
    try {
      const response = await axios.put("/admin/profile", { name: name.trim(), mobile: Number(mobile) }, { headers: { Authorization: `Bearer ${token}` } });
      onProfileUpdate(response.data);
      onMessage("Profile updated.");
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Could not save profile details.");
    } finally { setSaving(false); }
  }

  return <div className="admin-page-content"><div className="admin-page-heading"><div><span className="dashboard-date">YOUR ACCOUNT</span><h1>My Profile</h1><p>Update your contact details and review your admin account.</p></div></div>
    <div className="admin-profile-layout"><section className="admin-profile-card"><span className="admin-profile-avatar">{initials}</span><span className="profile-eyebrow">ADMINISTRATOR</span><h2>{profile.name || "Administrator"}</h2><p>{profile.username || "Username unavailable"}</p><span className="profile-role-pill"><i /> {profile.role || "ADMIN"}</span></section>
      <form className="admin-profile-form" onSubmit={save}><div className="profile-card-heading"><div><span className="profile-card-icon">♙</span><div><h3>Personal details</h3><p>Username and role are managed by your system administrator.</p></div></div></div>{error && <div className="admin-form-error">{error}</div>}<div className="admin-create-fields"><label>Full name<input required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} /></label><label>Mobile number<input required inputMode="numeric" value={mobile} onChange={(event) => setMobile(event.target.value.replace(/\D/g, "").slice(0, 18))} /></label><label>Username<input readOnly value={profile.username || ""} /></label><label>Role<input readOnly value={profile.role || "ADMIN"} /></label></div><div className="admin-profile-actions"><span>Only your name and mobile number are editable.</span><button className="apply-leave-shortcut" disabled={saving}>{saving ? "Saving…" : "Save changes"}</button></div></form>
    </div>
  </div>;
}

export default AdminProfile;

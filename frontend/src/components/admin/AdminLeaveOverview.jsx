import { useState } from "react";

const filters = ["ALL", "PENDING", "APPROVED", "REJECTED"];

function displayDate(value) {
  if (!value) return "—";
  const date = new Date(`${value.slice(0, 10)}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleDateString("en", { month: "short", day: "numeric", year: "numeric" });
}

function AdminLeaveOverview({ leaves }) {
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const visibleLeaves = leaves.filter((leave) => {
    if (status !== "ALL" && leave.status !== status) return false;
    return `${leave.employeeName || ""} ${leave.employeeUsername || ""}`.toLowerCase().includes(search.trim().toLowerCase());
  });

  return <div className="admin-page-content"><div className="admin-page-heading"><div><span className="dashboard-date">SYSTEM-WIDE RECORDS</span><h1>Leave Overview</h1><p>View leave requests across the organization. Managers make approval decisions.</p></div></div>
    <section className="admin-list-card"><div className="admin-leave-toolbar"><div className="admin-role-tabs">{filters.map((value) => <button type="button" key={value} className={status === value ? "selected" : ""} onClick={() => setStatus(value)}>{value === "ALL" ? "All requests" : value.charAt(0) + value.slice(1).toLowerCase()}<span>{value === "ALL" ? leaves.length : leaves.filter((leave) => leave.status === value).length}</span></button>)}</div><input className="admin-search" type="search" placeholder="Search employee" value={search} onChange={(event) => setSearch(event.target.value)} /></div>
      <div className="admin-users-wrap"><table className="admin-users-table admin-leave-table"><thead><tr><th>EMPLOYEE</th><th>LEAVE TYPE</th><th>DATES</th><th>REASON</th><th>STATUS</th><th>REVIEW</th></tr></thead><tbody>{visibleLeaves.map((leave) => <tr key={leave.id}><td><div className="admin-user-cell"><span>{(leave.employeeName || "E").split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}</span><div><b>{leave.employeeName || "Employee"}</b><small>{leave.employeeUsername || ""}</small></div></div></td><td>{String(leave.leaveType || "—").replaceAll("_", " ")}</td><td><div className="admin-leave-dates"><b>{displayDate(leave.startDate)}</b><small>to {displayDate(leave.endDate)}</small></div></td><td><span className="admin-truncate" title={leave.reason}>{leave.reason || "—"}</span></td><td><span className={`leave-status status-${String(leave.status || "pending").toLowerCase()}`}><i />{leave.status}</span></td><td><button type="button" className="admin-view-button" onClick={() => setSelected(leave)}>Details</button></td></tr>)}</tbody></table>{visibleLeaves.length === 0 && <div className="admin-empty">No leave requests match your filters.</div>}</div>
    </section>
    {selected && <div className="admin-modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}><section className="admin-create-modal admin-leave-detail" role="dialog" aria-modal="true"><button className="admin-close-button" type="button" onClick={() => setSelected(null)} aria-label="Close">×</button><span className="dashboard-date">LEAVE REQUEST #{selected.id}</span><h2>{selected.employeeName}</h2><p>{selected.employeeUsername} · {String(selected.leaveType || "").replaceAll("_", " ")}</p><div className="admin-detail-grid"><div><small>Start date</small><b>{displayDate(selected.startDate)}</b></div><div><small>End date</small><b>{displayDate(selected.endDate)}</b></div><div><small>Status</small><b>{selected.status}</b></div><div><small>Reviewed by</small><b>{selected.reviewedBy || "Not reviewed yet"}</b></div><div className="admin-detail-wide"><small>Reason</small><p>{selected.reason || "No reason provided."}</p></div>{selected.adminComment && <div className="admin-detail-wide"><small>Review note</small><p>{selected.adminComment}</p></div>}</div><div className="admin-detail-foot">This is an oversight view. Assigned managers handle approvals and rejections.</div></section></div>}
  </div>;
}

export default AdminLeaveOverview;

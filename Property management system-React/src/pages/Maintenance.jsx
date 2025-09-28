import React, { useEffect, useState } from "react";

const Maintenance = () => {
  const [requestID, setRequestID] = useState("");
  const [propertyID, setPropertyID] = useState("");
  const [tenantID, setTenantID] = useState("");
  const [issueDescription, setIssueDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const apiBase = "https://localhost:7067/api/MaintenanceRequest";

  const roles = JSON.parse(localStorage.getItem("authRoles") || "[]");
  const isAdmin = roles.includes("Admin");
  const isTenant = roles.includes("Tenant");

  // Load token and tenant ID from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedTenantID = localStorage.getItem("tenantID");
    if (storedToken) setToken(storedToken);
    if (storedTenantID) setTenantID(storedTenantID);
  }, []);

  // Fetch requests only after token is set
  useEffect(() => {
    if (token) {
      handleRead();
    }
  }, [token]);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const mapError = (text, status, action) => {
    if (status === 401) return `${action} failed: Unauthorized. Please log in again.`;
    if (status === 404) return `${action} failed: Request not found.`;
    if (status === 400 && text.includes("FOREIGN KEY"))
      return `${action} failed: Invalid Property ID or Tenant ID.`;
    if (text.includes("SqlException") || text.includes("SqlClient"))
      return `${action} failed: Database error.`;
    return `${action} failed:\n${text}`;
  };

  const handleCreate = async () => {
    if (!propertyID || !tenantID) return alert("Property ID and Tenant ID are required");
    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          propertyID,
          tenantID,
          issueDescription,
          status: status || "Pending",
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Create"));
        return;
      }

      alert("Maintenance request created successfully");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Create failed:\n${err.message}`);
    }
  };

  const handleRead = async () => {
    try {
      let url = apiBase;
      if (isTenant && tenantID) {
        url = `${apiBase}/tenant/${tenantID}`;
      }

      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Read"));
        return;
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      alert(`Read failed:\n${err.message}`);
    }
  };

  const handleReadOne = async (id) => {
    try {
      const response = await fetch(`${apiBase}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "View Details"));
        return;
      }

      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      alert(`View Details failed:\n${err.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!requestID) return alert("Please select a request to update");
    try {
      const response = await fetch(`${apiBase}/${requestID}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          propertyID,
          tenantID,
          issueDescription,
          status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Update"));
        return;
      }

      alert("Maintenance request updated");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Update failed:\n${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    try {
      const response = await fetch(`${apiBase}/${id}`, {
        method: "DELETE",
        headers: authHeaders,
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Delete"));
        return;
      }

      alert("Maintenance request deleted");
      handleRead();
    } catch (err) {
      alert(`Delete failed:\n${err.message}`);
    }
  };

  const handleEditClick = (req) => {
    setRequestID(req.requestID);
    setPropertyID(req.propertyID);
    setTenantID(req.tenantID);
    setIssueDescription(req.issueDescription);
    setStatus(req.status);
    setIsEditing(true);
  };

  const resetForm = () => {
    setRequestID("");
    setPropertyID("");
    setTenantID("");
    setIssueDescription("");
    setStatus("");
    setIsEditing(false);
  };

  return (
    <div
      style={{
        backgroundImage: `url('https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1974')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        minHeight: '100vh',
        width: '100%',
      }}
    >
      <div className="container mt-5 pt-5">
        <div className="card p-4 shadow-sm">
          <h2 className="mb-4 text-center">Maintenance Requests</h2>

          <div className="mb-3">
            <label className="form-label">Request ID</label>
            <input
              type="text"
              className="form-control"
              value={requestID}
              disabled={isEditing}
              onChange={(e) => setRequestID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Property ID</label>
            <input
              type="text"
              className="form-control"
              value={propertyID}
              disabled={isEditing}
              onChange={(e) => setPropertyID(e.target.value)}
            />
          </div>

          {!isTenant && (
            <div className="mb-3">
              <label className="form-label">Tenant ID</label>
              <input
                type="text"
                className="form-control"
                value={tenantID}
                disabled={isEditing}
                onChange={(e) => setTenantID(e.target.value)}
              />
            </div>
          )}

          <div className="mb-3">
            <label className="form-label">Issue Description</label>
            <input
              type="text"
              className="form-control"
              value={issueDescription}
              onChange={(e) => setIssueDescription(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <input
              type="text"
              className="form-control"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            />
          </div>

          <div className="d-flex flex-wrap gap-2 mb-4">
            {!isEditing ? (
              <button className="btn btn-success" onClick={handleCreate}>Create</button>
            ) : (
              <button className="btn btn-warning" onClick={handleUpdate}>Update</button>
            )}
            <button className="btn btn-primary" onClick={handleRead}>Refresh List</button>
            {isEditing && <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>}
          </div>
        </div>

        {requests.length > 0 && (
          <div className="mt-4 pb-5 mb-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">Maintenance Request List</h4>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Request ID</th>
                        <th>Property ID</th>
                        <th>Tenant ID</th>
                        <th>Issue Description</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {requests.map((req) => (
                        <tr key={req.requestID}>
                          <td>{req.requestID}</td>
                          <td>{req.propertyID}</td>
                          <td>{req.tenantID}</td>
                          <td>{req.issueDescription}</td>
                          <td>{req.status}</td>
                          <td>{new Date(req.createdAt).toLocaleString()}</td>
                          <td>
                            <div className="d-flex gap-2 flex-wrap">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEditClick(req)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleReadOne(req.requestID)}
                              >
                                View Details
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(req.requestID)}
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Maintenance;
import React, { useEffect, useState } from "react";

const Tenant = () => {
  const [tenants, setTenants] = useState([]);
  const [tenantID, setTenantID] = useState("");
  const [userID, setUserID] = useState("");
  const [contactDetails, setContactDetails] = useState("");
  const [rentalHistory, setRentalHistory] = useState("");
  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const apiBase = "https://localhost:7067/api/Tenant";

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedUserID = localStorage.getItem("userID");
    if (storedToken) setToken(storedToken);
    if (storedUserID) setUserID(storedUserID);
  }, []);

  useEffect(() => {
    if (token) handleRead();
  }, [token]);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const mapError = (text, status, action) => {
    if (status === 401) return `${action} failed: Unauthorized. Please log in again.`;
    if (status === 404) return `${action} failed: Tenant ID not found.`;
    if (status === 400 && text.includes("FOREIGN KEY"))
      return `${action} failed: User ID not found.`;
    if (text.includes("SqlException") || text.includes("SqlClient"))
      return `${action} failed: Database error.`;
    return `${action} failed:\n${text}`;
  };

  const handleCreate = async () => {
    if (!userID) return alert("User ID is required to create a tenant");
    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          userID,
          contactDetails,
          rentalHistory,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Create"));
        return;
      }

      alert("Tenant created successfully");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Create failed:\n${err.message}`);
    }
  };

  const handleRead = async () => {
    try {
      const response = await fetch(apiBase, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Read"));
        return;
      }

      const data = await response.json();
      setTenants(data);
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
    if (!tenantID) return alert("Please select a tenant to update");
    try {
      const response = await fetch(`${apiBase}/${tenantID}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          tenantID,
          userID,
          contactDetails,
          rentalHistory,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Update"));
        return;
      }

      alert("Tenant updated");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Update failed:\n${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
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

      alert("Tenant deleted");
      handleRead();
    } catch (err) {
      alert(`Delete failed:\n${err.message}`);
    }
  };

  const handleEditClick = (tenant) => {
    setTenantID(tenant.tenantID);
    setUserID(tenant.userID);
    setContactDetails(tenant.contactDetails);
    setRentalHistory(tenant.rentalHistory);
    setIsEditing(true);
  };

  const resetForm = () => {
    setTenantID("");
    setUserID("");
    setContactDetails("");
    setRentalHistory("");
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
          <h2 className="mb-4 text-center">Tenant Management</h2>

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

          <div className="mb-3">
            <label className="form-label">User ID</label>
            <input
              type="text"
              className="form-control"
              value={userID}
              disabled={isEditing}
              onChange={(e) => setUserID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contact Details</label>
            <input
              type="text"
              className="form-control"
              value={contactDetails}
              onChange={(e) => setContactDetails(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rental History</label>
            <input
              type="text"
              className="form-control"
              value={rentalHistory}
              onChange={(e) => setRentalHistory(e.target.value)}
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

        {tenants.length > 0 && (
          <div className="mt-4 pb-5 mb-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">Tenant List</h4>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Tenant ID</th>
                        <th>User ID</th>
                        <th>Contact Details</th>
                        <th>Rental History</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((tenant) => (
                        <tr key={tenant.tenantID}>
                          <td>{tenant.tenantID}</td>
                          <td>{tenant.userID}</td>
                          <td>{tenant.contactDetails}</td>
                          <td>{tenant.rentalHistory}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-warning me-2"
                              onClick={() => handleEditClick(tenant)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-info me-2"
                              onClick={() => handleReadOne(tenant.tenantID)}
                            >
                              View Details
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDelete(tenant.tenantID)}
                            >
                              Delete
                            </button>
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

export default Tenant;
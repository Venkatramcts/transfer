import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Lease = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const leaseData = location.state || {};

  const [leaseID, setLeaseID] = useState("");
  const [propertyID, setPropertyID] = useState("");
  const [tenantID, setTenantID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [rentAmount, setRentAmount] = useState("");
  const [status, setStatus] = useState("");
  const [leases, setLeases] = useState([]);
  const [token, setToken] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const apiBase = "https://localhost:7067/api/Lease";

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedTenantID = localStorage.getItem("tenantID");
    if (storedToken) setToken(storedToken);
    if (storedTenantID) setTenantID(storedTenantID);

    if (leaseData.propertyID) setPropertyID(leaseData.propertyID);
    if (leaseData.rentAmount) setRentAmount(leaseData.rentAmount);
    setStartDate(new Date().toISOString().split("T")[0]);
  }, [leaseData]);

  useEffect(() => {
    if (token && tenantID) handleRead();
  }, [token, tenantID]);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const mapError = (text, status, action) => {
    if (status === 401) return `${action} failed: Unauthorized. Please log in again.`;
    if (status === 404) return `${action} failed: Lease not found.`;
    if (status === 400 && text.includes("FOREIGN KEY"))
      return `${action} failed: Invalid Property ID or Tenant ID.`;
    if (text.includes("SqlException") || text.includes("SqlClient"))
      return `${action} failed: Database error.`;
    return `${action} failed:\n${text}`;
  };

  const handleCreate = async () => {
    if (!propertyID || !tenantID || !startDate) return alert("Property ID, Tenant ID, and Start Date are required");
    try {
      const response = await fetch(apiBase, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          propertyID,
          tenantID,
          startDate,
          endDate,
          rentAmount: parseFloat(rentAmount),
          status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Create"));
        return;
      }

      alert("Lease created successfully");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Create failed:\n${err.message}`);
    }
  };

  const handleRead = async () => {
    try {
      if (!tenantID) {
        alert("Tenant ID missing. Cannot fetch leases.");
        return;
      }

      const response = await fetch(`${apiBase}/tenant/${tenantID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Read"));
        return;
      }

      const data = await response.json();
      setLeases(data);
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
    if (!leaseID) return alert("Please select a lease to update");
    try {
      const response = await fetch(`${apiBase}/${leaseID}`, {
        method: "PUT",
        headers: authHeaders,
        body: JSON.stringify({
          leaseID,
          propertyID,
          tenantID,
          startDate,
          endDate,
          rentAmount: parseFloat(rentAmount),
          status,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, "Update"));
        return;
      }

      alert("Lease updated");
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Update failed:\n${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this lease?")) return;
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

      alert("Lease deleted");
      handleRead();
    } catch (err) {
      alert(`Delete failed:\n${err.message}`);
    }
  };

  const handleEditClick = (lease) => {
    setLeaseID(lease.leaseID);
    setPropertyID(lease.propertyID);
    setTenantID(lease.tenantID);
    setStartDate(lease.startDate.split("T")[0]);
    setEndDate(lease.endDate ? lease.endDate.split("T")[0] : "");
    setRentAmount(lease.rentAmount);
    setStatus(lease.status);
    setIsEditing(true);
  };

  const resetForm = () => {
    setLeaseID("");
    setPropertyID("");
    setTenantID("");
    setStartDate("");
    setEndDate("");
    setRentAmount("");
    setStatus("");
    setIsEditing(false);
  };

  const calculateTotalRent = (lease) => {
    if (!lease.startDate) return lease.rentAmount;
    const start = new Date(lease.startDate);
    const end = lease.endDate ? new Date(lease.endDate) : null;

    let months = 1;
    if (end && end > start) {
      months =
        (end.getFullYear() - start.getFullYear()) * 12 +
        (end.getMonth() - start.getMonth()) +
        (end.getDate() >= start.getDate() ? 0 : -1);
      if (months < 1) months = 1;
    }
    return lease.rentAmount * months;
  };

  const handlePay = (lease) => {
    const totalRent = calculateTotalRent(lease);
    window.location.href = `http://localhost:5173/payments?leaseID=${lease.leaseID}&amount=${totalRent}`;
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
          <h2 className="mb-4 text-center">Lease Management</h2>

          <div className="mb-3">
            <label className="form-label">Lease ID</label>
            <input
              type="text"
              className="form-control"
              value={leaseID}
              disabled={isEditing}
              onChange={(e) => setLeaseID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Property ID</label>
            <input
              type="text"
              className="form-control"
              value={propertyID}
              disabled={isEditing || !!leaseData.propertyID}
              onChange={(e) => setPropertyID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Tenant ID</label>
            <input
              type="text"
              className="form-control"
              value={tenantID}
              disabled={isEditing || !!tenantID}
              onChange={(e) => setTenantID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Start Date</label>
            <input
              type="date"
              className="form-control"
              value={startDate}
              disabled={isEditing}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">End Date</label>
            <input
              type="date"
              className="form-control"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rent Amount (per month)</label>
            <input
              type="number"
              className="form-control"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
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
            {isEditing && (
              <button className="btn btn-secondary" onClick={resetForm}>Cancel</button>
            )}
          </div>
        </div>

        {leases.length > 0 && (
          <div className="mt-4 pb-5 mb-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">Lease List</h4>
                <div style={{ overflowX: "auto" }}>
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Lease ID</th>
                        <th>Property ID</th>
                        <th>Tenant ID</th>
                        <th>Start Date</th>
                        <th>End Date</th>
                        <th>Total Rent</th>
                        <th>Status</th>
                        <th>Created At</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leases.map((lease) => {
                        const totalRent = calculateTotalRent(lease);
                        return (
                          <tr key={lease.leaseID}>
                            <td>{lease.leaseID}</td>
                            <td>{lease.propertyID}</td>
                            <td>{lease.tenantID}</td>
                            <td>{lease.startDate ? new Date(lease.startDate).toLocaleDateString() : ""}</td>
                            <td>{lease.endDate ? new Date(lease.endDate).toLocaleDateString() : ""}</td>
                            <td>{totalRent}</td>
                            <td>{lease.status}</td>
                            <td>{lease.createdAt ? new Date(lease.createdAt).toLocaleString() : ""}</td>
                            <td className="d-flex flex-wrap gap-1">
                              <button
                                className="btn btn-sm btn-warning"
                                onClick={() => handleEditClick(lease)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-info"
                                onClick={() => handleReadOne(lease.leaseID)}
                              >
                                View Details
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(lease.leaseID)}
                              >
                                Delete
                              </button>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handlePay(lease)}
                              >
                                Pay
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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

export default Lease;
import React, { useEffect, useState } from "react";

const MaintenanceDashboard = () => {
  const [requests, setRequests] = useState([]);
  const [token, setToken] = useState("");
  const [ownerID, setOwnerID] = useState("");
  const [statusUpdate, setStatusUpdate] = useState({});

  const apiBase = "https://localhost:7067/api/MaintenanceRequest";

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    const storedOwnerID = localStorage.getItem("ownerID");
    if (storedToken) setToken(storedToken);
    if (storedOwnerID) setOwnerID(storedOwnerID);
  }, []);

  useEffect(() => {
    if (token && ownerID) {
      fetchRequests();
    }
  }, [token, ownerID]);

  const fetchRequests = async () => {
    try {
      const response = await fetch(`${apiBase}/owner/${ownerID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Failed to fetch requests:\n${errorText}`);
        return;
      }

      const data = await response.json();
      setRequests(data);
    } catch (err) {
      alert(`Error fetching requests:\n${err.message}`);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setStatusUpdate((prev) => ({ ...prev, [id]: newStatus }));
  };

  const handleUpdateStatus = async (req) => {
    const updatedStatus = statusUpdate[req.requestID] || req.status;

    try {
      const response = await fetch(`${apiBase}/${req.requestID}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          propertyID: req.propertyID,
          tenantID: req.tenantID,
          issueDescription: req.issueDescription,
          status: updatedStatus,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(`Update failed:\n${errorText}`);
        return;
      }

      alert("Status updated successfully");
      fetchRequests();
    } catch (err) {
      alert(`Error updating status:\n${err.message}`);
    }
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
        <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-4 text-center">Owner Maintenance Dashboard</h2>

            {requests.length === 0 ? (
              <p className="text-muted text-center">No maintenance requests found.</p>
            ) : (
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
                      <th>Update</th>
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => (
                      <tr key={req.requestID}>
                        <td>{req.requestID}</td>
                        <td>{req.propertyID}</td>
                        <td>{req.tenantID}</td>
                        <td>{req.issueDescription}</td>
                        <td>
                          <select
                            className="form-select"
                            value={statusUpdate[req.requestID] || req.status}
                            onChange={(e) =>
                              handleStatusChange(req.requestID, e.target.value)
                            }
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        </td>
                        <td>{new Date(req.createdAt).toLocaleString()}</td>
                        <td>
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => handleUpdateStatus(req)}
                          >
                            Save
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MaintenanceDashboard;

import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";

export default function AdminUsers() {
  const [owners, setOwners] = useState([]);
  const [tenants, setTenants] = useState([]);
  const [token, setToken] = useState("");

  const ownerApi = "https://localhost:7067/api/Owner";
  const tenantApi = "https://localhost:7067/api/Tenant";

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchOwners();
      fetchTenants();
    }
  }, [token]);

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const mapError = (text, status, action) => {
    if (status === 401) return `${action} failed: Unauthorized. Please log in again.`;
    if (status === 404) return `${action} failed: Record not found.`;
    if (status === 400 && text.includes("FOREIGN KEY"))
      return `${action} failed: Related User ID not found.`;
    if (text.includes("SqlException") || text.includes("SqlClient"))
      return `${action} failed: Database error.`;
    return `${action} failed:\n${text}`;
  };

  const fetchOwners = async () => {
    try {
      const res = await fetch(ownerApi, { headers: authHeaders });
      if (!res.ok) {
        const errorText = await res.text();
        alert(mapError(errorText, res.status, "Read Owners"));
        return;
      }
      setOwners(await res.json());
    } catch (err) {
      alert(`Read Owners failed: ${err.message}`);
    }
  };

  const fetchTenants = async () => {
    try {
      const res = await fetch(tenantApi, { headers: authHeaders });
      if (!res.ok) {
        const errorText = await res.text();
        alert(mapError(errorText, res.status, "Read Tenants"));
        return;
      }
      setTenants(await res.json());
    } catch (err) {
      alert(`Read Tenants failed: ${err.message}`);
    }
  };

  const deleteOwner = async (id) => {
    if (!window.confirm("Are you sure you want to delete this owner?")) return;
    try {
      const res = await fetch(`${ownerApi}/${id}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) {
        const errorText = await res.text();
        alert(mapError(errorText, res.status, "Delete Owner"));
        return;
      }
      alert("Owner deleted");
      fetchOwners();
    } catch (err) {
      alert(`Delete Owner failed: ${err.message}`);
    }
  };

  const deleteTenant = async (id) => {
    if (!window.confirm("Are you sure you want to delete this tenant?")) return;
    try {
      const res = await fetch(`${tenantApi}/${id}`, { method: "DELETE", headers: authHeaders });
      if (!res.ok) {
        const errorText = await res.text();
        alert(mapError(errorText, res.status, "Delete Tenant"));
        return;
      }
      alert("Tenant deleted");
      fetchTenants();
    } catch (err) {
      alert(`Delete Tenant failed: ${err.message}`);
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
      <div style={{ height: '250px' }}></div>
      <Container>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-lg border-0 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
              <Card.Body className="p-4 p-md-5">
                <h2 className="mb-4">Manage Users</h2>

                {/* Owners Table */}
                <h4>Owners</h4>
                {owners.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Owner ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {owners.map((owner) => (
                        <tr key={owner.ownerID}>
                          <td>{owner.ownerID}</td>
                          <td>{owner.name}</td>
                          <td>{owner.email}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteOwner(owner.ownerID)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No owners found.</p>
                )}

                {/* Tenants Table */}
                <h4 className="mt-5">Tenants</h4>
                {tenants.length > 0 ? (
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>Tenant ID</th>
                        <th>Contact Details</th>
                        <th>Rental History</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tenants.map((tenant) => (
                        <tr key={tenant.tenantID}>
                          <td>{tenant.tenantID}</td>
                          <td>{tenant.contactDetails}</td>
                          <td>{tenant.rentalHistory}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => deleteTenant(tenant.tenantID)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No tenants found.</p>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
}

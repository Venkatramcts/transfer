import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const Property = () => {
  const [propertyID, setPropertyID] = useState('');
  const [ownerID, setOwnerID] = useState('');
  const [propertyName, setPropertyName] = useState('');
  const [address, setAddress] = useState('');
  const [rentAmount, setRentAmount] = useState('');
  const [availabilityStatus, setAvailabilityStatus] = useState('');
  const [properties, setProperties] = useState([]);
  const [token, setToken] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  const apiBase = 'https://localhost:7067/api/Property';
  const imageApiBase = 'https://localhost:7067/api/Image';

  const ownerIDFromStorage = localStorage.getItem('ownerID');
  const ownerPropertyApi = ownerIDFromStorage
    ? `https://localhost:7067/api/Property/owner/${ownerIDFromStorage}`
    : null;

  const roles = JSON.parse(localStorage.getItem('authRoles') || '[]');
  const isOwner = roles.includes("Owner");

  const location = useLocation();

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      setToken(storedToken);
    } else {
      alert('No login token found. Please log in first.');
    }

    const storedOwnerID = localStorage.getItem('ownerID');
    if (storedOwnerID) {
      setOwnerID(storedOwnerID);
    }
  }, []);

  useEffect(() => {
    if (token) {
      handleRead();
    }
  }, [token]);

  useEffect(() => {
    if (location.state?.property) {
      handleEditClick(location.state.property);
      window.history.replaceState({}, document.title);
    }
  }, []);

  const authHeaders = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`
  };

  const mapError = (text, status, action) => {
    if (status === 401) return `${action} failed: Unauthorized. Please log in again.`;
    if (status === 404) return `${action} failed: Property ID not found.`;
    if (status === 400 && text.includes('FOREIGN KEY')) return `${action} failed: Owner ID not found.`;
    if (text.includes('SqlException') || text.includes('SqlClient')) return `${action} failed: Database error.`;
    return `${action} failed:\n${text}`;
  };

  const handleCreate = async () => {
    if (!ownerID || !propertyName) return alert('Owner ID and Property Name are required');

    try {
      const createResponse = await fetch(apiBase, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          ownerID,
          propertyName,
          address,
          rentAmount: parseFloat(rentAmount),
          availabilityStatus: availabilityStatus === 'true'
        })
      });

      if (!createResponse.ok) {
        const errorText = await createResponse.text();
        alert(mapError(errorText, createResponse.status, 'Create'));
        return;
      }

      const createdProperty = await createResponse.json();
      alert(`Property created with ID: ${createdProperty.propertyID}`);

      if (imageFile) {
        const formData = new FormData();
        formData.append('File', imageFile);
        formData.append('PropertyID', createdProperty.propertyID);

        const uploadResponse = await fetch(`${imageApiBase}/upload`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: formData
        });

        if (!uploadResponse.ok) {
          const uploadError = await uploadResponse.text();
          alert(mapError(uploadError, uploadResponse.status, 'Image Upload'));
        } else {
          alert('Image uploaded successfully');
        }
      }

      await handleRead();
      resetForm();
    } catch (err) {
      alert(`Create failed:\n${err.message}`);
    }
  };

  const handleRead = async () => {
    try {
      const endpoint = isOwner && ownerPropertyApi ? ownerPropertyApi : apiBase;
      const response = await fetch(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, 'Read'));
        return;
      }

      let data = await response.json();

      const withImages = await Promise.all(
        data.map(async (prop) => {
          try {
            const imgRes = await fetch(`${imageApiBase}/property/${prop.propertyID}`);
            if (imgRes.ok) {
              const imgs = await imgRes.json();
              return { ...prop, images: imgs };
            }
          } catch {}
          return { ...prop, images: [] };
        })
      );

      setProperties(withImages);
    } catch (err) {
      alert(`Read failed:\n${err.message}`);
    }
  };

  const handleReadOne = async (id) => {
    try {
      const response = await fetch(`${apiBase}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, 'View Details'));
        return;
      }

      const data = await response.json();
      alert(JSON.stringify(data, null, 2));
    } catch (err) {
      alert(`View Details failed:\n${err.message}`);
    }
  };

  const handleUpdate = async () => {
    if (!propertyID) return alert('Please select a property to update');
    try {
      const response = await fetch(`${apiBase}/${propertyID}`, {
        method: 'PUT',
        headers: authHeaders,
        body: JSON.stringify({
          propertyID,
          ownerID,
          propertyName,
          address,
          rentAmount: parseFloat(rentAmount),
          availabilityStatus: availabilityStatus === 'true'
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, 'Update'));
        return;
      }

      alert('Property updated');
      handleRead();
      resetForm();
    } catch (err) {
      alert(`Update failed:\n${err.message}`);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this property?')) return;
    try {
      const response = await fetch(`${apiBase}/${id}`, {
        method: 'DELETE',
        headers: authHeaders
      });

      if (!response.ok) {
        const errorText = await response.text();
        alert(mapError(errorText, response.status, 'Delete'));
        return;
      }

      alert('Property deleted');
      handleRead();
    } catch (err) {
      alert(`Delete failed:\n${err.message}`);
    }
  };

  const handleEditClick = (property) => {
    setPropertyID(property.propertyID);
    setOwnerID(property.ownerID);
    setPropertyName(property.propertyName || '');
    setAddress(property.address);
    setRentAmount(property.rentAmount);
    setAvailabilityStatus(property.availabilityStatus ? 'true' : 'false');
    setIsEditing(true);
  };

  const handleUploadImage = async () => {
    if (!propertyID) return alert('Please select a property before uploading an image');
    if (!imageFile) return alert('Please select an image file');

    const formData = new FormData();
    formData.append('File', imageFile);
    formData.append('PropertyID', propertyID);

    try {
      const response = await fetch(`${imageApiBase}/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      });

      const text = await response.text();
      if (!response.ok) {
        alert(mapError(text, response.status, 'Image Upload'));
        return;
      }

      alert(`Image uploaded successfully`);
      setImageFile(null);
      handleRead();
    } catch (err) {
      alert(`Image Upload failed:\n${err.message}`);
    }
  };

  const resetForm = () => {
    setPropertyID('');
    setOwnerID(ownerIDFromStorage || '');
    setPropertyName('');
    setAddress('');
    setRentAmount('');
    setAvailabilityStatus('');
    setImageFile(null);
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
      <div className="container mt-5 pt-4">
        <div className="card p-4 shadow-sm">
          <h2 className="mb-4 text-center">Property Management</h2>

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

          <div className="mb-3">
            <label className="form-label">Owner ID</label>
            <input
              type="text"
              className="form-control bg-light"
              value={ownerID}
              disabled={isEditing || !!ownerID}
              readOnly
              onChange={(e) => setOwnerID(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Property Name</label>
            <input
              type="text"
              className="form-control"
              value={propertyName}
              onChange={(e) => setPropertyName(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Address</label>
            <input
              type="text"
              className="form-control"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Rent Amount</label>
            <input
              type="number"
              className="form-control"
              value={rentAmount}
              onChange={(e) => setRentAmount(e.target.value)}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Availability Status</label>
            <select
              className="form-select"
              value={availabilityStatus}
              onChange={(e) => setAvailabilityStatus(e.target.value)}
            >
              <option value="">Select Status</option>
              <option value="true">Available</option>
              <option value="false">Not Available</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
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
            {propertyID && (
              <button className="btn btn-outline-dark" onClick={handleUploadImage}>
                Upload Image
              </button>
            )}
          </div>
        </div>

        {properties.length > 0 && (
          <div className="mt-4 mb-5 pb-5">
            <div className="card shadow-lg border-0 rounded-3">
              <div className="card-body p-4">
                <h4 className="mb-4 text-center">Property List</h4>
                <div style={{ overflowX: 'auto' }}>
                  <table className="table table-bordered table-striped">
                    <thead className="table-dark">
                      <tr>
                        <th>ID</th>
                        <th>Owner ID</th>
                        <th>Property Name</th>
                        <th>Address</th>
                        <th>Rent</th>
                        <th>Status</th>
                        <th>Image</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {properties.map((property) => (
                        <tr key={property.propertyID}>
                          <td>{property.propertyID}</td>
                          <td>{property.ownerID}</td>
                          <td>{property.propertyName}</td>
                          <td>{property.address}</td>
                          <td>{property.rentAmount}</td>
                          <td>{property.availabilityStatus ? 'Available' : 'Occupied'}</td>
                          <td>
                            {property.images && property.images.length > 0 ? (
                              <img
                                src={`data:${property.images[0].contentType};base64,${property.images[0].base64Data}`}
                                alt={property.images[0].fileName}
                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                              />
                            ) : (
                              <span>No Image</span>
                            )}
                          </td>
                          <td>
  <div className="d-flex gap-2 flex-wrap">
    <button className="btn btn-sm btn-warning" onClick={() => handleEditClick(property)}>Edit</button>
    <button className="btn btn-sm btn-info" onClick={() => handleReadOne(property.propertyID)}>View Details</button>
    <button className="btn btn-sm btn-danger" onClick={() => handleDelete(property.propertyID)}>Delete</button>
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

export default Property;
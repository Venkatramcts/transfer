import React, { useState, useEffect } from "react";

export default function Profile() {
  const [showToken, setShowToken] = useState(false);
  const [userDetails, setUserDetails] = useState({
    userIdLabel: "User ID",
    userId: "N/A",
    name: "Unknown",
    email: "Unknown",
    roles: "No roles assigned",
    address: "Not provided"
  });
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);

    if (!storedToken) return;

    fetch("https://localhost:7067/api/Auth/token-details", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${storedToken}`
      }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch token details");
        return res.json();
      })
      .then((data) => {
        console.log("✅ Token details response:", data);

        const roles = Array.isArray(data.roles) ? data.roles : data.Roles || [];
        const roleLabel = roles.includes("Owner")
          ? "Owner ID"
          : roles.includes("Tenant")
          ? "Tenant ID"
          : "User ID";

        // Use the exact keys from your API response
        const userId = data.ownerID || data.tenantID || data.userId || "N/A";
        const name = data.name || (data.email ? data.email.split("@")[0] : "Unknown");
        const email = data.email || "Unknown";

        setUserDetails({
          userIdLabel: roleLabel,
          userId,
          name,
          email,
          roles: roles.length > 0 ? roles.join(", ") : "No roles assigned",
          address: "Not provided"
        });
      })
      .catch((err) => {
        console.error("❌ Profile fetch error:", err);
      });
  }, []);

  return (
    <div className="container mt-5 pt-5">
      <h2>User Profile</h2>
      <p><strong>{userDetails.userIdLabel}:</strong> {userDetails.userId}</p>
      <p><strong>Name:</strong> {userDetails.name}</p>
      <p><strong>Email:</strong> {userDetails.email}</p>
      <p><strong>Roles:</strong> {userDetails.roles}</p>
      <p><strong>Address:</strong> {userDetails.address}</p>

      <button
        className="btn btn-primary mt-3"
        onClick={() => setShowToken(!showToken)}
      >
        {showToken ? "Hide Token" : "View Token"}
      </button>

      {showToken && (
        <div
          className="alert alert-info mt-3"
          style={{
            wordBreak: "break-word",
            whiteSpace: "pre-wrap"
          }}
        >
          <strong>Token:</strong> {token}
        </div>
      )}
    </div>
  );
}

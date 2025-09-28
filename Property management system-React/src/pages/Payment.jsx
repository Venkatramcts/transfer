import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const leaseIDFromQuery = searchParams.get("leaseID") || "";
  const amountFromQuery = searchParams.get("amount") || "";
  const propertyIDFromQuery = searchParams.get("propertyID") || "";

  const [leaseID] = useState(leaseIDFromQuery);
  const [amount] = useState(amountFromQuery);
  const [propertyID] = useState(propertyIDFromQuery);
  const [cardNumber, setCardNumber] = useState("");
  const [name, setName] = useState("");
  const [validity, setValidity] = useState("");
  const [cvv, setCvv] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const [searchLeaseID, setSearchLeaseID] = useState("");
  const [searchPaymentID, setSearchPaymentID] = useState("");
  const [payments, setPayments] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState(null);

  const token = localStorage.getItem("authToken");
  const apiBase = "https://localhost:7067/api/Payment";

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const validateForm = () => {
    if (!leaseID) return "Lease ID is required";
    if (!amount || amount <= 0) return "Amount must be greater than 0";
    if (!/^\d{16}$/.test(cardNumber)) return "Card number must be 16 digits";
    if (name !== name.toUpperCase()) return "Name must be in CAPITAL letters";
    if (!/^\d{2}\/\d{2}$/.test(validity)) return "Validity must be in MM/YY format";
    if (!/^\d{3}$/.test(cvv)) return "CVV must be exactly 3 digits";
    return null;
  };

  const handlePay = async () => {
    const error = validateForm();
    if (error) {
      alert(error);
      return;
    }

    try {
      const res = await fetch(apiBase, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({
          leaseID,
          amount: parseFloat(amount),
          paymentDate: new Date().toISOString(),
          status: "Paid",
          propertyID
        }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(errText || "Payment failed");
      }

      const created = await res.json();
      const msg = `✅ Payment successful! Payment ID: ${created.paymentID}`;
      setSuccessMessage(msg);
      alert(msg);

      setCardNumber("");
      setName("");
      setValidity("");
      setCvv("");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed. Please try again.");
    }
  };

  const getPaymentsByLeaseID = async () => {
    try {
      const res = await fetch(`${apiBase}/byLease/${searchLeaseID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPayments(data);
      setPaymentDetails(null);
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const getPaymentByPaymentID = async () => {
    try {
      const res = await fetch(`${apiBase}/${searchPaymentID}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      setPaymentDetails(data);
      setPayments([]);
    } catch (err) {
      alert(`Error: ${err.message}`);
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
      <div className="container mt-5 pt-5 mb-5 pb-5">
        <div className="card shadow-lg border-0 rounded-3" style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}>
          <div className="card-body p-4 p-md-5">
            <h2 className="mb-4">Make Payment</h2>

            {successMessage && (
              <div className="alert alert-success" role="alert">
                {successMessage}
              </div>
            )}

            <div className="mb-3">
              <label>Lease ID</label>
              <input className="form-control" value={leaseID} disabled />
            </div>

            <div className="mb-3">
              <label>Amount</label>
              <input className="form-control" type="number" value={amount} disabled />
            </div>

            <div className="mb-3">
              <label>Card Number</label>
              <input
                className="form-control"
                maxLength={16}
                inputMode="numeric"
                autoComplete="cc-number"
                placeholder="16-digit number"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <div className="mb-3">
              <label>Name on Card (CAPS)</label>
              <input
                className="form-control"
                autoComplete="cc-name"
                placeholder="FULL NAME"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>Validity (MM/YY)</label>
              <input
                className="form-control"
                maxLength={5}
                inputMode="numeric"
                autoComplete="cc-exp"
                placeholder="MM/YY"
                value={validity}
                onChange={(e) => setValidity(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label>CVV</label>
              <input
                className="form-control"
                type="password"
                maxLength={3}
                inputMode="numeric"
                autoComplete="cc-csc"
                placeholder="***"
                value={cvv}
                onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
              />
            </div>

            <button className="btn btn-success mb-4" onClick={handlePay}>
              Pay Now
            </button>

            <hr />
            <h4>Search Payments</h4>

            <div className="mb-3">
              <label>Search by Lease ID</label>
              <input
                className="form-control"
                placeholder="Enter Lease ID"
                value={searchLeaseID}
                onChange={(e) => setSearchLeaseID(e.target.value)}
              />
              <button className="btn btn-primary mt-2" onClick={getPaymentsByLeaseID}>
                Get Payments by Lease ID
              </button>
            </div>

            <div className="mb-3">
              <label>Search by Payment ID</label>
              <input
                className="form-control"
                placeholder="Enter Payment ID"
                value={searchPaymentID}
                onChange={(e) => setSearchPaymentID(e.target.value)}
              />
              <button className="btn btn-info mt-2" onClick={getPaymentByPaymentID}>
                Get Payment by Payment ID
              </button>
            </div>

            {payments.length > 0 && (
              <div className="mt-3">
                <h5>Payments for Lease</h5>
                <table className="table table-bordered">
                  <thead>
                    <tr>
                      <th>Payment ID</th>
                      <th>Lease ID</th>
                      <th>Amount</th>
                      <th>Payment Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.paymentID}>
                        <td>{p.paymentID}</td>
                        <td>{p.leaseID}</td>
                        <td>{p.amount}</td>
                        <td>{new Date(p.paymentDate).toLocaleDateString()}</td>
                        <td>{p.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {paymentDetails && (
              <div className="mt-3">
                <h5>Payment Details</h5>
                <p><strong>Payment ID:</strong> {paymentDetails.paymentID}</p>
                <p><strong>Lease ID:</strong> {paymentDetails.leaseID}</p>
                <p><strong>Amount:</strong> {paymentDetails.amount}</p>
                <p>
                  <strong>Payment Date:</strong>{" "}
                  {new Date(paymentDetails.paymentDate).toLocaleDateString()}
                </p>
                <p><strong>Status:</strong> {paymentDetails.status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payment;

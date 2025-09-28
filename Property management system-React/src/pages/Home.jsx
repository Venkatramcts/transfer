import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const [cards, setCards] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const token = localStorage.getItem('authToken');
  const roles = JSON.parse(localStorage.getItem('authRoles') || '[]');
  const ownerID = localStorage.getItem('ownerID');
  const navigate = useNavigate();

  const cartApi = 'https://localhost:7067/api/Cart';
  const propertyApi = 'https://localhost:7067/api/Property';
  const ownerPropertyApi = `https://localhost:7067/api/Property/owner/${ownerID}`;
  const imageApi = 'https://localhost:7067/api/Image/all';
  const ownerApi = 'https://localhost:7067/api/Owner';

  const isTenant = roles.includes("Tenant");
  const isOwner = roles.includes("Owner");
  const isAdmin = roles.includes("Admin");

  const fetchAll = async () => {
    try {
      let cartData = { items: [] };
      if (isTenant) {
        const cartRes = await fetch(cartApi, {
          headers: { Authorization: `Bearer ${token}` }
        });
        cartData = await cartRes.json();
        setCartItems(cartData.items || []);
      }

      const imgRes = await fetch(imageApi, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const images = await imgRes.json();

      let properties = [];
      const propRes = await fetch(
        isOwner ? ownerPropertyApi : propertyApi,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!propRes.ok) throw new Error(`Property fetch failed: ${propRes.status}`);
      properties = await propRes.json();

      const ownerIDs = Array.from(new Set(properties.map(p => p.ownerID)));
      const ownerMap = {};
      await Promise.all(
        ownerIDs.map(async (id) => {
          const res = await fetch(`${ownerApi}/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.ok) {
            const owner = await res.json();
            ownerMap[id] = owner.name || 'Unknown owner';
          } else {
            ownerMap[id] = 'Unknown owner';
          }
        })
      );

      const merged = properties.map(prop => {
        const img = images.find(i => i.propertyID === prop.propertyID);
        const inCart = isTenant
          ? cartData.items?.some(
              ci => ci.propertyId === prop.propertyID || ci.propertyID === prop.propertyID
            )
          : false;

        const statusValue = prop.status
          ? prop.status
          : (prop.availabilityStatus === true ? 'Available' : 'Occupied');

        return {
          propertyID: prop.propertyID,
          imageSrc: img
            ? `data:${img.contentType};base64,${img.base64Data}`
            : null,
          ownerName: ownerMap[prop.ownerID] || 'Unknown owner',
          propertyName: prop.propertyName || 'N/A',
          rentAmount: prop.rentAmount ?? 0,
          status: statusValue,
          inCart,
          fullProperty: prop
        };
      });

      setCards(merged);
    } catch (err) {
      console.error('Error fetching data:', err.message);
    }
  };

  useEffect(() => {
    if (token) fetchAll();
  }, [token]);

  const toggleCart = async (propertyID, inCart) => {
    const card = cards.find(c => c.propertyID === propertyID);
    if (!card) return;

    if (String(card.status).toLowerCase() !== "available" && !card.inCart) {
      alert("This property is currently leased and cannot be added to the cart.");
      return;
    }

    if (!inCart) {
      const res = await fetch(`${cartApi}/add`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          propertyId: propertyID,
          price: card?.rentAmount || 0
        })
      });
      if (res.ok) {
        await fetchAll();
      } else {
        const errText = await res.text();
        console.error("Add to cart failed:", errText);
        alert("This property is currently leased and cannot be added to the cart.");
      }
    } else {
      const cartItem = cartItems.find(
        ci => ci.propertyId === propertyID || ci.propertyID === propertyID
      );
      if (cartItem) {
        const res = await fetch(`${cartApi}/remove/${cartItem.id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          await fetchAll();
        }
      }
    }
  };

  const deleteProperty = async (propertyID) => {
    if (!window.confirm("Are you sure you want to delete this property?")) return;
    const res = await fetch(`${propertyApi}/${propertyID}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    if (res.ok) {
      alert("Property deleted");
      await fetchAll();
    } else {
      alert("Failed to delete property");
    }
  };

  const imageStyle = {
    height: '200px',
    objectFit: 'cover',
    width: '100%',
    borderRadius: '6px'
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
    <div className="container mt-4 pt-5">
      {/* Heading Card */}
      <div className="card shadow-lg border-0 rounded-3 mb-4" style={{ backgroundColor: 'rgba(255,255,255,0.95)' }}>
        <div className="card-body py-4">
          <h3 className="text-center text-success mb-0">
            {isTenant
              ? "All Available Properties"
              : isOwner
              ? "My Properties"
              : isAdmin
              ? "All Properties (Admin)"
              : "Properties"}
          </h3>
        </div>
      </div>

      {/* Property Cards */}
      <div className="row g-4">
        {cards.map((card) => {
          const isOccupied = String(card.status || "").toLowerCase() !== "available";
          return (
            <div className="col-md-4 col-lg-3" key={card.propertyID}>
              <div
                className="card h-100 border shadow-lg d-flex justify-content-center align-items-center"
                style={{
                  backgroundColor: '#fff',
                  borderRadius: '12px',
                  textAlign: 'center',
                  paddingBottom: '2rem',
                  paddingTop: '1rem',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                }}
              >
                {card.imageSrc ? (
                  <img
                    src={card.imageSrc}
                    alt={card.propertyName}
                    style={{
                      height: '180px',
                      objectFit: 'cover',
                      width: '90%',
                      borderRadius: '12px',
                    }}
                  />
                ) : (
                  <div
                    style={{
                      height: '200px',
                      background: '#eee',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderTopLeftRadius: '12px',
                      borderTopRightRadius: '12px',
                    }}
                  >
                    No Image
                  </div>
                )}

                <div className="card-body">
                  <p><strong>Owner name:</strong><br />{card.ownerName}</p>
                  <p><strong>Property name:</strong><br />{card.propertyName}</p>
                  <p><strong>Amount:</strong><br />₹{card.rentAmount}</p>
                  <p><strong>Status:</strong><br />{isOccupied ? 'Not Available' : 'Available'}</p>

                  <div className="d-flex flex-column align-items-center">
                    {isTenant && (
                      isOccupied ? (
                        <button className="btn btn-secondary mt-2" disabled>
                          Leased
                        </button>
                      ) : (
                        <button
                          className={`btn ${card.inCart ? 'btn-danger' : 'btn-primary'} mt-2`}
                          onClick={() => toggleCart(card.propertyID, card.inCart)}
                        >
                          {card.inCart ? 'Remove from Cart' : 'Add to Cart'}
                        </button>
                      )
                    )}

                    {isOwner && (
                      <button
                        className="btn btn-warning mt-2"
                        onClick={() =>
                          navigate("/propertyManager", {
                            state: { property: card.fullProperty },
                          })
                        }
                      >
                        Edit Property
                      </button>
                    )}

                    {isAdmin && (
                      <>
                        <button
                          className="btn btn-warning mt-2 me-2"
                          onClick={() =>
                            navigate("/propertyManager", {
                              state: { property: card.fullProperty },
                            })
                          }
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger mt-2"
                          onClick={() => deleteProperty(card.propertyID)}
                        >
                          Delete
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);


}

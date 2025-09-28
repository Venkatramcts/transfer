import React from "react";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function AppNavbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const roles = JSON.parse(localStorage.getItem("authRoles") || "[]");
  const isLoggedIn = !!token;

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth");
  };

  const isTenant = roles.includes("Tenant");
  const isOwner = roles.includes("Owner");
  const isAdmin = roles.includes("Admin");

  const commonLinks = [
    { path: "/", text: "Home" },
    { path: "/about", text: "About" },
    { path: "/contact", text: "Contact" },
  ];

  const roleLinks = {
    Admin: [
      { path: "/admin", text: "Dashboard" },
      { path: "/admin/users", text: "Manage Users" },
      // { path: "/maintenance", text: "Maintenance" },
    ],
    Tenant: [
      { path: "/lease", text: "Lease" },
      { path: "/cart", text: "Cart" },
      { path: "/maintenance", text: "Maintenance" },
    ],
    Owner: [
      { path: "/propertyManager", text: "Property" },
      { path: "/maintenance-dashboard", text: "Maintenance" },
    ],
  };

  const getNavLinks = () => {
    let links = [...commonLinks];
    if (isAdmin) links.push(...roleLinks.Admin);
    else if (isTenant) links.push(...roleLinks.Tenant);
    else if (isOwner) links.push(...roleLinks.Owner);
    return links;
  };

  return (
    <Navbar expand="lg" className="shadow-sm" style={{ backgroundColor: '#0f3460' }} variant="dark" fixed="top">
      <Container>
        <Navbar.Brand
          as={Link}
          to={isLoggedIn ? "/" : "/auth"}
          className="fw-bold text-white"
        >
          <img
            src="/vite.svg"
            alt="Logo"
            width="32"
            height="32"
            className="me-2"
          />
          MyApp
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="ms-auto">
            {isLoggedIn ? (
              <>
                {getNavLinks().map((link) => (
                  <Nav.Link as={Link} to={link.path} key={link.path} className="text-white">
                    {link.text}
                  </Nav.Link>
                ))}
                <NavDropdown title="Account" id="account-nav-dropdown" menuVariant="dark" align="end">
                  <NavDropdown.Item as={Link} to="/profile">
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <Nav.Link as={Link} to="/auth" className="text-white">
                Login / Register
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

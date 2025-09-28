import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

const Admin = () => {
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
      <Container className="pt-5">
        <div style={{ height: '200px' }}></div>
        <Row className="justify-content-center">
          <Col md={10}>
            <Card className="shadow-sm mb-4" style={{ minHeight: '350px' }}>
              <Card.Body className="p-5">
                <Card.Title
                  as="h2"
                  className="mb-4 text-center"
                  style={{ fontSize: '2.5rem' }}
                >
                  Admin Dashboard
                </Card.Title>
                <Card.Text
                  className="text-center"
                  style={{ fontSize: '1.25rem' }}
                >
                  Manage all sections of the system from here.
                </Card.Text>
                <div className="d-flex flex-wrap gap-3 justify-content-center mt-5">
                  <Link to="/addowner" className="btn btn-primary btn-lg">
                    Owner
                  </Link>
                  <Link to="/propertyManager" className="btn btn-secondary btn-lg">
                    Property
                  </Link>
                  <Link to="/tenants" className="btn btn-info btn-lg">
                    Tenant
                  </Link>
                  <Link to="/maintenance" className="btn btn-warning btn-lg">
                    Maintenance
                  </Link>
                  <Link to="/lease" className="btn btn-success btn-lg">
                    Lease
                  </Link>
                  <Link to="/payments" className="btn btn-dark btn-lg">
                    Payment
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Admin;

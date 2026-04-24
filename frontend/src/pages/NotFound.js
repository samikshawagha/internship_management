import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import '../styles/notfound.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <Container className="notfound-container">
      <div className="notfound-content">
        <div className="notfound-number">404</div>
        
        <h1 className="notfound-title">Page Not Found</h1>
        
        <p className="notfound-message">
          Oops! The page you're looking for doesn't exist.
          <br />
          It might have been moved or deleted.
        </p>
        
        <div className="notfound-actions">
          <Button 
            variant="outline-primary" 
            size="lg"
            onClick={() => navigate(-1)}
            className="me-3"
          >
            Go Back
          </Button>
          
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/')}
          >
            Go to Home
          </Button>
        </div>
      </div>
    </Container>
  );
};

export default NotFound;

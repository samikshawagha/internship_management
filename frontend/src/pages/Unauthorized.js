import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Button } from 'react-bootstrap';
import '../styles/unauthorized.css';

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <Container className="unauthorized-container">
      <div className="unauthorized-content">
        <div className="icon-wrapper">
          <svg 
            width="140" 
            height="140" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
            className="unauthorized-icon"
          >
            <circle 
              cx="12" 
              cy="12" 
              r="10" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              fill="none"
            />
            <path 
              d="M15 9l-6 6M9 9l6 6" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </div>
        
        <h1 className="unauthorized-title">Access Denied</h1>
        
        <p className="unauthorized-message">
          You don't have permission to access this page. 
          <br />
          Please contact your administrator if you believe this is an error.
        </p>
        
        <div className="unauthorized-actions">
          <Button 
            variant="outline-secondary" 
            size="lg"
            onClick={() => navigate(-1)}
            className="me-3"
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
              style={{ verticalAlign: 'middle' }}
            >
              <path 
                d="M19 12H5M5 12l7 7M5 12l7-7" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Go Back
          </Button>
          
          <Button 
            variant="primary" 
            size="lg"
            onClick={() => navigate('/')}
          >
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
              className="me-2"
              style={{ verticalAlign: 'middle' }}
            >
              <path 
                d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M9 22V12h6v10" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            Go to Home
          </Button>
        </div>
        
        <div className="unauthorized-help">
          <p className="text-muted small mb-0">
            Need help? Contact support at <a href="mailto:support@internhub.com">support@internhub.com</a>
          </p>
        </div>
      </div>
    </Container>
  );
};

export default Unauthorized;

// Utility function to decode JWT token and extract payload
export const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part)
    const payloadBase64 = parts[1];
    const payloadDecode = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    return JSON.parse(payloadDecode);
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};

// Get user role from token
export const getRoleFromToken = (token) => {
  const decoded = decodeJWT(token);
  return decoded?.role || null;
};

// Get redirect path based on role
export const getRedirectPathByRole = (role) => {
  switch (role) {
    case 'company':
      return '/company-home';
    case 'admin':
      return '/admin-dashboard';
    case 'student':
    default:
      return '/dashboard';
  }
};

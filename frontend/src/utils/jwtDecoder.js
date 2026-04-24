// Utility function to decode JWT token and extract payload
export const decodeJWT = (token) => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }

    // Decode the payload (second part) - browser-compatible base64 decoding
    const payloadBase64 = parts[1];
    // Replace URL-safe characters and add padding if needed
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const paddedBase64 = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const payloadDecode = decodeURIComponent(
      atob(paddedBase64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
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

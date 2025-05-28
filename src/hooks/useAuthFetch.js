export function useAuthFetch() {
  const authFetch = async (url, options = {}) => {
    const token = localStorage.getItem('authToken');
    
    const headers = {
      ...options.headers,
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (options.body && !(options.body instanceof FormData)) {
      headers['Content-Type'] = 'application/json';
    }

    // Debug log
    console.log('Request Debug:', {
      url,
      method: options.method || 'GET',
      headers,
      body: options.body
    });
    
    const response = await fetch(url, {
      ...options,
      headers,
    });

    // Debug log
    console.log('Response Debug:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries())
    });

    // If error, try to get response body for debugging
    if (!response.ok) {
      try {
        const errorText = await response.text();
        console.log('Error Response Body:', errorText);
      } catch (err) {
        console.log('Could not read error response body:', err);
      }
    }

    return response;
  };
  
  return authFetch;
} 
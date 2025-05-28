export async function debugApiCall(url, options) {
  console.log('=== API Debug ===');
  console.log('URL:', url);
  console.log('Method:', options.method || 'GET');
  console.log('Headers:', options.headers);
  console.log('Body:', options.body);
  
  try {
    const response = await fetch(url, options);
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response Text:', responseText);
    
    // Retorna um clone da resposta com o texto já lido
    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      text: async () => responseText,
      json: async () => {
        try {
          return JSON.parse(responseText);
        } catch (e) {
          console.error('Failed to parse JSON:', e);
          throw e;
        }
      }
    };
  } catch (error) {
    console.error('Fetch Error:', error);
    throw error;
  }
} 
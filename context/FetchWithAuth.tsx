import AsyncStorage from '@react-native-async-storage/async-storage';

interface FetchOptions extends RequestInit {
  headers?: HeadersInit;
}

const fetchWithAuth = async (url: string, options: FetchOptions = {}): Promise<Response> => {
  try {
    // Get the token from AsyncStorage
    const token = await AsyncStorage.getItem('token');

    // Create a headers object if it doesn't exist
    const headers: HeadersInit = options.headers || {};

    // If the token exists, add it to the request headers
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    // Add the headers to the options
    options.headers = headers;

    // Make the fetch request
    const response = await fetch(url, options);

    // Handle the response
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return response;
  } catch (error) {
    console.error('Fetch with auth failed:', error);
    throw error;
  }
};

export default fetchWithAuth;

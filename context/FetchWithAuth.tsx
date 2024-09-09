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

    // If you want to log the response status for debugging
    // console.log(url);
    // console.log('Response status:', response.status);

    return response; // Return the response, even if it's not "ok"
  } catch (error) {
    console.error('Fetch with auth failed:', error);
    throw error; // Re-throw the error for the calling code to handle
  }
};

export default fetchWithAuth;

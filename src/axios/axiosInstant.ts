import axios from 'axios';
import Cookies from 'js-cookie';
import useAxiosPublic from './useAxiosPublic';


const apiClient = axios.create({
  baseURL:process.env.NEXT_PUBLIC_BASE_API_URL, 
  withCredentials: true, 
});

// Add a request interceptor to include the access token
apiClient.interceptors.request.use(
  (config) => {
    const accessToken = Cookies.get('accessToken');
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => response, // Pass successful responses through
  async (error) => {
    const originalRequest = error.config;

    // If token expired and the endpoint is not /refresh-token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      originalRequest.url !== '/auth/refresh-token'
    ) {
      originalRequest._retry = true;

      try {
        // Call refresh-token API to get a new access token
        const axiosPublic=useAxiosPublic();
        const { data } = await axiosPublic.post(
          '/auth/refresh-token',
          {},
          { withCredentials: true }
        );

        // Save the new access token in cookies
        Cookies.set('accessToken', data.data.accessToken, { expires: 1 });

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${data.data.accessToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // If refresh token also fails, redirect to login
        console.error('Refresh token failed:', refreshError);
        window.location.href = '/';
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

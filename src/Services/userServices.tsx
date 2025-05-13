import toast from 'react-hot-toast';
import axios from 'axios';

const BASE_URL = 'https://movie-explorer-ror-ashutosh-singh.onrender.com'; 

interface UserResponse {
  id: number;
  email: string;
  role: string;
  token: string;
}

interface UserPayload {
  email: string;
  password: string;
}

export const loginAPI = async (payload: { email: string, password: string }) => {
  const { email, password } = payload;
  console.log("login payload", payload);

  try {
      const response = await axios.post(`${BASE_URL}/users/sign_in`,
        { 
          user: {email, password}
        },
          {
              headers: {
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
              }
          }
      );
      console.log("login response",response.data);
      localStorage.setItem("token", response?.data?.token);
      // console.log(token);
      localStorage.setItem("user", JSON.stringify(response?.data));
      const userResponse : UserResponse ={
        ...response.data,
      }

      return userResponse;
  }
  catch (error) {
      console.log("Error Occurred while Signing In: ", error);
  }
}

export const signup = async (payload: { name: string, mobile_number: string , email: string, password: string, }) => {
  const { name , mobile_number, email, password } = payload;

  try {
    const response = await axios.post(`${BASE_URL}/users`, {
      user: { name, mobile_number , email, password }
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    console.log('Signup response:', response);
    return response.data;

  } catch (error: any) {
    console.error('Error Occurred while Signing Up:', error);
    const errorMessage = error.response?.data?.errors;
    console.log("ERROR MESSAGE: ", errorMessage);

    if (Array.isArray(errorMessage) && errorMessage.length > 1) {
      toast.error(errorMessage[0]);
    } else {
      toast.error(errorMessage);
    }
  }
};


interface UserData {
  token?: string;
}

interface ApiErrorResponse {
  message?: string;
}

export const sendTokenToBackend = async (token: string): Promise<any> => {
  try {
    const token = localStorage.getItem('token');
    console.log("TOKEN INSIDE SEND TOKEN: ", token)
    if (!token) {
      throw new Error('No user data found. User might not be logged in.');
    }
    if (!token) {
      throw new Error('No authentication token found in user data.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', token);

    const response = await fetch('https://movie-explorer-ror-aalekh-2ewg.onrender.com/api/v1/update_device_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ device_token: token }),
    });

    if (!response.ok) {
      const errorData: ApiErrorResponse = await response.json().catch(() => ({}));
      throw new Error(`Failed to send device token: ${response.status} ${response.statusText} - ${errorData.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('Device token sent to backend successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending device token to backend:', error);
    throw error;
  }
};

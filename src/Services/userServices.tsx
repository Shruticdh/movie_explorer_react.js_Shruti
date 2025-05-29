// import toast from 'react-hot-toast';
// import axios from 'axios';

// const BASE_URL = 'https://movie-explorer-ror-ashutosh-singh.onrender.com'; 

// interface UserResponse {
//   id: number;
//   email: string;
//   role: string;
//   token: string;
// }

// interface UserPayload {
//   email: string;
//   password: string;
// }

// export const loginAPI = async (payload: { email: string, password: string }) => {
//   const { email, password } = payload;
//   console.log("login payload", payload);

//   try {
//       const response = await axios.post(`${BASE_URL}/users/sign_in`,
//         { 
//           user: {email, password}
//         },
//           {
//               headers: {
//                   'Content-Type': 'application/json',
//                   'Accept': 'application/json'
//               }
//           }
//       );
//       localStorage.setItem("token", response?.data?.token);
//       localStorage.setItem("user", JSON.stringify(response?.data));
//       const userResponse : UserResponse ={
//         ...response.data,
//       }

//       return userResponse;
//   }
//   catch (error) {
//       toast.success("Error Occurred while Signing In: ", error);
//   }
// }

// export const signup = async (payload: { name: string, mobile_number: string , email: string, password: string, }) => {
//   const { name , mobile_number, email, password } = payload;

//   try {
//     const response = await axios.post(`${BASE_URL}/users`, {
//       user: { name, mobile_number , email, password }
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Accept': 'application/json',
//       },
//     });
//     return response.data;

//   } catch (error: any) {
//     toast.error('Error Occurred while Signing Up:', error);
//     const errorMessage = error.response?.data?.errors;
//     toast.error("ERROR MESSAGE: ", errorMessage);

//     if (Array.isArray(errorMessage) && errorMessage.length > 1) {
//       toast.error(errorMessage[0]);
//     } else {
//       toast.error(errorMessage);
//     }
//   }
// };


// interface UserData {
//   token?: string;
// }

// interface ApiErrorResponse {
//   message?: string;
// }


// export const sendTokenToBackend = async (token: string): Promise<any> => {
//   try {
//     const userData = localStorage.getItem('user');
//     if (!userData) {
//       throw new Error('No user data found. User might not be logged in.');
//     }

//     const user: UserData = JSON.parse(userData);
//     const authToken = user?.token;
//     if (!authToken) {
//       throw new Error('No authentication token found in user data.');
//     }

//     console.log('Sending FCM token to backend:', token);
//     console.log('Using auth token:', authToken);

//     const response = await axios.put(
//       `${BASE_URL}/api/v1/update_device_token`,
//       { device_token: token },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${authToken}`,
//         }
//       }
//     );

//     // console.log('Device token sent to backend successfully:', response.data);
//     return response.data;
//   } catch (error: any) {
//     console.error('Error sending device token to backend:', error);
//   }
// };



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

interface CurrentUserResponse {
  id: number;
  name: string;
  role: string;
  email: string;
  plan_type: string;
  updated_at: string;
  expires_at: string;
  profile_picture_url: string | null;
  profile_picture_thumbnail: string | null;
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
      localStorage.setItem("token", response?.data?.token);
      localStorage.setItem("user", JSON.stringify(response?.data));
      const userResponse : UserResponse ={
        ...response.data,
      }

      return userResponse;
  }
  catch (error) {
      toast.success("Error Occurred while Signing In: ", error);
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
    return response.data;

  } catch (error: any) {
    toast.error('Error Occurred while Signing Up:', error);
    const errorMessage = error.response?.data?.errors;
    toast.error("ERROR MESSAGE: ", errorMessage);

    if (Array.isArray(errorMessage) && errorMessage.length > 1) {
      toast.error(errorMessage[0]);
    } else {
      toast.error(errorMessage);
    }
  }
};

export const getCurrentUser = async (token: string): Promise<CurrentUserResponse> => {
  try {
    const response = await axios.get(`${BASE_URL}/api/v1/current_user`, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      }
    });
    
    return response.data;
  } catch (error: any) {
    console.error('Error fetching current user:', error);
    const errorMessage = error.response?.data?.message || 'Failed to fetch current user';
    toast.error(errorMessage);
    throw error;
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
    const userData = localStorage.getItem('user');
    if (!userData) {
      throw new Error('No user data found. User might not be logged in.');
    }

    const user: UserData = JSON.parse(userData);
    const authToken = user?.token;
    if (!authToken) {
      throw new Error('No authentication token found in user data.');
    }

    console.log('Sending FCM token to backend:', token);
    console.log('Using auth token:', authToken);

    const response = await axios.put(
      `${BASE_URL}/api/v1/update_device_token`,
      { device_token: token },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authToken}`,
        }
      }
    );

    // console.log('Device token sent to backend successfully:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error sending device token to backend:', error);
  }
};
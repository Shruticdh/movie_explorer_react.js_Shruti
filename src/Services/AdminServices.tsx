import axios from 'axios';

const BASE_URL = 'https://movie-explorer-ror-ashutosh-singh.onrender.com/api/v1/movies';

export const addMovie = async (formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.post(BASE_URL, formData, {
      headers: {
        Authorization: `Bearer ${token}`, 
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateMovie = async (id, formData) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.put(`${BASE_URL}/${id}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};


export const deleteMovie = async (id) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.delete(`${BASE_URL}/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: 'application/json',
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

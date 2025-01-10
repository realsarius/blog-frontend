import axios from 'axios';

const baseUrl = '/api/users';

let token = null;

const setToken = newToken => {
  token = `Bearer ${newToken}`;
};

const getAll = () => {
  const config = {
    headers: { Authorization: token },
  };

  const request = axios.get(baseUrl, config);
  return request.then(response => response.data);
};

const getUserById = async (userId) => {
  const response = await axios.get(`${baseUrl}/${userId}`);
  return response.data;
};

export default { getAll, setToken, getUserById };
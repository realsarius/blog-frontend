import axios from 'axios';

const baseUrl = '/api/blogs';

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

const create = async newObject => {
    const user = JSON.parse(localStorage.getItem('loggedBlogappUser'));

    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    };

    const request = await axios.post(baseUrl, newObject, config);

    return request.data;
};

const remove = async (id) => {

    const user = JSON.parse(localStorage.getItem('loggedBlogappUser'));

    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    };

    const request = await axios.delete(`${baseUrl}/${id}`, config);
    return request.data;
};

const updateLikes = async (id, newLikes) => {
    const updatedBlog = { likes: newLikes };

    const user = JSON.parse(localStorage.getItem('loggedBlogappUser'));

    const config = {
        headers: { Authorization: `Bearer ${user.token}` },
    };

    const request = await axios.put(`${baseUrl}/${id}`, updatedBlog, config);
    return request.data;
};

export default { getAll, setToken, create, updateLikes, remove };
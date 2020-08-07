import axios from 'axios';

export default {

  // API/USERS ================================================================
  // Create user.
  createUser: function (data) {
    return axios.post('/api/users/', data);
  },
  // Get user with given id.
  getUser: function (id) {
    return axios.get('/api/users/' + id);
  },
  // Update user with data.
  updateUser: function (id, data) {
    return axios.put('/api/users/' + id, data);
  },
  // Delete user with given id.
  deleteUser: function (id) {
    return axios.delete('/api/users/' + id);
  },

  // API/PRINTS ===============================================================
  // Create print.

  // Get print with given id.

  // Update print with data.

  // Delete print with given id.
};

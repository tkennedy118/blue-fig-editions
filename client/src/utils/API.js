import axios from 'axios';

export default {
  // API/USERS ================================================================
  // Create user.
  createUser: function(data) {
    return axios.post('/api/users/', data);
  },
  // Get user with given id.
  getUser: function(id) {
    return axios.get('/api/users/' + id);
  },
  // Update user with data.
  updateUser: function(id, data) {
    return axios.put('/api/users/' + id, data);
  },
  // Delete user with given id.
  deleteUser: function(id) {
    return axios.delete('/api/users/' + id);
  },

  // API/PRINTS ===============================================================
  // Create print.
  createPrint: function(data) {
    return axios.post('/api/prints/', data);
  },
  // Get all prints.
  getPrints: function() {
    return axios.get('/api/prints');
  },
  // Get print with given id.
  getPrint: function(id) {
    return axios.get('/api/prints/' + id);
  },
  // Update print with data.
  updatePrint: function(id, data, options) {
    const body = { data, options };
    return axios.put('/api/prints/' + id, body);
  },
  // Delete print with given id.
  deletePrint: function(id) {
    return axios.delete('/api/prints/' + id);
  },

  // SIGNUP/SIGNIN/SIGNOUT/STATUS ==============================================
  status: function() {
    return axios.get('/api/status');
  },

  signin: function(data) {
    return axios.post('/api/signin', data);
  },

  signup: function(data) {
    return axios.post('/api/signup', data);
  },

  signout: function () {
    return axios.get('/api/signout');
  },

  // EMAIL ====================================================================
  sendEmail: function(data) {
    console.log('DATA: ', data);
    return axios.put('/api/emails/send', data);
  }
};

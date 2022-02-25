import api from './api';
import authHeader from './auth-header';

class UserService {
  getProfile() {
    return api.post('/api/user/profile', {}, { headers: authHeader() })
      .then(response => {
        return response.data.profile;
      });
  }
}

export default new UserService();
import api from './api';
import authHeader from './auth-header';

class AdminService {
    getUserList(page, size) {
        return api.post('/admin/getUserList', { page: page, size: size }, { headers: authHeader() })
            .then(response => {
                return response.data;
            });
    }

    changeRoleOf(userId, role){
        return api.post('/admin/changeRoleOf', { id: userId, role: role }, { headers: authHeader() })
            .then(response => {
                return response;
            });
    }
}

export default new AdminService();
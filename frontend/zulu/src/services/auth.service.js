import axios from "axios";
import authHeader from './auth-header';

const AUTH_API_URL = "http://localhost:8342/api/auth";

class AuthService {
  login(username, password) {
    var data = new FormData();
    data.set('username', username);
    data.set('password', password);

    return axios({
      method: 'post',
      url: AUTH_API_URL + "/token",
      data: data,
      headers: {'Content-Type': 'multipart/form-data'}
    })
      .then(response => {
        if (response.data.access_token) {
          localStorage.setItem("accessToken", JSON.stringify(response.data));
        }
        return response;
      }).then(() => this.getCurrentUserAPI())
      .then(user_response => {
        localStorage.setItem("user", JSON.stringify(user_response.data))
      });
  }

  logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
  }

  register(username, email, password, full_name) {
    return axios.post(AUTH_API_URL + "/users", {
      username,
      email,
      password,
      full_name
    });
  }


 getCurrentUserAPI() {
  
    return axios.get(AUTH_API_URL + '/users/me', 
    {
      headers: authHeader(),
    }, );
 }
 
 getCurrentUser() {
   const user = JSON.parse(localStorage.getItem('user'));
   return user;
 }

 }
export default new AuthService();
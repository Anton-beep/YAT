import axios from 'axios';
import Cookies from 'js-cookie';

const API_URL = 'http://localhost:8000/';

class Auth {
    constructor() {
        this.axiosInstance = axios.create({
            baseURL: API_URL,
            timeout: 5000,
            headers: {
                'Content-Type': 'application/json',
                'accept': 'application/json'
            }
        });

        this.axiosInstance.interceptors.request.use(
            config => {
                const access_token = Cookies.get('access');
                if (access_token) {
                    config.headers['Authorization'] = 'Bearer ' + access_token;
                }
                return config;
            },
            error => {
                return Promise.reject(error);
            }
        );

        this.axiosInstance.interceptors.response.use(
            response => response,
            async error => {
                const originalRequest = error.config;
                if (error.response.status === 401 && !originalRequest._retry) {
                    originalRequest._retry = true;
                    const access_token = await this.refreshToken();
                    Cookies.set('access', access_token, {secure: true});
                    return this.axiosInstance(originalRequest);
                }
                return Promise.reject(error);
            }
        );
    }

    async refreshToken() {
        const refresh_token = Cookies.get('refresh');
        try {
            const response = await this.axiosInstance.post('api/v1/users/refresh/', {refresh: refresh_token});
            return response.data.access;
        } catch (error) {
        }
    }

    login(user) {
        return axios
            .post(API_URL + '/api/v1/users/login/', {
                email: user.email,
                password: user.password
            })
            .then(response => {
                if (response.data.access) {
                    Cookies.set('access', response.data.access);
                    Cookies.set('refresh', response.data.refresh);
                }
                return response.data;
            });
    }

    logout() {
        Cookies.remove('access');
        Cookies.remove('refresh');
    }

    register(user) {
        return axios.post(API_URL + '/api/v1/users/register/', {
            email: user.email,
            password: user.password,
            first_name: user.first_name,
            last_name: user.last_name
        })
            .catch(error => {
                console.error(error);
            });
    }
}

export default new Auth();
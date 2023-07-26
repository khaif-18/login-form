import { BehaviorSubject } from 'rxjs';
import getConfig from 'next/config';
import Router from 'next/router';

import { fetchWrapper } from '@/helpers/fetch-wrapper';

const { publicRuntimeConfig } = getConfig();
const baseUrl = `${publicRuntimeConfig.apiUrl}/users`;
const userSubject = new BehaviorSubject<any | null>(process.browser ? JSON.parse(localStorage.getItem('user') as string) : null);

export const userService = {
    user: userSubject.asObservable(),
    get userValue() { return userSubject.value; },
    login,
    logout,
    register,
    getAll,
    getById,
    update,
    delete: _delete
};

function login(username: string, password: string) {
    return fetchWrapper.post(`${baseUrl}/authenticate`, { username, password })
        .then(user => {
            // publish user to subscribers and store in local storage to stay logged in between page refreshes
            userSubject.next(user);
            localStorage.setItem('user', JSON.stringify(user));

            return user;
        });
}

function logout() {
    // remove user from local storage, publish null to user subscribers, and redirect to login page
    localStorage.removeItem('user');
    userSubject.next(null);
    Router.push('/account/login');
}

function register(user: any) {
    return fetchWrapper.post(`${baseUrl}/register`, user);
}

function getAll() {
    return fetchWrapper.get(baseUrl);
}

function getById(id: string) {
    return fetchWrapper.get(`${baseUrl}/${id}`);
}

function update(id: string, params: any) {
    return fetchWrapper.put(`${baseUrl}/${id}`, params)
        .then(x => {
            // update stored user if the logged in user updated their own record
            if (userSubject.value && id === userSubject.value.id) {
                // update local storage
                const user = { ...userSubject.value, ...params };
                localStorage.setItem('user', JSON.stringify(user));

                // publish updated user to subscribers
                userSubject.next(user);
            }
            return x;
        });
}

// prefixed with underscore because delete is a reserved word in JavaScript
function _delete(id: string) {
    return fetchWrapper.delete(`${baseUrl}/${id}`);
}

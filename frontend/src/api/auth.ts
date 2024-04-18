import api from '@/api';

export const login = ({email, password}: {
	email: string,
	password: string
}) => api.post('/auth/login', {email, password}, {withCredentials: true});

export const register = ({name, email, password}: {
	name: string,
	email: string,
	password: string
}) => api.post('/auth/register', {name, email, password}, {withCredentials: true});

export const logout = () => api.get('/auth/logout', {withCredentials: true});

export const refreshToken = () => api.post('/auth/refresh', {}, {withCredentials: true});

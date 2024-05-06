import axios from 'axios';

const API = axios.create({ baseURL: 'https://projectmanagement.runasp.net/api/' });

export const fetchProjects = () => API.get('/Project/ListAll');
export const addProject = (project) => API.post('/Project/Add', project);

export const fetchTasks = (projectId) => API.post(`/Task/ListAll/${projectId}`);
export const addTask = (task) => API.post('/Task/Add', task);

export const fetchUsers = () => API.get('/User/ListAll');
export const addUser = (user) => API.post('/User/Add', user);

export const login = (credentials) => API.post('/auth/login', credentials);

export default API;

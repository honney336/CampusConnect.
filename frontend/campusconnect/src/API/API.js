import axios from 'axios';
const ApiFormData = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'multipart/form-data',
    },
});

const Api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json',
    },                                                                         
});


const config = {
  headers: {
    'authorization': `Bearer ${localStorage.getItem("token")}`
  }
}





export const createuser = (data) => Api.post('/api/auth/register', data);

export  const login = (data) => Api.post('/api/user/login', data);

export const getAllAnnouncements = () => Api.get('/api/announcement/all')
export const getAnnouncementById = (id) => Api.get(`/api/announcement/${id}`, config);

export const createAnnouncement =(data) => Api.post('/api/announcement/create' , data, config); 

export const changePassword = (data) => Api.post('/api/user/change-password', data, config);
// export const updateAnnouncement = (id) => Api.put('/api/announcement/update/`{id}`')
// export const createAnnouncement = (data) => {
//   const token = localStorage.getItem("token");
//   return Api.post('/api/announcement/create', data, {
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//   });
// };



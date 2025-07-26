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



//Auth api

export const createuser = (data) => Api.post('/api/auth/register', data);

export  const login = (data) => Api.post('/api/user/login', data);


//User api
export const changePassword = (data) => Api.post('/api/user/change-password', data, config);

//Announcement api
export const getAllAnnouncements = () => Api.get('/api/announcement/all', config);

export const getAnnouncementById = (id) => {
  if (!id || isNaN(id)) { // Check for valid numeric ID
    console.error('Invalid announcement ID:', id);
    throw new Error('Valid announcement ID is required');
  }
  return Api.get(`/api/announcement/${id}`, config);
};



export const createAnnouncement =(data) => Api.post('/api/announcement/create' , data, config); 


// export const updateAnnouncement = (id) => Api.put('/api/announcement/update/`{id}`')



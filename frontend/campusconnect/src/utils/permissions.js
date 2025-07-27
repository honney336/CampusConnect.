export const checkPermission = (user, action, resource) => {
  if (!user || !user.role) return false;

  const permissions = {
    admin: {
      create: true,
      edit: true,
      delete: true,
      view: true
    },
    faculty: {
      create: ['announcements', 'events', 'courses'],
      edit: ['announcements', 'events', 'courses'],
      delete: ['announcements', 'events', 'courses'],
      view: true
    },
    student: {
      view: true
    }
  };

  const userPerms = permissions[user.role];
  if (!userPerms) return false;

  if (typeof userPerms[action] === 'boolean') {
    return userPerms[action];
  }

  if (Array.isArray(userPerms[action])) {
    return userPerms[action].includes(resource);
  }

  return false;
};

export const getCurrentUser = () => {
  try {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  } catch (e) {
    console.error('Error parsing user data:', e);
    return null;
  }
};

export const hasPermission = (requiredRole) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  if (!user || !user.role) return false;
  
  if (requiredRole === 'admin') {
    return user.role === 'admin';
  }
  
  if (requiredRole === 'faculty') {
    return user.role === 'admin' || user.role === 'faculty';
  }
  
  return true;
};

export const canPerformAction = (action) => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const permissions = {
    admin: ['create', 'read', 'update', 'delete'],
    faculty: ['create', 'read', 'update', 'delete'],
    student: ['read']
  };

  return permissions[user.role]?.includes(action) || false;
};

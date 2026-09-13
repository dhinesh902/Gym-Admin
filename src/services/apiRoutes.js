export const API_ROUTES = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
  },
  members: '/members',
  trainers: {
    create: '/trainers/add',
    list: '/trainers/get',
    detail: (id) => `/trainers/get/${id}`,
    update: (id) => `/trainers/edit/${id}`,
    remove: (id) => `/trainers/delete/${id}`,
    status: (id) => `/trainers/status/${id}`,
  },
  attendance: '/attendance',
  checkIn: '/attendance/check-in',
  payments: '/payments',
  workouts: '/workouts',
  diets: '/diets',
  plans: '/plans',
  subscriptions: '/subscriptions',
  dashboardStats: '/dashboard/stats',
};

export const routeWithId = (route, id) => `${route}/${id}`;

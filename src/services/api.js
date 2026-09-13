import apiClient from './apiClient';
import { API_ROUTES } from './apiRoutes';
import Trainer from '../models/Trainer';
import Member from '../models/Member';
import Attendance from '../models/Attendance';
import MembershipPlan from '../models/MembershipPlan';
import Payment from '../models/Payment';

export const toCollection = (value, keys = []) => {
  if (Array.isArray(value)) return value;
  for (const key of keys) {
    if (Array.isArray(value?.[key])) return value[key];
  }
  return [];
};

const createMockResource = () => ({
  list: async () => [],
  get: async (id) => ({ id }),
  create: async (payload) => ({ id: Math.random().toString(36).substr(2, 9), ...payload }),
  update: async (id, payload) => ({ id, ...payload }),
  remove: async (id) => ({ id }),
});

export const authApi = {
  login: async (_payload) => ({ token: 'mock-token', user: { name: 'Admin' } }),
  register: async (_payload) => ({ token: 'mock-token', user: { name: 'Admin' } }),
  getProfile: async () => {
    const response = await apiClient.post('/auth/profile/get');
    return response.data.data;
  },
  updateProfile: async (payload) => {
    const response = await apiClient.post('/auth/profile/update', payload);
    return response.data;
  }
};

export const membersApi = {
  list: async () => {
    const response = await apiClient.post('/members/get');
    const data = response.data.data || [];
    return data.map(item => new Member(item));
  },
  get: async (id) => {
    const response = await apiClient.post(`/members/get/${id}`);
    return new Member(response.data.data);
  },
  create: async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        if (key === 'profilephoto' && payload[key] instanceof FileList && payload[key].length > 0) {
          formData.append(key, payload[key][0]);
        } else {
          formData.append(key, payload[key]);
        }
      }
    });
    const response = await apiClient.post('/members/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async ({ id, ...payload }) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null && payload[key] !== '') {
        if (key === 'profilephoto' && payload[key] instanceof FileList && payload[key].length > 0) {
          formData.append(key, payload[key][0]);
        } else {
          formData.append(key, payload[key]);
        }
      }
    });
    const response = await apiClient.post(`/members/edit/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.post(`/members/delete/${id}`);
    return response.data;
  }
};
export const trainersApi = {
  list: async () => {
    const response = await apiClient.post(API_ROUTES.trainers.list);
    const data = response.data.data || [];
    return data.map(item => new Trainer(item));
  },
  get: async (id) => {
    const response = await apiClient.post(API_ROUTES.trainers.detail(id));
    return new Trainer(response.data.data);
  },
  create: async (payload) => {
    const trainer = new Trainer(payload);
    const response = await apiClient.post(API_ROUTES.trainers.create, trainer.toFormData(), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  update: async ({ id, ...payload }) => {
    const trainer = new Trainer(payload);
    const response = await apiClient.post(API_ROUTES.trainers.update(id), trainer.toFormData({ includePassword: false }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.post(API_ROUTES.trainers.remove(id));
    return response.data;
  },
  updateStatus: async ({ id, status }) => {
    const response = await apiClient.post(API_ROUTES.trainers.status(id), { status });
    return response.data;
  },
};
export const paymentsApi = {
  list: async () => {
    const response = await apiClient.post('/payments/get');
    const data = response.data.data || [];
    return data.map(item => new Payment(item));
  },
  get: async (id) => {
    const response = await apiClient.post(`/payments/get/${id}`);
    return new Payment(response.data.data);
  },
  create: async (payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null) {
        if (key === 'paymentscreenshot' && payload[key] instanceof FileList && payload[key].length > 0) {
          formData.append(key, payload[key][0]);
        } else if (key !== 'paymentscreenshot') {
          formData.append(key, payload[key]);
        }
      }
    });
    const response = await apiClient.post('/payments/add', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  update: async (id, payload) => {
    const formData = new FormData();
    Object.keys(payload).forEach(key => {
      if (payload[key] !== undefined && payload[key] !== null) {
        if (key === 'paymentscreenshot' && payload[key] instanceof FileList && payload[key].length > 0) {
          formData.append(key, payload[key][0]);
        } else if (key !== 'paymentscreenshot') {
          formData.append(key, payload[key]);
        }
      }
    });
    const response = await apiClient.post(`/payments/edit/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.post(`/payments/delete/${id}`);
    return response.data;
  }
};
import Workout from '../models/Workout';

export const workoutsApi = {
  list: async () => {
    const response = await apiClient.post('/workouts/get');
    const data = response.data.data || [];
    return data.map(item => new Workout(item));
  },
  create: async (payload) => {
    const response = await apiClient.post('/workouts/add', payload);
    return response.data;
  },
  update: async ({ id, ...payload }) => {
    const response = await apiClient.post(`/workouts/edit/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.post(`/workouts/delete/${id}`);
    return response.data;
  }
};

import Diet from '../models/Diet';

export const dietsApi = {
  list: async () => {
    const response = await apiClient.post('/diets/get');
    const data = response.data.data || [];
    return data.map(item => new Diet(item));
  },
  create: async (payload) => {
    const response = await apiClient.post('/diets/add', payload);
    return response.data;
  },
  update: async ({ id, ...payload }) => {
    const response = await apiClient.post(`/diets/edit/${id}`, payload);
    return response.data;
  },
  remove: async (id) => {
    const response = await apiClient.post(`/diets/delete/${id}`);
    return response.data;
  }
};
export const progressApi = {
  overview: async (memberId) => {
    const response = await apiClient.post(`/progress/overview/${memberId}`);
    return response.data.data;
  },
  history: async (memberId, filter = '6months') => {
    const response = await apiClient.post(`/progress/history/${memberId}?filter=${filter}`);
    return response.data.data;
  },
  log: async (payload) => {
    const response = await apiClient.post('/progress/add', payload);
    return response.data;
  }
};

export const plansApi = {
  list: async () => {
    const response = await apiClient.post('/plans/get');
    const data = response.data.data || [];
    return data.map(item => new MembershipPlan(item));
  }
};
export const subscriptionsApi = createMockResource();

export const attendanceApi = {
  list: async () => {
    const response = await apiClient.post('/attendance/get');
    const data = response.data.data || [];
    return data.map(item => new Attendance(item));
  },
  checkIn: async (payload) => {
    const response = await apiClient.post('/attendance/check-in/add', payload);
    return response.data;
  },
};

export const reportsApi = {
  getAnalytics: async (filter = '6months') => {
    const response = await apiClient.post('/reports/analytics', { filter });
    return response.data.data;
  }
};

export const dashboardApi = {
  stats: async (filter = 'Last 6 Months') => {
    const response = await apiClient.post('/dashboard/stats/get', { filter });
    return response.data.data;
  }
};

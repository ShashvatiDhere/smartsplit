import API from './axiosConfig';

export const login = (data) => API.post('/auth/login', data);
export const register = (data) => API.post('/auth/register', data);
export const getCurrentUser = () => API.get('/auth/me');

export const getGroups = (userId) => API.get(`/groups/user/${userId}`);
export const createGroup = (userId, data) => API.post(`/groups/create/${userId}`, data);
export const getGroupDetails = (groupId) => API.get(`/groups/${groupId}`);
export const addGroupMember = (groupId, userId) => API.post(`/groups/${groupId}/add-member/${userId}`);

export const getExpenses = (groupId) => API.get(`/expenses/group/${groupId}`);
export const addExpense = (data) => API.post('/expenses', data);

export const getBalances = (userId, groupId) => API.get(`/balance/dashboard?userId=${userId}${groupId ? `&groupId=${groupId}` : ''}`);

export const getSettlements = (groupId) => API.get(`/settlements/suggestions?groupId=${groupId || ''}`);
export const createSettlement = (data) => API.post('/settlements', data);
export const markSettlementPaid = (id) => API.put(`/settlements/${id}/status?status=PAID`);

export const getNotifications = (userId) => API.get(`/notifications/${userId}`);
export const markNotificationRead = (id) => API.put(`/notifications/${id}/read`);

export const getActivityLogs = (groupId) => API.get(`/activity-logs/group/${groupId}`);

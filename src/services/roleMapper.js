const ROLE_MAP_TO_API = {
  user: 'viewer',
  actor: 'actor',
  manager: 'manager',
  admin: 'admin',
};

const ROLE_MAP_FROM_API = {
  viewer: 'user',
  actor: 'actor',
  manager: 'manager',
  admin: 'admin',
};

export const normalizeRoleFromApi = (role) => {
  if (!role) return role;
  return ROLE_MAP_FROM_API[role] || role;
};

export const mapRoleToApi = (role) => {
  if (!role) return role;
  return ROLE_MAP_TO_API[role] || role;
};

export const normalizeUserFromApi = (user) => {
  if (!user) return user;
  return {
    ...user,
    role: normalizeRoleFromApi(user.role),
  };
};

export const normalizeUsersFromApi = (users) => {
  if (!Array.isArray(users)) return [];
  return users.map(normalizeUserFromApi);
};

export const buildRegisterPayload = (userData) => ({
  email: userData.email?.trim(),
  first_name: userData.first_name?.trim(),
  last_name: userData.last_name?.trim(),
  phone_number: userData.phone_number?.trim(),
  password: userData.password,
  role: mapRoleToApi(userData.role),
  age: Number.parseInt(userData.age, 10),
});

export const buildUserUpdatePayload = (userData) => ({
  first_name: userData.first_name?.trim(),
  last_name: userData.last_name?.trim(),
  phone_number: userData.phone_number?.trim(),
  age: Number.parseInt(userData.age, 10),
  language_preferences: Array.isArray(userData.language_preferences) ? userData.language_preferences : [],
  regions: Array.isArray(userData.regions) ? userData.regions : [],
  role: mapRoleToApi(userData.role),
});

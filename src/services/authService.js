
import api from "./api";

export async function registerUser(userData) {
  const response = await api.post("/auth/register", {
    name: userData.name,
    email: userData.email,
    password: userData.password,
  });

  return response.data;
}

export async function loginUser(credentials) {
  const response = await api.post("/auth/login", {
    email: credentials.email,
    password: credentials.password,
  });

  return response.data;
}

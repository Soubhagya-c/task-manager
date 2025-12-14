import API from "../api/api";

export interface LoginPayload {
  email: string;
  password: string;
};

export interface RegisterPayload {
  email: string;
  password: string;
  name: string;
}

export const loginUser = async (loginPayload: LoginPayload) => {
  const res = await API.post("/auth/login", loginPayload);
  localStorage.setItem("token", res.data.access_token);
  return res.data;
};

export const registerUser = async (payload: RegisterPayload) => {
  const res = await API.post("/auth/register", payload);
  return res.data;
};

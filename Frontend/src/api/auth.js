import { apiFetch, setAccessToken } from "./client";

export const authApi = {
  register: async (name, email, password, confirmpassword) => {
    const res = await apiFetch("/register", {
      method: "POST",
      body: JSON.stringify({
        name,
        email,
        password,
        confirmpassword,
      }),
    });
    return res.json();
  },
  login: async (email, password) => {
    const res = await apiFetch("/login", {
      method: "POST",
      body: JSON.stringify({
        email,
        password,
      }),
    });
    const data = await res.json();
    setAccessToken(data.accessToken);
    return data;
  },
  logout: async () => {
    const res = await apiFetch("/logout", {
      method: "POST",
    });
    setAccessToken(null);
    return res.json();
  },
  me: async () => {
    const res = await apiFetch("/me", { method: "GET" });
    const data = await res.json();
    return data.user;
  },
};

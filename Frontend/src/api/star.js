import { apiFetch } from "./client.js";

export const starApi = {
  getAllStarred: async () => {
    const res = await apiFetch(`/star`, { method: "GET" });
    return res.json();
  },
  star: async (fileId, folderId) => {
    const res = await apiFetch(`/star`, {
      method: "POST",
      body: JSON.stringify({ fileId, folderId }),
    });
    return res.json();
  },
  unStar: async (fileId, folderId) => {
    const res = await apiFetch(`/star`, {
      method: "DELETE",
      body: JSON.stringify({ fileId, folderId }),
    });
    return res.json();
  },
};

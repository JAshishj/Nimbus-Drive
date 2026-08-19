import { apiFetch } from "./client.js";

export const foldersApi = {
  getFolders: async (parentFolderId) => {
    const query = parentFolderId ? `?parentFolderId=${parentFolderId}` : "";
    const res = await apiFetch(`/folders${query}`, { method: "GET" });
    return res.json();
  },
  createFolder: async (name, parentFolderId) => {
    const res = await apiFetch(`/folders`, {
      method: "POST",
      body: JSON.stringify({ name, parentFolderId }),
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },
  deleteFolder: async (id) => {
    const res = await apiFetch(`/folders/${id}`, {
      method: "DELETE",
    });
    return res.json();
  },
};

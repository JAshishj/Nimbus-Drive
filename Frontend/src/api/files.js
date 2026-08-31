import { apiFetch } from "./client";

export const filesApi = {
  getFiles: async (folderId) => {
    const query = folderId ? `?folderId=${folderId}` : "";
    const res = await apiFetch(`/files${query}`, { method: "GET" });
    return res.json();
  },
  uploadFile: async (file, folderId) => {
    const formData = new FormData();
    formData.append("file", file);
    if (folderId) formData.append("folderId", folderId);
    const res = await apiFetch("/files", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    return data;
  },
  deleteFile: async (id) => {
    const res = await apiFetch(`/files/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    return data;
  },
  viewFile: async (id) => {
    const res = await apiFetch(`/files/${id}/download?mode=view`, { method: "GET" });
    const data = await res.json();
    return data.url;
  },
  downloadFile: async (id) => {
    const res = await apiFetch(`/files/${id}/download?mode=download`, { method: "GET" });
    const data = await res.json();
    return data.url;
  },
  renameFile: async (id, name) => {
    const res = await apiFetch(`/files/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ name }),
    });
    const data = await res.json();
    return data;
  },
};

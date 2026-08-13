import { viewFile } from "../../../Backend/controllers/filesController";
import { apiFetch } from "./client";

export const filesApi = {
  getFiles: async (folderId) => {
    const res = await apiFetch(`/files?folderId=${folderId ?? ""}`, {
      method: "GET",
    });
    const data = await res.json();
    return data;
  },
  getFile: async (id) => {
    const res = await apiFetch(`/files/${id}`, { method: "GET" });
    const data = await res.json();
    return data;
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
    const res = await apiFetch(`/files/${id}/view`, { method: "GET" });
    const blob = await res.blob();
    return URL.createObjectURL(blob);
  }
};

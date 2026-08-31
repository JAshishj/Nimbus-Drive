import { apiFetch } from "./client";

export const shareApi = {
  getAllShared: async () => {
    const res = await apiFetch(`/shared`, { method: "GET" });
    return res.json();
  },
  share: async (fileId, folderId, targetEmail, permission) => {
    const res = await apiFetch(`/shared`, {
      method: "POST",
      body: JSON.stringify({ fileId, folderId, targetEmail, permission }),
      headers: { "Content-Type": "application/json" },
    });
    return res.json();
  },
};
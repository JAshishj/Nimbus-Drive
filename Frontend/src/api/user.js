import { apiFetch } from "./client";

export const userApi = {
    getUsedSpace: async () => {
        const res = await apiFetch(`/me/storage`, { method: "GET" });
        const data = await res.json();
        return data.usedSpace;
    }
}
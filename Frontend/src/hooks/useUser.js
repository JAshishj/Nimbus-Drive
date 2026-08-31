import { useQuery } from "@tanstack/react-query";
import { userApi } from "../api/user.js";

export function useUsedSpace(){
    return useQuery({
        queryKey: ["usedSpace"],
        queryFn: () => userApi.getUsedSpace()
    })
}
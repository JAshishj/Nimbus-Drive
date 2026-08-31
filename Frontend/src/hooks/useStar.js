import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { starApi } from "../api/star.js";

export const useStarred = () => {
  return useQuery({
    queryKey: ["starred"],
    queryFn: starApi.getAllStarred,
  });
};

export const useStar = (FolderId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, folderId }) => starApi.star(fileId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred"] });
      queryClient.invalidateQueries({
        queryKey: ["files", FolderId ?? "root"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folders", FolderId ?? "root"],
      });
    },
  });
};

export const useUnStar = (FolderId) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, folderId }) => starApi.unStar(fileId, folderId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["starred"] });
      queryClient.invalidateQueries({
        queryKey: ["files", FolderId ?? "root"],
      });
      queryClient.invalidateQueries({
        queryKey: ["folders", FolderId ?? "root"],
      });
    },
  });
};

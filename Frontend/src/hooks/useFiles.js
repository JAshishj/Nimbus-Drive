import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { filesApi } from "../api/files";

export function useFiles(folderId) {
  return useQuery({
    queryKey: ["files", folderId ?? 'root'],
    queryFn: () => filesApi.getFiles(folderId),
  });
}

export function useFile(id) {
  return useQuery({
    queryKey: ["files", "detail", id],
    queryFn: () => filesApi.getFile(id),
  });
}

export function useUploadFile(folderId) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (file) => filesApi.upload(file, folderId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['files', folderId ?? 'root'] }),
  });
}

export function useDeleteFile(id, folderId) {
    const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => filesApi.deleteFile(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['files', folderId ?? 'root'] });
    },
  });
}

export function useViewFile(id){
  return useQuery({
    queryKey: ["files", "view", id],
    queryFn: () => filesApi.viewFile(id),
    enabled: !!id,
  });
}

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { foldersApi } from '../api/folders.js';

export function useFolders(parentFolderId){
    return useQuery({
        queryKey: ["folders", parentFolderId ?? "root"],
        queryFn: () => foldersApi.getFolders(parentFolderId)
    })
}

export function useCreateFolder(parentFolderId){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (name) => foldersApi.createFolder(name, parentFolderId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId ?? 'root'] });
        }
    })
}

export function useDeleteFolder(parentFolderId){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id) => foldersApi.deleteFolder(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId ?? 'root'] });
            queryClient.invalidateQueries({ queryKey: ["usedSpace"]});
        }
    })
}

export function useRenameFolder(parentFolderId){
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({id, name}) => foldersApi.renameFolder(id, name),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['folders', parentFolderId ?? 'root'] });
        }
    })
}
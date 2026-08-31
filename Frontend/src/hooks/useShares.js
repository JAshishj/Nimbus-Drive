import { useMutation, useQueryClient } from "@tanstack/react-query";
import { shareApi } from "../api/share";

export function useShareItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ fileId, folderId, targetEmail, permission }) =>
      shareApi.share(fileId, folderId, targetEmail, permission),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["shared"] });
    },
  });
}

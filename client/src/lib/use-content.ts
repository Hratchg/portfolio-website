import { useQuery } from "@tanstack/react-query";

export function useContent<T>(endpoint: string) {
  return useQuery<T>({
    queryKey: [endpoint],
    staleTime: 5 * 60 * 1000,
  });
}

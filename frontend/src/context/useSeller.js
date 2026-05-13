import { useAuth } from "./useAuth.js";

export function useSeller() {
  const { user } = useAuth();
  return {
    shopId: user?.shopId ?? null,
  };
}

import { useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import useRouter from "./use-router";

const useRequireAuth = (redirectUrl = "/") => {
  const { isAuthenticated, isLoading } = useAuth0();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(redirectUrl);
    }
  }, [isAuthenticated, router, redirectUrl, isLoading]);

  return isAuthenticated;
};

export default useRequireAuth;

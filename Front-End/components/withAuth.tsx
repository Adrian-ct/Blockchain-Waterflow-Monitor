import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const router = useRouter();
    const { data: session } = useSession();

    useEffect(() => {
      if (!session) {
        router.push("/auth");
      }
    }, [session]);

    return <>{session && <WrappedComponent {...props} />}</>;
  };
};

export default withAuth;

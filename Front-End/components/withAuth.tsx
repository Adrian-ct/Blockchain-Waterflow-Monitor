import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  return function WithAuthComponent(props: any) {
    const router = useRouter();
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
      if (status === "authenticated") {
        setLoading(false);
      } else if (status === "unauthenticated") {
        setLoading(false);
        router.push("/auth");
      }
    }, [status, router]);

    if (loading) {
      return <div>Loading...</div>;
    }

    return <>{session && <WrappedComponent {...props} />}</>;
  };
};

export default withAuth;

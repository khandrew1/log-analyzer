"use client";

import { ReactNode, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface ProtectedPageProps {
  children: ReactNode;
}

const ProtectedPage = ({ children }: ProtectedPageProps) => {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch(`/api/auth`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) router.replace("/login");
        else setChecking(false);
      })
      .catch(() => router.replace("/login"));
  }, [router]);

  if (checking) {
    return <div>Loading…</div>;
  }

  return <>{children}</>;
};

export default ProtectedPage;

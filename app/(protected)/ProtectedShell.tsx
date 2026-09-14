"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch } from "@/lib/api";
import Preloader from "@/components/Preloader";

export default function ProtectedShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function verifyAuth() {
      try {
        const res = await apiFetch("/check/");
        if (!res.ok) {
          router.push("/login");
          return;
        }
      } catch {
        router.push("/login");
        return;
      }
      setLoading(false);
    }
    verifyAuth();
  }, [router]);

  if (loading) {
    return <Preloader />;
  }

  return <>{children}</>;
}

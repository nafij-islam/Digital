"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { LoadingSpinner } from "@/components/common/LoadingSpinner";

export default function SubscriptionsRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/account/orders");
  }, [router]);

  return (
    <div className="py-20 flex justify-center">
      <LoadingSpinner text="Redirecting to your orders..." />
    </div>
  );
}

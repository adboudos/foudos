"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function RealtimeRefresh() {
  const router = useRouter();

  useEffect(() => {
    const channel = supabase
      .channel("foudos-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "drinks",
        },
        () => {
          router.refresh();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [router]);

  return null;
}
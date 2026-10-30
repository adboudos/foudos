"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createBrowserSupabaseClient } from "@/lib/supabase/browser";
import { toRole, type Role } from "@/lib/roles";

type AccessState = {
  loading: boolean;
  userId: string | null;
  role: Role;
};

const AccessContext = createContext<AccessState>({
  loading: true,
  userId: null,
  role: "general",
});

/**
 * Who is signed in and at what level, for showing or hiding buttons.
 * This is cosmetic only: the server and database check permissions again.
 */
export function useAccess() {
  return useContext(AccessContext);
}

export default function AccessProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AccessState>({
    loading: true,
    userId: null,
    role: "general",
  });

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();
    let cancelled = false;

    async function load(userId: string | null) {
      if (!userId) {
        if (!cancelled) setState({ loading: false, userId: null, role: "general" });
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", userId)
        .maybeSingle();

      if (!cancelled) {
        setState({ loading: false, userId, role: toRole(data?.role) });
      }
    }

    supabase.auth
      .getSession()
      .then(({ data }) => load(data.session?.user.id ?? null));

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      // Don't call Supabase from inside this callback directly; defer it.
      setTimeout(() => load(session?.user.id ?? null), 0);
    });

    return () => {
      cancelled = true;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AccessContext.Provider value={state}>{children}</AccessContext.Provider>
  );
}

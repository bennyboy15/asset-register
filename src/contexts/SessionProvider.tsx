import { useEffect, useState } from "react";
import type { ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/utils/supabase";
import { SessionContext } from "@/contexts/session.context";

export function SessionProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const queryClient = useQueryClient();

    useEffect(() => {
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {
            setSession(session);
            setIsLoading(false);

            if (event === "SIGNED_OUT") {
                queryClient.clear();
            }
        });

        return () => subscription.unsubscribe();
    }, [queryClient]);

    return (
        <SessionContext.Provider value={{ session, isLoading }}>{children}</SessionContext.Provider>
    );
}

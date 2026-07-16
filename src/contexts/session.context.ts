import { createContext } from "react";
import type { Session } from "@supabase/supabase-js";

export interface SessionContextType {
    session: Session | null;
    isLoading: boolean;
}

export const SessionContext = createContext<SessionContextType | null>(null);

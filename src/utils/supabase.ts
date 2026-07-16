import { createClient } from "@supabase/supabase-js";
import type {
    ForgotPasswordType,
    LoginCredentialsType,
    SignupCredentialsType,
    UpdatePasswordType,
} from "@/schemas/auth.schemas";
import type { Database } from "@/types/database.types";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Missing VITE_SUPABASE_URL or VITE_SUPABASE_PUBLISHABLE_KEY — copy .env.example to .env and fill in your project's values",
    );
}

export const supabase = createClient<Database>(supabaseUrl, supabaseKey);

// -- AUTH --
export async function signup(user: SignupCredentialsType) {
    const { data, error } = await supabase.auth.signUp({
        email: user.email,
        password: user.password,
    });

    if (error) throw error;

    if (data.user?.identities?.length === 0) {
        throw new Error("An account with this email already exists");
    }
    return data;
}

export async function login(user: LoginCredentialsType) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: user.email,
        password: user.password,
    });

    if (error) throw error;
    return data;
}

export async function logout() {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    return;
}

export async function resetPassword({ email }: ForgotPasswordType) {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`,
    });

    if (error) throw error;
    return;
}

export async function updatePassword({ password }: UpdatePasswordType) {
    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) throw error;
    return data;
}

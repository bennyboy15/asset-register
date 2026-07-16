import { useMutation } from "@tanstack/react-query";
import { login, logout, resetPassword, signup, updatePassword } from "@/utils/supabase";
import toast from "react-hot-toast";

// Mutation errors are toasted globally via the QueryClient's MutationCache (src/main.tsx)

export function useAuthSignup() {
    return useMutation({
        mutationFn: signup,
        onSuccess: (data) => {
            if (data.session) {
                toast.success("Successfully signed up");
            } else {
                toast.success("Check your email to confirm your account");
            }
        },
    });
}

export function useAuthLogin() {
    return useMutation({
        mutationFn: login,
        onSuccess: () => {
            toast.success("Successfully logged in");
        },
    });
}

export function useAuthLogout() {
    return useMutation({
        mutationFn: logout,
        onSuccess: () => {
            toast.success("Successfully logged out");
        },
    });
}

export function useAuthResetPassword() {
    return useMutation({
        mutationFn: resetPassword,
        onSuccess: () => {
            toast.success("Check your email for a password reset link");
        },
    });
}

export function useAuthUpdatePassword() {
    return useMutation({
        mutationFn: updatePassword,
        onSuccess: () => {
            toast.success("Password updated");
        },
    });
}

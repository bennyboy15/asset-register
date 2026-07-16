import { useAuthLogin } from "@/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, type SubmitHandler } from "react-hook-form";
import { LoginSchema, type LoginCredentialsType } from "@/schemas/auth.schemas";
import { Link } from "react-router-dom";

function LoginPage() {
    const { mutate: login, isPending } = useAuthLogin();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentialsType>({ resolver: zodResolver(LoginSchema) });

    const onSubmit: SubmitHandler<LoginCredentialsType> = (data) => {
        login(data);
    };

    return (
        <div>
            <div>LoginPage</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email" {...register("email")} placeholder="example@email.com" />
                {errors.email && <p role="alert">{errors.email.message}</p>}
                <input type="password" {...register("password")} placeholder="password123" />
                {errors.password && <p role="alert">{errors.password.message}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? "LOGGING IN..." : "LOGIN"}
                </button>
            </form>
            <p>
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
            <p>
                <Link to="/forgot-password">Forgot your password?</Link>
            </p>
        </div>
    );
}

export default LoginPage;

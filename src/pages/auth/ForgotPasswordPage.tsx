import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthResetPassword } from "@/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { ForgotPasswordSchema, type ForgotPasswordType } from "@/schemas/auth.schemas";
import { Link } from "react-router-dom";

function ForgotPasswordPage() {
    const { mutate: resetPassword, isPending } = useAuthResetPassword();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ForgotPasswordType>({ resolver: zodResolver(ForgotPasswordSchema) });

    const onSubmit: SubmitHandler<ForgotPasswordType> = (data) => {
        resetPassword(data);
    };

    return (
        <div>
            <div>ForgotPasswordPage</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="email" {...register("email")} placeholder="example@email.com" />
                {errors.email && <p role="alert">{errors.email.message}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? "SENDING..." : "SEND RESET LINK"}
                </button>
            </form>
            <p>
                Remembered your password? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default ForgotPasswordPage;

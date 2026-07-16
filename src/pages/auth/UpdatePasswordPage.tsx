import { useForm, type SubmitHandler } from "react-hook-form";
import { useAuthUpdatePassword } from "@/hooks/auth.hooks";
import { zodResolver } from "@hookform/resolvers/zod";
import { UpdatePasswordSchema, type UpdatePasswordType } from "@/schemas/auth.schemas";
import { useNavigate } from "react-router-dom";

function UpdatePasswordPage() {
    const { mutate: updatePassword, isPending } = useAuthUpdatePassword();
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<UpdatePasswordType>({ resolver: zodResolver(UpdatePasswordSchema) });

    const onSubmit: SubmitHandler<UpdatePasswordType> = (data) => {
        updatePassword(data, {
            onSuccess: () => navigate("/", { replace: true }),
        });
    };

    return (
        <div>
            <div>UpdatePasswordPage</div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <input type="password" {...register("password")} placeholder="new password" />
                {errors.password && <p role="alert">{errors.password.message}</p>}
                <input
                    type="password"
                    {...register("confirmPassword")}
                    placeholder="confirm new password"
                />
                {errors.confirmPassword && <p role="alert">{errors.confirmPassword.message}</p>}
                <button type="submit" disabled={isPending}>
                    {isPending ? "UPDATING..." : "UPDATE PASSWORD"}
                </button>
            </form>
        </div>
    );
}

export default UpdatePasswordPage;

"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/schema";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import { useState } from "react";

export function LoginForm({ className, ...props }: React.ComponentPropsWithoutRef<"div">) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        mode: "onChange",
    });

    const onSubmit = async (data: LoginFormData) => {
        setLoading(true);
        const result = await signIn("credentials", {
            redirect: false,
            email: data.email,
            password: data.password,
        });

        setLoading(false);

        if (result?.error) {
            toast.error("Invalid credentials, please try again!");
        } else {
            router.push("/dashboard");
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid gap-4">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                {...register("email")}
                                placeholder="email@example.com"
                            />
                            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                {...register("password")}
                                placeholder="*********"
                            />
                            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

                            <Button type="submit" disabled={loading} className="relative">
                                {loading ? (
                                    <ClipLoader size={20} color="white" />
                                ) : (
                                    "Login"
                                )}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}

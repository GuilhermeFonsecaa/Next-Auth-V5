"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/schemas/loginSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { loginAction } from "@/actions/auth-actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

const FormLogin = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<loginSchemaType>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: loginSchemaType) => {
        setError(null);
        startTransition(async () => {
            const response = await loginAction(values);
            console.log(response)
            if (response.error) {
                setError(response.error);
            } else {
                router.push("/dashboard");
            }
        });
    };

    return (
        <div className="max-w-96 border px-12 py-14 border-gray-400 shadow-md rounded-md">
          <h1 className="mb-5 font-bold">Login</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField control={form.control} name="email" render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Email
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                    <FormField control={form.control} name="password" render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Senha
                            </FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="Digite sua senha" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />

                    {error && <FormMessage>{error}</FormMessage>}
                    <Button className="" type="submit" disabled={isPending}>
                        Iniciar sessão
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default FormLogin;

"use client"

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, loginSchemaType } from "@/schemas/loginSchema";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { loginAction, registerAction } from "@/actions/auth-actions";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { registerSchema, registerSchemaType } from "@/schemas/registerSchema";

const FormRegister = () => {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    const form = useForm<registerSchemaType>({
        resolver: zodResolver(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: ""
        }
    });

    const onSubmit = async (values: registerSchemaType) => {
        setError(null);
        startTransition(async () => {
            const response = await registerAction(values);
            if (response.error) {
                setError(response.error)
            }
            else
                router.push("/dashboard")
        });
    };

    return (
        <div className="w-96 border flex flex-col  justify-center px-10 py-10 border-gray-400 shadow-md rounded-md">
            <h1 className="text-start mb-5 font-bold">Criar Conta</h1>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9">
                    <FormField control={form.control} name="name" render={({ field }) => (
                        <FormItem>
                            <FormLabel>
                                Nome
                            </FormLabel>
                            <FormControl>
                                <Input placeholder="Digite seu nome" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
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
                    <Button className="w-full" type="submit" disabled={isPending}>
                        Criar conta
                    </Button>
                </form>
            </Form>
        </div>
    );
};

export default FormRegister;

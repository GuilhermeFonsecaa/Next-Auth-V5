import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

export const registerSchema = z.object({
    name: z.string({ required_error: "Nome é obrigatório" }).min(1, "Nome é obrigatório").max(32, "Nome não pode ser maior que 32 caracteres"),
    email: z.string({ required_error: "Email é obrigatório" }).email("Email inválido"),
    password: z.string({ required_error: "Senha é obrigatória" }).regex(passwordRegex, "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial")
})

export type registerSchemaType = z.infer<typeof registerSchema>;
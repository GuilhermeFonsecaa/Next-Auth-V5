import { z } from "zod";

const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[^A-Za-z0-9]).{8,}$/;

export const loginSchema = z.object({
    email: z.string({ required_error: "Email é obrigatório" }).email("Email inválido").min(1, "Email é obrigatório"),
    password: z.string({ required_error: "Senha é obrigatória" }).regex(passwordRegex, "A senha deve conter pelo menos 8 caracteres, incluindo uma letra maiúscula, uma letra minúscula, um número e um caractere especial")
})
import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./schemas/loginSchema";
import Credentials from "next-auth/providers/credentials"
import { db } from "./lib/db";
import bcrypt from "bcryptjs"

export default {
    providers: [
        Credentials({
            authorize: async (credentials) => {
                const { data, success } = loginSchema.safeParse(credentials);

                if (!success) {
                    throw new Error("Credenciais inválidas");
                }

                const user = await db.user.findUnique({
                    where: {
                        email: data.email,
                    },
                });

                if (!user || !user.password) {
                    throw new Error("Usuário não encontrado");
                }

                const isValid = await bcrypt.compare(data.password, user.password);

                if(!isValid) {
                    throw new Error("Senha incorreta")
                }

                return user;

            }
        })
    ],
} satisfies NextAuthConfig;
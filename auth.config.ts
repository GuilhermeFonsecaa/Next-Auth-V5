import type { NextAuthConfig } from "next-auth";
import { loginSchema } from "./schemas/loginSchema";
import Credentials from "next-auth/providers/credentials"
import { db } from "./lib/db";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid"
import { sendEmailVerification } from "./lib/mail";

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

                if (!isValid) {
                    throw new Error("Senha incorreta")
                }

                //verificação de email
                if (!user.emailVerified) {

                    const verifyTokenExists = await db.verificationToken.findFirst({
                        where: {
                            identifier: user.email
                        }
                    });

                    //se existir eliminar o token
                    if (verifyTokenExists?.identifier) {
                        await db.verificationToken.delete({
                            where: {
                                identifier: user.email
                            }
                        })
                    }

                    const token = nanoid();

                    await db.verificationToken.create({
                        data: {
                            identifier: user.email,
                            token,
                            expires: new Date(Date.now() + 1000 * 60 * 60 * 24)
                        }
                    })

                    //enviar email de verificação
                     await sendEmailVerification(user.email, token);

                    throw new Error("Por favor, verifique seu email para confirmar sua conta.")

                }

                return user;

            }
        })
    ],
} satisfies NextAuthConfig;
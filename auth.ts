import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { PrismaClient } from "@prisma/client"
import authConfig from "./auth.config"
import { db } from "@/lib/db";

export const { handlers, signIn, signOut, auth } = NextAuth({
    adapter: PrismaAdapter(db),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        
        //jwt() executa cada vez que cria ou atualiza um token JWT
        //Onde se pode adicionar informações ao token
        jwt({ token, user }) {
            if (user) {
               token.role = user.role;
            }
            return token;
        },

        //session() é utilizado para adicionar a informação do token a sessão do usuário, deixando disponível no cliente
        session({ session, token }) {
            if(session.user) {
                session.user.role = token.role;
            }
            return session;
        }
    }
})